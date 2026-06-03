import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { scopeChecks } from "../schema";

export type ScopeCheckRow = typeof scopeChecks.$inferSelect;
export type NewScopeCheckRow = typeof scopeChecks.$inferInsert;

export async function listScopeChecks(): Promise<ScopeCheckRow[]> {
  return db.select().from(scopeChecks).all();
}

export async function listScopeChecksForTask(taskId: string): Promise<ScopeCheckRow[]> {
  return db.select().from(scopeChecks).where(eq(scopeChecks.taskId, taskId)).orderBy(desc(scopeChecks.createdAt)).all();
}

export async function getLatestScopeCheckForTask(taskId: string): Promise<ScopeCheckRow | undefined> {
  return db.select().from(scopeChecks).where(eq(scopeChecks.taskId, taskId)).orderBy(desc(scopeChecks.createdAt)).get();
}

export async function insertScopeCheck(scopeCheck: NewScopeCheckRow): Promise<void> {
  db.insert(scopeChecks).values(scopeCheck).run();
}

export async function deleteScopeChecksForTask(taskId: string): Promise<void> {
  db.delete(scopeChecks).where(eq(scopeChecks.taskId, taskId)).run();
}
