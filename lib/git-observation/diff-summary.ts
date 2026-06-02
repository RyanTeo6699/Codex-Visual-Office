import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { DiffSummaryCommand, ParsedDiffSummary, ParsedNumstatFile } from "./git-types";

const execFileAsync = promisify(execFile);
const diffOutputLimit = 16000;
const maxNumstatRows = 120;

const diffSummaryAllowlist: Record<DiffSummaryCommand, readonly string[]> = {
  diff_stat: ["diff", "--stat"],
  diff_numstat: ["diff", "--numstat"],
};

export const allowedDiffSummaryCommands = ["git diff --stat", "git diff --numstat"] as const;

export const forbiddenDiffSummaryCommands = [
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

function boundOutput(value: string): { value: string; truncated: boolean } {
  const truncated = value.length > diffOutputLimit;
  return {
    value: truncated ? value.slice(0, diffOutputLimit) : value,
    truncated,
  };
}

async function runAllowlistedDiffSummaryCommand(command: DiffSummaryCommand, cwd: string): Promise<{ value: string; truncated: boolean }> {
  const args = diffSummaryAllowlist[command];
  if (!args) {
    throw new Error(`Diff summary command is not allowlisted: ${command}`);
  }

  const { stdout } = await execFileAsync("git", [...args], {
    cwd,
    shell: false,
    timeout: 10000,
    maxBuffer: 1024 * 1024,
  });

  return boundOutput(stdout.trim());
}

export function parseNumstat(output: string): { files: ParsedNumstatFile[]; totals: { filesChanged: number; insertions: number; deletions: number }; truncated: boolean } {
  const lines = output.split("\n").filter(Boolean);
  const selected = lines.slice(0, maxNumstatRows);
  const files: ParsedNumstatFile[] = selected.map((line) => {
    const [additionsRaw, deletionsRaw, ...pathParts] = line.split("\t");
    const filePath = pathParts.join("\t") || "unknown";
    const additions = Number(additionsRaw);
    const deletions = Number(deletionsRaw);
    const binary = additionsRaw === "-" || deletionsRaw === "-" || Number.isNaN(additions) || Number.isNaN(deletions);

    return {
      filePath,
      additions: binary ? undefined : additions,
      deletions: binary ? undefined : deletions,
      binary,
      rawLine: line,
    };
  });

  return {
    files,
    totals: {
      filesChanged: lines.length,
      insertions: files.reduce((total, file) => total + (file.additions ?? 0), 0),
      deletions: files.reduce((total, file) => total + (file.deletions ?? 0), 0),
    },
    truncated: lines.length > maxNumstatRows,
  };
}

export function parseDiffSummary(input: { statOutput: string; numstatOutput: string; statTruncated?: boolean; numstatOutputTruncated?: boolean }): ParsedDiffSummary {
  const parsedNumstat = parseNumstat(input.numstatOutput);
  return {
    filesChanged: parsedNumstat.totals.filesChanged,
    insertions: parsedNumstat.totals.insertions,
    deletions: parsedNumstat.totals.deletions,
    numstat: parsedNumstat.files,
    statSummary: input.statOutput,
    stdoutTruncated: Boolean(input.statTruncated),
    numstatTruncated: Boolean(input.numstatOutputTruncated) || parsedNumstat.truncated,
  };
}

export async function readDiffSummary(input: { approvedProjectPath: string }): Promise<ParsedDiffSummary> {
  if (!input.approvedProjectPath.trim()) {
    throw new Error("Approved project path is required for diff summary observation.");
  }

  const [stat, numstat] = await Promise.all([
    runAllowlistedDiffSummaryCommand("diff_stat", input.approvedProjectPath),
    runAllowlistedDiffSummaryCommand("diff_numstat", input.approvedProjectPath),
  ]);

  return parseDiffSummary({
    statOutput: stat.value,
    numstatOutput: numstat.value,
    statTruncated: stat.truncated,
    numstatOutputTruncated: numstat.truncated,
  });
}
