import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { qualityGateRuns } from "../schema";

export type QualityGateRunRow = typeof qualityGateRuns.$inferSelect;
export type NewQualityGateRunRow = typeof qualityGateRuns.$inferInsert;

export async function listQualityGateRuns(): Promise<QualityGateRunRow[]> {
  return db.select().from(qualityGateRuns).all();
}

export async function listQualityGateRunsForTask(taskId: string): Promise<QualityGateRunRow[]> {
  return db.select().from(qualityGateRuns).where(eq(qualityGateRuns.taskId, taskId)).orderBy(desc(qualityGateRuns.createdAt)).all();
}

export async function getQualityGateRunById(id: string): Promise<QualityGateRunRow | undefined> {
  return db.select().from(qualityGateRuns).where(eq(qualityGateRuns.id, id)).get();
}

export async function insertQualityGateRun(run: NewQualityGateRunRow): Promise<void> {
  db.insert(qualityGateRuns).values(run).run();
}

export async function updateQualityGateRun(id: string, changes: Partial<Omit<NewQualityGateRunRow, "id" | "taskId" | "projectId" | "configId" | "commandKey" | "command" | "createdAt">>): Promise<void> {
  db.update(qualityGateRuns).set(changes).where(eq(qualityGateRuns.id, id)).run();
}
