import type { AgentStatus, TaskStatus } from "@/lib/types";
import { getAgentSeatById, type AgentSeatRow, updateAgentSeat } from "../repositories/agent-seats";
import {
  getTaskById,
  listTasks,
  listTasksByProject,
  type NewTaskRow,
  type TaskRow,
  updateTask,
  upsertTask,
} from "../repositories/tasks";
import type { taskPriorities } from "../schema";
import { nowIso } from "./time";

export type TaskPriority = (typeof taskPriorities)[number];

export interface CreateTaskInput {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedSeatId?: string | null;
  acceptanceCriteria?: string[];
  forbiddenScope?: string[];
  changedFiles?: string[];
}

export async function createTask(input: CreateTaskInput): Promise<TaskRow> {
  const timestamp = nowIso();
  const task: NewTaskRow = {
    id: input.id,
    projectId: input.projectId,
    title: input.title,
    summary: input.summary ?? "",
    status: input.status,
    priority: input.priority,
    assignedSeatId: input.assignedSeatId ?? null,
    acceptanceCriteriaJson: JSON.stringify(input.acceptanceCriteria ?? []),
    forbiddenScopeJson: JSON.stringify(input.forbiddenScope ?? []),
    changedFilesJson: JSON.stringify(input.changedFiles ?? []),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await upsertTask(task);

  const created = await getTaskById(input.id);
  if (!created) {
    throw new Error(`Task was not created: ${input.id}`);
  }

  return created;
}

export async function updateTaskDetails(id: string, changes: Partial<Omit<CreateTaskInput, "id">>): Promise<TaskRow> {
  await updateTask(id, {
    projectId: changes.projectId,
    title: changes.title,
    summary: changes.summary,
    status: changes.status,
    priority: changes.priority,
    assignedSeatId: changes.assignedSeatId,
    acceptanceCriteriaJson: changes.acceptanceCriteria ? JSON.stringify(changes.acceptanceCriteria) : undefined,
    forbiddenScopeJson: changes.forbiddenScope ? JSON.stringify(changes.forbiddenScope) : undefined,
    changedFilesJson: changes.changedFiles ? JSON.stringify(changes.changedFiles) : undefined,
    updatedAt: nowIso(),
  });

  const updated = await getTaskById(id);
  if (!updated) {
    throw new Error(`Task was not found after update: ${id}`);
  }

  return updated;
}

export async function assignTaskToAgentSeat(taskId: string, agentSeatId: string): Promise<{ task: TaskRow; agentSeat: AgentSeatRow }> {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const agentSeat = await getAgentSeatById(agentSeatId);
  if (!agentSeat) {
    throw new Error(`Agent seat not found: ${agentSeatId}`);
  }

  const timestamp = nowIso();
  await updateTask(taskId, {
    assignedSeatId: agentSeatId,
    updatedAt: timestamp,
  });
  await updateAgentSeat(agentSeatId, {
    currentTaskId: taskId,
    currentProjectId: task.projectId,
    updatedAt: timestamp,
  });

  const updatedTask = await getTaskById(taskId);
  const updatedAgentSeat = await getAgentSeatById(agentSeatId);

  if (!updatedTask || !updatedAgentSeat) {
    throw new Error("Assignment update failed");
  }

  return { task: updatedTask, agentSeat: updatedAgentSeat };
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<TaskRow> {
  await updateTask(taskId, {
    status,
    updatedAt: nowIso(),
  });

  const updated = await getTaskById(taskId);
  if (!updated) {
    throw new Error(`Task was not found after status update: ${taskId}`);
  }

  return updated;
}

export async function updateAgentSeatWorkState(
  agentSeatId: string,
  input: { status: AgentStatus; currentTaskId?: string | null; currentProjectId?: string | null; focus?: string },
): Promise<AgentSeatRow> {
  await updateAgentSeat(agentSeatId, {
    status: input.status,
    currentTaskId: input.currentTaskId,
    currentProjectId: input.currentProjectId,
    focus: input.focus,
    updatedAt: nowIso(),
  });

  const updated = await getAgentSeatById(agentSeatId);
  if (!updated) {
    throw new Error(`Agent seat was not found after update: ${agentSeatId}`);
  }

  return updated;
}

export { getTaskById, listTasks, listTasksByProject };
