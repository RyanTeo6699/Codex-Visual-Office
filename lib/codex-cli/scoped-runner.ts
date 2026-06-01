import { execFile } from "node:child_process";
import { basename } from "node:path";
import { promisify } from "node:util";
import { detectCodexCliStatus } from "./detect";
import { createScopedCodexRunnerPolicy } from "./runner-policy";
import { addTaskEvent } from "@/lib/local-db/operations/events";
import type {
  ScopedCodexRunnerInput,
  ScopedCodexRunnerOutput,
  ScopedCodexRunnerValidationInput,
  ScopedCodexRunnerValidationResult,
} from "./scoped-runner-types";

const execFileAsync = promisify(execFile);
const maxPreviewChars = 8000;
const runnerTimeoutMs = 180000;

function preview(value: string): string {
  return value.length > maxPreviewChars ? `${value.slice(0, maxPreviewChars)}\n[truncated]` : value;
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
      executionMode: "scoped_codex_runner",
      canExecute: validation.allowed,
      cliTaskExecutionAttempted: false,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      reasons: validation.reasons,
    },
  }));

  if (!validation.allowed || !codexStatus.path) {
    return {
      status: "blocked",
      startedAt,
      endedAt: new Date().toISOString(),
      outputPreview: "",
      errorPreview: validation.reasons.join("\n"),
      taskExecutionAttempted: false,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds,
    };
  }

  eventIds.push(await recordRunnerEvent({
    id: `codex-runner-started-${input.taskId}`,
    taskId: input.taskId,
    projectId: input.projectId,
    type: "info",
    message: "Scoped Codex runner started",
    payload: {
      executionMode: "scoped_codex_runner",
      cliTaskExecutionAttempted: true,
      commandShape: ["codex", "exec", "--cd", "[approved_project_path]", "--sandbox", "read-only", "--json", "[generated_prompt]"],
      autoPushAttempted: false,
      autoDeployAttempted: false,
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

    const outputPreview = preview(stdout);
    const errorPreview = preview(stderr);

    eventIds.push(await recordRunnerEvent({
      id: `codex-runner-output-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "info",
      message: "Scoped Codex runner output preview received",
      payload: {
        outputPreview,
        errorPreview,
        maxPreviewChars,
        cliTaskExecutionAttempted: true,
      },
    }));

    eventIds.push(await recordRunnerEvent({
      id: `codex-runner-completed-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "success",
      message: "Scoped Codex runner completed",
      payload: {
        cliTaskExecutionAttempted: true,
        autoPushAttempted: false,
        autoDeployAttempted: false,
      },
    }));

    return {
      status: "completed",
      exitCode: 0,
      startedAt,
      endedAt: new Date().toISOString(),
      outputPreview,
      errorPreview,
      taskExecutionAttempted: true,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds,
    };
  } catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string; message?: string };
    const outputPreview = preview(failure.stdout ?? "");
    const errorPreview = preview(failure.stderr ?? failure.message ?? "Scoped Codex runner failed.");

    eventIds.push(await recordRunnerEvent({
      id: `codex-runner-failed-${input.taskId}`,
      taskId: input.taskId,
      projectId: input.projectId,
      type: "danger",
      message: "Scoped Codex runner failed",
      payload: {
        exitCode: failure.code,
        outputPreview,
        errorPreview,
        cliTaskExecutionAttempted: true,
        autoPushAttempted: false,
        autoDeployAttempted: false,
      },
    }));

    return {
      status: "failed",
      exitCode: failure.code,
      startedAt,
      endedAt: new Date().toISOString(),
      outputPreview,
      errorPreview,
      taskExecutionAttempted: true,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds,
    };
  }
}
