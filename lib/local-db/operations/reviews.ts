import type { ReviewDecision } from "@/lib/types";
import {
  getReviewRecordByTaskId,
  listReviewRecords,
  type NewReviewRecordRow,
  type ReviewRecordRow,
  updateReviewRecord,
  upsertReviewRecord,
} from "../repositories/review-records";
import { nowIso } from "./time";

export interface CreateReviewRecordInput {
  id: string;
  taskId: string;
  decision: ReviewDecision;
  notes?: string;
  diffSummary?: string[];
  riskNotes?: string[];
  qualityGateIds?: string[];
}

export async function createReviewRecord(input: CreateReviewRecordInput): Promise<ReviewRecordRow> {
  const reviewRecord: NewReviewRecordRow = {
    id: input.id,
    taskId: input.taskId,
    decision: input.decision,
    notes: input.notes ?? "",
    diffSummaryJson: JSON.stringify(input.diffSummary ?? []),
    riskNotesJson: JSON.stringify(input.riskNotes ?? []),
    qualityGateIdsJson: JSON.stringify(input.qualityGateIds ?? []),
    createdAt: nowIso(),
  };

  await upsertReviewRecord(reviewRecord);

  const created = await getReviewRecordByTaskId(input.taskId);
  if (!created) {
    throw new Error(`Review record was not created for task: ${input.taskId}`);
  }

  return created;
}

export async function updateReviewDecision(taskId: string, decision: ReviewDecision, notes?: string): Promise<ReviewRecordRow> {
  const existing = await getReviewRecordByTaskId(taskId);
  if (!existing) {
    throw new Error(`Review record not found for task: ${taskId}`);
  }

  await updateReviewRecord(existing.id, {
    decision,
    notes,
  });

  const updated = await getReviewRecordByTaskId(taskId);
  if (!updated) {
    throw new Error(`Review record was not found after update for task: ${taskId}`);
  }

  return updated;
}

export { getReviewRecordByTaskId, listReviewRecords };
