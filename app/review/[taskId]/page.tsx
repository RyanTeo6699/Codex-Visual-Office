import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { WorkflowInsightPanels } from "@/components/review/WorkflowInsightPanels";
import type { AgentVisualStateSummary, CodexRunHistoryItem, PromptVersionSummary, TaskLifecycleSummary, WorkflowTimelineItem } from "@/components/review/WorkflowInsightPanels";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { buildCodexTaskPrompt } from "@/lib/codex-cli/prompt-builder";
import { getRunnerSafetyStatus } from "@/lib/codex-cli/runner-safety";
import { summarizeCodexLastRun } from "@/lib/codex-cli/runtime-status";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";
import * as selectedReads from "@/lib/local-db/selected-reads";
import { agentSeats, buildChecks, projects, reviewRecords, tasks } from "@/lib/mock-data";
import type { AgentSeat, DiffSummary, FileChange, QualityGateRun, ReviewRecord, ScopeCheck, Task, TaskEvent } from "@/lib/types";
import { summarizeCodexRunHistory } from "@/lib/workflow/codex-run-history";
import { summarizePromptVersions } from "@/lib/workflow/prompt-version-summary";
import { persistReviewDecisionAction, recordCodexPromptHandoffAction, runEnabledQualityGatesAction, runScopedCodexTaskAction } from "./actions";

function readStringPayload(event: TaskEvent | undefined, key: string): string | undefined {
  const value = event?.payload?.[key];
  return typeof value === "string" ? value : undefined;
}

function readNumberPayload(event: TaskEvent | undefined, key: string): number | undefined {
  const value = event?.payload?.[key];
  return typeof value === "number" ? value : undefined;
}

function readBooleanPayload(event: TaskEvent | undefined, key: string): boolean | undefined {
  const value = event?.payload?.[key];
  return typeof value === "boolean" ? value : undefined;
}

function readReasonsPayload(event: TaskEvent | undefined): string | undefined {
  const value = event?.payload?.reasons;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join("\n") : undefined;
}

function calculateDurationMs(startedAt: string, endedAt: string): number | undefined {
  if (!startedAt || !endedAt) {
    return undefined;
  }

  return Math.max(0, new Date(endedAt).getTime() - new Date(startedAt).getTime());
}

function buildRunnerResultFromEvents(events: TaskEvent[]): ScopedCodexRunnerOutput | undefined {
  const completed = events.find((event) => event.payload?.lifecycleEvent === "runner_completed");
  const failed = events.find((event) => event.payload?.lifecycleEvent === "runner_failed");
  const started = events.find((event) => event.payload?.lifecycleEvent === "runner_started");
  const output = events.find((event) => event.payload?.lifecycleEvent === "runner_output_received");
  const requested = events.find((event) => event.payload?.lifecycleEvent === "runner_requested");
  const terminalEvent = completed ?? failed;

  if (!terminalEvent && !started && !requested) {
    return undefined;
  }

  const status = completed ? "completed" : failed ? "failed" : started ? "running" : "blocked";
  const startedAt = readStringPayload(started, "startedAt") ?? readStringPayload(terminalEvent, "startedAt") ?? "";
  const endedAt = readStringPayload(terminalEvent, "endedAt") ?? "";
  const stdoutPreview = readStringPayload(output, "stdoutPreview") ?? readStringPayload(terminalEvent, "stdoutPreview") ?? readStringPayload(output, "outputPreview") ?? readStringPayload(failed, "outputPreview") ?? "";
  const stderrPreview = readStringPayload(output, "stderrPreview") ?? readStringPayload(terminalEvent, "stderrPreview") ?? readStringPayload(output, "errorPreview") ?? readStringPayload(failed, "errorPreview") ?? readReasonsPayload(requested) ?? "";

  return {
    status,
    exitCode: readNumberPayload(terminalEvent, "exitCode"),
    startedAt,
    endedAt,
    durationMs: readNumberPayload(terminalEvent, "durationMs") ?? readNumberPayload(output, "durationMs") ?? calculateDurationMs(startedAt, endedAt),
    stdoutPreview,
    stderrPreview,
    stdoutTruncated: readBooleanPayload(output, "stdoutTruncated") ?? readBooleanPayload(terminalEvent, "stdoutTruncated") ?? false,
    stderrTruncated: readBooleanPayload(output, "stderrTruncated") ?? readBooleanPayload(terminalEvent, "stderrTruncated") ?? false,
    outputPreview: stdoutPreview,
    errorPreview: stderrPreview,
    taskExecutionAttempted: status !== "blocked",
    autoPushAttempted: false,
    autoDeployAttempted: false,
    eventIds: events
      .filter((event) => typeof event.payload?.lifecycleEvent === "string")
      .map((event) => event.id),
  };
}

