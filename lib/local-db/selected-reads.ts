import type { AgentSeat, ApprovedProjectPath, BuildCheck, DiffSummary, FileChange, GitSnapshot, Project, QualityGateConfig, QualityGateRun, ReviewRecord, ScopeCheck, Task, TaskEvent } from "@/lib/types";
import { getPrimaryApprovedPathForProject, listApprovedProjectPathsForProject } from "./operations/approved-project-paths";
import { listBackupRecords } from "./operations/backup-records";
import { readLatestDiffSummaryForTask } from "./operations/diff-summaries";
import { readFileChangesForTask } from "./operations/file-changes";
import { getLatestBeforeAfterSnapshotsForTask, listGitSnapshots, mapGitSnapshotRow } from "./operations/git-snapshots";
import { listQualityGateConfigsForProject, seedDefaultQualityGateConfigsForProject } from "./operations/quality-gate-configs";
import { getLatestQualityGateRunsForTask, listQualityGateRuns, mapQualityGateRunRow } from "./operations/quality-gate-runs";
import { readLatestScopeCheckForTask } from "./operations/scope-checks";
import { initializeLocalDb } from "./init";
import { listAgentSeats } from "./repositories/agent-seats";
import type { AgentSeatRow } from "./repositories/agent-seats";
import { listBuildChecksByProject } from "./repositories/build-checks";
import type { BuildCheckRow } from "./repositories/build-checks";
import { getProjectById, listProjects } from "./repositories/projects";
import type { ProjectRow } from "./repositories/projects";
import { getReviewRecordByTaskId, listReviewRecords } from "./repositories/review-records";
import type { ReviewRecordRow } from "./repositories/review-records";
import { listTaskEventsByProject } from "./repositories/task-events";
import type { TaskEventRow } from "./repositories/task-events";
import { getTaskById, listTasksByProject } from "./repositories/tasks";
import type { TaskRow } from "./repositories/tasks";
import { summarizeProjectHealth } from "@/lib/projects/project-health-summary";
import { summarizeProjectWorkspace } from "@/lib/projects/project-workspace-summary";
import type { ProjectHealthSummary, ProjectWorkspaceSummary } from "@/lib/projects/project-health-types";
import { summarizeAgentWorkflowForProject, summarizeAgentWorkflowForTask } from "@/lib/agents/agent-workflow-summary";
import type { AgentWorkflowSummary } from "@/lib/agents/agent-workflow-types";
import { summarizeTaskLifecycle } from "@/lib/workflow/task-lifecycle-summary";
import type { TaskLifecycleSummary, WorkflowTimeline } from "@/lib/workflow/task-lifecycle-types";
import { buildWorkflowTimeline } from "@/lib/workflow/workflow-timeline";

export interface SelectedProjectRoomRead {
  project: Project;
  tasks: Task[];
  agentSeats: AgentSeat[];
  buildChecks: BuildCheck[];
  taskEvents: TaskEvent[];
  qualityGateConfigs: QualityGateConfig[];
  approvedProjectPaths: ApprovedProjectPath[];
  primaryApprovedProjectPath?: ApprovedProjectPath;
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
  qualityGateRuns: QualityGateRun[];
  approvedProjectPath?: ApprovedProjectPath;
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

