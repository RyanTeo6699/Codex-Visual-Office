import { addTaskEvent } from "@/lib/local-db/operations/events";
import { getTaskById } from "@/lib/local-db/operations/tasks";
import type { TaskEventRow } from "@/lib/local-db/repositories/task-events";
import { createPhase3Step3ARunnerPolicy } from "./runner-policy";
import type { ApprovedProjectPath, RunnerSafetyStatus } from "./runner-types";

export function createUnconfiguredApprovedProjectPath(projectId: string, localPath: string): ApprovedProjectPath {
  return {
    projectId,
    localPath,
    approved: false,
    approvalSource: "not_configured",
    note: "Project path approval is reserved for a later step.",
  };
}

export function getRunnerSafetyStatus(input: { projectId: string; localPath: string }): RunnerSafetyStatus {
  const policy = createPhase3Step3ARunnerPolicy();
  const approvedProjectPath = createUnconfiguredApprovedProjectPath(input.projectId, input.localPath);

  return {
    canExecute: false,
    reason: "Phase 3 Step 3A safety harness only",
    missingRequirements: [
      "Approved project path is not configured.",
      "Explicit user confirmation is not collected in this step.",
      "Forbidden scope acknowledgement is not collected in this step.",
      "Prompt execution is disabled in this step.",
    ],
    policy,
    approvedProjectPath,
  };
}

export async function recordRunnerSafetyPreview(taskId: string): Promise<TaskEventRow> {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error(`Task not found for runner safety preview: ${taskId}`);
  }

  const safetyStatus = getRunnerSafetyStatus({
    projectId: task.projectId,
    localPath: "not_configured",
  });

  return addTaskEvent({
    id: `codex-runner-safety-preview-${taskId}`,
    projectId: task.projectId,
    taskId,
    seatId: task.assignedSeatId,
    type: "warning",
    message: "Codex runner safety preview checked",
    payload: {
      executionMode: safetyStatus.policy.executionMode,
      canExecute: safetyStatus.canExecute,
      cliTaskExecutionAttempted: false,
      arbitraryShellAllowed: safetyStatus.policy.allowArbitraryShell,
      promptExecutionAllowed: safetyStatus.policy.allowPromptExecution,
      autoPushAllowed: safetyStatus.policy.allowAutoPush,
      autoDeployAllowed: safetyStatus.policy.allowAutoDeploy,
    },
  });
}