export default async function ReviewRoom({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  let localRead: Awaited<ReturnType<typeof selectedReads.readSelectedReviewRoom>> | undefined;

  try {
    localRead = await selectedReads.readSelectedReviewRoom(taskId);
  } catch (error) {
    console.error("Review Room selected local read failed", error);
  }

  const task = localRead?.task ?? tasks.find((item) => item.id === taskId);

  if (!task) {
    notFound();
  }

  const project = projects.find((item) => item.id === task.projectId);

  if (!project) {
    notFound();
  }

  const agent = agentSeats.find((item) => item.id === task.agentSeatId);
  const review = localRead?.review ?? reviewRecords.find((item) => item.taskId === task.id);
  const reviewChecks = buildChecks.filter((check) => review?.qualityGateIds.includes(check.id) || check.taskId === task.id);
  const reviewEvents = localRead?.taskEvents ?? [];
  const runnerResult = buildRunnerResultFromEvents(reviewEvents);
  const codexStatus = await detectCodexCliStatus();
  const approvedProjectPath = localRead?.approvedProjectPath?.localPath ?? "";
  const codexPromptResult = buildCodexTaskPrompt({ project, task });
  const codexPrompt = codexPromptResult.prompt;
  const runnerSafetyStatus = getRunnerSafetyStatus({
    projectId: project.id,
    localPath: project.localPathPlaceholder,
  });
  const lastRunSummary = summarizeCodexLastRun({
    events: reviewEvents,
    runnerResult,
    taskId: task.id,
    projectId: project.id,
  });
  const workflowInsights = await readReviewWorkflowInsights({
    task,
    agent,
    review,
    events: reviewEvents,
    codexPromptGeneratedAt: codexPromptResult.generatedAt,
    lastRunSummary,
    runnerResult,
    fileChanges: localRead?.fileChanges ?? [],
    diffSummary: localRead?.diffSummary,
    scopeCheck: localRead?.scopeCheck,
    qualityGateRuns: localRead?.qualityGateRuns ?? [],
  });

  return (
    <AppShell>
      <div className="relative space-y-5">
        <div className="pointer-events-none absolute inset-x-0 -top-7 h-48 bg-[radial-gradient(circle_at_22%_0%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_72%_10%,rgba(16,185,129,0.12),transparent_32%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 text-sm">
            <Link href="/" className="inline-flex items-center gap-2 border border-white/8 bg-white/[0.04] px-3 py-2 font-semibold text-slate-300 transition hover:border-white/16 hover:bg-white/[0.07] hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              Office Home
            </Link>
            <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2 border border-sky-200/16 bg-sky-200/8 px-3 py-2 font-semibold text-sky-100 transition hover:bg-sky-200/12">
              <Building2 className="h-3.5 w-3.5" />
              Project Room
            </Link>
          </div>
        </div>
        <WorkflowInsightPanels
          lifecycleSummary={workflowInsights.lifecycleSummary}
          promptSummary={workflowInsights.promptSummary}
          runHistory={workflowInsights.runHistory}
          timeline={workflowInsights.timeline}
          agentVisualState={workflowInsights.agentVisualState}
        />
        <ReviewPanel
          task={task}
          project={project}
          agent={agent}
          review={review}
          checks={reviewChecks}
          events={reviewEvents}
          codexPrompt={codexPrompt}
          runnerSafetyStatus={runnerSafetyStatus}
          codexStatus={codexStatus}
          approvedProjectPath={approvedProjectPath}
          approvedProjectPathSource={approvedProjectPath ? "approved_path" : "missing"}
          initialRunnerResult={runnerResult}
          gitSnapshots={localRead?.gitSnapshots ?? {}}
          fileChanges={localRead?.fileChanges ?? []}
          diffSummary={localRead?.diffSummary}
          scopeCheck={localRead?.scopeCheck}
          qualityGateConfigs={localRead?.qualityGateConfigs ?? []}
          qualityGateRuns={localRead?.qualityGateRuns ?? []}
          persistDecisionAction={persistReviewDecisionAction}
          recordCodexPromptHandoffAction={recordCodexPromptHandoffAction}
          runScopedCodexTaskAction={runScopedCodexTaskAction}
          runEnabledQualityGatesAction={runEnabledQualityGatesAction}
        />
      </div>
    </AppShell>
  );
}

type OptionalPhase11SelectedReads = {
  getAgentWorkflowSummaryForTask?: (taskId: string) => Promise<unknown> | unknown;
  getTaskLifecycleSummary?: (taskId: string) => Promise<unknown> | unknown;
  getWorkflowTimelineForTask?: (taskId: string) => Promise<unknown> | unknown;
};

type ReviewWorkflowInsights = {
  lifecycleSummary: TaskLifecycleSummary;
  promptSummary: PromptVersionSummary;
  runHistory: CodexRunHistoryItem[];
  timeline: WorkflowTimelineItem[];
  agentVisualState: AgentVisualStateSummary;
};

const phase11SelectedReads = selectedReads as typeof selectedReads & OptionalPhase11SelectedReads;

const taskProgressByStatus: Record<Task["status"], number> = {
  backlog: 8,
  ready: 22,
  running: 58,
  waiting_review: 82,
  blocked: 43,
  done: 100,
};

async function readReviewWorkflowInsights({
  task,
  agent,
  events,
  codexPromptGeneratedAt,
  lastRunSummary,
  runnerResult,
  fileChanges,
  diffSummary,
  scopeCheck,
  qualityGateRuns,
}: {
  task: Task;
  agent?: AgentSeat;
  review?: ReviewRecord;
  events: TaskEvent[];
  codexPromptGeneratedAt: string;
  lastRunSummary: ReturnType<typeof summarizeCodexLastRun>;
  runnerResult?: ScopedCodexRunnerOutput;
  fileChanges: FileChange[];
  diffSummary?: DiffSummary;
  scopeCheck?: ScopeCheck;
  qualityGateRuns: QualityGateRun[];
}): Promise<ReviewWorkflowInsights> {
  const fallbackLifecycle = buildTaskLifecycleSummary({
    task,
    lastRunSummary,
    fileChanges,
    diffSummary,
    scopeCheck,
    qualityGateRuns,
  });
  const [lifecycleValue, timelineValue, agentWorkflowValue] = await Promise.all([
    readOptionalPhase11Value(() => phase11SelectedReads.getTaskLifecycleSummary?.(task.id)),
    readOptionalPhase11Value(() => phase11SelectedReads.getWorkflowTimelineForTask?.(task.id)),
    readOptionalPhase11Value(() => phase11SelectedReads.getAgentWorkflowSummaryForTask?.(task.id)),
  ]);

  return {
    lifecycleSummary: normalizeTaskLifecycleSummary(lifecycleValue, fallbackLifecycle),
    promptSummary: buildPromptVersionSummary(task, events, codexPromptGeneratedAt),
    runHistory: buildRunHistory({ events, lastRunSummary, runnerResult }),
    timeline: normalizeWorkflowTimeline(timelineValue, events),
    agentVisualState: normalizeAgentVisualState(agentWorkflowValue, buildAgentVisualState(task, agent)),
  };
}

async function readOptionalPhase11Value(read: () => Promise<unknown> | unknown): Promise<unknown> {
  try {
    return await read();
  } catch (error) {
    console.error("Review Room Phase 11 selected helper read failed", error);
    return undefined;
  }
}

function buildTaskLifecycleSummary({
  task,
  lastRunSummary,
  fileChanges,
  diffSummary,
  scopeCheck,
  qualityGateRuns,
}: {
  task: Task;
  lastRunSummary: ReturnType<typeof summarizeCodexLastRun>;
  fileChanges: FileChange[];
  diffSummary?: DiffSummary;
  scopeCheck?: ScopeCheck;
  qualityGateRuns: QualityGateRun[];
}): TaskLifecycleSummary {
  const failedQualityRun = qualityGateRuns.find((run) => run.status === "failed" || run.status === "blocked");
  const failureCategory = lastRunSummary.failureCategory ?? (scopeCheck?.status === "blocked" ? "scope_guard_blocked" : failedQualityRun ? "quality_gate_failed" : undefined);

  return {
    taskId: task.id,
    taskTitle: task.title,
    status: task.status,
    lifecycleStage: getTaskLifecycleStage(task.status),
    progressPercent: taskProgressByStatus[task.status],
    promptReadiness: getTaskPromptReadiness(task),
    evidenceReadiness: getEvidenceReadiness({ fileChanges, diffSummary, scopeCheck, qualityGateRuns }),
    failureCategory,
    recommendedAction: getReviewRecommendedAction(task, failureCategory),
    recommendedActionDetail: getReviewRecommendedActionDetail(task, lastRunSummary, failureCategory),
  };
}

function buildPromptVersionSummary(task: Task, events: TaskEvent[], generatedAt: string): PromptVersionSummary {
  const handoffEvent = events.find((event) => typeof event.payload?.mode === "string" && event.payload?.promptHandoffOnly === true);
  const mode = typeof handoffEvent?.payload?.mode === "string" ? handoffEvent.payload.mode : "prompt_handoff_only";
  const promptSummary = summarizePromptVersions({
    taskId: task.id,
    projectId: task.projectId,
    taskEvents: events,
  });

  return {
    versionLabel: promptSummary.latestVersion ?? `${task.id}:generated`,
    mode,
    readiness: promptSummary.promptState === "not_generated" ? getTaskPromptReadiness(task) : promptSummary.promptState,
    generatedAt,
    handoffState: handoffEvent?.message ?? promptSummary.latestPromptLabel ?? "not recorded",
    acceptanceCriteriaCount: task.acceptanceCriteria.length,
    forbiddenScopeCount: task.forbiddenScope.length,
    versionCount: promptSummary.promptVersionCount,
    latestPromptReadyAt: promptSummary.latestPromptReadyAt,
    latestRunnerRequestedAt: promptSummary.latestRunnerRequestedAt,
  };
}

function buildRunHistory({
  events,
  lastRunSummary,
  runnerResult,
}: {
  events: TaskEvent[];
  lastRunSummary: ReturnType<typeof summarizeCodexLastRun>;
  runnerResult?: ScopedCodexRunnerOutput;
}): CodexRunHistoryItem[] {
  const runSummary = summarizeCodexRunHistory({
    taskId: events.find((event) => event.taskId)?.taskId,
    projectId: events.find((event) => event.projectId)?.projectId,
    taskEvents: events,
  });
  const runnerEvents = runSummary.items
    .map((event) => {
      return {
        id: event.eventId,
        status: event.status ?? event.lifecycleEvent,
        time: event.endedAt ?? event.startedAt ?? "--:--",
        duration: event.durationMs === undefined ? undefined : `${event.durationMs} ms`,
        exitCode: event.exitCode?.toString(),
        failureCategory: event.failureClass,
        preview: event.outputSummary ?? event.message,
      };
    });

  if (runnerEvents.length) {
    return runnerEvents;
  }

  if (lastRunSummary.status !== "never_run" || runnerResult) {
    return [{
      id: lastRunSummary.eventId ?? "last-run-summary",
      status: lastRunSummary.status,
      time: lastRunSummary.endedAt ?? lastRunSummary.startedAt ?? "--:--",
      duration: typeof lastRunSummary.durationMs === "number" ? `${lastRunSummary.durationMs} ms` : undefined,
      exitCode: typeof lastRunSummary.exitCode === "number" ? String(lastRunSummary.exitCode) : undefined,
      failureCategory: lastRunSummary.failureCategory,
      preview: lastRunSummary.preview || lastRunSummary.reason,
    }];
  }

  return [];
}

function buildAgentVisualState(task: Task, agent?: AgentSeat): AgentVisualStateSummary {
  return {
    agentName: agent?.name ?? "Unassigned Codex seat",
    status: agent?.status ?? "unassigned",
    taskTitle: task.title,
    visualState: agent ? getAgentVisualState(agent.status, task.status) : "No seat attached",
    focus: agent?.focus ?? "Assign a Codex seat before runner work becomes visible.",
    progressPercent: taskProgressByStatus[task.status],
  };
}

function normalizeTaskLifecycleSummary(value: unknown, fallback: TaskLifecycleSummary): TaskLifecycleSummary {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;
  return {
    ...fallback,
    lifecycleStage: readString(record.lifecycleStage) ?? readString(record.stage) ?? readString(record.summaryMessage) ?? readString(record.phase) ?? fallback.lifecycleStage,
    progressPercent: readNumber(record.progressPercent) ?? fallback.progressPercent,
    promptReadiness: readString(record.promptReadiness) ?? readString(record.codexLastRunStatus) ?? fallback.promptReadiness,
    evidenceReadiness: readString(record.evidenceReadiness) ?? readLifecycleEvidenceReadiness(record) ?? fallback.evidenceReadiness,
    failureCategory: readString(record.failureCategory) ?? fallback.failureCategory,
    recommendedAction: readString(record.recommendedAction) ?? readString(record.recommendedNextAction) ?? fallback.recommendedAction,
    recommendedActionDetail: readString(record.recommendedActionDetail) ?? readString(record.summaryMessage) ?? fallback.recommendedActionDetail,
  };
}

function normalizeWorkflowTimeline(value: unknown, fallbackEvents: TaskEvent[]): WorkflowTimelineItem[] {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as Record<string, unknown>).items)
      ? (value as { items: unknown[] }).items
      : undefined;

  if (items) {
    const normalized = items.flatMap((item, index) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const record = item as Record<string, unknown>;
      return [{
        id: readString(record.id) ?? `phase11-timeline-${index}`,
        time: readString(record.time) ?? readString(record.createdAt) ?? "--:--",
        title: readString(record.title) ?? readString(record.message) ?? readString(record.label) ?? "Workflow event",
        detail: readString(record.detail) ?? readString(record.lifecycleEvent) ?? "Local workflow record",
        tone: normalizeTimelineTone(readString(record.tone)),
      }];
    });

    if (normalized.length) {
      return normalized;
    }
  }

  return fallbackEvents.map((event) => ({
    id: event.id,
    time: event.time,
    title: event.message,
    detail: typeof event.payload?.lifecycleEvent === "string" ? event.payload.lifecycleEvent : "Local review event",
    tone: event.tone,
  }));
}