  const [taskRows, allAgentSeatRows, buildCheckRows, taskEventRows, qualityGateConfigs, approvedProjectPaths, primaryApprovedProjectPath] = await Promise.all([
    listTasksByProject(projectId),
    listAgentSeats(),
    listBuildChecksByProject(projectId),
    listTaskEventsByProject(projectId),
    listQualityGateConfigsForProject(projectId),
    listApprovedProjectPathsForProject(projectId),
    getPrimaryApprovedPathForProject(projectId),
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
    approvedProjectPaths,
    primaryApprovedProjectPath,
  };
}

export async function readSelectedReviewRoom(taskId: string): Promise<SelectedReviewRoomRead | undefined> {
  initializeLocalDb();

  const taskRow = await getTaskById(taskId);
  if (!taskRow) {
    return undefined;
  }

  await seedDefaultQualityGateConfigsForProject(taskRow.projectId);

  const [reviewRow, taskEventRows, gitSnapshots, fileChanges, diffSummary, scopeCheck, qualityGateConfigs, qualityGateRuns, approvedProjectPath] = await Promise.all([
    getReviewRecordByTaskId(taskId),
    listTaskEventsByProject(taskRow.projectId),
    getLatestBeforeAfterSnapshotsForTask(taskId),
    readFileChangesForTask(taskId),
    readLatestDiffSummaryForTask(taskId),
    readLatestScopeCheckForTask(taskId),
    listQualityGateConfigsForProject(taskRow.projectId),
    getLatestQualityGateRunsForTask(taskId),
    getPrimaryApprovedPathForProject(taskRow.projectId),
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
    qualityGateRuns,
    approvedProjectPath,
  };
}

function latestProjectActivity(row: ProjectRow): string {
  return row.updatedAt || row.createdAt;
}

async function buildProjectHealthSummary(projectRow: ProjectRow): Promise<ProjectHealthSummary> {
  const [taskRows, allAgentSeatRows, taskEventRows, reviewRows, qualityGateConfigs, qualityGateRunRows, gitSnapshotRows, approvedProjectPath, backupRecords] = await Promise.all([
    listTasksByProject(projectRow.id),
    listAgentSeats(),
    listTaskEventsByProject(projectRow.id),
    listReviewRecords(),
    listQualityGateConfigsForProject(projectRow.id),
    listQualityGateRuns(),
    listGitSnapshots(),
    getPrimaryApprovedPathForProject(projectRow.id),
    listBackupRecords(),
  ]);

  const taskIds = new Set(taskRows.map((task) => task.id));
  const assignedAgentSeatRows = allAgentSeatRows.filter((agentSeat) => {
    const currentProjectMatch = agentSeat.currentProjectId === projectRow.id;
    const assignedTaskMatch = taskRows.some((task) => task.assignedSeatId === agentSeat.id);
    return currentProjectMatch || assignedTaskMatch;
  });

  return summarizeProjectHealth({
    project: mapProjectRow(projectRow, assignedAgentSeatRows),
    approvedProjectPath,
    tasks: taskRows.map(mapTaskRow),
    taskEvents: [...taskEventRows].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(mapTaskEventRow),
    reviewRecords: reviewRows
      .filter((review) => taskIds.has(review.taskId))
      .map((review) => ({
        taskId: review.taskId,
        decision: review.decision,
        createdAt: review.createdAt,
      })),
    qualityGateConfigs,
    qualityGateRuns: qualityGateRunRows
      .filter((run) => run.projectId === projectRow.id)
      .map(mapQualityGateRunRow),
    gitSnapshots: gitSnapshotRows
      .filter((snapshot) => snapshot.projectId === projectRow.id)
      .map(mapGitSnapshotRow),
    backupRecords,
  });
}

export async function getProjectHealthSummaryForProject(projectId: string): Promise<ProjectHealthSummary | undefined> {
  initializeLocalDb();

  const projectRow = await getProjectById(projectId);
  if (!projectRow) {
    return undefined;
  }

  return buildProjectHealthSummary(projectRow);
}

export async function getAllProjectWorkspaceSummaries(): Promise<ProjectWorkspaceSummary[]> {
  initializeLocalDb();

  const projectRows = await listProjects();
  const summaries = await Promise.all(
    [...projectRows]
      .sort((a, b) => latestProjectActivity(b).localeCompare(latestProjectActivity(a)))
      .map(async (projectRow) => summarizeProjectWorkspace(await buildProjectHealthSummary(projectRow))),
  );

  return summaries;
}

export async function getRecentProjects(limit = 5): Promise<ProjectWorkspaceSummary[]> {
  const summaries = await getAllProjectWorkspaceSummaries();
  return summaries.slice(0, Math.max(0, limit));
}

export async function getAgentWorkflowSummaryForProject(projectId: string): Promise<AgentWorkflowSummary | undefined> {
  initializeLocalDb();

  const projectRow = await getProjectById(projectId);
  if (!projectRow) {
    return undefined;
  }

  const [taskRows, agentSeatRows, taskEventRows, buildCheckRows, reviewRows] = await Promise.all([
    listTasksByProject(projectId),
    listAgentSeats(),
    listTaskEventsByProject(projectId),
    listBuildChecksByProject(projectId),
    listReviewRecords(),
  ]);
  const taskIds = new Set(taskRows.map((task) => task.id));

  return summarizeAgentWorkflowForProject({
    projectId,
    tasks: taskRows.map(mapTaskRow),
    agentSeats: agentSeatRows.map(mapAgentSeatRow),
    taskEvents: [...taskEventRows].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(mapTaskEventRow),
    buildChecks: buildCheckRows.map(mapBuildCheckRow),
    reviewRecords: reviewRows.filter((review) => taskIds.has(review.taskId)).map(mapReviewRecordRow),
  });
}

export async function getAgentWorkflowSummaryForTask(taskId: string): Promise<AgentWorkflowSummary | undefined> {
  initializeLocalDb();

  const taskRow = await getTaskById(taskId);
  if (!taskRow) {
    return undefined;
  }

  const [agentSeatRows, taskEventRows, buildCheckRows, reviewRow] = await Promise.all([
    listAgentSeats(),
    listTaskEventsByProject(taskRow.projectId),
    listBuildChecksByProject(taskRow.projectId),
    getReviewRecordByTaskId(taskId),
  ]);

  return summarizeAgentWorkflowForTask({
    task: mapTaskRow(taskRow),
    agentSeats: agentSeatRows.map(mapAgentSeatRow),
    taskEvents: [...taskEventRows].filter((event) => event.taskId === taskId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(mapTaskEventRow),
    buildChecks: buildCheckRows.filter((check) => check.taskId === taskId).map(mapBuildCheckRow),
    reviewRecords: reviewRow ? [mapReviewRecordRow(reviewRow)] : [],
  });
}

export async function getTaskLifecycleSummary(taskId: string): Promise<TaskLifecycleSummary | undefined> {
  initializeLocalDb();

  const taskRow = await getTaskById(taskId);
  if (!taskRow) {
    return undefined;
  }

  const [reviewRow, taskEventRows, buildCheckRows, diffSummary, scopeCheck, qualityGateConfigs, qualityGateRunRows] = await Promise.all([
    getReviewRecordByTaskId(taskId),
    listTaskEventsByProject(taskRow.projectId),
    listBuildChecksByProject(taskRow.projectId),
    readLatestDiffSummaryForTask(taskId),
    readLatestScopeCheckForTask(taskId),
    listQualityGateConfigsForProject(taskRow.projectId),
    listQualityGateRuns(),
  ]);

  return summarizeTaskLifecycle({
    task: mapTaskRow(taskRow),
    taskEvents: [...taskEventRows].filter((event) => event.taskId === taskId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(mapTaskEventRow),
    buildChecks: buildCheckRows.filter((check) => check.taskId === taskId).map(mapBuildCheckRow),
    review: reviewRow ? mapReviewRecordRow(reviewRow) : undefined,
    scopeCheck,
    diffSummary,
    qualityGateConfigs,
    qualityGateRuns: qualityGateRunRows.filter((run) => run.taskId === taskId).map(mapQualityGateRunRow),
  });
}

export async function getWorkflowTimelineForTask(taskId: string): Promise<WorkflowTimeline | undefined> {
  initializeLocalDb();

  const taskRow = await getTaskById(taskId);
  if (!taskRow) {
    return undefined;
  }

  const [reviewRow, taskEventRows, buildCheckRows, qualityGateRunRows, diffSummary, scopeCheck] = await Promise.all([
    getReviewRecordByTaskId(taskId),
    listTaskEventsByProject(taskRow.projectId),
    listBuildChecksByProject(taskRow.projectId),
    listQualityGateRuns(),
    readLatestDiffSummaryForTask(taskId),
    readLatestScopeCheckForTask(taskId),
  ]);

  return buildWorkflowTimeline({
    task: mapTaskRow(taskRow),
    taskEvents: [...taskEventRows].filter((event) => event.taskId === taskId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(mapTaskEventRow),
    buildChecks: buildCheckRows.filter((check) => check.taskId === taskId).map(mapBuildCheckRow),
    qualityGateRuns: qualityGateRunRows.filter((run) => run.taskId === taskId).map(mapQualityGateRunRow),
    review: reviewRow
      ? {
          taskId: reviewRow.taskId,
          projectId: taskRow.projectId,
          decision: reviewRow.decision,
          createdAt: reviewRow.createdAt,
        }
      : undefined,
    diffSummary,
    scopeCheck,
  });
}
