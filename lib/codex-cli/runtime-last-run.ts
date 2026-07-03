import type { CodexLastRunSummary, CodexRuntimeRunnerLike, CodexRuntimeTaskEventLike } from "./runtime-status-types";
import { classifyCodexRuntimeFailure, createBoundedRuntimePreview } from "./runtime-failure-classification";

const runnerLifecycleEvents = new Set([
  "runner_requested",
  "runner_started",
  "runner_output_received",
  "runner_completed",
  "runner_failed",
  "runner_blocked",
  "runner_timed_out",
]);

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function eventSortValue(event: CodexRuntimeTaskEventLike): number {
  const timestamp = event.createdAt ?? readString(event.payload?.endedAt) ?? readString(event.payload?.startedAt) ?? event.time;
  const parsed = timestamp ? Date.parse(timestamp) : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isRunnerEvent(event: CodexRuntimeTaskEventLike): boolean {
  const lifecycleEvent = readString(event.payload?.lifecycleEvent);
  return lifecycleEvent ? runnerLifecycleEvents.has(lifecycleEvent) : false;
}

function statusFromRunnerStatus(status: string | undefined, exitCode?: number): CodexLastRunSummary["status"] {
  if (status === "blocked") {
    return "blocked";
  }

  if (status === "timed_out" || status === "timeout") {
    return "timed_out";
  }

  if (status === "failed") {
    return "failed";
  }

  if (status === "completed" || status === "succeeded" || exitCode === 0) {
    return "succeeded";
  }

  if (typeof exitCode === "number" && exitCode !== 0) {
    return "failed";
  }

  return "unknown";
}

function summarizeRunnerLike(input: {
  runner: CodexRuntimeRunnerLike;
  taskId?: string;
  projectId?: string;
  eventId?: string;
  lifecycleEvent?: string;
}): CodexLastRunSummary {
  const status = statusFromRunnerStatus(input.runner.status, input.runner.exitCode);
  const preview = createBoundedRuntimePreview(
    [input.runner.errorPreview, input.runner.stderrPreview, input.runner.outputPreview, input.runner.stdoutPreview].filter(Boolean).join("\n"),
  );
  const failure = status === "failed" || status === "blocked" || status === "timed_out"
    ? classifyCodexRuntimeFailure({
        status: input.runner.status,
        exitCode: input.runner.exitCode,
        errorPreview: input.runner.errorPreview,
        stderrPreview: input.runner.stderrPreview,
        outputPreview: input.runner.outputPreview,
        stdoutPreview: input.runner.stdoutPreview,
        timedOut: status === "timed_out",
      })
    : undefined;

  return {
    status,
    taskId: input.taskId,
    projectId: input.projectId,
    eventId: input.eventId,
    lifecycleEvent: input.lifecycleEvent,
    exitCode: input.runner.exitCode,
    startedAt: input.runner.startedAt,
    endedAt: input.runner.endedAt,
    durationMs: input.runner.durationMs,
    failureCategory: failure?.category,
    reason: failure?.reason ?? (status === "succeeded" ? "Last Codex run succeeded." : "Last Codex run status is unknown."),
    preview: preview.preview,
    previewTruncated: preview.truncated || Boolean(input.runner.stdoutTruncated || input.runner.stderrTruncated),
  };
}

function runnerFromEvent(event: CodexRuntimeTaskEventLike): CodexRuntimeRunnerLike {
  const payload = event.payload ?? {};

  return {
    status: readString(payload.status),
    exitCode: readNumber(payload.exitCode),
    stdoutPreview: readString(payload.stdoutPreview),
    stderrPreview: readString(payload.stderrPreview),
    outputPreview: readString(payload.outputPreview),
    errorPreview: readString(payload.errorPreview) ?? event.message,
    stdoutTruncated: payload.stdoutTruncated === true,
    stderrTruncated: payload.stderrTruncated === true,
    startedAt: readString(payload.startedAt),
    endedAt: readString(payload.endedAt),
    durationMs: readNumber(payload.durationMs),
  };
}

export interface SummarizeCodexLastRunInput {
  events?: CodexRuntimeTaskEventLike[];
  runnerResult?: CodexRuntimeRunnerLike;
  taskId?: string;
  projectId?: string;
}

export function summarizeCodexLastRun(input: SummarizeCodexLastRunInput): CodexLastRunSummary {
  if (input.runnerResult) {
    return summarizeRunnerLike({
      runner: input.runnerResult,
      taskId: input.taskId,
      projectId: input.projectId,
    });
  }

  const candidates = (input.events ?? [])
    .filter((event) => !input.taskId || event.taskId === input.taskId)
    .filter((event) => !input.projectId || event.projectId === input.projectId)
    .filter(isRunnerEvent)
    .sort((a, b) => eventSortValue(b) - eventSortValue(a));

  const latest = candidates.find((event) => {
    const lifecycleEvent = readString(event.payload?.lifecycleEvent);
    return lifecycleEvent === "runner_completed" || lifecycleEvent === "runner_failed" || lifecycleEvent === "runner_blocked" || lifecycleEvent === "runner_timed_out";
  }) ?? candidates[0];

  if (!latest) {
    return {
      status: "never_run",
      taskId: input.taskId,
      projectId: input.projectId,
      reason: "No local Codex runner event has been recorded.",
      preview: "",
      previewTruncated: false,
    };
  }

  const lifecycleEvent = readString(latest.payload?.lifecycleEvent);
  const runner = runnerFromEvent(latest);

  if (lifecycleEvent === "runner_failed" && !runner.status) {
    runner.status = "failed";
  }

  if (lifecycleEvent === "runner_blocked" && !runner.status) {
    runner.status = "blocked";
  }

  if (lifecycleEvent === "runner_timed_out" && !runner.status) {
    runner.status = "timed_out";
  }

  if (lifecycleEvent === "runner_completed" && !runner.status) {
    runner.status = "completed";
  }

  return summarizeRunnerLike({
    runner,
    taskId: latest.taskId ?? input.taskId,
    projectId: latest.projectId ?? input.projectId,
    eventId: latest.id,
    lifecycleEvent,
  });
}
