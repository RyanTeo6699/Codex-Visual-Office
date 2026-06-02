import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ChangedFilesCommand, ParsedChangedFile } from "./git-types";

const execFileAsync = promisify(execFile);
const changedFilesOutputLimit = 16000;
const maxChangedFiles = 200;

const changedFilesAllowlist: Record<ChangedFilesCommand, readonly string[]> = {
  diff_name_status: ["diff", "--name-status"],
};

export const allowedChangedFilesCommands = ["git diff --name-status"] as const;

export const forbiddenChangedFilesCommands = [
  "git diff --stat",
  "git diff --numstat",
  "git diff --patch",
  "git show",
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
  return value.length > changedFilesOutputLimit ? value.slice(0, changedFilesOutputLimit) : value;
}

async function runAllowlistedChangedFilesCommand(command: ChangedFilesCommand, cwd: string): Promise<string> {
  const args = changedFilesAllowlist[command];
  if (!args) {
    throw new Error(`Changed files command is not allowlisted: ${command}`);
  }

  const { stdout } = await execFileAsync("git", [...args], {
    cwd,
    shell: false,
    timeout: 10000,
    maxBuffer: 1024 * 1024,
  });

  return boundOutput(stdout.trim());
}

export function parseGitNameStatus(output: string): ParsedChangedFile[] {
  return output
    .split("\n")
    .filter(Boolean)
    .slice(0, maxChangedFiles)
    .map((line) => {
      const parts = line.split("\t");
      const rawStatus = parts[0] ?? "";
      const code = rawStatus[0] ?? "";

      if (code === "R") {
        return {
          changeStatus: "renamed" as const,
          rawStatus,
          previousFilePath: parts[1] ?? "",
          filePath: parts[2] ?? parts[1] ?? "",
        };
      }

      if (code === "C") {
        return {
          changeStatus: "copied" as const,
          rawStatus,
          previousFilePath: parts[1] ?? "",
          filePath: parts[2] ?? parts[1] ?? "",
        };
      }

      return {
        changeStatus: mapStatus(code),
        rawStatus,
        filePath: parts[1] ?? "",
      };
    })
    .filter((item) => item.filePath.length > 0);
}

export async function readChangedFiles(input: { approvedProjectPath: string }): Promise<ParsedChangedFile[]> {
  if (!input.approvedProjectPath.trim()) {
    throw new Error("Approved project path is required for changed files observation.");
  }

  const output = await runAllowlistedChangedFilesCommand("diff_name_status", input.approvedProjectPath);
  return parseGitNameStatus(output);
}

function mapStatus(code: string): ParsedChangedFile["changeStatus"] {
  if (code === "M") return "modified";
  if (code === "A") return "added";
  if (code === "D") return "deleted";
  if (code === "U") return "unmerged";
  return "unknown";
}
