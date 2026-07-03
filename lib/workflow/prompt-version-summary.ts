import type { TaskEvent } from "@/lib/types";

export interface PromptVersionSummaryItem {
  eventId: string;
  taskId?: string;
  projectId: string;
  promptVersion: string;
  promptLabel?: string;
  createdAt: string;
  lifecycleEvent?: string;
  promptPreviewBounded?: string;
}

export type PromptState =
  | "not_generated"
  | "generated"
  | "copied"
  | "ready"
  | "dry_run"
  | "runner_requested"
  | "unknown";

export interface PromptVersionSummary {
  taskId?: string;
  projectId?: string;
  source: "task_event_payloads";
  versionCount: number;
  promptVersionCount: number;
  latestVersion?: string;
  latestPromptLabel?: string;
  latestPromptReadyAt?: string;
  latestPromptCopiedAt?: string;
  latestDryRunAt?: string;
  latestRunnerRequestedAt?: string;
  promptState: PromptState;
  latestPromptPreviewBounded?: string;
  items: PromptVersionSummaryItem[];
  sourceEvents: string[];
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function eventTime(event: TaskEvent): string {
  return readString(event.payload?.createdAt) ?? readString(event.payload?.startedAt) ?? event.time;
}

function stateRank(state: PromptState): number {
  return {
    not_generated: 0,
    unknown: 1,
    generated: 2,
    copied: 3,
    ready: 4,
    dry_run: 5,
    runner_requested: 6,
  }[state];
}

function stateFromLifecycle(lifecycleEvent?: string): PromptState {
  if (!lifecycleEvent) {
    return "generated";
  }

  if (lifecycleEvent === "runner_requested") {
    return "runner_requested";
  }

  if (lifecycleEvent.includes("dry_run")) {
    return "dry_run";
  }

  if (lifecycleEvent.includes("copied")) {
    return "copied";
  }

  if (lifecycleEvent.includes("ready") || lifecycleEvent === "prompt_prepared") {
    return "ready";
  }

  if (lifecycleEvent.includes("prompt")) {
    return "generated";
  }

  return "unknown";
}

function latestTimeFor(events: TaskEvent[], predicate: (event: TaskEvent) => boolean): string | undefined {
  return events
    .filter(predicate)
    .map(eventTime)
    .sort((a, b) => b.localeCompare(a))[0];
}

export function summarizePromptVersions(input: { taskId?: string; projectId?: string; taskEvents: TaskEvent[] }): PromptVersionSummary {
  const sourceEvents = input.taskEvents
    .filter((event) => !input.taskId || event.taskId === input.taskId)
    .filter((event) => !input.projectId || event.projectId === input.projectId);
  const items: PromptVersionSummaryItem[] = sourceEvents
    .flatMap((event): PromptVersionSummaryItem[] => {
      const promptVersion = readString(event.payload?.promptVersion) ?? readString(event.payload?.promptId);
      if (!promptVersion) {
        return [];
      }

      const item: PromptVersionSummaryItem = {
        eventId: event.id,
        projectId: event.projectId,
        promptVersion,
        createdAt: eventTime(event),
      };
      const promptLabel = readString(event.payload?.promptLabel);
      const lifecycleEvent = readString(event.payload?.lifecycleEvent);
      const promptPreviewBounded = readString(event.payload?.promptPreviewBounded) ?? readString(event.payload?.promptPreview);
      if (event.taskId) {
        item.taskId = event.taskId;
      }
      if (promptLabel) {
        item.promptLabel = promptLabel;
      }
      if (lifecycleEvent) {
        item.lifecycleEvent = lifecycleEvent;
      }
      if (promptPreviewBounded) {
        item.promptPreviewBounded = promptPreviewBounded.slice(0, 800);
      }

      return [item];
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const latest = items[0];
  const promptState = items.reduce<PromptState>((state, item) => {
    const next = stateFromLifecycle(item.lifecycleEvent);
    return stateRank(next) > stateRank(state) ? next : state;
  }, items.length ? "generated" : "not_generated");

  return {
    taskId: input.taskId,
    projectId: input.projectId,
    source: "task_event_payloads",
    versionCount: new Set(items.map((item) => item.promptVersion)).size,
    promptVersionCount: new Set(items.map((item) => item.promptVersion)).size,
    latestVersion: latest?.promptVersion,
    latestPromptLabel: latest?.promptLabel,
    latestPromptReadyAt: latestTimeFor(sourceEvents, (event) => stateFromLifecycle(readString(event.payload?.lifecycleEvent)) === "ready"),
    latestPromptCopiedAt: latestTimeFor(sourceEvents, (event) => stateFromLifecycle(readString(event.payload?.lifecycleEvent)) === "copied"),
    latestDryRunAt: latestTimeFor(sourceEvents, (event) => stateFromLifecycle(readString(event.payload?.lifecycleEvent)) === "dry_run"),
    latestRunnerRequestedAt: latestTimeFor(sourceEvents, (event) => readString(event.payload?.lifecycleEvent) === "runner_requested"),
    promptState,
    latestPromptPreviewBounded: latest?.promptPreviewBounded,
    items,
    sourceEvents: items.map((item) => item.eventId),
  };
}
