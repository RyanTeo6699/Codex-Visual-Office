import type { AgentSeat, BuildCheck, DiffSummary, FileChange, GitSnapshot, Project, QualityGateConfig, ReviewRecord, ScopeCheck, Task, TaskEvent } from "@/lib/types";
import { readLatestDiffSummaryForTask } from "./operations/diff-summaries";
import { readFileChangesForTask } from "./operations/file-changes";
import { getLatestBeforeAfterSnapshotsForTask } from "./operations/git-snapshots";
import { listQualityGateConfigsForProject, seedDefaultQualityGateConfigsForProject } from "./operations/quality-gate-configs";
import { readLatestScopeCheckForTask } from "./operations/scope-checks";
import { initializeLocalDb } from "./init";
import { listAgentSeats } from "./repositories/agent-seats";
import type { AgentSeatRow } from "./repositories/agent-seats";
import { listBuildChecksByProject } from "./repositories/build-checks";
import type { BuildCheckRow } from "./repositories/build-checks";
import { getProjectById } from "./repositories/projects";
import type { ProjectRow } from "./repositories/projects";
import { getReviewRecordByTaskId } from "./repositories/review-records";
import type { ReviewRecordRow } from "./repositories/review-records";
import { listTaskEventsByProject } from "./repositories/task-events";
import type { TaskEventRow } from "./repositories/task-events";
import { getTaskById, listTasksByProject } from "./repositories/tasks";
import type { TaskRow } from "./repositories/tasks";

export interface SelectedProjectRoomRead {
  project: Project;
  tasks: Task[];
  agentSeats: AgentSeat[];
  buildChecks: BuildCheck[];
  taskEvents: TaskEvent[];
  qualityGateConfigs: QualityGateConfig[];
}

export interface SelectedReviewRoomRead {
  task: Task;
  review?: ReviewRecord;
  taskEvents: TaskEvent[];
  gitSnapshots: {
    before?: GitSnapshot;
    after?: GitSnapshot;
  };
  fileChanges: FileChange[];
  diffSummary?: DiffSummary;
  scopeCheck?: ScopeCheck;
  qualityGateConfigs: QualityGateConfig[];
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parsePayload(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function formatEventTime(row: TaskEventRow): string {
  const payload = parsePayload(row.payloadJson);
  if (typeof payload.displayTime === "string") {
    return payload.displayTime;
  }

  return row.createdAt.slice(11, 16) || "--:--";
}

export function mapProjectRow(row: ProjectRow, agentSeats: AgentSeatRow[]): Project {
  return {
    id: row.id,
    name: row.name,
    phase: row.phase,
    status: row.status,
    localPathPlaceholder: row.localPath ?? "Local path not set",
    summary: row.description,
    accent: row.accent,
    agentSeatIds: agentSeats.filter((agentSeat) => agentSeat.currentProjectId === row.id).map((agentSeat) => agentSeat.id),
  };
}

export function mapAgentSeatRow(row: AgentSeatRow): AgentSeat {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    projectId: row.currentProjectId ?? "",
    taskId: row.currentTaskId ?? undefined,
    focus: row.focus,
  };
}

export function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    status: row.status,
    priority: row.priority,
    agentSeatId: row.assignedSeatId ?? undefined,
    acceptanceCriteria: parseStringArray(row.acceptanceCriteriaJson),
    forbiddenScope: parseStringArray(row.forbiddenScopeJson),
    changedFiles: parseStringArray(row.changedFilesJson),
  };
}

export function mapBuildCheckRow(row: BuildCheckRow): BuildCheck {
  return {
    id: row.id,
    projectId: row.projectId,
    taskId: row.taskId ?? undefined,
    label: row.name,
    status: row.status,
    detail: row.message,
  };
}

export function mapTaskEventRow(row: TaskEventRow): TaskEvent {
  const payload = parsePayload(row.payloadJson);
  return {
    id: row.id,
    projectId: row.projectId,
    taskId: row.taskId ?? undefined,
    agentSeatId: row.seatId ?? undefined,
    time: formatEventTime(row),
    tone: row.type,
    message: row.message,
    payload,
  };
}

export function mapReviewRecordRow(row: ReviewRecordRow): ReviewRecord {
  return {
    taskId: row.taskId,
    diffSummary: parseStringArray(row.diffSummaryJson),
    riskNotes: parseStringArray(row.riskNotesJson),
    qualityGateIds: parseStringArray(row.qualityGateIdsJson),
    decision: row.decision,
  };
}

export async function readSelectedProjectRoom(projectId: string): Promise<SelectedProjectRoomRead | undefined> {
  initializeLocalDb();

  const projectRow = await getProjectById(projectId);
  if (!projectRow) {
    return undefined;
  }

  await seedDefaultQualityGateConfigsForProject(projectId);

  const [taskRows, allAgentSeatRows, buildCheckRows, taskEventRows, qualityGateConfigs] = await Promise.all([
    listTasksByProject(projectId),
    listAgentSeats(),
    listBuildChecksByProject(projectId),
    listTaskEventsByProject(projectId),
    listQualityGateConfigsForProject(projectId),
  ]);

  const assignedAgentSeatRows = allAgentSeatRows.filter((agentSeat) => {
    const currentProjectMatch = agentSeat.currentProjectId === projectId;
    const assignedTaskMatch = taskRows.some((task) => task.assignedSeatId === agentSeat.id);
    return currentProjectMatch || assignedTaskMatch;
  });

  return {
    project: mapProjectRow(projectRow, assignedAgentSeatRows),
    tasks: taskRows.map(mapTaskRow),
    agentSeats: assignedAgentSeatRows.map(mapAgentSeatRow),
    buildChecks: buildCheckRows.map(mapBuildCheckRow),
    taskEvents: [...taskEventRows].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(mapTaskEventRow),
    qualityGateConfigs,
  };
}

export async function readSelectedReviewRoom(taskId: string): Promise<SelectedReviewRoomRead | undefined> {
  initializeLocalDb();

  const taskRow = await getTaskById(taskId);
  if (!taskRow) {
    return undefined;
  }

  await seedDefaultQualityGateConfigsForProject(taskRow.projectId);

  const [reviewRow, taskEventRows, gitSnapshots, fileChanges, diffSummary, scopeCheck, qualityGateConfigs] = await Promise.all([
    getReviewRecordByTaskId(taskId),
    listTaskEventsByProject(taskRow.projectId),
    getLatestBeforeAfterSnapshotsForTask(taskId),
    readFileChangesForTask(taskId),
    readLatestDiffSummaryForTask(taskId),
    readLatestScopeCheckForTask(taskId),
    listQualityGateConfigsForProject(taskRow.projectId),
  ]);

  return {
    task: mapTaskRow(taskRow),
    review: reviewRow ? mapReviewRecordRow(reviewRow) : undefined,
    taskEvents: [...taskEventRows]
      .filter((event) => event.taskId === taskId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(mapTaskEventRow),
    gitSnapshots,
    fileChanges,
    diffSummary,
    scopeCheck,
    qualityGateConfigs,
  };
}
