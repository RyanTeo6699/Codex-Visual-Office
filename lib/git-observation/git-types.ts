import type { GitSnapshotKind } from "@/lib/types";

export type GitSnapshotCommand = "status_porcelain" | "branch_current" | "repo_root" | "head_sha";

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
