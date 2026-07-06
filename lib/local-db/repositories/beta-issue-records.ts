import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { betaIssueRecords } from "../schema";

export type BetaIssueRecordRow = typeof betaIssueRecords.$inferSelect;
export type NewBetaIssueRecordRow = typeof betaIssueRecords.$inferInsert;

export async function insertBetaIssueRecord(row: NewBetaIssueRecordRow): Promise<void> {
  db.insert(betaIssueRecords).values(row).run();
}

export async function listBetaIssueRecordRows(): Promise<BetaIssueRecordRow[]> {
  return db.select().from(betaIssueRecords).orderBy(desc(betaIssueRecords.createdAt)).all();
}

export async function listBetaIssueRecordRowsForFeedback(feedbackId: string): Promise<BetaIssueRecordRow[]> {
  return db.select().from(betaIssueRecords).where(eq(betaIssueRecords.feedbackId, feedbackId)).orderBy(desc(betaIssueRecords.createdAt)).all();
}

export async function getBetaIssueRecordRowById(id: string): Promise<BetaIssueRecordRow | undefined> {
  return db.select().from(betaIssueRecords).where(eq(betaIssueRecords.id, id)).get();
}

export async function updateBetaIssueRecordRow(
  id: string,
  changes: Partial<Omit<NewBetaIssueRecordRow, "id" | "feedbackId" | "createdAt">>,
): Promise<void> {
  db.update(betaIssueRecords).set(changes).where(eq(betaIssueRecords.id, id)).run();
}
