import { addTaskEvent } from "@/lib/local-db/operations/events";
import { getTaskById, updateTaskStatus } from "@/lib/local-db/operations/tasks";
import type { TaskEventRow } from "@/lib/local-db/repositories/task-events";
import type { CodexPromptHandoffMode } from "./prompt-types";

const handoffMessages: Record<CodexPromptHandoffMode, string> = {
  mark_ready: "Task marked ready for Codex",
  dry_run_dispatch: "Dry-run dispatch recorded",
};

export async function recordCodexPromptHandoff(taskId: string, mode: CodexPromptHandoffMode): Promise<TaskEventRow> {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error(`Task not found for Codex prompt handoff: ${taskId}`);
  }

  if (task.status !== "ready") {
    await updateTaskStatus(taskId, "ready");
  }

  return addTaskEvent({
    id: `codex-prompt-handoff-${taskId}-${mode}`,
    projectId: task.projectId,
    taskId,
    seatId: task.assignedSeatId,
    type: mode === "dry_run_dispatch" ? "success" : "info",
    message: handoffMessages[mode],
    payload: {
      phase: "phase-3-step-2",
      mode,
      promptHandoffOnly: true,
      cliTaskExecutionAttempted: false,
    },
  });
}
