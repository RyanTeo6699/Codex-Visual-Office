import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { QualityGateConfig, QualityGateEventType, QualityGateRun, QualityGateRunStatus } from "@/lib/types";
import { createQualityGateEvent } from "@/lib/local-db/operations/quality-gate-events";
import { createQualityGateRun, updateQualityGateRunStatus } from "@/lib/local-db/operations/quality-gate-runs";
import { nowIso } from "@/lib/local-db/operations/time";
import { buildQualityGateCommandPlan } from "./quality-gate-policy";
import type { QualityGateOutputCapture, RunEnabledQualityGatesInput, RunEnabledQualityGatesOutput, RunQualityGateConfigInput } from "./quality-gate-runner-types";

export { buildQualityGateCommandPlan } from "./quality-gate-policy";

const execFileAsync = promisify(execFile);
const maxPreviewChars = 8_000;
const maxBufferBytes = 1024 * 1024;
const commandTimeoutMs = 120_000;

interface ExecFileError extends Error {
  code?: number | string;
  stdout?: string | Buffer;
  stderr?: string | Buffer;
}

interface PackageJsonShape {
  scripts?: Record<string, string>;
}

function runIdFor(taskId: string, configId: string): string {
  return `quality-gate-run-${taskId}-${configId}-${Date.now()}`;
}

function eventIdFor(runId: string, eventType: QualityGateEventType): string {
  return `${runId}-${eventType}`;
}

function durationMs(startedAt: string, endedAt: string): number {
  return Math.max(0, new Date(endedAt).getTime() - new Date(startedAt).getTime());
}

function stringifyOutput(value: string | Buffer | undefined): string {
  if (Buffer.isBuffer(value)) {
    return value.toString("utf8");
  }

  return value ?? "";
}

export function redactSensitiveOutput(output: string): string {
  return output
    .replace(/\b(OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD|AUTH)\b(?:\s*=\s*[^\s]+)?/gi, (match, marker: string) => {
      return `[REDACTED:${marker.toUpperCase()}]`;
    })
    .replace(/~\/\.codex\/auth\.json/gi, "[REDACTED:CODEX_AUTH]")
    .replace(/~\/\.codex/gi, "[REDACTED:CODEX_HOME]")
    .replace(/\bauth\.json\b/gi, "[REDACTED:AUTH_JSON]")
    .replace(/\.env\.local/gi, "[REDACTED:ENV_LOCAL]")
    .replace(/\.env\b/gi, "[REDACTED:ENV_FILE]");
}

export function truncateQualityGateOutput(output: string, maxChars = maxPreviewChars): QualityGateOutputCapture {
  const redacted = redactSensitiveOutput(output);
  if (redacted.length <= maxChars) {
    return {
      preview: redacted,
      truncated: false,
    };
  }

  return {
    preview: redacted.slice(0, maxChars),
    truncated: true,
  };
}

