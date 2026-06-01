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
