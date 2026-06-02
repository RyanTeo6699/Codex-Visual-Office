import { execFile } from "node:child_process";
import { basename } from "node:path";
import { promisify } from "node:util";
import { detectCodexCliStatus } from "./detect";
import { createScopedCodexRunnerPolicy } from "./runner-policy";
import { readGitSnapshot } from "@/lib/git-observation/git-snapshot";
import { addTaskEvent } from "@/lib/local-db/operations/events";
import { createGitSnapshot } from "@/lib/local-db/operations/git-snapshots";
import type { GitSnapshotKind } from "@/lib/types";
import type {
  ScopedCodexRunnerInput,
  ScopedCodexRunnerOutput,
  ScopedCodexRunnerValidationInput,
  ScopedCodexRunnerValidationResult,
} from "./scoped-runner-types";

const execFileAsync = promisify(execFile);
export const maxRunnerPreviewChars = 8000;
const runnerTimeoutMs = 180000;

export function redactRunnerOutput(value: string): string {
  return value
    .replace(/\b(?:OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD)\b\s*[:=]\s*\S+/gi, "[redacted-value]")
    .replace(/\b(?:OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD)\b/gi, "[redacted-marker]")
    .replace(/~\/\.codex\/auth\.json/gi, "[redacted-path]")
    .replace(/~\/\.codex/gi, "[redacted-path]")
    .replace(/\bauth\.json\b/gi, "[redacted-file]")
    .replace(/sk-[a-z0-9_-]+/gi, "[redacted-value]");
}

export function createBoundedRunnerPreview(value: string, limit = maxRunnerPreviewChars): { preview: string; truncated: boolean } {
  const redacted = redactRunnerOutput(value);
  const truncated = redacted.length > limit;
  return {
    preview: truncated ? redacted.slice(0, limit) : redacted,
    truncated,
  };
}

function durationMs(startedAt: string, endedAt: string): number {
  return Math.max(0, new Date(endedAt).getTime() - new Date(startedAt).getTime());
}

function runnerSafetyPayload(input: {
  taskId: string;
  projectId: string;
  status?: ScopedCodexRunnerOutput["status"];
  startedAt?: string;
  endedAt?: string;
  exitCode?: number;
  stdoutPreview?: string;
  stderrPreview?: string;
  stdoutTruncated?: boolean;
  stderrTruncated?: boolean;
  cliTaskExecutionAttempted: boolean;
}): Record<string, unknown> {
  return {
    executionMode: "scoped_codex_runner",
    taskId: input.taskId,
    projectId: input.projectId,
    status: input.status,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    durationMs: input.startedAt && input.endedAt ? durationMs(input.startedAt, input.endedAt) : undefined,
    exitCode: input.exitCode,
    stdoutPreview: input.stdoutPreview,
    stderrPreview: input.stderrPreview,
    stdoutTruncated: input.stdoutTruncated,
    stderrTruncated: input.stderrTruncated,
    cliTaskExecutionAttempted: input.cliTaskExecutionAttempted,
    autoPushAttempted: false,
    autoDeployAttempted: false,
    arbitraryShellAllowed: false,
  };
}

function containsForbiddenSecretMarker(prompt: string): boolean {
  return [
    /auth\.json/i,
    /api[_-]?key/i,
    /oauth/i,
    /sk-[a-z0-9]/i,
    /-----BEGIN [A-Z ]+PRIVATE KEY-----/i,
  ].some((pattern) => pattern.test(prompt));
}

