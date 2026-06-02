import { eq } from "drizzle-orm";
import { db } from "../client";
import { fileChanges } from "../schema";

export type FileChangeRow = typeof fileChanges.$inferSelect;
export type NewFileChangeRow = typeof fileChanges.$inferInsert;

export async function listFileChanges(): Promise<FileChangeRow[]> {
  return db.select().from(fileChanges).all();
}

export async function listFileChangesForTask(taskId: string): Promise<FileChangeRow[]> {
  return db.select().from(fileChanges).where(eq(fileChanges.taskId, taskId)).all();
}

export async function listFileChangesForSnapshot(gitSnapshotId: string): Promise<FileChangeRow[]> {
  return db.select().from(fileChanges).where(eq(fileChanges.gitSnapshotId, gitSnapshotId)).all();
}

export async function insertFileChange(fileChange: NewFileChangeRow): Promise<void> {
  db.insert(fileChanges).values(fileChange).run();
}

export async function deleteFileChangesForTask(taskId: string): Promise<void> {
  db.delete(fileChanges).where(eq(fileChanges.taskId, taskId)).run();
}
