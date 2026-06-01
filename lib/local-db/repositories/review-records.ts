import { eq } from "drizzle-orm";
import { db } from "../client";
import { reviewRecords } from "../schema";

export type ReviewRecordRow = typeof reviewRecords.$inferSelect;
export type NewReviewRecordRow = typeof reviewRecords.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function listReviewRecords(): Promise<ReviewRecordRow[]> {
  return db.select().from(reviewRecords).all();
}

export async function getReviewRecordByTaskId(taskId: string): Promise<ReviewRecordRow | undefined> {
  return db.select().from(reviewRecords).where(eq(reviewRecords.taskId, taskId)).get();
}

export async function insertReviewRecord(reviewRecord: NewReviewRecordRow): Promise<void> {
  db.insert(reviewRecords).values(reviewRecord).run();
}

export async function upsertReviewRecord(reviewRecord: NewReviewRecordRow): Promise<void> {
  db.insert(reviewRecords).values(reviewRecord).onConflictDoUpdate({
    target: reviewRecords.id,
    set: {
      taskId: reviewRecord.taskId,
      decision: reviewRecord.decision,
      notes: reviewRecord.notes,
      diffSummaryJson: reviewRecord.diffSummaryJson,
      riskNotesJson: reviewRecord.riskNotesJson,
      qualityGateIdsJson: reviewRecord.qualityGateIdsJson,
    },
  }).run();
}

export async function updateReviewRecord(id: string, changes: Partial<Omit<NewReviewRecordRow, "id" | "createdAt">>): Promise<void> {
  db.update(reviewRecords).set(changes).where(eq(reviewRecords.id, id)).run();
}

export async function deleteReviewRecord(id: string): Promise<void> {
  db.delete(reviewRecords).where(eq(reviewRecords.id, id)).run();
}
