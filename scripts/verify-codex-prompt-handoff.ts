import { buildCodexTaskPrompt } from "@/lib/codex-cli/prompt-builder";
import { recordCodexPromptHandoff } from "@/lib/codex-cli/handoff";
import { initializeLocalDb } from "@/lib/local-db/init";
import { listTaskEventsByProject } from "@/lib/local-db/repositories/task-events";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import { readSelectedProjectRoom, readSelectedReviewRoom } from "@/lib/local-db/selected-reads";

const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoSecretContent(prompt: string): void {
  const forbiddenPatterns = [
    /auth\.json/i,
    /api[_-]?key/i,
    /oauth/i,
    /token/i,
    /sk-[a-z0-9]/i,
  ];

  for (const pattern of forbiddenPatterns) {
    assert(!pattern.test(prompt), `Prompt contains forbidden secret-related content: ${pattern}`);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const projectRoom = await readSelectedProjectRoom(projectId);
  const reviewRoom = await readSelectedReviewRoom(taskId);

  assert(projectRoom, `Project not found: ${projectId}`);
  assert(reviewRoom, `Task not found: ${taskId}`);

  const promptResult = buildCodexTaskPrompt({
    project: projectRoom.project,
    task: reviewRoom.task,
  });

  assert(promptResult.prompt.includes(reviewRoom.task.title), "Prompt does not include task title");
  assert(reviewRoom.task.acceptanceCriteria.every((item) => promptResult.prompt.includes(item)), "Prompt does not include every acceptance criterion");
  assert(reviewRoom.task.forbiddenScope.every((item) => promptResult.prompt.includes(item)), "Prompt does not include every forbidden scope item");
  assert(promptResult.prompt.includes("List files changed"), "Prompt does not request files changed");
  assert(promptResult.prompt.includes("verification commands"), "Prompt does not request verification commands");
  assert(promptResult.prompt.includes("Do not exceed this task scope"), "Prompt does not include task scope boundary");
  assertNoSecretContent(promptResult.prompt);

  const readyEvent = await recordCodexPromptHandoff(taskId, "mark_ready");
  const dryRunEvent = await recordCodexPromptHandoff(taskId, "dry_run_dispatch");
  const events = await listTaskEventsByProject(projectId);

  assert(events.some((event) => event.id === readyEvent.id), "Ready handoff event was not persisted");
  assert(events.some((event) => event.id === dryRunEvent.id), "Dry-run dispatch event was not persisted");

  const summary = {
    project: projectId,
    task: taskId,
    promptLength: promptResult.prompt.length,
    promptMode: promptResult.mode,
    readyEvent: readyEvent.id,
    dryRunEvent: dryRunEvent.id,
    cliTaskExecutionAttempted: false,
  };

  console.log("Codex prompt handoff verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Codex prompt handoff verification failed");
  console.error(error);
  process.exit(1);
});
