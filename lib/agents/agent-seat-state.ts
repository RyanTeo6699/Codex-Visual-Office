import type { AgentSeat, BuildCheck, ReviewRecord, Task, TaskEvent } from "@/lib/types";
import type { AgentSeatWorkflowState, AgentVisualState, AgentWorkflowActivity, AgentWorkflowRisk } from "./agent-workflow-types";
import { determineWorkflowNextAction } from "@/lib/workflow/workflow-next-action";

export interface SummarizeAgentSeatStateInput {
  agentSeat: AgentSeat;
  tasks: Task[];
  taskEvents: TaskEvent[];
  buildChecks: BuildCheck[];
  reviewRecords?: ReviewRecord[];
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

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function latestPromptVersion(events: TaskEvent[]): string | undefined {
  return [...events]
    .sort((a, b) => eventTime(b).localeCompare(eventTime(a)))
    .map((event) => readString(event.payload?.promptVersion) ?? readString(event.payload?.promptId))
    .find(Boolean);
}

function latestRunnerEventId(events: TaskEvent[]): string | undefined {
  return [...events]
    .sort((a, b) => eventTime(b).localeCompare(eventTime(a)))
    .find((event) => readString(event.payload?.lifecycleEvent)?.startsWith("runner_"))
    ?.id;
}

function activityFor(agentSeat: AgentSeat, task?: Task): AgentWorkflowActivity {
  if (agentSeat.status === "blocked" || agentSeat.status === "build_failed" || task?.status === "blocked") {
    return "blocked";
  }

  if (agentSeat.status === "waiting_review" || task?.status === "waiting_review") {
    return "reviewing";
  }

  if (agentSeat.status === "running_checks") {
    return "checking";
  }

  if (agentSeat.status === "done" || task?.status === "done") {
    return "done";
  }

  if (agentSeat.status === "idle") {
    return "idle";
  }

  return "active";
}

function riskFor(input: { activity: AgentWorkflowActivity; failedBuildCheckCount: number; pendingBuildCheckCount: number; reviewDecision?: ReviewRecord["decision"] }): AgentWorkflowRisk {
  if (input.activity === "blocked" || input.failedBuildCheckCount > 0 || input.reviewDecision === "rejected") {
    return "blocked";
  }

  if (input.activity === "reviewing" || input.pendingBuildCheckCount > 0 || input.reviewDecision === "revision_requested") {
    return "attention";
  }

  return "none";
}

function visualStateFor(input: {
  agentSeat: AgentSeat;
  task?: Task;
  reviewDecision?: ReviewRecord["decision"];
  failedBuildCheckCount: number;
}): AgentVisualState {
  if (!input.agentSeat.projectId) {
    return "missing_approved_path";
  }

  if (input.reviewDecision === "revision_requested") {
    return "revision_requested";
  }

  if (input.agentSeat.status === "build_failed" || input.failedBuildCheckCount > 0) {
    return "failed";
  }

  if (input.agentSeat.status === "blocked" || input.task?.status === "blocked") {
    return "blocked";
  }

  if (input.agentSeat.status === "waiting_review" || input.task?.status === "waiting_review") {
    return "reviewing";
  }

  if (input.agentSeat.status === "done" || input.task?.status === "done") {
    return "done";
  }

  if (input.agentSeat.status === "idle") {
    return input.task?.status === "ready" ? "ready" : "idle";
  }

  if (input.agentSeat.status === "reading_repo" || input.agentSeat.status === "planning" || input.agentSeat.status === "editing" || input.agentSeat.status === "running_checks" || input.agentSeat.status === "fixing") {
    return "running";
  }

  return "unknown";
}

export function summarizeAgentSeatState(input: SummarizeAgentSeatStateInput): AgentSeatWorkflowState {
  const currentTask = input.tasks.find((task) => task.id === input.agentSeat.taskId)
    ?? input.tasks.find((task) => task.agentSeatId === input.agentSeat.id);
  const taskEvents = input.taskEvents.filter((event) => {
    if (currentTask?.id && event.taskId === currentTask.id) {
      return true;
    }

    return event.agentSeatId === input.agentSeat.id;
  });
  const taskBuildChecks = currentTask
    ? input.buildChecks.filter((check) => check.taskId === currentTask.id)
    : input.buildChecks.filter((check) => check.projectId === input.agentSeat.projectId);
  const reviewDecision = currentTask
    ? input.reviewRecords?.find((review) => review.taskId === currentTask.id)?.decision
    : undefined;
  const failedBuildCheckCount = taskBuildChecks.filter((check) => check.status === "failed").length;
  const pendingBuildCheckCount = taskBuildChecks.filter((check) => check.status === "pending" || check.status === "running").length;
  const activity = activityFor(input.agentSeat, currentTask);
  const lastEvent = latestEvent(taskEvents);
  const visualState = visualStateFor({ agentSeat: input.agentSeat, task: currentTask, reviewDecision, failedBuildCheckCount });

  return {
    seatId: input.agentSeat.id,
    name: input.agentSeat.name,
    status: input.agentSeat.status,
    state: visualState,
    projectId: input.agentSeat.projectId || undefined,
    taskId: currentTask?.id ?? input.agentSeat.taskId,
    focus: input.agentSeat.focus,
    currentTaskTitle: currentTask?.title,
    currentTaskStatus: currentTask?.status,
    currentTaskPriority: currentTask?.priority,
    currentRunId: latestRunnerEventId(taskEvents),
    lastPromptVersionId: latestPromptVersion(taskEvents),
    lastActivityAt: lastEvent ? eventTime(lastEvent) : undefined,
    manualNextAction: currentTask
      ? determineWorkflowNextAction({
          task: currentTask,
          review: reviewDecision ? { taskId: currentTask.id, diffSummary: [], riskNotes: [], qualityGateIds: [], decision: reviewDecision } : undefined,
        })
      : "prepare_prompt",
    safetyBoundary: "Manual local workflow only. No automatic Codex, Git, quality gate, source-read, commit, push, or deploy action is triggered by this seat state.",
    activity,
    visualState,
    risk: riskFor({ activity, failedBuildCheckCount, pendingBuildCheckCount, reviewDecision }),
    reviewDecision,
    latestBuildStatus: latestBuildStatus(taskBuildChecks),
    failedBuildCheckCount,
    pendingBuildCheckCount,
    eventCount: taskEvents.length,
    lastEventMessage: lastEvent?.message,
  };
}
