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

export async function upsertProject(project: NewProjectRow): Promise<void> {
  db.insert(projects).values(project).onConflictDoUpdate({
    target: projects.id,
    set: {
      name: project.name,
      description: project.description,
      phase: project.phase,
      status: project.status,
      localPath: project.localPath,
      accent: project.accent,
      updatedAt: project.updatedAt,
    },
  }).run();
}

export async function updateProject(id: string, changes: Partial<Omit<NewProjectRow, "id" | "createdAt">>): Promise<void> {
  db.update(projects).set(changes).where(eq(projects.id, id)).run();
}

export async function deleteProject(id: string): Promise<void> {
  db.delete(projects).where(eq(projects.id, id)).run();
}
