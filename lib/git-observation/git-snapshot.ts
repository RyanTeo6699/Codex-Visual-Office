import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { GitSnapshotKind } from "@/lib/types";
import type { GitSnapshotCommand, GitSnapshotReadResult, GitStatusSummary } from "./git-types";

const execFileAsync = promisify(execFile);
const gitOutputLimit = 8000;

const gitCommandAllowlist: Record<GitSnapshotCommand, readonly string[]> = {
  status_porcelain: ["status", "--porcelain=v1"],
  branch_current: ["branch", "--show-current"],
  repo_root: ["rev-parse", "--show-toplevel"],
  head_sha: ["rev-parse", "HEAD"],
};

export const allowedGitSnapshotCommands = [
  "git status --porcelain=v1",
  "git branch --show-current",
  "git rev-parse --show-toplevel",
  "git rev-parse HEAD",
] as const;

export const forbiddenGitSnapshotCommands = [
  "git diff --name-status",
  "git diff --stat",
  "git diff --numstat",
  "git add",
  "git commit",
  "git push",
  "git pull",
  "git reset",
  "git clean",
  "git checkout",
  "git switch",
  "git merge",
  "git rebase",
  "git stash",
  "git tag",
  "git remote add",
  "git remote remove",
] as const;

function boundOutput(value: string): string {
  return value.length > gitOutputLimit ? value.slice(0, gitOutputLimit) : value;
}

async function runAllowlistedGitCommand(command: GitSnapshotCommand, cwd: string): Promise<string> {
  const args = gitCommandAllowlist[command];
  if (!args) {
    throw new Error(`Git command is not allowlisted: ${command}`);
  }

  const { stdout } = await execFileAsync("git", [...args], {
    cwd,
    shell: false,
    timeout: 10000,
    maxBuffer: 1024 * 1024,
  });

  return boundOutput(stdout.trim());
}

export function summarizePorcelainStatus(porcelainStatus: string): GitStatusSummary {
  const lines = porcelainStatus.split("\n").filter(Boolean);
  let stagedCount = 0;
  let unstagedCount = 0;
  let untrackedCount = 0;

  for (const line of lines) {
    const staged = line[0] ?? " ";
    const unstaged = line[1] ?? " ";
    if (line.startsWith("??")) {
      untrackedCount += 1;
      continue;
    }

    if (staged !== " ") {
      stagedCount += 1;
    }
    if (unstaged !== " ") {
      unstagedCount += 1;
    }
  }

  return {
    changedFileCount: lines.length,
    stagedCount,
    unstagedCount,
    untrackedCount,
  };
}

export async function readGitSnapshot(input: {
  approvedProjectPath: string;
  snapshotKind: GitSnapshotKind;
}): Promise<GitSnapshotReadResult> {
  if (!input.approvedProjectPath.trim()) {
    throw new Error("Approved project path is required for Git snapshot observation.");
  }

  const [repoRoot, branch, headSha, porcelainStatus] = await Promise.all([
    runAllowlistedGitCommand("repo_root", input.approvedProjectPath),
    runAllowlistedGitCommand("branch_current", input.approvedProjectPath),
    runAllowlistedGitCommand("head_sha", input.approvedProjectPath),
    runAllowlistedGitCommand("status_porcelain", input.approvedProjectPath),
  ]);
  const statusSummary = summarizePorcelainStatus(porcelainStatus);

  return {
    snapshotKind: input.snapshotKind,
    branch: branch || "detached",
    headSha,
    repoRoot,
    porcelainStatus,
    isDirty: statusSummary.changedFileCount > 0,
    statusSummary,
  };
}
