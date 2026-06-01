import { createScopedCodexRunnerPolicy } from "@/lib/codex-cli/runner-policy";
import { createBoundedRunnerPreview, maxRunnerPreviewChars, redactRunnerOutput } from "@/lib/codex-cli/scoped-runner";
import { addTaskEvent } from "@/lib/local-db/operations/events";
import { createProject } from "@/lib/local-db/operations/projects";
import { createTask } from "@/lib/local-db/operations/tasks";
import { initializeLocalDb } from "@/lib/local-db/init";
import { listTaskEventsByProject } from "@/lib/local-db/repositories/task-events";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

const projectId = "verify-runner-output-project";
const taskId = "verify-runner-output-task";
const lifecycleOrder = ["runner_requested", "runner_started", "runner_output_received", "runner_completed"] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function parsePayload(payloadJson: string): Record<string, unknown> {
  const parsed = JSON.parse(payloadJson);
  assert(parsed && typeof parsed === "object" && !Array.isArray(parsed), "Payload must be a structured object");
  return parsed as Record<string, unknown>;
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  await createProject({
    id: projectId,
    name: "Runner Output Verification",
    description: "Isolated verification project for runner output event payloads",
    phase: "Phase 3 Verification",
    status: "active",
    localPath: "~/Projects/runner-output-verification",
    accent: "teal",
  });

  await createTask({
    id: taskId,
    projectId,
    title: "Verify scoped runner output events",
    summary: "Controlled output event verification task",
    status: "ready",
    priority: "medium",
    acceptanceCriteria: ["Bound output previews", "Redact sensitive markers", "Read lifecycle order"],
    forbiddenScope: ["Real Codex execution", "Token reads", "Git push", "Deploy"],
    changedFiles: ["scripts/verify-codex-runner-output-events.ts"],
  });

  const policy = createScopedCodexRunnerPolicy();
  assert(policy.allowlistedExecutable === "codex", "Runner executable must remain codex-only");
  assert(policy.allowArbitraryShell === false, "Arbitrary shell must remain disabled");
  assert(policy.allowAutoPush === false, "Auto push must remain disabled");
  assert(policy.allowAutoDeploy === false, "Auto deploy must remain disabled");

  const oversizedStdout = `safe stdout\n${"A".repeat(maxRunnerPreviewChars + 32)}`;
  const sensitiveStderr = [
    "OPENAI_API_KEY=should-not-persist",
    "TOKEN=should-not-persist",
    "SECRET=should-not-persist",
    "PASSWORD=should-not-persist",
    "~/.codex/auth.json",
    "auth.json",
  ].join("\n");
  const stdout = createBoundedRunnerPreview(oversizedStdout);
  const stderr = createBoundedRunnerPreview(sensitiveStderr);
  const redacted = redactRunnerOutput(sensitiveStderr);
  const startedAt = "2026-06-01T00:00:00.000Z";
  const endedAt = "2026-06-01T00:00:01.234Z";
  const durationMs = 1234;

  assert(stdout.preview.length <= maxRunnerPreviewChars, "Stdout preview must stay bounded");
  assert(stdout.truncated === true, "Oversized stdout must report truncation");
  assert(stderr.preview.length <= maxRunnerPreviewChars, "Stderr preview must stay bounded");
  assert(redacted.includes("[redacted-value]"), "Secret assignment values must be redacted");
  assert(!/OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD|~\/\.codex|auth\.json/i.test(redacted), "Sensitive markers must not survive redaction");

  const basePayload = {
    executionMode: "scoped_codex_runner",
    taskId,
    projectId,
    startedAt,
    endedAt,
    durationMs,
    exitCode: 0,
    stdoutPreview: stdout.preview,
    stderrPreview: stderr.preview,
    stdoutTruncated: stdout.truncated,
    stderrTruncated: stderr.truncated,
    cliTaskExecutionAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
    arbitraryShellAllowed: false,
  };

  await addTaskEvent({
    id: "verify-runner-output-requested",
    projectId,
    taskId,
    type: "info",
    message: "Verify runner requested",
    payload: { ...basePayload, lifecycleEvent: "runner_requested", status: "running" },
  });

  await addTaskEvent({
    id: "verify-runner-output-started",
    projectId,
    taskId,
    type: "info",
    message: "Verify runner started",
    payload: { ...basePayload, lifecycleEvent: "runner_started", status: "running" },
  });

  await addTaskEvent({
    id: "verify-runner-output-received",
    projectId,
    taskId,
    type: "info",
    message: "Verify runner output preview received",
    payload: { ...basePayload, lifecycleEvent: "runner_output_received", status: "completed" },
  });

  await addTaskEvent({
    id: "verify-runner-output-completed",
    projectId,
    taskId,
    type: "success",
    message: "Verify runner completed",
    payload: { ...basePayload, lifecycleEvent: "runner_completed", status: "completed" },
  });

  const events = await listTaskEventsByProject(projectId);
  const payloads = events
    .filter((event) => event.taskId === taskId && event.id.startsWith("verify-runner-output-"))
    .map((event) => parsePayload(event.payloadJson));
  const readLifecycle = lifecycleOrder.map((lifecycleEvent) => payloads.find((payload) => payload.lifecycleEvent === lifecycleEvent));

  assert(readLifecycle.every(Boolean), "Lifecycle events must be readable in requested order");
  for (const payload of readLifecycle) {
    assert(payload?.executionMode === "scoped_codex_runner", "Execution mode must be scoped_codex_runner");
    assert(payload.taskId === taskId, "Payload taskId must match");
    assert(payload.projectId === projectId, "Payload projectId must match");
    assert(typeof payload.durationMs === "number", "Payload durationMs must be present");
    assert(typeof payload.stdoutPreview === "string", "Payload stdoutPreview must be present");
    assert(typeof payload.stderrPreview === "string", "Payload stderrPreview must be present");
    assert((payload.stdoutPreview as string).length <= maxRunnerPreviewChars, "Persisted stdout preview must stay bounded");
    assert((payload.stderrPreview as string).length <= maxRunnerPreviewChars, "Persisted stderr preview must stay bounded");
    assert(payload.autoPushAttempted === false, "Auto push must not be attempted");
    assert(payload.autoDeployAttempted === false, "Auto deploy must not be attempted");
    assert(payload.arbitraryShellAllowed === false, "Arbitrary shell must not be allowed");
  }

  const summary = {
    executionMode: policy.executionMode,
    maxPreviewChars: maxRunnerPreviewChars,
    stdoutPreviewLength: stdout.preview.length,
    stderrPreviewLength: stderr.preview.length,
    stdoutTruncated: stdout.truncated,
    stderrTruncated: stderr.truncated,
    redactionVerified: true,
    lifecycleOrderReadable: lifecycleOrder,
    allowArbitraryShell: policy.allowArbitraryShell,
    allowAutoPush: policy.allowAutoPush,
    allowAutoDeploy: policy.allowAutoDeploy,
    realCodexExecutionAttempted: false,
  };

  console.log("Codex runner output event verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Codex runner output event verification failed");
  console.error(error);
  process.exit(1);
});
