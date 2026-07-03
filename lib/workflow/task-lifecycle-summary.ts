import { summarizeCodexRunHistory } from "./codex-run-history";
import { determineWorkflowNextAction } from "./workflow-next-action";
import type { DiffSummary, BuildCheck, QualityGateConfig, QualityGateRun, ReviewRecord, ScopeCheck, Task, TaskEvent } from "@/lib/types";
import { summarizeQualityGates } from "@/lib/quality-gates/quality-gate-summary";
import type { TaskLifecycleStage, TaskLifecycleSummary } from "./task-lifecycle-types";

export interface SummarizeTaskLifecycleInput {
  task: Task;
  taskEvents: TaskEvent[];
  buildChecks: BuildCheck[];
  review?: ReviewRecord;
  scopeCheck?: ScopeCheck;
  diffSummary?: DiffSummary;
  qualityGateConfigs: QualityGateConfig[];
  qualityGateRuns: QualityGateRun[];
}

function eventTime(event: TaskEvent): string {
  const createdAt = typeof event.payload?.createdAt === "string" ? event.payload.createdAt : undefined;
  return createdAt ?? event.time;
}

function latestEvent(events: TaskEvent[]): TaskEvent | undefined {
  return [...events].sort((a, b) => eventTime(b).localeCompare(eventTime(a)))[0];
}

function latestBuildStatus(buildChecks: BuildCheck[]): BuildCheck["status"] | undefined {
  return [...buildChecks].sort((a, b) => a.id.localeCompare(b.id)).at(-1)?.status;
}

function stageFor(input: { task: Task; qualityGateRuns: QualityGateRun[]; review?: ReviewRecord; scopeCheck?: ScopeCheck; codexLastRunStatus?: string }): TaskLifecycleStage {
  if (input.task.status === "blocked" || input.scopeCheck?.status === "blocked") {
    return "blocked";
  }

  if (input.review?.decision === "revision_requested") {
    return "revision_requested";
  }

  if (input.review?.decision === "approved") {
    return "approved";
  }

  if (input.review?.decision === "rejected") {
    return "rejected";
  }

  if (input.task.status === "done") {
    return "done";
  }

  if (input.task.status === "waiting_review" || input.review?.decision === "pending") {
    return "reviewing";
  }

  if (input.qualityGateRuns.some((run) => run.status === "running" || run.status === "failed" || run.status === "blocked")) {
    return "run_completed";
  }

  if (input.task.status === "running") {
    return "running";
  }

  if (input.task.status === "ready") {
    return "ready";
  }

  return "planned";
}

function v2AliasFor(stage: TaskLifecycleStage): TaskLifecycleStage {
  if (stage === "planned") {
    return "draft";
  }

  if (stage === "prompt_ready") {
    return "prompt_prepared";
  }

  if (stage === "run_completed") {
    return "waiting_for_review";
  }

  if (stage === "reviewing") {
    return "waiting_for_review";
  }

  if (stage === "revision_requested") {
    return "changes_requested";
  }

  if (stage === "done") {
    return "archived";
  }

  return stage;
}

function summaryMessage(summary: Pick<TaskLifecycleSummary, "lifecycleStage" | "failedBuildCheckCount" | "failedQualityGateCount" | "blockedQualityGateCount" | "recommendedNextAction">): string {
  if (summary.lifecycleStage === "blocked") {
    return "Task is blocked and needs inspection before workflow can continue.";
  }

  if (summary.failedBuildCheckCount > 0 || summary.failedQualityGateCount > 0 || summary.blockedQualityGateCount > 0) {
    return "Task has failed or blocked verification records.";
  }

  if (summary.recommendedNextAction === "review_decision") {
    return "Task is waiting for review.";
  }

  if (summary.lifecycleStage === "done" || summary.lifecycleStage === "approved") {
    return "Task lifecycle is complete in local records.";
  }

  return "Task lifecycle is ready for the next local workflow step.";
}

