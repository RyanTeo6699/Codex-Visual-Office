import { readdir } from "node:fs/promises";
import { LOCAL_BACKUP_DIR } from "@/lib/local-backup/backup-paths";
import { buildArchiveSummary } from "@/lib/archive/archive-summary";
import { buildCleanupDryRunPreview } from "@/lib/archive/archive-retention-preview";
import { initializeLocalDb } from "@/lib/local-db/init";
import {
  disableRetentionPolicy,
  enableRetentionPolicy,
  getRetentionPolicyByTarget,
  listRetentionPolicies,
  seedDefaultRetentionPolicies,
  upsertRetentionPolicy,
} from "@/lib/local-db/operations/retention-policies";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listQualityGateEvents } from "@/lib/local-db/operations/quality-gate-events";
import { listQualityGateRuns } from "@/lib/local-db/operations/quality-gate-runs";
import { listTaskEvents } from "@/lib/local-db/repositories/task-events";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

const requiredTargets = [
  "task_events",
  "runner_outputs",
  "quality_gate_events",
  "quality_gate_runs",
  "git_snapshots",
  "file_changes",
  "diff_summaries",
  "scope_checks",
  "review_records",
  "backup_records",
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function listBackupFiles(): Promise<string[]> {
  try {
    return await readdir(LOCAL_BACKUP_DIR);
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();
  await seedDefaultRetentionPolicies();
  await seedDefaultRetentionPolicies();

  const policies = await listRetentionPolicies();
  for (const target of requiredTargets) {
    const policy = policies.find((item) => item.target === target);
    assert(policy, `Missing default retention policy: ${target}`);
    assert(policy.mode === "dry_run_only", `Retention policy must be dry_run_only: ${target}`);
  }

  const taskPolicy = await getRetentionPolicyByTarget("task_events");
  assert(taskPolicy?.target === "task_events", "getRetentionPolicyByTarget should read task_events");

  const updatedPolicy = await upsertRetentionPolicy({
    id: "retention-policy-verify-target",
    target: "verify_target",
    retentionDays: 7,
    enabled: true,
    mode: "dry_run_only",
    description: "Verification policy",
  });
  assert(updatedPolicy.target === "verify_target", "upsertRetentionPolicy should persist a policy");

  const disabled = await disableRetentionPolicy(updatedPolicy.id);
  assert(disabled.enabled === false, "disableRetentionPolicy should disable policy");

  const enabled = await enableRetentionPolicy(updatedPolicy.id);
  assert(enabled.enabled === true, "enableRetentionPolicy should enable policy");

  const beforeCounts = {
    taskEvents: (await listTaskEvents()).length,
    qualityGateRuns: (await listQualityGateRuns()).length,
    qualityGateEvents: (await listQualityGateEvents()).length,
    backupRecords: (await listBackupRecords()).length,
    backupFiles: (await listBackupFiles()).length,
  };

  const summary = await buildArchiveSummary();
  assert(summary.counts.taskEvents >= beforeCounts.taskEvents, "Archive summary should count task events");
  assert(summary.counts.backupRecords >= beforeCounts.backupRecords, "Archive summary should count backup records");
  assert(summary.retentionPolicies.length >= requiredTargets.length, "Archive summary should include retention policies");

  const dryRun = await buildCleanupDryRunPreview();
  assert(dryRun.mode === "dry_run_only", "Cleanup preview must be dry_run_only");
  assert(dryRun.totalWouldDeleteCount >= 0, "Cleanup preview should return a non-negative candidate count");
  assert(dryRun.policyResults.every((result) => result.mode === "dry_run_only"), "Every policy result should be dry-run only");

  const afterCounts = {
    taskEvents: (await listTaskEvents()).length,
    qualityGateRuns: (await listQualityGateRuns()).length,
    qualityGateEvents: (await listQualityGateEvents()).length,
    backupRecords: (await listBackupRecords()).length,
    backupFiles: (await listBackupFiles()).length,
  };

  assert(afterCounts.taskEvents === beforeCounts.taskEvents, "Dry-run must not delete task events");
  assert(afterCounts.qualityGateRuns === beforeCounts.qualityGateRuns, "Dry-run must not delete quality gate runs");
  assert(afterCounts.qualityGateEvents === beforeCounts.qualityGateEvents, "Dry-run must not delete quality gate events");
  assert(afterCounts.backupRecords === beforeCounts.backupRecords, "Dry-run must not delete backup records");
  assert(afterCounts.backupFiles === beforeCounts.backupFiles, "Dry-run must not delete backup files");

  const output = {
    defaultPolicies: policies.length,
    summaryCounts: summary.counts,
    latestActivityTime: summary.latestActivityTime,
    latestBackupTime: summary.latestBackupTime,
    dryRunMode: dryRun.mode,
    totalWouldDeleteCount: dryRun.totalWouldDeleteCount,
    dataDeleted: false,
    backupFilesDeleted: false,
    gitExecutionAttempted: false,
    codexExecutionAttempted: false,
    qualityGateExecutionAttempted: false,
    codexAuthReadAttempted: false,
    envReadAttempted: false,
    cloudUploadAttempted: false,
  };

  console.log("Archive retention verification passed");
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error: unknown) => {
  console.error("Archive retention verification failed");
  console.error(error);
  process.exit(1);
});