function normalizeAgentVisualState(value: unknown, fallback: AgentVisualStateSummary): AgentVisualStateSummary {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;
  const firstSeat = Array.isArray(record.seats) && record.seats[0] && typeof record.seats[0] === "object"
    ? record.seats[0] as Record<string, unknown>
    : undefined;

  return {
    ...fallback,
    agentName: readString(record.agentName) ?? readString(record.name) ?? readString(firstSeat?.name) ?? fallback.agentName,
    visualState: readString(record.visualState) ?? readString(firstSeat?.activity) ?? fallback.visualState,
    focus: readString(record.focus) ?? readString(firstSeat?.focus) ?? readString(record.summaryMessage) ?? fallback.focus,
    progressPercent: readNumber(record.progressPercent) ?? fallback.progressPercent,
  };
}

function getTaskLifecycleStage(status: Task["status"]): string {
  const stageByStatus: Record<Task["status"], string> = {
    backlog: "Queued before prompt handoff",
    ready: "Prompt can be handed off",
    running: "Scoped Codex runner is in progress or expected",
    waiting_review: "Review evidence is ready for human decision",
    blocked: "Workflow requires intervention before approval",
    done: "Final decision accepted",
  };

  return stageByStatus[status];
}

function getTaskPromptReadiness(task: Task): string {
  if (task.status === "ready") {
    return "ready for prompt handoff";
  }

  if (task.status === "running") {
    return "prompt is active";
  }

  if (task.status === "waiting_review" || task.status === "done") {
    return "prompt output is ready for review";
  }

  if (task.status === "blocked") {
    return "prompt workflow is blocked";
  }

  return "not ready for handoff";
}

