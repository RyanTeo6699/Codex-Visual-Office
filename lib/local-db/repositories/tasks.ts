import { eq } from "drizzle-orm";
import { db } from "../client";
import { tasks } from "../schema";

export type TaskRow = typeof tasks.$inferSelect;
export type NewTaskRow = typeof tasks.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function listTasks(): Promise<TaskRow[]> {
  return db.select().from(tasks).all();
}

export async function listTasksByProject(projectId: string): Promise<TaskRow[]> {
  return db.select().from(tasks).where(eq(tasks.projectId, projectId)).all();
}

export async function getTaskById(id: string): Promise<TaskRow | undefined> {
  return db.select().from(tasks).where(eq(tasks.id, id)).get();
}

export async function insertTask(task: NewTaskRow): Promise<void> {
  db.insert(tasks).values(task).run();
}

export async function upsertTask(task: NewTaskRow): Promise<void> {
  db.insert(tasks).values(task).onConflictDoUpdate({
    target: tasks.id,
    set: {
      projectId: task.projectId,
      title: task.title,
      summary: task.summary,
      status: task.status,
      priority: task.priority,
      assignedSeatId: task.assignedSeatId,
      acceptanceCriteriaJson: task.acceptanceCriteriaJson,
      forbiddenScopeJson: task.forbiddenScopeJson,
      changedFilesJson: task.changedFilesJson,
      updatedAt: task.updatedAt,
    },
  }).run();
}

export async function updateTask(id: string, changes: Partial<Omit<NewTaskRow, "id" | "createdAt">>): Promise<void> {
  db.update(tasks).set(changes).where(eq(tasks.id, id)).run();
}

export async function deleteTask(id: string): Promise<void> {
  db.delete(tasks).where(eq(tasks.id, id)).run();
}
