import { buildCodexTaskPrompt } from "@/lib/codex-cli/prompt-builder";
import { createScopedCodexRunnerPolicy } from "@/lib/codex-cli/runner-policy";
import { runScopedCodexTask, validateScopedCodexRunnerInput } from "@/lib/codex-cli/scoped-runner";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import { readSelectedProjectRoom, readSelectedReviewRoom } from "@/lib/local-db/selected-reads";

const projectId = "provider-workspace";
const taskId = "task-provider-review";
const approvedProjectPath = process.cwd();

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const policy = createScopedCodexRunnerPolicy();
  assert(policy.allowlistedExecutable === "codex", "Scoped runner executable must be codex");
  assert(policy.allowArbitraryShell === false, "Arbitrary shell must be disabled");
  assert(policy.allowAutoPush === false, "Auto push must be disabled");
  assert(policy.allowAutoDeploy === false, "Auto deploy must be disabled");
  assert(policy.allowPromptExecution === true, "Scoped runner policy should allow generated prompt execution");
  assert(policy.executionMode === "scoped_codex_runner", "Execution mode must be scoped_codex_runner");

  const projectRoom = await readSelectedProjectRoom(projectId);
  const reviewRoom = await readSelectedReviewRoom(taskId);
  assert(projectRoom, `Project not found: ${projectId}`);
  assert(reviewRoom, `Task not found: ${taskId}`);

  const prompt = buildCodexTaskPrompt({
    project: projectRoom.project,
    task: reviewRoom.task,
  }).prompt;

  const missingConfirmation = validateScopedCodexRunnerInput({
    executableName: "codex",
    codexInstalled: true,
    approvedProjectPath,
    projectPathApproved: true,
    explicitConfirmation: false,
    promptReviewed: true,
    forbiddenScopeAcknowledged: true,
    noAutoCommitPushDeployAcknowledged: true,
    prompt,
  });
  assert(!missingConfirmation.allowed, "Runner must block missing explicit confirmation");

  const missingPath = validateScopedCodexRunnerInput({
    executableName: "codex",
    codexInstalled: true,
    approvedProjectPath: "",
    projectPathApproved: false,
    explicitConfirmation: true,
    promptReviewed: true,
    forbiddenScopeAcknowledged: true,
    noAutoCommitPushDeployAcknowledged: true,
    prompt,
  });
  assert(!missingPath.allowed, "Runner must block missing project path");

  const wrongExecutable = validateScopedCodexRunnerInput({
    executableName: "bash",
    codexInstalled: true,
    approvedProjectPath,
    projectPathApproved: true,
    explicitConfirmation: true,
    promptReviewed: true,
    forbiddenScopeAcknowledged: true,
    noAutoCommitPushDeployAcknowledged: true,
    prompt,
  });
  assert(!wrongExecutable.allowed, "Runner must block non-codex executable");

  const blockedRun = await runScopedCodexTask({
    taskId,
    projectId,
    approvedProjectPath: "",
    prompt,
    explicitConfirmation: true,
    promptReviewed: true,
    forbiddenScopeAcknowledged: true,
    noAutoCommitPushDeployAcknowledged: true,
  });
  assert(blockedRun.status === "blocked", "Blocked run should not proceed");
  assert(blockedRun.taskExecutionAttempted === false, "Blocked verification must not execute Codex");

  const summary = {
    executionMode: policy.executionMode,
    allowlistedExecutable: policy.allowlistedExecutable,
    allowArbitraryShell: policy.allowArbitraryShell,
    allowAutoPush: policy.allowAutoPush,
    allowAutoDeploy: policy.allowAutoDeploy,
    generatedPromptUsed: prompt.includes(reviewRoom.task.title),
    missingConfirmationBlocked: !missingConfirmation.allowed,
    missingProjectPathBlocked: !missingPath.allowed,
    nonCodexExecutableBlocked: !wrongExecutable.allowed,
    blockedRunStatus: blockedRun.status,
    cliTaskExecutionAttempted: blockedRun.taskExecutionAttempted,
    realExecutionVerification: "skipped_to_avoid_file_modification",
  };

  console.log("Scoped Codex runner verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Scoped Codex runner verification failed");
  console.error(error);
  process.exit(1);
});
