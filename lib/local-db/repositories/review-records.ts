import { eq } from "drizzle-orm";
import { db } from "../client";
import { reviewRecords } from "../schema";

export type ReviewRecordRow = typeof reviewRecords.$inferSelect;
export type NewReviewRecordRow = typeof reviewRecords.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function getReviewRecordByTaskId(taskId: string): Promise<ReviewRecordRow | undefined> {
  return db.select().from(reviewRecords).where(eq(reviewRecords.taskId, taskId)).get();
}

export async function insertReviewRecord(reviewRecord: NewReviewRecordRow): Promise<void> {
  db.insert(reviewRecords).values(reviewRecord).run();
}
