import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { betaFeedbackRecords } from "../schema";

export type BetaFeedbackRecordRow = typeof betaFeedbackRecords.$inferSelect;
export type NewBetaFeedbackRecordRow = typeof betaFeedbackRecords.$inferInsert;

export async function insertBetaFeedbackRecord(row: NewBetaFeedbackRecordRow): Promise<void> {
  db.insert(betaFeedbackRecords).values(row).run();
}

export async function listBetaFeedbackRecordRows(): Promise<BetaFeedbackRecordRow[]> {
  return db.select().from(betaFeedbackRecords).orderBy(desc(betaFeedbackRecords.createdAt)).all();
}

export async function listBetaFeedbackRecordRowsForTester(testerId: string): Promise<BetaFeedbackRecordRow[]> {
  return db.select().from(betaFeedbackRecords).where(eq(betaFeedbackRecords.testerId, testerId)).orderBy(desc(betaFeedbackRecords.createdAt)).all();
}

export async function getBetaFeedbackRecordRowById(id: string): Promise<BetaFeedbackRecordRow | undefined> {
  return db.select().from(betaFeedbackRecords).where(eq(betaFeedbackRecords.id, id)).get();
}

export async function updateBetaFeedbackRecordRow(
  id: string,
  changes: Partial<Omit<NewBetaFeedbackRecordRow, "id" | "testerId" | "createdAt">>,
): Promise<void> {
  db.update(betaFeedbackRecords).set(changes).where(eq(betaFeedbackRecords.id, id)).run();
}
