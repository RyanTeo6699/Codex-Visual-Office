import {
  agentSeats,
  buildChecks,
  projects,
  reviewRecords,
  taskEvents,
  tasks,
} from "@/lib/mock-data";
import type {
  NewAgentSeatRow,
} from "../repositories/agent-seats";
import type { NewBuildCheckRow } from "../repositories/build-checks";
import type { NewProjectRow } from "../repositories/projects";
import type { NewReviewRecordRow } from "../repositories/review-records";
import type { NewTaskEventRow } from "../repositories/task-events";
import type { NewTaskRow } from "../repositories/tasks";

const seedTimestamp = "2026-05-31T00:00:00.000Z";

// Phase 2 Step 1 seed skeleton only.
// Do not run this automatically on app startup. UI integration starts in a later step.
export function mapMockProjectsToSeedRows(): NewProjectRow[] {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.summary,
    phase: project.phase,
    status: project.status,
    localPath: project.localPathPlaceholder,
    accent: project.accent,
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockAgentSeatsToSeedRows(): NewAgentSeatRow[] {
  return agentSeats.map((agentSeat) => ({
    id: agentSeat.id,
    name: agentSeat.name,
    agentType: "codex",
    status: agentSeat.status,
    currentTaskId: agentSeat.taskId ?? null,
    currentProjectId: agentSeat.projectId,
    focus: agentSeat.focus,
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockTasksToSeedRows(): NewTaskRow[] {
  return tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    summary: "",
    status: task.status,
    priority: task.priority,
    assignedSeatId: task.agentSeatId ?? null,
    acceptanceCriteriaJson: JSON.stringify(task.acceptanceCriteria),
    forbiddenScopeJson: JSON.stringify(task.forbiddenScope),
    changedFilesJson: JSON.stringify(task.changedFiles),
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockTaskEventsToSeedRows(): NewTaskEventRow[] {
  return taskEvents.map((event) => ({
    id: event.id,
    taskId: event.taskId ?? null,
    projectId: event.projectId,
    seatId: event.agentSeatId ?? null,
    type: event.tone,
    message: event.message,
    payloadJson: JSON.stringify({ displayTime: event.time }),
    createdAt: seedTimestamp,
  }));
}

export function mapMockBuildChecksToSeedRows(): NewBuildCheckRow[] {
  return buildChecks.map((check) => ({
    id: check.id,
    projectId: check.projectId,
    taskId: check.taskId ?? null,
    name: check.label,
    status: check.status,
    message: check.detail,
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockReviewRecordsToSeedRows(): NewReviewRecordRow[] {
  return reviewRecords.map((reviewRecord) => ({
    id: `review-${reviewRecord.taskId}`,
    taskId: reviewRecord.taskId,
    decision: reviewRecord.decision,
    notes: "",
    diffSummaryJson: JSON.stringify(reviewRecord.diffSummary),
    riskNotesJson: JSON.stringify(reviewRecord.riskNotes),
    qualityGateIdsJson: JSON.stringify(reviewRecord.qualityGateIds),
    createdAt: seedTimestamp,
  }));
}