export function validateScopedCodexRunnerInput(input: ScopedCodexRunnerValidationInput): ScopedCodexRunnerValidationResult {
  const policy = createScopedCodexRunnerPolicy();
  const reasons: string[] = [];

  if (!input.codexInstalled) {
    reasons.push("Codex CLI is not installed.");
  }

  if (input.executableName !== policy.allowlistedExecutable) {
    reasons.push("Executable is not the allowlisted codex binary.");
  }

  if (!input.approvedProjectPath) {
    reasons.push("Approved project path is missing.");
  }

  if (!input.projectPathApproved) {
    reasons.push("Project path is not approved.");
  }

  if (!input.explicitConfirmation) {
    reasons.push("Explicit user confirmation is missing.");
  }

  if (!input.promptReviewed) {
    reasons.push("Prompt preview acknowledgement is missing.");
  }

  if (!input.forbiddenScopeAcknowledged) {
    reasons.push("Forbidden scope acknowledgement is missing.");
  }

  if (!input.noAutoCommitPushDeployAcknowledged) {
    reasons.push("No auto commit/push/deploy acknowledgement is missing.");
  }

  if (!input.prompt.trim()) {
    reasons.push("Generated prompt is empty.");
  }

  if (containsForbiddenSecretMarker(input.prompt)) {
    reasons.push("Generated prompt contains forbidden secret markers.");
  }

  if (policy.allowArbitraryShell || policy.allowAutoPush || policy.allowAutoDeploy) {
    reasons.push("Runner policy enables a forbidden capability.");
  }

  if (!policy.allowPromptExecution || policy.executionMode !== "scoped_codex_runner") {
    reasons.push("Runner policy does not allow scoped prompt execution.");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}

async function recordRunnerEvent(input: {
  id: string;
  taskId: string;
  projectId: string;
  type: "info" | "success" | "warning" | "danger";
  message: string;
  payload: Record<string, unknown>;
}): Promise<string> {
  const event = await addTaskEvent({
    id: input.id,
    projectId: input.projectId,
    taskId: input.taskId,
    type: input.type,
    message: input.message,
    payload: input.payload,
  });

  return event.id;
}

function snapshotId(taskId: string, snapshotKind: GitSnapshotKind): string {
  return `git-snapshot-${snapshotKind}-${taskId}-${Date.now()}`;
}

async function captureRunnerGitSnapshot(input: {
  taskId: string;
  projectId: string;
  approvedProjectPath: string;
  snapshotKind: GitSnapshotKind;
}): Promise<string | undefined> {
  try {
    const snapshot = await readGitSnapshot({
      approvedProjectPath: input.approvedProjectPath,
      snapshotKind: input.snapshotKind,
    });
    const created = await createGitSnapshot({
      id: snapshotId(input.taskId, input.snapshotKind),
      taskId: input.taskId,
      projectId: input.projectId,
      snapshotKind: input.snapshotKind,
      branch: snapshot.branch,
      headSha: snapshot.headSha,
      repoRoot: snapshot.repoRoot,
      porcelainStatus: snapshot.porcelainStatus,
      isDirty: snapshot.isDirty,
      statusSummary: snapshot.statusSummary,
    });

    await recordRunnerEvent({
      id: `git-snapshot-${input.snapshotKind}-captured-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "info",
      message: `Git ${input.snapshotKind} snapshot captured`,
      payload: {
        lifecycleEvent: `git_snapshot_${input.snapshotKind}`,
        snapshotId: created.id,
        snapshotKind: input.snapshotKind,
        branch: created.branch,
        headSha: created.headSha,
        isDirty: created.isDirty,
        changedFileCount: created.statusSummary.changedFileCount,
        autoCommitAttempted: false,
        autoPushAttempted: false,
        autoDeployAttempted: false,
      },
    });

    return created.id;
  } catch (error) {
    await recordRunnerEvent({
      id: `git-snapshot-${input.snapshotKind}-unavailable-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "warning",
      message: `Git ${input.snapshotKind} snapshot unavailable`,
      payload: {
        lifecycleEvent: `git_snapshot_${input.snapshotKind}_unavailable`,
        snapshotKind: input.snapshotKind,
        error: error instanceof Error ? error.message : "Git snapshot unavailable.",
        autoCommitAttempted: false,
        autoPushAttempted: false,
        autoDeployAttempted: false,
      },
    });
    return undefined;
  }
}

export async function runScopedCodexTask(input: ScopedCodexRunnerInput): Promise<ScopedCodexRunnerOutput> {
  const startedAt = new Date().toISOString();
  const eventIds: string[] = [];
  const codexStatus = await detectCodexCliStatus();
  const executableName = codexStatus.path ? basename(codexStatus.path) : undefined;
  const validation = validateScopedCodexRunnerInput({
    executableName,
    codexInstalled: codexStatus.installed,
    approvedProjectPath: input.approvedProjectPath,
    projectPathApproved: Boolean(input.approvedProjectPath),
    explicitConfirmation: input.explicitConfirmation,
    promptReviewed: input.promptReviewed,
    forbiddenScopeAcknowledged: input.forbiddenScopeAcknowledged,
    noAutoCommitPushDeployAcknowledged: input.noAutoCommitPushDeployAcknowledged,
    prompt: input.prompt,
  });

  eventIds.push(await recordRunnerEvent({
    id: `codex-runner-requested-${input.taskId}`,
    taskId: input.taskId,
    projectId: input.projectId,
    type: validation.allowed ? "info" : "warning",
    message: "Scoped Codex runner requested",
    payload: {
      ...runnerSafetyPayload({
        taskId: input.taskId,
        projectId: input.projectId,
        status: validation.allowed ? "running" : "blocked",
        startedAt,
        cliTaskExecutionAttempted: false,
      }),
      lifecycleEvent: "runner_requested",
      canExecute: validation.allowed,
      reasons: validation.reasons,
    },
  }));

  if (!validation.allowed || !codexStatus.path) {
    const endedAt = new Date().toISOString();
    const stderr = createBoundedRunnerPreview(validation.reasons.join("\n"));
    return {
      status: "blocked",
      startedAt,
      endedAt,
      durationMs: durationMs(startedAt, endedAt),
      stdoutPreview: "",
      stderrPreview: stderr.preview,
      stdoutTruncated: false,
      stderrTruncated: stderr.truncated,
      outputPreview: "",
      errorPreview: stderr.preview,
      taskExecutionAttempted: false,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds,
    };
  }

  await captureRunnerGitSnapshot({
    taskId: input.taskId,
    projectId: input.projectId,
    approvedProjectPath: input.approvedProjectPath,
    snapshotKind: "before_runner",
  });

  eventIds.push(await recordRunnerEvent({
    id: `codex-runner-started-${input.taskId}`,
    taskId: input.taskId,
    projectId: input.projectId,
    type: "info",
    message: "Scoped Codex runner started",
    payload: {
      ...runnerSafetyPayload({
        taskId: input.taskId,
        projectId: input.projectId,
        status: "running",
        startedAt,
        cliTaskExecutionAttempted: true,
      }),
      lifecycleEvent: "runner_started",
      commandShape: ["codex", "exec", "--cd", "[approved_project_path]", "--sandbox", "read-only", "--json", "[generated_prompt]"],
    },
  }));

  try {
    const { stdout, stderr } = await execFileAsync(codexStatus.path, [
      "exec",
      "--cd",
      input.approvedProjectPath,
      "--sandbox",
      "read-only",
      "--json",
      input.prompt,
    ], {
      shell: false,
      timeout: runnerTimeoutMs,
      maxBuffer: 1024 * 1024,
    });

    const stdoutCapture = createBoundedRunnerPreview(stdout);
    const stderrCapture = createBoundedRunnerPreview(stderr);
    const endedAt = new Date().toISOString();
    const runDurationMs = durationMs(startedAt, endedAt);

    await captureRunnerGitSnapshot({
      taskId: input.taskId,
      projectId: input.projectId,
      approvedProjectPath: input.approvedProjectPath,
      snapshotKind: "after_runner",
    });

    eventIds.push(await recordRunnerEvent({
      id: `codex-runner-output-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "info",
      message: "Scoped Codex runner output preview received",
      payload: {
        ...runnerSafetyPayload({
          taskId: input.taskId,
          projectId: input.projectId,
          status: "completed",
          startedAt,
          endedAt,
          exitCode: 0,
          stdoutPreview: stdoutCapture.preview,
          stderrPreview: stderrCapture.preview,
          stdoutTruncated: stdoutCapture.truncated,
          stderrTruncated: stderrCapture.truncated,
          cliTaskExecutionAttempted: true,
        }),
        outputPreview: stdoutCapture.preview,
        errorPreview: stderrCapture.preview,
        maxPreviewChars: maxRunnerPreviewChars,
        lifecycleEvent: "runner_output_received",
      },
    }));

    eventIds.push(await recordRunnerEvent({
      id: `codex-runner-completed-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "success",
      message: "Scoped Codex runner completed",
      payload: {
        ...runnerSafetyPayload({
          taskId: input.taskId,
          projectId: input.projectId,
          status: "completed",
          startedAt,
          endedAt,
          exitCode: 0,
          stdoutPreview: stdoutCapture.preview,
          stderrPreview: stderrCapture.preview,
          stdoutTruncated: stdoutCapture.truncated,
          stderrTruncated: stderrCapture.truncated,
          cliTaskExecutionAttempted: true,
        }),
        lifecycleEvent: "runner_completed",
      },
    }));

    return {
      status: "completed",
      exitCode: 0,
      startedAt,
      endedAt,
      durationMs: runDurationMs,
      stdoutPreview: stdoutCapture.preview,
      stderrPreview: stderrCapture.preview,
      stdoutTruncated: stdoutCapture.truncated,
      stderrTruncated: stderrCapture.truncated,
      outputPreview: stdoutCapture.preview,
      errorPreview: stderrCapture.preview,
      taskExecutionAttempted: true,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds,
    };
  } catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string; message?: string };
    const stdoutCapture = createBoundedRunnerPreview(failure.stdout ?? "");
    const stderrCapture = createBoundedRunnerPreview(failure.stderr ?? failure.message ?? "Scoped Codex runner failed.");
    const endedAt = new Date().toISOString();
    const runDurationMs = durationMs(startedAt, endedAt);

    await captureRunnerGitSnapshot({
      taskId: input.taskId,
      projectId: input.projectId,
      approvedProjectPath: input.approvedProjectPath,
      snapshotKind: "after_runner",
    });

    eventIds.push(await recordRunnerEvent({
      id: `codex-runner-failed-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "danger",
      message: "Scoped Codex runner failed",
      payload: {
        ...runnerSafetyPayload({
          taskId: input.taskId,
          projectId: input.projectId,
          status: "failed",
          startedAt,
          endedAt,
          exitCode: failure.code,
          stdoutPreview: stdoutCapture.preview,
          stderrPreview: stderrCapture.preview,
          stdoutTruncated: stdoutCapture.truncated,
          stderrTruncated: stderrCapture.truncated,
          cliTaskExecutionAttempted: true,
        }),
        lifecycleEvent: "runner_failed",
        outputPreview: stdoutCapture.preview,
        errorPreview: stderrCapture.preview,
      },
    }));

    return {
      status: "failed",
      exitCode: failure.code,
      startedAt,
      endedAt,
      durationMs: runDurationMs,
      stdoutPreview: stdoutCapture.preview,
      stderrPreview: stderrCapture.preview,
      stdoutTruncated: stdoutCapture.truncated,
      stderrTruncated: stderrCapture.truncated,
      outputPreview: stdoutCapture.preview,
      errorPreview: stderrCapture.preview,
      taskExecutionAttempted: true,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds,
    };
  }
}