function getEvidenceReadiness({
  fileChanges,
  diffSummary,
  scopeCheck,
  qualityGateRuns,
}: {
  fileChanges: FileChange[];
  diffSummary?: DiffSummary;
  scopeCheck?: ScopeCheck;
  qualityGateRuns: QualityGateRun[];
}): string {
  const evidence = [
    fileChanges.length ? "changed files" : undefined,
    diffSummary ? "diff summary" : undefined,
    scopeCheck ? "scope guard" : undefined,
    qualityGateRuns.length ? "quality gates" : undefined,
  ].filter(Boolean);

  return evidence.length ? evidence.join(", ") : "no review evidence recorded";
}

function getReviewRecommendedAction(task: Task, failureCategory?: string): string {
  if (failureCategory) {
    return "inspect failure before final decision";
  }

  if (task.status === "waiting_review") {
    return "make final decision";
  }

  if (task.status === "running") {
    return "wait for run history";
  }

  if (task.status === "ready") {
    return "review prompt handoff";
  }

  return "continue review evidence check";
}

function getReviewRecommendedActionDetail(task: Task, lastRunSummary: ReturnType<typeof summarizeCodexLastRun>, failureCategory?: string): string {
  if (failureCategory) {
    return lastRunSummary.reason;
  }

  if (task.status === "waiting_review") {
    return "Prompt, Scoped Runner, Git evidence, Scope Guard, Quality Gates, Review Readiness, and Final Decision remain visible below.";
  }

  return `Current lifecycle stage: ${getTaskLifecycleStage(task.status)}.`;
}

