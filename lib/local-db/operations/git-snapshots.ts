import type { GitSnapshot, GitSnapshotKind } from "@/lib/types";
import {
  getLatestGitSnapshotForTask,
  getLatestGitSnapshotForTaskByKind,
  listGitSnapshots,
  listGitSnapshotsForTask,
  type GitSnapshotRow,
  type NewGitSnapshotRow,
  upsertGitSnapshot,
} from "../repositories/git-snapshots";
import { nowIso } from "./time";

export interface CreateGitSnapshotInput {
  id: string;
  taskId: string;
  projectId: string;
  snapshotKind: GitSnapshotKind;
  branch: string;
  headSha: string;
  repoRoot: string;
  porcelainStatus: string;
  isDirty: boolean;
  statusSummary: GitSnapshot["statusSummary"];
  createdAt?: string;
}

function parseStatusSummary(value: string): GitSnapshot["statusSummary"] {
  try {
    const parsed = JSON.parse(value);
    return {
      changedFileCount: typeof parsed.changedFileCount === "number" ? parsed.changedFileCount : 0,
      stagedCount: typeof parsed.stagedCount === "number" ? parsed.stagedCount : 0,
      unstagedCount: typeof parsed.unstagedCount === "number" ? parsed.unstagedCount : 0,
      untrackedCount: typeof parsed.untrackedCount === "number" ? parsed.untrackedCount : 0,
    };
  } catch {
    return {
      changedFileCount: 0,
      stagedCount: 0,
      unstagedCount: 0,
      untrackedCount: 0,
    };
  }
}

export function mapGitSnapshotRow(row: GitSnapshotRow): GitSnapshot {
  return {
    id: row.id,
    taskId: row.taskId,
    projectId: row.projectId,
    snapshotKind: row.snapshotKind,
    branch: row.branch,
    headSha: row.headSha,
    repoRoot: row.repoRoot,
    porcelainStatus: row.porcelainStatus,
    isDirty: row.isDirty,
    statusSummary: parseStatusSummary(row.statusSummaryJson),
    createdAt: row.createdAt,
  };
}

export async function createGitSnapshot(input: CreateGitSnapshotInput): Promise<GitSnapshot> {
  const row: NewGitSnapshotRow = {
    id: input.id,
    taskId: input.taskId,
    projectId: input.projectId,
    snapshotKind: input.snapshotKind,
    branch: input.branch,
    headSha: input.headSha,
    repoRoot: input.repoRoot,
    porcelainStatus: input.porcelainStatus,
    isDirty: input.isDirty,
    statusSummaryJson: JSON.stringify(input.statusSummary),
    createdAt: input.createdAt ?? nowIso(),
  };

  await upsertGitSnapshot(row);

  const created = (await listGitSnapshots()).find((item) => item.id === input.id);
  if (!created) {
    throw new Error(`Git snapshot was not created: ${input.id}`);
  }

  return mapGitSnapshotRow(created);
}

export async function readGitSnapshotsForTask(taskId: string): Promise<GitSnapshot[]> {
  return (await listGitSnapshotsForTask(taskId)).map(mapGitSnapshotRow);
}

export async function readLatestGitSnapshotForTask(taskId: string): Promise<GitSnapshot | undefined> {
  const row = await getLatestGitSnapshotForTask(taskId);
  return row ? mapGitSnapshotRow(row) : undefined;
}

export async function getLatestBeforeAfterSnapshotsForTask(taskId: string): Promise<{
  before?: GitSnapshot;
  after?: GitSnapshot;
}> {
  const [before, after] = await Promise.all([
    getLatestGitSnapshotForTaskByKind(taskId, "before_runner"),
    getLatestGitSnapshotForTaskByKind(taskId, "after_runner"),
  ]);

  return {
    before: before ? mapGitSnapshotRow(before) : undefined,
    after: after ? mapGitSnapshotRow(after) : undefined,
  };
}

export { listGitSnapshots };
