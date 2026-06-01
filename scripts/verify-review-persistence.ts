import { initializeLocalDb } from "@/lib/local-db/init";
import { getReviewRecordByTaskId, persistReviewDecisionForTask } from "@/lib/local-db/operations/reviews";
import { getTaskById } from "@/lib/local-db/operations/tasks";
import { listTaskEventsByProject } from "@/lib/local-db/repositories/task-events";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import type { ReviewDecision, TaskStatus } from "@/lib/types";

const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function verifyDecision(decision: ReviewDecision, expectedStatus: TaskStatus): Promise<string> {
  const result = await persistReviewDecisionForTask(taskId, decision);
  const task = await getTaskById(taskId);
  const review = await getReviewRecordByTaskId(taskId);

  assert(task, `Task was not found after ${decision}`);
  assert(review, `Review record was not found after ${decision}`);
  assert(review.decision === decision, `Expected review decision ${decision}, received ${review.decision}`);
  assert(task.status === expectedStatus, `Expected task status ${expectedStatus}, received ${task.status}`);

  const events = await listTaskEventsByProject(task.projectId);
  assert(events.some((event) => event.id === result.eventId), `Expected review event ${result.eventId}`);

  return result.eventId;
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const seededTask = await getTaskById(taskId);
  assert(seededTask, `Seeded task not found: ${taskId}`);

  const approvedEventId = await verifyDecision("approved", "done");
  const rejectedEventId = await verifyDecision("rejected", "blocked");
  const revisionEventId = await verifyDecision("revision_requested", "ready");

  const finalTask = await getTaskById(taskId);
  const finalReview = await getReviewRecordByTaskId(taskId);
  assert(finalTask, "Final task readback failed");
  assert(finalReview, "Final review readback failed");

  const summary = {
    task: taskId,
    finalDecision: finalReview.decision,
    finalTaskStatus: finalTask.status,
    eventIds: [approvedEventId, rejectedEventId, revisionEventId],
  };

  console.log("Review persistence verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Review persistence verification failed");
  console.error(error);
  process.exit(1);
});
