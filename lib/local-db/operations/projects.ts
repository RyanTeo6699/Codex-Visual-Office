import type { ProjectStatus } from "@/lib/types";
import {
  getProjectById,
  listProjects,
  type NewProjectRow,
  type ProjectRow,
  updateProject,
  upsertProject,
} from "../repositories/projects";
import type { projectAccents } from "../schema";
import { nowIso } from "./time";

export type ProjectAccent = (typeof projectAccents)[number];

export interface CreateProjectInput {
  id: string;
  name: string;
  description?: string;
  phase: string;
  status: ProjectStatus;
  localPath?: string | null;
  accent?: ProjectAccent;
}

export async function createProject(input: CreateProjectInput): Promise<ProjectRow> {
  const timestamp = nowIso();
  const project: NewProjectRow = {
    id: input.id,
    name: input.name,
    description: input.description ?? "",
    phase: input.phase,
    status: input.status,
    localPath: input.localPath ?? null,
    accent: input.accent ?? "cyan",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await upsertProject(project);

  const created = await getProjectById(input.id);
  if (!created) {
    throw new Error(`Project was not created: ${input.id}`);
  }

  return created;
}

export async function updateProjectDetails(id: string, changes: Partial<Omit<CreateProjectInput, "id">>): Promise<ProjectRow> {
  await updateProject(id, {
    name: changes.name,
    description: changes.description,
    phase: changes.phase,
    status: changes.status,
    localPath: changes.localPath,
    accent: changes.accent,
    updatedAt: nowIso(),
  });

  const updated = await getProjectById(id);
  if (!updated) {
    throw new Error(`Project was not found after update: ${id}`);
  }

  return updated;
}

export { getProjectById, listProjects };
