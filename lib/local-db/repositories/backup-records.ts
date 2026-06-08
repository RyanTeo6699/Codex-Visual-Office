import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { backupRecords } from "../schema";

export type BackupRecordRow = typeof backupRecords.$inferSelect;
export type NewBackupRecordRow = typeof backupRecords.$inferInsert;

export async function createBackupRecordRow(record: NewBackupRecordRow): Promise<void> {
  db.insert(backupRecords).values(record).run();
}

export async function updateBackupRecordRow(
  id: string,
  changes: Partial<Omit<NewBackupRecordRow, "id" | "createdAt">>,
): Promise<void> {
  db.update(backupRecords).set(changes).where(eq(backupRecords.id, id)).run();
}

export async function listBackupRecordRows(): Promise<BackupRecordRow[]> {
  return db.select().from(backupRecords).orderBy(desc(backupRecords.createdAt)).all();
}

export async function getBackupRecordRowById(id: string): Promise<BackupRecordRow | undefined> {
  return db.select().from(backupRecords).where(eq(backupRecords.id, id)).get();
}

export async function getLatestBackupRecordRow(): Promise<BackupRecordRow | undefined> {
  return db.select().from(backupRecords).orderBy(desc(backupRecords.createdAt)).get();
}