function getAgentVisualState(agentStatus: AgentSeat["status"], taskStatus: Task["status"]): string {
  if (agentStatus === "build_failed" || agentStatus === "blocked" || taskStatus === "blocked") {
    return "intervention beacon";
  }

  if (agentStatus === "waiting_review" || taskStatus === "waiting_review") {
    return "review handoff";
  }

  if (agentStatus === "editing" || taskStatus === "running") {
    return "active work pod";
  }

  return "passive desk";
}

function normalizeTimelineTone(value: string | undefined): WorkflowTimelineItem["tone"] {
  if (value === "success" || value === "warning" || value === "danger" || value === "info") {
    return value;
  }

  return "info";
}

function readLifecycleEvidenceReadiness(record: Record<string, unknown>): string | undefined {
  const changedFiles = readNumber(record.changedFileCount);
  const buildChecks = readNumber(record.buildCheckCount);
  const failedBuildChecks = readNumber(record.failedBuildCheckCount);
  const failedQualityGates = readNumber(record.failedQualityGateCount);
  const scopeStatus = readString(record.scopeStatus);

  const parts = [
    changedFiles ? `${changedFiles} changed files` : undefined,
    buildChecks ? `${buildChecks} build checks` : undefined,
    failedBuildChecks ? `${failedBuildChecks} failed build checks` : undefined,
    failedQualityGates ? `${failedQualityGates} failed quality gates` : undefined,
    scopeStatus ? `scope ${scopeStatus}` : undefined,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
