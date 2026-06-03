import type { QualityGateEvent, QualityGateEventType } from "@/lib/types";
import {
  insertQualityGateEvent,
  listQualityGateEvents,
  listQualityGateEventsForRun as listQualityGateEventRowsForRun,
  listQualityGateEventsForTask as listQualityGateEventRowsForTask,
  type NewQualityGateEventRow,
  type QualityGateEventRow,
} from "../repositories/quality-gate-events";
import { nowIso } from "./time";

export interface CreateQualityGateEventInput {
  id: string;
  runId: string;
  taskId: string;
  projectId: string;
  eventType: QualityGateEventType;
  payload?: Record<string, unknown>;
  createdAt?: string;
}

function parsePayload(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function mapQualityGateEventRow(row: QualityGateEventRow): QualityGateEvent {
  return {
    id: row.id,
    runId: row.runId,
    taskId: row.taskId,
    projectId: row.projectId,
    eventType: row.eventType,
    payload: parsePayload(row.payloadJson),
    createdAt: row.createdAt,
  };
}

export async function createQualityGateEvent(input: CreateQualityGateEventInput): Promise<QualityGateEvent> {
  const row: NewQualityGateEventRow = {
    id: input.id,
    runId: input.runId,
    taskId: input.taskId,
    projectId: input.projectId,
    eventType: input.eventType,
    payloadJson: JSON.stringify(input.payload ?? {}),
    createdAt: input.createdAt ?? nowIso(),
  };

  await insertQualityGateEvent(row);
  return mapQualityGateEventRow(row as QualityGateEventRow);
}

export async function listQualityGateEventsForRun(runId: string): Promise<QualityGateEvent[]> {
  return (await listQualityGateEventRowsForRun(runId)).map(mapQualityGateEventRow);
}

export async function listQualityGateEventsForTask(taskId: string): Promise<QualityGateEvent[]> {
  return (await listQualityGateEventRowsForTask(taskId)).map(mapQualityGateEventRow);
}

export { listQualityGateEvents };
