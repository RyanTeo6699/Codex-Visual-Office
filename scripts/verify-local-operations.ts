import { initializeLocalDb } from "@/lib/local-db/init";
import { getAgentSeatById } from "@/lib/local-db/repositories/agent-seats";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import { addTaskEvent } from "@/lib/local-db/operations/events";
import { createProject, getProjectById, updateProjectDetails } from "@/lib/local-db/operations/projects";
import { createReviewRecord, getReviewRecordByTaskId, listReviewRecords, updateReviewDecision } from "@/lib/local-db/operations/reviews";
import { readSetting, updateSetting } from "@/lib/local-db/operations/settings";
import {
  assignTaskToAgentSeat,
  createTask,
  getTaskById,
  updateAgentSeatWorkState,
  updateTaskDetails,
  updateTaskStatus,
} from "@/lib/local-db/operations/tasks";
import { listTaskEventsByProject } from "@/lib/local-db/repositories/task-events";

const testProjectId = "verify-phase-2-project";
const testTaskId = "verify-phase-2-task";
const testEventId = "verify-phase-2-event";
const testReviewId = "verify-phase-2-review";
const seatId = "seat-1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const project = await createProject({
    id: testProjectId,
    name: "Verification Project",
    description: "Local operation verification project",
    phase: "Phase 2 Verification",
    status: "active",
    localPath: "~/Projects/verification",
    accent: "cyan",
  });

  await updateProjectDetails(testProjectId, {
    status: "reviewing",
    description: "Updated by local operation verification",
  });

  const task = await createTask({
    id: testTaskId,
    projectId: testProjectId,
    title: "Verify local task operations",
    summary: "Created by scripts/verify-local-operations.ts",
    status: "ready",
    priority: "high",
    acceptanceCriteria: ["Project is readable", "Task status updates", "Review record persists"],
    forbiddenScope: ["Codex CLI", "OpenAI API", "GitHub"],
    changedFiles: ["lib/local-db/operations/tasks.ts"],
  });

  await updateTaskDetails(testTaskId, {
    summary: "Updated by local operation verification",
    priority: "critical",
  });

  const assignment = await assignTaskToAgentSeat(testTaskId, seatId);
  await updateTaskStatus(testTaskId, "running");
  await updateAgentSeatWorkState(seatId, {
    status: "editing",
    currentTaskId: testTaskId,
    currentProjectId: testProjectId,
    focus: "Verifying local operation helpers",
  });

  const event = await addTaskEvent({
    id: testEventId,
    projectId: testProjectId,
    taskId: testTaskId,
    seatId,
    type: "info",
    message: "Local operation verification event",
    payload: { source: "verify-local-operations" },
  });

  const review = await createReviewRecord({
    id: testReviewId,
    taskId: testTaskId,
    decision: "pending",
    notes: "Created by operation verification",
    diffSummary: ["Added local operation verification"],
    riskNotes: ["No UI wiring performed"],
    qualityGateIds: [],
  });

  await updateReviewDecision(testTaskId, "approved", "Approved by operation verification");
  await updateTaskStatus(testTaskId, "done");
  const setting = await updateSetting("operation_verification_last_run", new Date().toISOString());

  const readBackProject = await getProjectById(testProjectId);
  const readBackTask = await getTaskById(testTaskId);
  const readBackEvents = await listTaskEventsByProject(testProjectId);
  const readBackReview = await getReviewRecordByTaskId(testTaskId);
  const readBackSeat = await getAgentSeatById(seatId);
  const readBackSetting = await readSetting("operation_verification_last_run");
  const reviewRecords = await listReviewRecords();

  assert(project.id === testProjectId, "Project creation failed");
  assert(task.id === testTaskId, "Task creation failed");
  assert(assignment.task.assignedSeatId === seatId, "Task assignment failed");
  assert(event.id === testEventId, "Task event creation failed");
  assert(review.id === testReviewId, "Review creation failed");
  assert(setting.key === "operation_verification_last_run", "Setting update failed");
  assert(readBackProject?.status === "reviewing", "Project update did not persist");
  assert(readBackTask?.status === "done", "Task status did not persist");
  assert(readBackTask?.priority === "critical", "Task update did not persist");
  assert(readBackEvents.some((item) => item.id === testEventId), "Task event readback failed");
  assert(readBackReview?.decision === "approved", "Review decision did not persist");
  assert(readBackSeat?.currentTaskId === testTaskId, "Agent seat current task did not persist");
  assert(readBackSetting?.key === "operation_verification_last_run", "Setting readback failed");
  assert(reviewRecords.some((item) => item.id === testReviewId), "Review list readback failed");

  const summary = {
    project: readBackProject.id,
    task: readBackTask.id,
    taskStatus: readBackTask.status,
    assignedSeat: readBackSeat.id,
    event: testEventId,
    reviewDecision: readBackReview.decision,
    setting: readBackSetting.key,
  };

  console.log("Local operations verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local operations verification failed");
  console.error(error);
  process.exit(1);
});
