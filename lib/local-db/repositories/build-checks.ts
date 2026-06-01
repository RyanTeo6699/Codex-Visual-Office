import { eq } from "drizzle-orm";
import { db } from "../client";
import { buildChecks } from "../schema";

export type BuildCheckRow = typeof buildChecks.$inferSelect;
export type NewBuildCheckRow = typeof buildChecks.$inferInsert;

// Phase 2 Step 1 repository skeleton. Build checks remain local records only.
export async function listBuildChecks(): Promise<BuildCheckRow[]> {
  return db.select().from(buildChecks).all();
}

export async function listBuildChecksByProject(projectId: string): Promise<BuildCheckRow[]> {
  return db.select().from(buildChecks).where(eq(buildChecks.projectId, projectId)).all();
}

export async function insertBuildCheck(buildCheck: NewBuildCheckRow): Promise<void> {
  db.insert(buildChecks).values(buildCheck).run();
}

export async function upsertBuildCheck(buildCheck: NewBuildCheckRow): Promise<void> {
  db.insert(buildChecks).values(buildCheck).onConflictDoUpdate({
    target: buildChecks.id,
    set: {
      projectId: buildCheck.projectId,
      taskId: buildCheck.taskId,
      name: buildCheck.name,
      status: buildCheck.status,
      message: buildCheck.message,
      updatedAt: buildCheck.updatedAt,
    },
  }).run();
}

export async function updateBuildCheck(id: string, changes: Partial<Omit<NewBuildCheckRow, "id" | "createdAt">>): Promise<void> {
  db.update(buildChecks).set(changes).where(eq(buildChecks.id, id)).run();
}

export async function deleteBuildCheck(id: string): Promise<void> {
  db.delete(buildChecks).where(eq(buildChecks.id, id)).run();
}
