import { initializeLocalDb } from "@/lib/local-db/init";
import { persistReviewDecisionForTask } from "@/lib/local-db/operations/reviews";
import { readSelectedProjectRoom, readSelectedReviewRoom } from "@/lib/local-db/selected-reads";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

const projectId = "provider-workspace";
const reviewTaskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  await persistReviewDecisionForTask(reviewTaskId, "approved");

  const projectRoom = await readSelectedProjectRoom(projectId);
  assert(projectRoom, `Selected project read failed: ${projectId}`);
  assert(projectRoom.project.id === projectId, "Selected project id mismatch");
  assert(projectRoom.tasks.length > 0, "Expected related project tasks");
  assert(projectRoom.buildChecks.length > 0, "Expected related project build checks");
  assert(projectRoom.agentSeats.length > 0, "Expected related project agent seats");
  assert(projectRoom.taskEvents.length > 0, "Expected related project task events");
  assert(projectRoom.tasks.some((task) => task.id === reviewTaskId), `Expected project task ${reviewTaskId}`);

  const reviewRoom = await readSelectedReviewRoom(reviewTaskId);
  assert(reviewRoom, `Selected review read failed: ${reviewTaskId}`);
  assert(reviewRoom.task.id === reviewTaskId, "Selected review task id mismatch");
  assert(reviewRoom.task.status === "done", `Expected persisted task status done, received ${reviewRoom.task.status}`);
  assert(reviewRoom.review?.decision === "approved", `Expected persisted approved decision, received ${reviewRoom.review?.decision}`);
  assert(reviewRoom.taskEvents.some((event) => event.id === `review-decision-${reviewTaskId}-approved`), "Expected persisted review approval event");

  const fallbackProject = await readSelectedProjectRoom("missing-project-for-fallback-check");
  const fallbackReview = await readSelectedReviewRoom("missing-task-for-fallback-check");
  assert(!fallbackProject, "Missing project should return undefined for UI fallback");
  assert(!fallbackReview, "Missing task should return undefined for UI fallback");

  const summary = {
    project: projectRoom.project.id,
    projectTasks: projectRoom.tasks.length,
    projectBuildChecks: projectRoom.buildChecks.length,
    projectAgentSeats: projectRoom.agentSeats.length,
    projectEvents: projectRoom.taskEvents.length,
    reviewTask: reviewRoom.task.id,
    reviewDecision: reviewRoom.review.decision,
    reviewTaskStatus: reviewRoom.task.status,
    reviewEvents: reviewRoom.taskEvents.length,
    fallback: "undefined local read triggers mock fallback",
  };

  console.log("Selected local reads verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Selected local reads verification failed");
  console.error(error);
  process.exit(1);
});
