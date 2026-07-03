import type { AgentSeat, BuildCheck, ReviewRecord, Task, TaskEvent } from "@/lib/types";
import { summarizeAgentSeatState } from "./agent-seat-state";
import type { AgentWorkflowSummary } from "./agent-workflow-types";

export interface SummarizeAgentWorkflowForProjectInput {
  projectId: string;
  tasks: Task[];
  agentSeats: AgentSeat[];
  taskEvents: TaskEvent[];
  buildChecks: BuildCheck[];
  reviewRecords?: ReviewRecord[];
}

export interface SummarizeAgentWorkflowForTaskInput {
  task: Task;
  agentSeats: AgentSeat[];
  taskEvents: TaskEvent[];
  buildChecks: BuildCheck[];
  reviewRecords?: ReviewRecord[];
}

function summaryMessage(input: Pick<AgentWorkflowSummary, "activeSeatCount" | "blockedSeatCount" | "waitingReviewSeatCount" | "runningTaskCount" | "reviewTaskCount" | "failedBuildCheckCount">): string {
  if (input.blockedSeatCount > 0 || input.failedBuildCheckCount > 0) {
    return `${input.blockedSeatCount} seat${input.blockedSeatCount === 1 ? "" : "s"} blocked and ${input.failedBuildCheckCount} failed check${input.failedBuildCheckCount === 1 ? "" : "s"} need attention.`;
  }

  if (input.waitingReviewSeatCount > 0 || input.reviewTaskCount > 0) {
    return `${input.reviewTaskCount} task${input.reviewTaskCount === 1 ? "" : "s"} waiting for review.`;
  }

  if (input.activeSeatCount > 0 || input.runningTaskCount > 0) {
    return `${input.runningTaskCount} task${input.runningTaskCount === 1 ? "" : "s"} currently running.`;
  }

  return "No active agent workflow pressure is recorded.";
}

function buildSummary(input: {
  projectId?: string;
  taskId?: string;
  tasks: Task[];
  agentSeats: AgentSeat[];
  taskEvents: TaskEvent[];
  buildChecks: BuildCheck[];
  reviewRecords?: ReviewRecord[];
}): AgentWorkflowSummary {
  const seats = input.agentSeats.map((agentSeat) => summarizeAgentSeatState({
    agentSeat,
    tasks: input.tasks,
    taskEvents: input.taskEvents,
    buildChecks: input.buildChecks,
    reviewRecords: input.reviewRecords,
  }));
  const activeSeatCount = seats.filter((seat) => seat.activity === "active" || seat.activity === "checking").length;
  const blockedSeatCount = seats.filter((seat) => seat.activity === "blocked").length;
  const waitingReviewSeatCount = seats.filter((seat) => seat.activity === "reviewing").length;
  const runningTaskCount = input.tasks.filter((task) => task.status === "running").length;
  const reviewTaskCount = input.tasks.filter((task) => task.status === "waiting_review").length;
  const failedBuildCheckCount = input.buildChecks.filter((check) => check.status === "failed").length;

  const summary = {
    projectId: input.projectId,
    taskId: input.taskId,
    source: "local_sqlite_records",
    seats,
    activeSeatCount,
    blockedSeatCount,
    waitingReviewSeatCount,
    runningTaskCount,
    reviewTaskCount,
    failedBuildCheckCount,
    recentEventCount: input.taskEvents.length,
    summaryMessage: "Pending summary",
  } satisfies AgentWorkflowSummary;

  return {
    ...summary,
    summaryMessage: summaryMessage(summary),
  };
}

export function summarizeAgentWorkflowForProject(input: SummarizeAgentWorkflowForProjectInput): AgentWorkflowSummary {
  const projectTasks = input.tasks.filter((task) => task.projectId === input.projectId);
  const projectTaskIds = new Set(projectTasks.map((task) => task.id));
  const agentSeats = input.agentSeats.filter((agentSeat) => {
    return agentSeat.projectId === input.projectId || Boolean(agentSeat.taskId && projectTaskIds.has(agentSeat.taskId));
  });

  return buildSummary({
    projectId: input.projectId,
    tasks: projectTasks,
    agentSeats,
    taskEvents: input.taskEvents.filter((event) => event.projectId === input.projectId),
    buildChecks: input.buildChecks.filter((check) => check.projectId === input.projectId),
    reviewRecords: input.reviewRecords?.filter((review) => projectTaskIds.has(review.taskId)),
  });
}

export function summarizeAgentWorkflowForTask(input: SummarizeAgentWorkflowForTaskInput): AgentWorkflowSummary {
  const taskAgentSeats = input.agentSeats.filter((agentSeat) => {
    return agentSeat.id === input.task.agentSeatId || agentSeat.taskId === input.task.id;
  });

  return buildSummary({
    projectId: input.task.projectId,
    taskId: input.task.id,
    tasks: [input.task],
    agentSeats: taskAgentSeats,
    taskEvents: input.taskEvents.filter((event) => event.taskId === input.task.id),
    buildChecks: input.buildChecks.filter((check) => check.taskId === input.task.id),
    reviewRecords: input.reviewRecords?.filter((review) => review.taskId === input.task.id),
  });
}
