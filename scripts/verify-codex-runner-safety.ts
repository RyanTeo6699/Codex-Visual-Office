import { initializeLocalDb } from "@/lib/local-db/init";
import { listTaskEventsByProject } from "@/lib/local-db/repositories/task-events";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import { createPhase3Step3ARunnerPolicy } from "@/lib/codex-cli/runner-policy";
import { getRunnerSafetyStatus, recordRunnerSafetyPreview } from "@/lib/codex-cli/runner-safety";

const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const policy = createPhase3Step3ARunnerPolicy();
  const status = getRunnerSafetyStatus({
    projectId,
    localPath: "not_configured",
  });

  assert(policy.allowlistedExecutable === "codex", "Runner must only allow codex executable");
  assert(policy.allowArbitraryShell === false, "Arbitrary shell must be disabled");
  assert(policy.allowPromptExecution === false, "Prompt execution must be disabled");
  assert(policy.allowAutoPush === false, "Auto push must be disabled");
  assert(policy.allowAutoDeploy === false, "Auto deploy must be disabled");
  assert(policy.requireApprovedProjectPath === true, "Approved project path must be required");
  assert(policy.requireExplicitUserConfirmation === true, "Explicit confirmation must be required");
  assert(policy.requirePromptPreview === true, "Prompt preview must be required");
  assert(policy.requireForbiddenScopeAcknowledgement === true, "Forbidden scope acknowledgement must be required");
  assert(policy.executionMode === "safety_harness_only", "Execution mode must be safety_harness_only");
  assert(status.canExecute === false, "Safety status must not allow execution");

  const event = await recordRunnerSafetyPreview(taskId);
  const events = await listTaskEventsByProject(projectId);
  const readBack = events.find((item) => item.id === event.id);

  assert(readBack, "Runner safety preview event was not persisted");
  const payload = JSON.parse(readBack.payloadJson) as {
    executionMode?: string;
    canExecute?: boolean;
    cliTaskExecutionAttempted?: boolean;
    arbitraryShellAllowed?: boolean;
    promptExecutionAllowed?: boolean;
  };

  assert(payload.executionMode === "safety_harness_only", "Event payload execution mode mismatch");
  assert(payload.canExecute === false, "Event payload must record canExecute=false");
  assert(payload.cliTaskExecutionAttempted === false, "Event payload must record no CLI task execution");
  assert(payload.arbitraryShellAllowed === false, "Event payload must record arbitrary shell disabled");
  assert(payload.promptExecutionAllowed === false, "Event payload must record prompt execution disabled");

  const summary = {
    executionMode: policy.executionMode,
    allowlistedExecutable: policy.allowlistedExecutable,
    canExecute: status.canExecute,
    allowArbitraryShell: policy.allowArbitraryShell,
    allowPromptExecution: policy.allowPromptExecution,
    allowAutoPush: policy.allowAutoPush,
    allowAutoDeploy: policy.allowAutoDeploy,
    requireApprovedProjectPath: policy.requireApprovedProjectPath,
    requireExplicitUserConfirmation: policy.requireExplicitUserConfirmation,
    safetyPreviewEvent: event.id,
    cliTaskExecutionAttempted: false,
  };

  console.log("Codex runner safety verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Codex runner safety verification failed");
  console.error(error);
  process.exit(1);
});
