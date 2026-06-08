import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listDiffSummaries } from "@/lib/local-db/operations/diff-summaries";
import { listQualityGateEvents } from "@/lib/local-db/operations/quality-gate-events";
import { listQualityGateRuns } from "@/lib/local-db/operations/quality-gate-runs";
import { listRetentionPolicies, seedDefaultRetentionPolicies } from "@/lib/local-db/operations/retention-policies";
import { listScopeChecks } from "@/lib/local-db/operations/scope-checks";
import { listFileChanges } from "@/lib/local-db/repositories/file-changes";
import { listGitSnapshots } from "@/lib/local-db/repositories/git-snapshots";
import { listReviewRecords } from "@/lib/local-db/repositories/review-records";
import { listTaskEvents } from "@/lib/local-db/repositories/task-events";
import type { CleanupDryRunPolicyResult, CleanupDryRunPreview } from "./archive-types";

interface CandidateRecord {
  id: string;
  createdAt: string;
  label: string;
}

function cutoffForDays(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function olderThanPolicy(records: CandidateRecord[], retentionDays: number): CandidateRecord[] {
  const cutoff = cutoffForDays(retentionDays);
  return records.filter((record) => record.createdAt < cutoff);
}

async function recordsForTarget(target: string): Promise<CandidateRecord[]> {
  switch (target) {
    case "task_events":
      return (await listTaskEvents()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: item.message }));
    case "runner_outputs":
      return (await listTaskEvents())
        .filter((item) => item.payloadJson.includes("runner_output_received") || item.payloadJson.includes("stdoutPreview"))
        .map((item) => ({ id: item.id, createdAt: item.createdAt, label: item.message }));
    case "quality_gate_events":
      return (await listQualityGateEvents()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: item.eventType }));
    case "quality_gate_runs":
      return (await listQualityGateRuns()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: `${item.command} / ${item.status}` }));
    case "git_snapshots":
      return (await listGitSnapshots()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: `${item.snapshotKind} / ${item.branch}` }));
    case "file_changes":
      return (await listFileChanges()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: item.filePath }));
    case "diff_summaries":
      return (await listDiffSummaries()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: `${item.filesChanged} files changed` }));
    case "scope_checks":
      return (await listScopeChecks()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: item.status }));
    case "review_records":
      return (await listReviewRecords()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: `${item.taskId} / ${item.decision}` }));
    case "backup_records":
      return (await listBackupRecords()).map((item) => ({ id: item.id, createdAt: item.createdAt, label: `${item.backupKind} / backup file retained` }));
    default:
      return [];
  }
}

export async function buildCleanupDryRunPreview(): Promise<CleanupDryRunPreview> {
  await seedDefaultRetentionPolicies();
  const policies = await listRetentionPolicies();
  const policyResults: CleanupDryRunPolicyResult[] = [];

  for (const policy of policies) {
    const records = policy.enabled ? olderThanPolicy(await recordsForTarget(policy.target), policy.retentionDays) : [];
    policyResults.push({
      target: policy.target,
      mode: "dry_run_only",
      enabled: policy.enabled,
      retentionDays: policy.retentionDays,
      wouldDeleteCount: records.length,
      candidatesPreview: records.slice(0, 5),
    });
  }

  return {
    mode: "dry_run_only",
    totalWouldDeleteCount: policyResults.reduce((total, item) => total + item.wouldDeleteCount, 0),
    policyResults,
    dataDeleted: false,
    backupFilesDeleted: false,
  };
}
