import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { diffSummaries } from "../schema";

export type DiffSummaryRow = typeof diffSummaries.$inferSelect;
export type NewDiffSummaryRow = typeof diffSummaries.$inferInsert;

export async function listDiffSummaries(): Promise<DiffSummaryRow[]> {
  return db.select().from(diffSummaries).all();
}

export async function listDiffSummariesForTask(taskId: string): Promise<DiffSummaryRow[]> {
  return db.select().from(diffSummaries).where(eq(diffSummaries.taskId, taskId)).orderBy(desc(diffSummaries.createdAt)).all();
}

export async function getLatestDiffSummaryForTask(taskId: string): Promise<DiffSummaryRow | undefined> {
  return db.select().from(diffSummaries).where(eq(diffSummaries.taskId, taskId)).orderBy(desc(diffSummaries.createdAt)).get();
}

export async function insertDiffSummary(summary: NewDiffSummaryRow): Promise<void> {
  db.insert(diffSummaries).values(summary).run();
}

export async function deleteDiffSummariesForTask(taskId: string): Promise<void> {
  db.delete(diffSummaries).where(eq(diffSummaries.taskId, taskId)).run();
}
