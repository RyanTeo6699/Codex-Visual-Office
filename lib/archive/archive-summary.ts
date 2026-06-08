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
import type { ArchiveSummary } from "./archive-types";

function latestTime(values: Array<string | undefined>): string | undefined {
  return values.filter((value): value is string => Boolean(value)).sort((a, b) => b.localeCompare(a))[0];
}

function takeRecent<T extends { createdAt: string }>(items: T[], limit = 5): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function buildArchiveSummary(): Promise<ArchiveSummary> {
  await seedDefaultRetentionPolicies();
  const [
    taskEvents,
    reviewRecords,
    qualityGateRuns,
    qualityGateEvents,
    gitSnapshots,
    fileChanges,
    diffSummaries,
    scopeChecks,
    backupRecords,
    retentionPolicies,
  ] = await Promise.all([
    listTaskEvents(),
    listReviewRecords(),
    listQualityGateRuns(),
    listQualityGateEvents(),
    listGitSnapshots(),
    listFileChanges(),
    listDiffSummaries(),
    listScopeChecks(),
    listBackupRecords(),
    listRetentionPolicies(),
  ]);

  const runnerOutputPreviewRecords = taskEvents.filter((event) => event.payloadJson.includes("runner_output_received") || event.payloadJson.includes("stdoutPreview")).length;

  return {
    counts: {
      taskEvents: taskEvents.length,
      reviewRecords: reviewRecords.length,
      runnerOutputPreviewRecords,
      qualityGateRuns: qualityGateRuns.length,
      qualityGateEvents: qualityGateEvents.length,
      gitSnapshots: gitSnapshots.length,
      fileChanges: fileChanges.length,
      diffSummaries: diffSummaries.length,
      scopeChecks: scopeChecks.length,
      backupRecords: backupRecords.length,
    },
    retentionPolicies,
    latestActivityTime: latestTime([
      ...taskEvents.map((item) => item.createdAt),
      ...reviewRecords.map((item) => item.createdAt),
      ...qualityGateRuns.map((item) => item.createdAt),
      ...qualityGateEvents.map((item) => item.createdAt),
      ...gitSnapshots.map((item) => item.createdAt),
      ...fileChanges.map((item) => item.createdAt),
      ...diffSummaries.map((item) => item.createdAt),
      ...scopeChecks.map((item) => item.createdAt),
    ]),
    latestBackupTime: latestTime(backupRecords.map((item) => item.createdAt)),
    recentRecords: {
      taskEvents: takeRecent(taskEvents).map((item) => ({ id: item.id, message: item.message, createdAt: item.createdAt })),
      reviewRecords: takeRecent(reviewRecords).map((item) => ({ id: item.id, taskId: item.taskId, decision: item.decision, createdAt: item.createdAt })),
      qualityGateRuns: takeRecent(qualityGateRuns).map((item) => ({ id: item.id, command: item.command, status: item.status, createdAt: item.createdAt })),
      qualityGateEvents: takeRecent(qualityGateEvents).map((item) => ({ id: item.id, eventType: item.eventType, createdAt: item.createdAt })),
      gitSnapshots: takeRecent(gitSnapshots).map((item) => ({ id: item.id, snapshotKind: item.snapshotKind, branch: item.branch, createdAt: item.createdAt })),
      fileChanges: takeRecent(fileChanges).map((item) => ({ id: item.id, filePath: item.filePath, changeStatus: item.changeStatus, createdAt: item.createdAt })),
      diffSummaries: takeRecent(diffSummaries).map((item) => ({ id: item.id, filesChanged: item.filesChanged, createdAt: item.createdAt })),
      scopeChecks: takeRecent(scopeChecks).map((item) => ({ id: item.id, status: item.status, createdAt: item.createdAt })),
      backupRecords: backupRecords.slice(0, 5),
    },
  };
}
