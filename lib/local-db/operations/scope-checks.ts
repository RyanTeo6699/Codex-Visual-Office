import type { ScopeCheck, ScopeCheckRuleResult, ScopeCheckStatus } from "@/lib/types";
import {
  deleteScopeChecksForTask,
  getLatestScopeCheckForTask,
  insertScopeCheck,
  listScopeChecks,
  listScopeChecksForTask,
  type NewScopeCheckRow,
  type ScopeCheckRow,
} from "../repositories/scope-checks";
import { nowIso } from "./time";

export interface CreateScopeCheckInput {
  id: string;
  taskId: string;
  projectId: string;
  status: ScopeCheckStatus;
  forbiddenScope: string[];
  matchedFiles: string[];
  unmatchedFiles: string[];
  ruleResults: ScopeCheckRuleResult[];
  reason: string;
  checkSource: "path_level_forbidden_scope";
  createdAt?: string;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseRuleResults(value: string): ScopeCheckRuleResult[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is ScopeCheckRuleResult => {
        return Boolean(item)
          && typeof item === "object"
          && typeof item.rule === "string"
          && typeof item.parsed === "boolean"
          && Array.isArray(item.matchedFiles);
      })
      : [];
  } catch {
    return [];
  }
}

export function mapScopeCheckRow(row: ScopeCheckRow): ScopeCheck {
  return {
    id: row.id,
    taskId: row.taskId,
    projectId: row.projectId,
    status: row.status,
    forbiddenScope: parseStringArray(row.forbiddenScopeJson),
    matchedFiles: parseStringArray(row.matchedFilesJson),
    unmatchedFiles: parseStringArray(row.unmatchedFilesJson),
    ruleResults: parseRuleResults(row.ruleResultsJson),
    reason: row.reason,
    checkSource: "path_level_forbidden_scope",
    createdAt: row.createdAt,
  };
}

export async function createScopeCheck(input: CreateScopeCheckInput): Promise<ScopeCheck> {
  const row: NewScopeCheckRow = {
    id: input.id,
    taskId: input.taskId,
    projectId: input.projectId,
    status: input.status,
    forbiddenScopeJson: JSON.stringify(input.forbiddenScope),
    matchedFilesJson: JSON.stringify(input.matchedFiles),
    unmatchedFilesJson: JSON.stringify(input.unmatchedFiles),
    ruleResultsJson: JSON.stringify(input.ruleResults),
    reason: input.reason,
    checkSource: input.checkSource,
    createdAt: input.createdAt ?? nowIso(),
  };

  await insertScopeCheck(row);

  const created = (await listScopeChecks()).find((item) => item.id === input.id);
  if (!created) {
    throw new Error(`Scope check was not created: ${input.id}`);
  }

  return mapScopeCheckRow(created);
}

export async function replaceScopeCheckForTask(input: Omit<CreateScopeCheckInput, "id" | "checkSource">): Promise<ScopeCheck> {
  await deleteScopeChecksForTask(input.taskId);
  return createScopeCheck({
    ...input,
    id: `scope-check-${input.taskId}-${nowIso()}`.replace(/[:.]/g, "-"),
    checkSource: "path_level_forbidden_scope",
  });
}

export async function readLatestScopeCheckForTask(taskId: string): Promise<ScopeCheck | undefined> {
  const row = await getLatestScopeCheckForTask(taskId);
  return row ? mapScopeCheckRow(row) : undefined;
}

export async function readScopeChecksForTask(taskId: string): Promise<ScopeCheck[]> {
  return (await listScopeChecksForTask(taskId)).map(mapScopeCheckRow);
}

export { listScopeChecks };
