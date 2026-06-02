import type { FileChangeStatus, GitSnapshotKind } from "@/lib/types";

export type GitSnapshotCommand = "status_porcelain" | "branch_current" | "repo_root" | "head_sha";
export type ChangedFilesCommand = "diff_name_status";
export type DiffSummaryCommand = "diff_stat" | "diff_numstat";

export interface GitStatusSummary {
  changedFileCount: number;
  stagedCount: number;
  unstagedCount: number;
  untrackedCount: number;
}

export interface GitSnapshotReadResult {
  snapshotKind: GitSnapshotKind;
  branch: string;
  headSha: string;
  repoRoot: string;
  porcelainStatus: string;
  isDirty: boolean;
  statusSummary: GitStatusSummary;
}

export interface ParsedChangedFile {
  changeStatus: FileChangeStatus;
  rawStatus: string;
  filePath: string;
  previousFilePath?: string;
}

export interface ParsedNumstatFile {
  filePath: string;
  additions?: number;
  deletions?: number;
  binary: boolean;
  rawLine: string;
}

export interface ParsedDiffSummary {
  filesChanged: number;
  insertions: number;
  deletions: number;
  numstat: ParsedNumstatFile[];
  statSummary: string;
  stdoutTruncated: boolean;
  numstatTruncated: boolean;
}
