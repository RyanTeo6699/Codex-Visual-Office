import type { BuildCheck, DiffSummary, QualityGateRun, ReviewDecision, ScopeCheck, Task, TaskEvent } from "@/lib/types";
import type { WorkflowTimeline, WorkflowTimelineItem } from "./task-lifecycle-types";

export interface WorkflowTimelineReviewInput {
  taskId: string;
  projectId: string;
  decision: ReviewDecision;
  createdAt?: string;
}

export interface BuildWorkflowTimelineInput {
  task: Task;
  taskEvents: TaskEvent[];
  buildChecks: BuildCheck[];
  qualityGateRuns: QualityGateRun[];
  review?: WorkflowTimelineReviewInput;
  diffSummary?: DiffSummary;
  scopeCheck?: ScopeCheck;
}

function readPayloadTime(event: TaskEvent): string | undefined {
  return typeof event.payload?.createdAt === "string" ? event.payload.createdAt : undefined;
}

function buildTone(status: BuildCheck["status"]): WorkflowTimelineItem["tone"] {
  if (status === "failed") {
    return "danger";
  }

  if (status === "passed") {
    return "success";
  }

  if (status === "skipped") {
    return "warning";
  }

  return "info";
}

function qualityTone(status: QualityGateRun["status"]): WorkflowTimelineItem["tone"] {
  if (status === "failed" || status === "blocked") {
    return "danger";
  }

  if (status === "passed") {
    return "success";
  }

  if (status === "skipped") {
    return "warning";
  }

  return "info";
}

function reviewTone(decision: ReviewDecision): WorkflowTimelineItem["tone"] {
  if (decision === "approved") {
    return "success";
  }

  if (decision === "rejected") {
    return "danger";
  }

  if (decision === "revision_requested") {
    return "warning";
  }

  return "info";
}

export function buildWorkflowTimeline(input: BuildWorkflowTimelineInput): WorkflowTimeline {
  const taskEvents: WorkflowTimelineItem[] = input.taskEvents
    .filter((event) => event.taskId === input.task.id)
    .map((event) => ({
      id: event.id,
      taskId: input.task.id,
      projectId: input.task.projectId,
      kind: "task_event",
      tone: event.tone,
      label: "Task event",
      detail: event.message,
      status: typeof event.payload?.lifecycleEvent === "string" ? event.payload.lifecycleEvent : undefined,
      createdAt: readPayloadTime(event) ?? event.time,
    }));
  const buildItems: WorkflowTimelineItem[] = input.buildChecks
    .filter((check) => check.taskId === input.task.id)
    .map((check) => ({
      id: check.id,
      taskId: input.task.id,
      projectId: input.task.projectId,
      kind: "build_check",
      tone: buildTone(check.status),
      label: check.label,
      detail: check.detail,
      status: check.status,
      createdAt: "1970-01-01T00:00:00.000Z",
    }));
  const qualityItems: WorkflowTimelineItem[] = input.qualityGateRuns
    .filter((run) => run.taskId === input.task.id)
    .map((run) => ({
      id: run.id,
      taskId: input.task.id,
      projectId: input.task.projectId,
      kind: "quality_gate_run",
      tone: qualityTone(run.status),
      label: run.commandKey,
      detail: run.failedReason ?? run.skippedReason ?? run.command,
      status: run.status,
      createdAt: run.endedAt ?? run.startedAt ?? run.createdAt,
    }));
  const reviewItems: WorkflowTimelineItem[] = input.review
    ? [{
        id: `review-${input.review.taskId}-${input.review.decision}`,
        taskId: input.task.id,
        projectId: input.task.projectId,
        kind: "review_decision",
        tone: reviewTone(input.review.decision),
        label: "Review decision",
        detail: input.review.decision,
        status: input.review.decision,
        createdAt: input.review.createdAt ?? "",
      }]
    : [];
  const diffItems: WorkflowTimelineItem[] = input.diffSummary
    ? [{
        id: input.diffSummary.id,
        taskId: input.task.id,
        projectId: input.task.projectId,
        kind: "diff_summary",
        tone: input.diffSummary.filesChanged > 0 ? "info" : "warning",
        label: "Diff summary",
        detail: `${input.diffSummary.filesChanged} files, +${input.diffSummary.insertions} -${input.diffSummary.deletions}`,
        status: input.diffSummary.source,
        createdAt: input.diffSummary.createdAt,
      }]
    : [];
  const scopeItems: WorkflowTimelineItem[] = input.scopeCheck
    ? [{
        id: input.scopeCheck.id,
        taskId: input.task.id,
        projectId: input.task.projectId,
        kind: "scope_check",
        tone: input.scopeCheck.status === "blocked" ? "danger" : input.scopeCheck.status === "warning" ? "warning" : "success",
        label: "Scope check",
        detail: input.scopeCheck.reason,
        status: input.scopeCheck.status,
        createdAt: input.scopeCheck.createdAt,
      }]
    : [];
  const items = [...taskEvents, ...buildItems, ...qualityItems, ...reviewItems, ...diffItems, ...scopeItems]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    taskId: input.task.id,
    projectId: input.task.projectId,
    source: "local_sqlite_records",
    items,
    latestItemAt: items[0]?.createdAt,
    hasBlockingItem: items.some((item) => item.tone === "danger" || item.status === "blocked" || item.status === "failed"),
  };
}
