"use server";

import { revalidatePath } from "next/cache";
import { initializeLocalDb } from "@/lib/local-db/init";
import { persistReviewDecisionForTask } from "@/lib/local-db/operations/reviews";
import type { ReviewDecision, TaskStatus } from "@/lib/types";

export interface PersistReviewDecisionActionResult {
  ok: boolean;
  decision: ReviewDecision;
  taskStatus?: TaskStatus;
  eventId?: string;
  error?: string;
}

export async function persistReviewDecisionAction(
  taskId: string,
  decision: ReviewDecision,
): Promise<PersistReviewDecisionActionResult> {
  try {
    initializeLocalDb();
    const result = await persistReviewDecisionForTask(taskId, decision);
    revalidatePath(`/review/${taskId}`);

    return {
      ok: true,
      decision: result.review.decision,
      taskStatus: result.taskStatus,
      eventId: result.eventId,
    };
  } catch (error) {
    return {
      ok: false,
      decision,
      error: error instanceof Error ? error.message : "Review decision could not be persisted.",
    };
  }
}
