import type { QualityGateRun, QualityGateRunStatus } from "@/lib/types";
import {
  getQualityGateRunById,
  insertQualityGateRun,
  listQualityGateRuns,
  listQualityGateRunsForTask as listQualityGateRunRowsForTask,
  updateQualityGateRun,
  type NewQualityGateRunRow,
  type QualityGateRunRow,
} from "../repositories/quality-gate-runs";
import { nowIso } from "./time";

export interface CreateQualityGateRunInput {
  id: string;
  taskId: string;
  projectId: string;
  configId: string;
  commandKey: NewQualityGateRunRow["commandKey"];
  command: string;
  status?: QualityGateRunStatus;
  createdAt?: string;
}

export interface UpdateQualityGateRunStatusInput {
  status: QualityGateRunStatus;
  exitCode?: number | null;
  durationMs?: number | null;
  stdoutPreview?: string;
  stderrPreview?: string;
  stdoutTruncated?: boolean;
  stderrTruncated?: boolean;
  skippedReason?: string | null;
  failedReason?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
}

export function mapQualityGateRunRow(row: QualityGateRunRow): QualityGateRun {
  return {
    id: row.id,
    taskId: row.taskId,
    projectId: row.projectId,
    configId: row.configId,
    commandKey: row.commandKey,
    command: row.command,
    status: row.status,
    exitCode: row.exitCode ?? undefined,
    durationMs: row.durationMs ?? undefined,
    stdoutPreview: row.stdoutPreview,
    stderrPreview: row.stderrPreview,
    stdoutTruncated: row.stdoutTruncated,
    stderrTruncated: row.stderrTruncated,
    skippedReason: row.skippedReason ?? undefined,
    failedReason: row.failedReason ?? undefined,
    startedAt: row.startedAt ?? undefined,
    endedAt: row.endedAt ?? undefined,
    createdAt: row.createdAt,
  };
}

export async function createQualityGateRun(input: CreateQualityGateRunInput): Promise<QualityGateRun> {
  const row: NewQualityGateRunRow = {
    id: input.id,
    taskId: input.taskId,
    projectId: input.projectId,
    configId: input.configId,
    commandKey: input.commandKey,
    command: input.command,
    status: input.status ?? "pending",
    exitCode: null,
    durationMs: null,
    stdoutPreview: "",
    stderrPreview: "",
    stdoutTruncated: false,
    stderrTruncated: false,
    skippedReason: null,
    failedReason: null,
    startedAt: null,
    endedAt: null,
    createdAt: input.createdAt ?? nowIso(),
  };

  await insertQualityGateRun(row);
  const created = await getQualityGateRunById(input.id);
  if (!created) {
    throw new Error(`Quality gate run was not created: ${input.id}`);
  }

  return mapQualityGateRunRow(created);
}

export async function updateQualityGateRunStatus(id: string, input: UpdateQualityGateRunStatusInput): Promise<QualityGateRun> {
  await updateQualityGateRun(id, {
    status: input.status,
    exitCode: input.exitCode ?? null,
    durationMs: input.durationMs ?? null,
    stdoutPreview: input.stdoutPreview ?? "",
    stderrPreview: input.stderrPreview ?? "",
    stdoutTruncated: input.stdoutTruncated ?? false,
    stderrTruncated: input.stderrTruncated ?? false,
    skippedReason: input.skippedReason ?? null,
    failedReason: input.failedReason ?? null,
    startedAt: input.startedAt ?? null,
    endedAt: input.endedAt ?? null,
  });

  const updated = await getQualityGateRunById(id);
  if (!updated) {
    throw new Error(`Quality gate run was not found after update: ${id}`);
  }

  return mapQualityGateRunRow(updated);
}

export async function listQualityGateRunsForTask(taskId: string): Promise<QualityGateRun[]> {
  return (await listQualityGateRunRowsForTask(taskId)).map(mapQualityGateRunRow);
}

export async function getLatestQualityGateRunsForTask(taskId: string): Promise<QualityGateRun[]> {
  const latestByConfig = new Map<string, QualityGateRun>();
  for (const run of await listQualityGateRunsForTask(taskId)) {
    if (!latestByConfig.has(run.configId)) {
      latestByConfig.set(run.configId, run);
    }
  }

  return [...latestByConfig.values()];
}

export { listQualityGateRuns };
