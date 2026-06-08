import type { RetentionMode, RetentionPolicy, RetentionTarget } from "@/lib/types";
import {
  getRetentionPolicyRowById,
  getRetentionPolicyRowByTarget,
  listRetentionPolicyRows,
  updateRetentionPolicyRow,
  upsertRetentionPolicyRow,
  type RetentionPolicyRow,
} from "../repositories/retention-policies";
import { nowIso } from "./time";

export interface UpsertRetentionPolicyInput {
  id?: string;
  target: RetentionTarget;
  retentionDays: number;
  enabled: boolean;
  mode: RetentionMode;
  description: string;
}

export const defaultRetentionPolicyInputs: UpsertRetentionPolicyInput[] = [
  { target: "task_events", retentionDays: 90, enabled: true, mode: "dry_run_only", description: "Task activity history dry-run retention." },
  { target: "runner_outputs", retentionDays: 30, enabled: true, mode: "dry_run_only", description: "Runner output preview dry-run retention." },
  { target: "quality_gate_events", retentionDays: 60, enabled: true, mode: "dry_run_only", description: "Quality gate event dry-run retention." },
  { target: "quality_gate_runs", retentionDays: 60, enabled: true, mode: "dry_run_only", description: "Quality gate run dry-run retention." },
  { target: "git_snapshots", retentionDays: 60, enabled: true, mode: "dry_run_only", description: "Git snapshot dry-run retention." },
  { target: "file_changes", retentionDays: 60, enabled: true, mode: "dry_run_only", description: "Changed file record dry-run retention." },
  { target: "diff_summaries", retentionDays: 60, enabled: true, mode: "dry_run_only", description: "Diff summary dry-run retention." },
  { target: "scope_checks", retentionDays: 60, enabled: true, mode: "dry_run_only", description: "Scope check dry-run retention." },
  { target: "review_records", retentionDays: 180, enabled: true, mode: "dry_run_only", description: "Review record dry-run retention." },
  { target: "backup_records", retentionDays: 180, enabled: true, mode: "dry_run_only", description: "Backup record dry-run retention. Backup files are not deleted." },
];

function policyIdForTarget(target: string): string {
  return `retention-policy-${target}`;
}

export function mapRetentionPolicyRow(row: RetentionPolicyRow): RetentionPolicy {
  return {
    id: row.id,
    target: row.target,
    retentionDays: row.retentionDays,
    enabled: row.enabled,
    mode: row.mode,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function upsertRetentionPolicy(input: UpsertRetentionPolicyInput): Promise<RetentionPolicy> {
  if (input.mode !== "dry_run_only") {
    throw new Error("Phase 6 Step 4 only supports dry_run_only retention policies.");
  }

  const id = input.id ?? policyIdForTarget(input.target);
  const existing = await getRetentionPolicyRowById(id);
  const now = nowIso();
  await upsertRetentionPolicyRow({
    id,
    target: input.target,
    retentionDays: input.retentionDays,
    enabled: input.enabled,
    mode: "dry_run_only",
    description: input.description,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });

  const row = await getRetentionPolicyRowById(id);
  if (!row) {
    throw new Error(`Retention policy was not persisted: ${id}`);
  }

  return mapRetentionPolicyRow(row);
}

export async function seedDefaultRetentionPolicies(): Promise<RetentionPolicy[]> {
  const policies: RetentionPolicy[] = [];
  for (const policy of defaultRetentionPolicyInputs) {
    policies.push(await upsertRetentionPolicy(policy));
  }

  return policies;
}

export async function listRetentionPolicies(): Promise<RetentionPolicy[]> {
  return (await listRetentionPolicyRows()).map(mapRetentionPolicyRow).sort((a, b) => a.target.localeCompare(b.target));
}

export async function getRetentionPolicyByTarget(target: RetentionTarget): Promise<RetentionPolicy | undefined> {
  const row = await getRetentionPolicyRowByTarget(target);
  return row ? mapRetentionPolicyRow(row) : undefined;
}

export async function updateRetentionPolicy(id: string, changes: Partial<Omit<UpsertRetentionPolicyInput, "id" | "target">>): Promise<RetentionPolicy> {
  const existing = await getRetentionPolicyRowById(id);
  if (!existing) {
    throw new Error(`Retention policy not found: ${id}`);
  }

  if (changes.mode && changes.mode !== "dry_run_only") {
    throw new Error("Phase 6 Step 4 only supports dry_run_only retention policies.");
  }

  await updateRetentionPolicyRow(id, {
    retentionDays: changes.retentionDays ?? existing.retentionDays,
    enabled: changes.enabled ?? existing.enabled,
    mode: "dry_run_only",
    description: changes.description ?? existing.description,
    updatedAt: nowIso(),
  });

  const row = await getRetentionPolicyRowById(id);
  if (!row) {
    throw new Error(`Retention policy not found after update: ${id}`);
  }

  return mapRetentionPolicyRow(row);
}

export async function enableRetentionPolicy(id: string): Promise<RetentionPolicy> {
  return updateRetentionPolicy(id, { enabled: true });
}

export async function disableRetentionPolicy(id: string): Promise<RetentionPolicy> {
  return updateRetentionPolicy(id, { enabled: false });
}
