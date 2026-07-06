import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { betaTesterRecords } from "../schema";

export type BetaTesterRecordRow = typeof betaTesterRecords.$inferSelect;
export type NewBetaTesterRecordRow = typeof betaTesterRecords.$inferInsert;

export async function insertBetaTesterRecord(row: NewBetaTesterRecordRow): Promise<void> {
  db.insert(betaTesterRecords).values(row).run();
}

export async function listBetaTesterRecordRows(): Promise<BetaTesterRecordRow[]> {
  return db.select().from(betaTesterRecords).orderBy(desc(betaTesterRecords.createdAt)).all();
}

export async function getBetaTesterRecordRowById(id: string): Promise<BetaTesterRecordRow | undefined> {
  return db.select().from(betaTesterRecords).where(eq(betaTesterRecords.id, id)).get();
}

export async function updateBetaTesterRecordRow(
  id: string,
  changes: Partial<Omit<NewBetaTesterRecordRow, "id" | "createdAt">>,
): Promise<void> {
  db.update(betaTesterRecords).set(changes).where(eq(betaTesterRecords.id, id)).run();
}
