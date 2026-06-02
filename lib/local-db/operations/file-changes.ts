import type { FileChange, FileChangeStatus } from "@/lib/types";
import {
  deleteFileChangesForTask,
  insertFileChange,
  listFileChanges,
  listFileChangesForSnapshot,
  listFileChangesForTask,
  type FileChangeRow,
  type NewFileChangeRow,
} from "../repositories/file-changes";
import { nowIso } from "./time";

export interface CreateFileChangeInput {
  id: string;
  taskId: string;
  projectId: string;
  gitSnapshotId?: string | null;
  changeStatus: FileChangeStatus;
  rawStatus: string;
  filePath: string;
  previousFilePath?: string | null;
  source: "git_diff_name_status";
  createdAt?: string;
}

export function mapFileChangeRow(row: FileChangeRow): FileChange {
  return {
    id: row.id,
    taskId: row.taskId,
    projectId: row.projectId,
    gitSnapshotId: row.gitSnapshotId ?? undefined,
    changeStatus: row.changeStatus,
    rawStatus: row.rawStatus,
    filePath: row.filePath,
    previousFilePath: row.previousFilePath ?? undefined,
    source: "git_diff_name_status",
    createdAt: row.createdAt,
  };
}

export async function createFileChange(input: CreateFileChangeInput): Promise<FileChange> {
  const row: NewFileChangeRow = {
    id: input.id,
    taskId: input.taskId,
    projectId: input.projectId,
    gitSnapshotId: input.gitSnapshotId ?? null,
    changeStatus: input.changeStatus,
    rawStatus: input.rawStatus,
    filePath: input.filePath,
    previousFilePath: input.previousFilePath ?? null,
    source: input.source,
    createdAt: input.createdAt ?? nowIso(),
  };

  await insertFileChange(row);

  const created = (await listFileChanges()).find((item) => item.id === input.id);
  if (!created) {
    throw new Error(`File change was not created: ${input.id}`);
  }

  return mapFileChangeRow(created);
}

export async function replaceFileChangesForTask(input: {
  taskId: string;
  projectId: string;
  gitSnapshotId?: string;
  changes: Array<Omit<CreateFileChangeInput, "id" | "taskId" | "projectId" | "gitSnapshotId" | "source">>;
}): Promise<FileChange[]> {
  await deleteFileChangesForTask(input.taskId);

  const timestamp = nowIso();
  const created: FileChange[] = [];
  for (const [index, change] of input.changes.entries()) {
    created.push(await createFileChange({
      id: `file-change-${input.taskId}-${timestamp}-${index}`.replace(/[:.]/g, "-"),
      taskId: input.taskId,
      projectId: input.projectId,
      gitSnapshotId: input.gitSnapshotId,
      source: "git_diff_name_status",
      createdAt: timestamp,
      ...change,
    }));
  }

  return created;
}

export async function readFileChangesForTask(taskId: string): Promise<FileChange[]> {
  return (await listFileChangesForTask(taskId)).map(mapFileChangeRow);
}

export async function readFileChangesForSnapshot(gitSnapshotId: string): Promise<FileChange[]> {
  return (await listFileChangesForSnapshot(gitSnapshotId)).map(mapFileChangeRow);
}

export async function getChangedFilesSummaryForTask(taskId: string): Promise<Record<FileChangeStatus, number>> {
  const summary: Record<FileChangeStatus, number> = {
    modified: 0,
    added: 0,
    deleted: 0,
    renamed: 0,
    copied: 0,
    unmerged: 0,
    unknown: 0,
  };

  for (const change of await readFileChangesForTask(taskId)) {
    summary[change.changeStatus] += 1;
  }

  return summary;
}

export { listFileChanges };
