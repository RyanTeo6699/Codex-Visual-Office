import type { ApprovedProjectPath } from "@/lib/types";
import {
  createApprovedProjectPathRow,
  deleteApprovedProjectPathRow,
  getApprovedProjectPathRowById,
  getPrimaryApprovedPathRowForProject,
  listApprovedProjectPathRows,
  listApprovedProjectPathRowsForProject,
  updateApprovedProjectPathRowStatus,
  upsertApprovedProjectPathRow,
  type ApprovedProjectPathRow,
} from "../repositories/approved-project-paths";
import { nowIso } from "./time";

export interface UpsertApprovedProjectPathInput {
  id?: string;
  projectId: string;
  localPath: string;
  label?: string;
  approved?: boolean;
  note?: string;
}

const sensitivePathPatterns = [
  /(^|\/)\.env(?:\.local)?$/i,
  /(^|\/)\.env(?:\.local)?(?:\/|$)/i,
  /~\/\.codex\/auth\.json/i,
  /(^|\/)auth\.json$/i,
  /(^|\/)id_(?:rsa|dsa|ecdsa|ed25519)$/i,
  /private[_-]?key/i,
  /\.(?:pem|key)$/i,
];

export function assertSafeApprovedProjectPath(localPath: string): string {
  const normalized = localPath.trim();
  if (!normalized) {
    throw new Error("Approved project path is required.");
  }

  if (!normalized.startsWith("/")) {
    throw new Error("Approved project path must be an absolute path.");
  }

  if (sensitivePathPatterns.some((pattern) => pattern.test(normalized))) {
    throw new Error("Approved project path cannot point to auth, env, token, or private key files.");
  }

  return normalized;
}

function normalizeText(value: string | undefined): string {
  return value?.trim() ?? "";
}

function createApprovedPathId(projectId: string, localPath: string): string {
  const sanitized = localPath.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "path";
  return `approved-path-${projectId}-${sanitized}`;
}

export function mapApprovedProjectPathRow(row: ApprovedProjectPathRow): ApprovedProjectPath {
  return {
    id: row.id,
    projectId: row.projectId,
    localPath: row.localPath,
    label: row.label,
    approved: row.approved,
    approvalSource: row.approvalSource,
    approvedAt: row.approvedAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    note: row.note ?? undefined,
  };
}

export async function createApprovedProjectPath(input: UpsertApprovedProjectPathInput): Promise<ApprovedProjectPath> {
  const now = nowIso();
  const localPath = assertSafeApprovedProjectPath(input.localPath);
  const id = input.id ?? createApprovedPathId(input.projectId, localPath);
  const approved = input.approved ?? true;

  await createApprovedProjectPathRow({
    id,
    projectId: input.projectId,
    localPath,
    label: normalizeText(input.label),
    approved,
    approvalSource: "manual",
    approvedAt: approved ? now : null,
    createdAt: now,
    updatedAt: now,
    note: normalizeText(input.note) || null,
  });

  const row = await getApprovedProjectPathRowById(id);
  if (!row) {
    throw new Error(`Approved project path was not persisted: ${id}`);
  }

  return mapApprovedProjectPathRow(row);
}

export async function upsertApprovedProjectPath(input: UpsertApprovedProjectPathInput): Promise<ApprovedProjectPath> {
  const now = nowIso();
  const localPath = assertSafeApprovedProjectPath(input.localPath);
  const id = input.id ?? createApprovedPathId(input.projectId, localPath);
  const existing = await getApprovedProjectPathRowById(id);
  const approved = input.approved ?? true;

  await upsertApprovedProjectPathRow({
    id,
    projectId: input.projectId,
    localPath,
    label: normalizeText(input.label),
    approved,
    approvalSource: "manual",
    approvedAt: approved ? (existing?.approvedAt ?? now) : null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    note: normalizeText(input.note) || null,
  });

  const row = await getApprovedProjectPathRowById(id);
  if (!row) {
    throw new Error(`Approved project path was not persisted: ${id}`);
  }

  return mapApprovedProjectPathRow(row);
}

export async function listApprovedProjectPaths(): Promise<ApprovedProjectPath[]> {
  return (await listApprovedProjectPathRows()).map(mapApprovedProjectPathRow);
}

export async function listApprovedProjectPathsForProject(projectId: string): Promise<ApprovedProjectPath[]> {
  return (await listApprovedProjectPathRowsForProject(projectId)).map(mapApprovedProjectPathRow);
}

export async function getApprovedProjectPathById(id: string): Promise<ApprovedProjectPath | undefined> {
  const row = await getApprovedProjectPathRowById(id);
  return row ? mapApprovedProjectPathRow(row) : undefined;
}

export async function getPrimaryApprovedPathForProject(projectId: string): Promise<ApprovedProjectPath | undefined> {
  const row = await getPrimaryApprovedPathRowForProject(projectId);
  return row ? mapApprovedProjectPathRow(row) : undefined;
}

export async function updateApprovedProjectPathStatus(id: string, approved: boolean): Promise<ApprovedProjectPath> {
  const existing = await getApprovedProjectPathRowById(id);
  if (!existing) {
    throw new Error(`Approved project path not found: ${id}`);
  }

  const now = nowIso();
  await updateApprovedProjectPathRowStatus({
    id,
    approved,
    approvedAt: approved ? now : null,
    updatedAt: now,
  });

  const row = await getApprovedProjectPathRowById(id);
  if (!row) {
    throw new Error(`Approved project path not found after update: ${id}`);
  }

  return mapApprovedProjectPathRow(row);
}

export async function removeApprovedProjectPathRecord(id: string): Promise<void> {
  await deleteApprovedProjectPathRow(id);
}