function lifecycleWarnings(input: {
  failedBuildCheckCount: number;
  failedQualityGateCount: number;
  blockedQualityGateCount: number;
  scopeStatus?: ScopeCheck["status"];
  codexFailureCategory?: string;
}): string[] {
  const warnings: string[] = [];

  if (input.scopeStatus === "blocked") {
    warnings.push("Scope Guard is blocked.");
  }

  if (input.failedBuildCheckCount > 0) {
    warnings.push("Build checks include failed records.");
  }

  if (input.failedQualityGateCount > 0) {
    warnings.push("Quality gates include failed records.");
  }

  if (input.blockedQualityGateCount > 0) {
    warnings.push("Quality gates include blocked records.");
  }

  if (input.codexFailureCategory) {
    warnings.push(`Latest Codex run failure category: ${input.codexFailureCategory}.`);
  }

  return warnings;
}

export function summarizeTaskLifecycle(input: SummarizeTaskLifecycleInput): TaskLifecycleSummary {
  const taskEvents = input.taskEvents.filter((event) => event.taskId === input.task.id);
  const buildChecks = input.buildChecks.filter((check) => check.taskId === input.task.id);
  const qualityGateRuns = input.qualityGateRuns.filter((run) => run.taskId === input.task.id);
  const qualitySummary = summarizeQualityGates(input.qualityGateConfigs, qualityGateRuns);
  const codexRunHistory = summarizeCodexRunHistory({
    taskId: input.task.id,
    projectId: input.task.projectId,
    taskEvents,
  });
  const lastEvent = latestEvent(taskEvents);
  const recommendedNextAction = determineWorkflowNextAction({
    task: input.task,
    review: input.review,
    scopeCheck: input.scopeCheck,
    diffSummary: input.diffSummary,
    qualitySummary,
    qualityGateRuns,
    codexRunHistory,
  });
  const failedQualityGateCount = qualityGateRuns.filter((run) => run.status === "failed").length;
  const blockedQualityGateCount = qualityGateRuns.filter((run) => run.status === "blocked").length;
  const lifecycleStage = stageFor({
    task: input.task,
    qualityGateRuns,
    review: input.review,
    scopeCheck: input.scopeCheck,
    codexLastRunStatus: codexRunHistory.lastRun.status,
  });
  const failedBuildCheckCount = buildChecks.filter((check) => check.status === "failed").length;
  const codexFailureCategory = codexRunHistory.lastRun.failureCategory;
  const warnings = lifecycleWarnings({
    failedBuildCheckCount,
    failedQualityGateCount,
    blockedQualityGateCount,
    scopeStatus: input.scopeCheck?.status,
    codexFailureCategory,
  });
  const summary = {
    taskId: input.task.id,
    projectId: input.task.projectId,
    title: input.task.title,
    status: input.task.status,
    currentTaskStatus: input.task.status,
    priority: input.task.priority,
    assignedSeatId: input.task.agentSeatId,
    lifecycleStage,
    phase: v2AliasFor(lifecycleStage),
    reviewDecision: input.review?.decision,
    codexFailureCategory,
    scopeGuardStatus: input.scopeCheck?.status,
    qualityGateSummaryStatus: qualitySummary.overallStatus,
    qualityOverallStatus: qualitySummary.overallStatus,
    latestBuildStatus: latestBuildStatus(buildChecks),
    scopeStatus: input.scopeCheck?.status,
    codexLastRunStatus: codexRunHistory.lastRun.status,
    eventCount: taskEvents.length,
    buildCheckCount: buildChecks.length,
    failedBuildCheckCount,
    failedQualityGateCount,
    blockedQualityGateCount,
    changedFileCount: input.task.changedFiles.length,
    diffFileCount: input.diffSummary?.filesChanged,
    lastEventAt: lastEvent ? eventTime(lastEvent) : undefined,
    lastEventTone: lastEvent?.tone,
    lastEventMessage: lastEvent?.message,
    recommendedNextAction,
    timelineEvents: taskEvents.length + buildChecks.length + qualityGateRuns.length + (input.review ? 1 : 0) + (input.diffSummary ? 1 : 0) + (input.scopeCheck ? 1 : 0),
    warnings,
    summaryMessage: "Pending summary",
  } satisfies TaskLifecycleSummary;

  return {
    ...summary,
    summaryMessage: summaryMessage(summary),
  };
}
