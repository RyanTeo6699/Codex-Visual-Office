import { and, desc, eq } from "drizzle-orm";
import { db } from "../client";
import { approvedProjectPaths } from "../schema";

export type ApprovedProjectPathRow = typeof approvedProjectPaths.$inferSelect;
export type NewApprovedProjectPathRow = typeof approvedProjectPaths.$inferInsert;

export async function createApprovedProjectPathRow(path: NewApprovedProjectPathRow): Promise<void> {
  db.insert(approvedProjectPaths).values(path).run();
}

export async function upsertApprovedProjectPathRow(path: NewApprovedProjectPathRow): Promise<void> {
  db.insert(approvedProjectPaths).values(path).onConflictDoUpdate({
    target: approvedProjectPaths.id,
    set: {
      projectId: path.projectId,
      localPath: path.localPath,
      label: path.label,
      approved: path.approved,
      approvalSource: path.approvalSource,
      approvedAt: path.approvedAt,
      updatedAt: path.updatedAt,
      note: path.note,
    },
  }).run();
}

export async function listApprovedProjectPathRows(): Promise<ApprovedProjectPathRow[]> {
  return db.select().from(approvedProjectPaths).orderBy(desc(approvedProjectPaths.updatedAt)).all();
}

export async function listApprovedProjectPathRowsForProject(projectId: string): Promise<ApprovedProjectPathRow[]> {
  return db.select()
    .from(approvedProjectPaths)
    .where(eq(approvedProjectPaths.projectId, projectId))
    .orderBy(desc(approvedProjectPaths.updatedAt))
    .all();
}

export async function getApprovedProjectPathRowById(id: string): Promise<ApprovedProjectPathRow | undefined> {
  return db.select().from(approvedProjectPaths).where(eq(approvedProjectPaths.id, id)).get();
}

export async function getPrimaryApprovedPathRowForProject(projectId: string): Promise<ApprovedProjectPathRow | undefined> {
  return db.select()
    .from(approvedProjectPaths)
    .where(and(eq(approvedProjectPaths.projectId, projectId), eq(approvedProjectPaths.approved, true)))
    .orderBy(desc(approvedProjectPaths.approvedAt), desc(approvedProjectPaths.updatedAt))
    .get();
}

export async function updateApprovedProjectPathRowStatus(input: {
  id: string;
  approved: boolean;
  approvedAt?: string | null;
  updatedAt: string;
}): Promise<void> {
  db.update(approvedProjectPaths)
    .set({
      approved: input.approved,
      approvedAt: input.approvedAt ?? null,
      updatedAt: input.updatedAt,
    })
    .where(eq(approvedProjectPaths.id, input.id))
    .run();
}

export async function deleteApprovedProjectPathRow(id: string): Promise<void> {
  db.delete(approvedProjectPaths).where(eq(approvedProjectPaths.id, id)).run();
}
