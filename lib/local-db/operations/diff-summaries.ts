import type { DiffSummary } from "@/lib/types";
import {
  deleteDiffSummariesForTask,
  getLatestDiffSummaryForTask,
  insertDiffSummary,
  listDiffSummaries,
  listDiffSummariesForTask,
  type DiffSummaryRow,
  type NewDiffSummaryRow,
} from "../repositories/diff-summaries";
import { nowIso } from "./time";

export interface CreateDiffSummaryInput {
  id: string;
  taskId: string;
  projectId: string;
  gitSnapshotId?: string | null;
  filesChanged: number;
  insertions: number;
  deletions: number;
  numstat: DiffSummary["numstat"];
  statSummary: string;
  stdoutTruncated: boolean;
  numstatTruncated: boolean;
  source: "git_diff_stat_numstat";
  createdAt?: string;
}

function parseNumstat(value: string): DiffSummary["numstat"] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is DiffSummary["numstat"][number] => {
      return item && typeof item === "object" && typeof item.filePath === "string" && typeof item.rawLine === "string";
    }) : [];
  } catch {
    return [];
  }
}

export function mapDiffSummaryRow(row: DiffSummaryRow): DiffSummary {
  return {
    id: row.id,
    taskId: row.taskId,
    projectId: row.projectId,
    gitSnapshotId: row.gitSnapshotId ?? undefined,
    filesChanged: row.filesChanged,
    insertions: row.insertions,
    deletions: row.deletions,
    numstat: parseNumstat(row.numstatJson),
    statSummary: row.statSummary,
    stdoutTruncated: row.stdoutTruncated,
    numstatTruncated: row.numstatTruncated,
    source: "git_diff_stat_numstat",
    createdAt: row.createdAt,
  };
}

export async function createDiffSummary(input: CreateDiffSummaryInput): Promise<DiffSummary> {
  const row: NewDiffSummaryRow = {
    id: input.id,
    taskId: input.taskId,
    projectId: input.projectId,
    gitSnapshotId: input.gitSnapshotId ?? null,
    filesChanged: input.filesChanged,
    insertions: input.insertions,
    deletions: input.deletions,
    numstatJson: JSON.stringify(input.numstat),
    statSummary: input.statSummary,
    stdoutTruncated: input.stdoutTruncated,
    numstatTruncated: input.numstatTruncated,
    source: input.source,
    createdAt: input.createdAt ?? nowIso(),
  };

  await insertDiffSummary(row);

  const created = (await listDiffSummaries()).find((item) => item.id === input.id);
  if (!created) {
    throw new Error(`Diff summary was not created: ${input.id}`);
  }

  return mapDiffSummaryRow(created);
}

export async function replaceDiffSummaryForTask(input: Omit<CreateDiffSummaryInput, "id" | "source">): Promise<DiffSummary> {
  await deleteDiffSummariesForTask(input.taskId);
  return createDiffSummary({
    ...input,
    id: `diff-summary-${input.taskId}-${nowIso()}`.replace(/[:.]/g, "-"),
    source: "git_diff_stat_numstat",
  });
}

export async function readLatestDiffSummaryForTask(taskId: string): Promise<DiffSummary | undefined> {
  const row = await getLatestDiffSummaryForTask(taskId);
  return row ? mapDiffSummaryRow(row) : undefined;
}

export async function readDiffSummariesForTask(taskId: string): Promise<DiffSummary[]> {
  return (await listDiffSummariesForTask(taskId)).map(mapDiffSummaryRow);
}

export { listDiffSummaries };
