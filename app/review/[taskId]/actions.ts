"use server";

import { revalidatePath } from "next/cache";
import { initializeLocalDb } from "@/lib/local-db/init";
import { recordCodexPromptHandoff } from "@/lib/codex-cli/handoff";
import { buildCodexTaskPrompt } from "@/lib/codex-cli/prompt-builder";
import type { CodexPromptHandoffMode, CodexPromptHandoffResult } from "@/lib/codex-cli/prompt-types";
import { runScopedCodexTask } from "@/lib/codex-cli/scoped-runner";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";
import { persistReviewDecisionForTask } from "@/lib/local-db/operations/reviews";
import { readSelectedReviewRoom } from "@/lib/local-db/selected-reads";
import { runEnabledQualityGates } from "@/lib/quality-gates/quality-gate-runner";
import { projects, tasks } from "@/lib/mock-data";
import type { QualityGateRun, ReviewDecision, TaskStatus } from "@/lib/types";

export interface PersistReviewDecisionActionResult {
  ok: boolean;
  decision: ReviewDecision;
  taskStatus?: TaskStatus;
  eventId?: string;
  error?: string;
}

export async function persistReviewDecisionAction(
  taskId: string,
  decision: ReviewDecision,
): Promise<PersistReviewDecisionActionResult> {
  try {
    initializeLocalDb();
    const result = await persistReviewDecisionForTask(taskId, decision);
    revalidatePath(`/review/${taskId}`);

    return {
      ok: true,
      decision: result.review.decision,
      taskStatus: result.taskStatus,
      eventId: result.eventId,
    };
  } catch (error) {
    return {
      ok: false,
      decision,
      error: error instanceof Error ? error.message : "Review decision could not be persisted.",
    };
  }
}

export async function recordCodexPromptHandoffAction(
  taskId: string,
  mode: CodexPromptHandoffMode,
): Promise<CodexPromptHandoffResult> {
  try {
    initializeLocalDb();
    const event = await recordCodexPromptHandoff(taskId, mode);
    revalidatePath(`/review/${taskId}`);

    return {
      ok: true,
      taskId,
      mode,
      eventId: event.id,
      message: event.message,
      cliTaskExecutionAttempted: false,
    };
  } catch (error) {
    return {
      ok: false,
      taskId,
      mode,
      error: error instanceof Error ? error.message : "Codex prompt handoff could not be recorded.",
      cliTaskExecutionAttempted: false,
    };
  }
}

export async function runScopedCodexTaskAction(
  taskId: string,
  confirmations: {
    projectPathApproved: boolean;
    promptReviewed: boolean;
    forbiddenScopeAcknowledged: boolean;
    noAutoCommitPushDeployAcknowledged: boolean;
  },
): Promise<ScopedCodexRunnerOutput> {
  const startedAt = new Date().toISOString();

  try {
    initializeLocalDb();
    const localRead = await readSelectedReviewRoom(taskId);
    const task = localRead?.task ?? tasks.find((item) => item.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const project = projects.find((item) => item.id === task.projectId);
    if (!project) {
      throw new Error(`Project not found for task: ${taskId}`);
    }

    const prompt = buildCodexTaskPrompt({ project, task }).prompt;
    const result = await runScopedCodexTask({
      taskId,
      projectId: project.id,
      approvedProjectPath: confirmations.projectPathApproved ? process.cwd() : "",
      prompt,
      forbiddenScope: task.forbiddenScope,
      explicitConfirmation: true,
      promptReviewed: confirmations.promptReviewed,
      forbiddenScopeAcknowledged: confirmations.forbiddenScopeAcknowledged,
      noAutoCommitPushDeployAcknowledged: confirmations.noAutoCommitPushDeployAcknowledged,
    });

    revalidatePath(`/review/${taskId}`);
    return result;
  } catch (error) {
    const endedAt = new Date().toISOString();
    const errorPreview = error instanceof Error ? error.message : "Scoped Codex runner could not start.";
    return {
      status: "blocked",
      startedAt,
      endedAt,
      durationMs: Math.max(0, new Date(endedAt).getTime() - new Date(startedAt).getTime()),
      stdoutPreview: "",
      stderrPreview: errorPreview,
      stdoutTruncated: false,
      stderrTruncated: false,
      outputPreview: "",
      errorPreview,
      taskExecutionAttempted: false,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds: [],
    };
  }
}

export interface RunEnabledQualityGatesActionResult {
  ok: boolean;
  runs: QualityGateRun[];
  error?: string;
}

export async function runEnabledQualityGatesAction(taskId: string): Promise<RunEnabledQualityGatesActionResult> {
  try {
    initializeLocalDb();
    const localRead = await readSelectedReviewRoom(taskId);
    if (!localRead) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const result = await runEnabledQualityGates({
      taskId,
      projectId: localRead.task.projectId,
      configs: localRead.qualityGateConfigs,
      cwd: process.cwd(),
    });

    revalidatePath(`/review/${taskId}`);
    return {
      ok: true,
      runs: result.runs,
    };
  } catch (error) {
    return {
      ok: false,
      runs: [],
      error: error instanceof Error ? error.message : "Quality gates could not run.",
    };
  }
}
