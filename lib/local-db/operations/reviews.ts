import type { ReviewDecision } from "@/lib/types";
import type { TaskStatus } from "@/lib/types";
import {
  getReviewRecordByTaskId,
  listReviewRecords,
  type NewReviewRecordRow,
  type ReviewRecordRow,
  updateReviewRecord,
  upsertReviewRecord,
} from "../repositories/review-records";
import { addTaskEvent } from "./events";
import { getTaskById, updateTaskStatus } from "./tasks";
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

export interface PersistReviewDecisionResult {
  review: ReviewRecordRow;
  taskStatus: TaskStatus;
  eventId: string;
}

export function reviewDecisionToTaskStatus(decision: ReviewDecision): TaskStatus {
  if (decision === "approved") {
    return "done";
  }

  if (decision === "rejected") {
    return "blocked";
  }

  if (decision === "revision_requested") {
    return "ready";
  }

  return "waiting_review";
}

function reviewDecisionEventTone(decision: ReviewDecision) {
  if (decision === "approved") {
    return "success";
  }

  if (decision === "rejected") {
    return "danger";
  }

  if (decision === "revision_requested") {
    return "warning";
  }

  return "info";
}

function reviewDecisionEventMessage(decision: ReviewDecision): string {
  if (decision === "approved") {
    return "Review approved and task marked done.";
  }

  if (decision === "rejected") {
    return "Review rejected and task marked blocked.";
  }

  if (decision === "revision_requested") {
    return "Revision requested and task returned to ready.";
  }

  return "Review decision updated.";
}

export async function persistReviewDecisionForTask(taskId: string, decision: ReviewDecision): Promise<PersistReviewDecisionResult> {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const taskStatus = reviewDecisionToTaskStatus(decision);
  const existingReview = await getReviewRecordByTaskId(taskId);
  const reviewId = existingReview?.id ?? `review-${taskId}`;

  const reviewRecord: NewReviewRecordRow = {
    id: reviewId,
    taskId,
    decision,
    notes: reviewDecisionEventMessage(decision),
    diffSummaryJson: existingReview?.diffSummaryJson ?? "[]",
    riskNotesJson: existingReview?.riskNotesJson ?? "[]",
    qualityGateIdsJson: existingReview?.qualityGateIdsJson ?? "[]",
    createdAt: existingReview?.createdAt ?? nowIso(),
  };

  await upsertReviewRecord(reviewRecord);
  const updatedReview = await getReviewRecordByTaskId(taskId);
  if (!updatedReview) {
    throw new Error(`Review decision was not persisted for task: ${taskId}`);
  }

  await updateTaskStatus(taskId, taskStatus);

  const eventId = `review-decision-${taskId}-${decision}`;
  await addTaskEvent({
    id: eventId,
    projectId: task.projectId,
    taskId,
    seatId: task.assignedSeatId,
    type: reviewDecisionEventTone(decision),
    message: reviewDecisionEventMessage(decision),
    payload: { decision, taskStatus, source: "review-room" },
  });

  return {
    review: updatedReview,
    taskStatus,
    eventId,
  };
}

export { getReviewRecordByTaskId, listReviewRecords };
