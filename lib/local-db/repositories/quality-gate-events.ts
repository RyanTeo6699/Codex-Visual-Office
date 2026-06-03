import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { qualityGateEvents } from "../schema";

export type QualityGateEventRow = typeof qualityGateEvents.$inferSelect;
export type NewQualityGateEventRow = typeof qualityGateEvents.$inferInsert;

export async function listQualityGateEvents(): Promise<QualityGateEventRow[]> {
  return db.select().from(qualityGateEvents).all();
}

export async function listQualityGateEventsForRun(runId: string): Promise<QualityGateEventRow[]> {
  return db.select().from(qualityGateEvents).where(eq(qualityGateEvents.runId, runId)).orderBy(desc(qualityGateEvents.createdAt)).all();
}

export async function listQualityGateEventsForTask(taskId: string): Promise<QualityGateEventRow[]> {
  return db.select().from(qualityGateEvents).where(eq(qualityGateEvents.taskId, taskId)).orderBy(desc(qualityGateEvents.createdAt)).all();
}

export async function insertQualityGateEvent(event: NewQualityGateEventRow): Promise<void> {
  db.insert(qualityGateEvents).values(event).run();
}
