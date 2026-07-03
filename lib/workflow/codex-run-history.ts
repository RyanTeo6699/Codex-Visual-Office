import { summarizeCodexLastRun } from "@/lib/codex-cli/runtime-status";
import type { CodexLastRunSummary } from "@/lib/codex-cli/runtime-status";
import type { TaskEvent } from "@/lib/types";

export interface CodexRunHistoryItem {
  eventId: string;
  runId: string;
  taskId?: string;
  projectId?: string;
  seatId?: string;
  promptVersionId?: string;
  lifecycleEvent: string;
  status?: string;
  exitCode?: number;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  failureClass?: string;
  outputSummary?: string;
  reviewRecordId?: string;
  message: string;
}

export interface CodexRunHistorySummary {
  taskId?: string;
  projectId?: string;
  source: "task_events";
  runEventCount: number;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  blockedRuns: number;
  timedOutRuns: number;
  latestRunStatus: CodexLastRunSummary["status"];
  latestRunAt?: string;
  latestDurationMs?: number;
  latestExitCode?: number;
  latestFailureCategory?: string;
  latestFailureMessageShort?: string;
  outputPreviewAvailable: boolean;
  lastRun: CodexLastRunSummary;
  items: CodexRunHistoryItem[];
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function isRunnerEvent(event: TaskEvent): boolean {
  return Boolean(readString(event.payload?.lifecycleEvent)?.startsWith("runner_"));
}

function eventSortTime(event: TaskEvent): string {
  return readString(event.payload?.endedAt)
    ?? readString(event.payload?.startedAt)
    ?? readString(event.payload?.createdAt)
    ?? event.time;
}

export function summarizeCodexRunHistory(input: { taskId?: string; projectId?: string; taskEvents: TaskEvent[] }): CodexRunHistorySummary {
  const events = input.taskEvents
    .filter((event) => !input.taskId || event.taskId === input.taskId)
    .filter((event) => !input.projectId || event.projectId === input.projectId)
    .filter(isRunnerEvent)
    .sort((a, b) => eventSortTime(b).localeCompare(eventSortTime(a)));
  const items = events.map((event) => ({
    eventId: event.id,
    runId: readString(event.payload?.runId) ?? event.id,
    taskId: event.taskId,
    projectId: event.projectId,
    seatId: event.agentSeatId,
    promptVersionId: readString(event.payload?.promptVersion) ?? readString(event.payload?.promptId),
    lifecycleEvent: readString(event.payload?.lifecycleEvent) ?? "runner_unknown",
    status: readString(event.payload?.status),
    exitCode: readNumber(event.payload?.exitCode),
    startedAt: readString(event.payload?.startedAt),
    endedAt: readString(event.payload?.endedAt),
    durationMs: readNumber(event.payload?.durationMs),
    failureClass: readString(event.payload?.failureCategory),
    outputSummary: readString(event.payload?.outputPreview) ?? readString(event.payload?.stdoutPreview) ?? readString(event.payload?.stderrPreview),
    reviewRecordId: readString(event.payload?.reviewRecordId),
    message: event.message,
  }));
  const lastRun = summarizeCodexLastRun({
    events: input.taskEvents,
    taskId: input.taskId,
    projectId: input.projectId,
  });

  return {
    taskId: input.taskId,
    projectId: input.projectId,
    source: "task_events",
    runEventCount: events.length,
    totalRuns: events.filter((event) => {
      const lifecycleEvent = readString(event.payload?.lifecycleEvent);
      return lifecycleEvent === "runner_requested" || lifecycleEvent === "runner_completed" || lifecycleEvent === "runner_failed" || lifecycleEvent === "runner_blocked" || lifecycleEvent === "runner_timed_out";
    }).length,
    successfulRuns: events.filter((event) => readString(event.payload?.lifecycleEvent) === "runner_completed").length,
    failedRuns: events.filter((event) => readString(event.payload?.lifecycleEvent) === "runner_failed").length,
    blockedRuns: events.filter((event) => readString(event.payload?.lifecycleEvent) === "runner_blocked").length,
    timedOutRuns: events.filter((event) => readString(event.payload?.lifecycleEvent) === "runner_timed_out").length,
    latestRunStatus: lastRun.status,
    latestRunAt: lastRun.endedAt ?? lastRun.startedAt,
    latestDurationMs: lastRun.durationMs,
    latestExitCode: lastRun.exitCode,
    latestFailureCategory: lastRun.failureCategory,
    latestFailureMessageShort: lastRun.reason,
    outputPreviewAvailable: items.some((item) => Boolean(item.outputSummary)),
    lastRun,
    items: items.slice(0, 10),
  };
}
