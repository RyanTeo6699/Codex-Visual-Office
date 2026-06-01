import type { EventTone } from "@/lib/types";
import {
  listTaskEvents,
  listTaskEventsByProject,
  type NewTaskEventRow,
  type TaskEventRow,
  upsertTaskEvent,
} from "../repositories/task-events";
import { nowIso } from "./time";

export interface AddTaskEventInput {
  id: string;
  projectId: string;
  taskId?: string | null;
  seatId?: string | null;
  type: EventTone;
  message: string;
  payload?: Record<string, unknown>;
}

export async function addTaskEvent(input: AddTaskEventInput): Promise<TaskEventRow> {
  const event: NewTaskEventRow = {
    id: input.id,
    projectId: input.projectId,
    taskId: input.taskId ?? null,
    seatId: input.seatId ?? null,
    type: input.type,
    message: input.message,
    payloadJson: JSON.stringify(input.payload ?? {}),
    createdAt: nowIso(),
  };

  await upsertTaskEvent(event);

  const created = (await listTaskEvents()).find((item) => item.id === input.id);
  if (!created) {
    throw new Error(`Task event was not created: ${input.id}`);
  }

  return created;
}

export { listTaskEvents, listTaskEventsByProject };
