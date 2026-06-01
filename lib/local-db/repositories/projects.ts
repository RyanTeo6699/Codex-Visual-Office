import { eq } from "drizzle-orm";
import { db } from "../client";
import { projects } from "../schema";

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function listProjects(): Promise<ProjectRow[]> {
  return db.select().from(projects).all();
}

export async function getProjectById(id: string): Promise<ProjectRow | undefined> {
  return db.select().from(projects).where(eq(projects.id, id)).get();
}

export async function insertProject(project: NewProjectRow): Promise<void> {
  db.insert(projects).values(project).run();
}
