import { eq } from "drizzle-orm";
import { db } from "../client";
import { taskEvents } from "../schema";

export type TaskEventRow = typeof taskEvents.$inferSelect;
export type NewTaskEventRow = typeof taskEvents.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function listTaskEvents(): Promise<TaskEventRow[]> {
  return db.select().from(taskEvents).all();
}

export async function listTaskEventsByProject(projectId: string): Promise<TaskEventRow[]> {
  return db.select().from(taskEvents).where(eq(taskEvents.projectId, projectId)).all();
}

export async function insertTaskEvent(taskEvent: NewTaskEventRow): Promise<void> {
  db.insert(taskEvents).values(taskEvent).run();
}
