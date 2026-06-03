import { summarizeQualityGates } from "@/lib/quality-gates/quality-gate-summary";
import { evaluateReviewReadiness } from "@/lib/review/readiness";
import { qualityGateCommandCatalog, seedDefaultQualityGateConfigsForProject } from "@/lib/local-db/operations/quality-gate-configs";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import type { QualityGateConfig, QualityGateRun, ReviewDecision, ScopeCheck } from "@/lib/types";

const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function scope(status: ScopeCheck["status"]): ScopeCheck {
  return {
    id: `verify-scope-${status}`,
    taskId,
    projectId,
    status,
    forbiddenScope: [],
    matchedFiles: [],
    unmatchedFiles: [],
    ruleResults: [],
    reason: `controlled ${status}`,
    checkSource: "path_level_forbidden_scope",
    createdAt: "2026-06-03T05:30:00.000Z",
  };
}

function runFor(config: QualityGateConfig, status: QualityGateRun["status"], index: number): QualityGateRun {
  const startedAt = `2026-06-03T05:3${index}:00.000Z`;
  const endedAt = `2026-06-03T05:3${index}:01.000Z`;
  return {
    id: `verify-readiness-run-${status}-${config.commandKey}-${index}`,
    taskId,
    projectId,
    configId: config.id,
    commandKey: config.commandKey,
    command: config.command,
    status,
    exitCode: status === "passed" ? 0 : status === "failed" ? 1 : undefined,
    durationMs: 1000,
    stdoutPreview: "",
    stderrPreview: status === "failed" ? "controlled failure" : "",
    stdoutTruncated: false,
    stderrTruncated: false,
    skippedReason: status === "skipped" ? "config_disabled" : undefined,
    failedReason: status === "failed" ? "nonzero_exit" : status === "blocked" ? "execution_blocked" : undefined,
    startedAt,
    endedAt,
    createdAt: startedAt,
  };
}

function readiness(input: {
  decision?: ReviewDecision;
  runnerStatus?: "completed" | "failed" | "blocked" | "running";
  scopeStatus?: ScopeCheck["status"];
  qualityRuns?: QualityGateRun[];
  configs: QualityGateConfig[];
}) {
  return evaluateReviewReadiness({
    taskStatus: "waiting_review",
    reviewDecision: input.decision ?? "pending",
    runnerStatus: input.runnerStatus,
    scopeCheck: input.scopeStatus ? scope(input.scopeStatus) : undefined,
    changedFilesCount: 2,
    diffSummaryAvailable: true,
    qualityGateSummary: summarizeQualityGates(input.configs, input.qualityRuns ?? []),
  });
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();
  const configs = await seedDefaultQualityGateConfigsForProject(projectId);
  const enabled = configs.filter((config) => config.enabled);
  const passedRuns = enabled.map((config, index) => runFor(config, "passed", index));
  const failedRuns = [runFor(enabled[0], "passed", 0), runFor(enabled[1], "failed", 1), runFor(enabled[2], "passed", 2)];
  const blockedRuns = [runFor(enabled[0], "blocked", 0)];

  const approved = readiness({ configs, decision: "approved", runnerStatus: "completed", scopeStatus: "pass", qualityRuns: failedRuns });
  assert(approved.reviewReadiness === "approved", "approved decision should win");

  const revision = readiness({ configs, decision: "revision_requested", runnerStatus: "completed", scopeStatus: "pass", qualityRuns: passedRuns });
  assert(revision.reviewReadiness === "revision_requested", "revision_requested decision should win");

  const rejected = readiness({ configs, decision: "rejected", runnerStatus: "completed", scopeStatus: "pass", qualityRuns: passedRuns });
  assert(rejected.reviewReadiness === "rejected", "rejected decision should win");

  const blockedByScope = readiness({ configs, runnerStatus: "completed", scopeStatus: "blocked", qualityRuns: passedRuns });
  assert(blockedByScope.reviewReadiness === "blocked_by_scope", "scope blocked should block readiness");

  const blockedByQuality = readiness({ configs, runnerStatus: "completed", scopeStatus: "pass", qualityRuns: failedRuns });
  assert(blockedByQuality.reviewReadiness === "blocked_by_quality", "quality failed should block readiness");

  const blockedQualityRun = readiness({ configs, runnerStatus: "completed", scopeStatus: "pass", qualityRuns: blockedRuns });
  assert(blockedQualityRun.reviewReadiness === "blocked_by_quality", "quality blocked should block readiness");

  const runnerNotCompleted = readiness({ configs, runnerStatus: "running", scopeStatus: "pass", qualityRuns: passedRuns });
  assert(runnerNotCompleted.reviewReadiness === "runner_not_completed", "runner must be completed before ready");

  const ready = readiness({ configs, runnerStatus: "completed", scopeStatus: "warning", qualityRuns: passedRuns });
  assert(ready.reviewReadiness === "ready_for_review", "completed runner with scope pass/warning and passing gates should be ready");

  const mixed = readiness({ configs, runnerStatus: "completed", scopeStatus: "pass", qualityRuns: [] });
  assert(mixed.reviewReadiness === "mixed", "completed runner with no quality results should be mixed");

  const summary = {
    projectId,
    allowlistedCommands: Object.fromEntries(Object.entries(qualityGateCommandCatalog).map(([key, value]) => [key, value.command])),
    approved: approved.reviewReadiness,
    revisionRequested: revision.reviewReadiness,
    rejected: rejected.reviewReadiness,
    blockedByScope: blockedByScope.reviewReadiness,
    blockedByQuality: blockedByQuality.reviewReadiness,
    runnerNotCompleted: runnerNotCompleted.reviewReadiness,
    readyForReview: ready.reviewReadiness,
    mixed: mixed.reviewReadiness,
    qualityGateCommandExecuted: false,
    codexCliExecuted: false,
    arbitraryCommandAdded: false,
    autoApproveAttempted: false,
    autoRejectAttempted: false,
    autoFixAttempted: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Review room readiness verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Review room readiness verification failed");
  console.error(error);
  process.exit(1);
});