async function readPackageScripts(cwd: string): Promise<Record<string, string>> {
  const packageJsonPath = path.join(cwd, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as PackageJsonShape;
  return packageJson.scripts ?? {};
}

async function packageScriptExists(cwd: string, scriptName: string): Promise<boolean> {
  const scripts = await readPackageScripts(cwd);
  return Boolean(scripts[scriptName]);
}

async function createEvent(run: QualityGateRun, eventType: QualityGateEventType, payload: Record<string, unknown> = {}): Promise<void> {
  await createQualityGateEvent({
    id: eventIdFor(run.id, eventType),
    runId: run.id,
    taskId: run.taskId,
    projectId: run.projectId,
    eventType,
    payload: {
      commandKey: run.commandKey,
      command: run.command,
      ...payload,
    },
  });
}

async function finishRun(
  run: QualityGateRun,
  status: QualityGateRunStatus,
  input: {
    startedAt?: string;
    endedAt?: string;
    exitCode?: number | null;
    stdout?: string;
    stderr?: string;
    skippedReason?: string | null;
    failedReason?: string | null;
  },
): Promise<QualityGateRun> {
  const stdout = truncateQualityGateOutput(input.stdout ?? "");
  const stderr = truncateQualityGateOutput(input.stderr ?? "");
  return updateQualityGateRunStatus(run.id, {
    status,
    exitCode: input.exitCode ?? null,
    durationMs: input.startedAt && input.endedAt ? durationMs(input.startedAt, input.endedAt) : null,
    stdoutPreview: stdout.preview,
    stderrPreview: stderr.preview,
    stdoutTruncated: stdout.truncated,
    stderrTruncated: stderr.truncated,
    skippedReason: input.skippedReason ?? null,
    failedReason: input.failedReason ?? null,
    startedAt: input.startedAt ?? null,
    endedAt: input.endedAt ?? null,
  });
}

export async function runQualityGateConfig(input: RunQualityGateConfigInput): Promise<QualityGateRun> {
  const plan = buildQualityGateCommandPlan(input.config);
  let run = await createQualityGateRun({
    id: runIdFor(input.taskId, input.config.id),
    taskId: input.taskId,
    projectId: input.projectId,
    configId: input.config.id,
    commandKey: input.config.commandKey,
    command: input.config.command,
  });

  await createEvent(run, "quality_gate_queued", { enabled: input.config.enabled, allowlisted: input.config.allowlisted });

  if (!input.config.enabled) {
    const endedAt = nowIso();
    run = await finishRun(run, "skipped", {
      endedAt,
      skippedReason: "config_disabled",
      stderr: "Quality gate config is disabled.",
    });
    await createEvent(run, "quality_gate_skipped", { reason: "config_disabled" });
    return run;
  }

  if (plan.requiredPackageScript && !(await packageScriptExists(input.cwd, plan.requiredPackageScript))) {
    const endedAt = nowIso();
    run = await finishRun(run, "skipped", {
      endedAt,
      skippedReason: "script_not_available",
      stderr: `package.json script is not available: ${plan.requiredPackageScript}`,
    });
    await createEvent(run, "quality_gate_skipped", { reason: "script_not_available", scriptName: plan.requiredPackageScript });
    return run;
  }

  const startedAt = nowIso();
  run = await updateQualityGateRunStatus(run.id, {
    status: "running",
    startedAt,
    stdoutPreview: "",
    stderrPreview: "",
    stdoutTruncated: false,
    stderrTruncated: false,
  });
  await createEvent(run, "quality_gate_started", {
    executable: plan.executable,
    args: plan.args,
    shell: plan.shell,
  });

  try {
    const { stdout, stderr } = await execFileAsync(plan.executable, plan.args, {
      cwd: input.cwd,
      shell: false,
      timeout: commandTimeoutMs,
      maxBuffer: maxBufferBytes,
    });
    const endedAt = nowIso();
    run = await finishRun(run, "passed", {
      startedAt,
      endedAt,
      exitCode: 0,
      stdout: stringifyOutput(stdout),
      stderr: stringifyOutput(stderr),
    });
    await createEvent(run, "quality_gate_passed", { exitCode: 0, durationMs: run.durationMs });
    return run;
  } catch (error) {
    const execError = error as ExecFileError;
    const endedAt = nowIso();
    const exitCode = typeof execError.code === "number" ? execError.code : null;
    const status: QualityGateRunStatus = exitCode === null ? "blocked" : "failed";
    const failedReason = status === "blocked" ? "execution_blocked" : "nonzero_exit";
    run = await finishRun(run, status, {
      startedAt,
      endedAt,
      exitCode,
      stdout: stringifyOutput(execError.stdout),
      stderr: stringifyOutput(execError.stderr) || execError.message,
      failedReason,
    });
    await createEvent(run, status === "blocked" ? "quality_gate_blocked" : "quality_gate_failed", {
      exitCode,
      reason: failedReason,
      durationMs: run.durationMs,
    });
    return run;
  }
}

export async function runEnabledQualityGates(input: RunEnabledQualityGatesInput): Promise<RunEnabledQualityGatesOutput> {
  const runs: QualityGateRun[] = [];
  for (const config of input.configs) {
    runs.push(await runQualityGateConfig({
      taskId: input.taskId,
      projectId: input.projectId,
      config,
      cwd: input.cwd,
    }));
  }

  return { runs };
}
