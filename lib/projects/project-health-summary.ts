import { summarizeCodexLastRun } from "@/lib/codex-cli/runtime-status";
import type {
  CodexAuthCapability,
  CodexFailureCategory,
  CodexRuntimeReadiness,
} from "@/lib/codex-cli/runtime-status";
import { summarizeQualityGates } from "@/lib/quality-gates/quality-gate-summary";
import type {
  ApprovedProjectPath,
  BackupRecord,
  GitSnapshot,
  Project,
  QualityGateConfig,
  QualityGateRun,
  ReviewDecision,
  Task,
  TaskEvent,
  TaskStatus,
} from "@/lib/types";
import type {
  ProjectHealth,
  ProjectHealthApprovedPathSummary,
  ProjectHealthSummary,
  ProjectRecommendedNextAction,
} from "./project-health-types";

export interface ProjectHealthReviewRecordInput {
  taskId: string;
  decision: ReviewDecision;
  createdAt?: string;
}

export interface ProjectHealthSummaryInput {
  project: Project;
  approvedProjectPath?: ApprovedProjectPath;
  tasks: Task[];
  taskEvents: TaskEvent[];
  reviewRecords: ProjectHealthReviewRecordInput[];
  qualityGateConfigs: QualityGateConfig[];
  qualityGateRuns: QualityGateRun[];
  gitSnapshots: GitSnapshot[];
  backupRecords: BackupRecord[];
}

const taskStatuses: TaskStatus[] = ["backlog", "ready", "running", "waiting_review", "blocked", "done"];

function latestByTime<T>(items: T[], getTime: (item: T) => string | undefined): T | undefined {
  return [...items]
    .filter((item) => Boolean(getTime(item)))
    .sort((a, b) => getTime(b)!.localeCompare(getTime(a)!))[0];
}

function runTime(run: QualityGateRun): string {
  return run.endedAt ?? run.startedAt ?? run.createdAt;
}

function summarizeApprovedPath(input: ProjectHealthSummaryInput): ProjectHealthApprovedPathSummary {
  if (input.approvedProjectPath) {
    return {
      configured: Boolean(input.approvedProjectPath.localPath.trim()),
      approved: input.approvedProjectPath.approved,
      localPath: input.approvedProjectPath.localPath,
      source: "approved_project_path",
    };
  }

  const projectPath = input.project.localPathPlaceholder.trim();
  if (projectPath && projectPath !== "Local path not set") {
    return {
      configured: true,
      approved: false,
      localPath: projectPath,
      source: "project_local_path",
    };
  }

  return {
    configured: false,
    approved: false,
    source: "none",
  };
}

function summarizeRuntime(input: ProjectHealthSummaryInput): {
  readiness: CodexRuntimeReadiness;
  authCapability: CodexAuthCapability;
  lastRunStatus: ReturnType<typeof summarizeCodexLastRun>["status"];
  failureCategory?: CodexFailureCategory;
} {
  const approvedPath = summarizeApprovedPath(input);
  const lastRun = summarizeCodexLastRun({ events: input.taskEvents, projectId: input.project.id });

  if (!approvedPath.approved) {
    return {
      readiness: "blocked_missing_approved_path",
      authCapability: "not_checked",
      lastRunStatus: lastRun.status,
      failureCategory: lastRun.failureCategory ?? "missing_approved_path",
    };
  }

  if (lastRun.status === "failed" || lastRun.status === "timed_out") {
    return {
      readiness: "failed_last_run",
      authCapability: "not_checked",
      lastRunStatus: lastRun.status,
      failureCategory: lastRun.failureCategory,
    };
  }

  if (lastRun.status === "blocked") {
    return {
      readiness: lastRun.failureCategory === "missing_approved_path" ? "blocked_missing_approved_path" : "blocked_policy",
      authCapability: "not_checked",
      lastRunStatus: lastRun.status,
      failureCategory: lastRun.failureCategory ?? "policy_blocked",
    };
  }

  return {
    readiness: "unknown",
    authCapability: "not_checked",
    lastRunStatus: lastRun.status,
    failureCategory: lastRun.failureCategory,
  };
}

function summarizeTasks(tasks: Task[]): ProjectHealthSummary["tasks"] {
  const counts = Object.fromEntries(taskStatuses.map((status) => [status, 0])) as Record<TaskStatus, number>;
  for (const task of tasks) {
    counts[task.status] += 1;
  }

  return {
    ...counts,
    total: tasks.length,
    review: counts.waiting_review,
  };
}

function determineHealth(input: {
  projectStatus: ProjectHealthSummary["projectStatus"];
  approvedPath: ProjectHealthSummary["approvedPath"];
  runtime: ProjectHealthSummary["codexRuntime"];
  tasks: ProjectHealthSummary["tasks"];
  quality: ProjectHealthSummary["quality"];
  review: ProjectHealthSummary["review"];
}): ProjectHealth {
  if (!input.approvedPath.approved || !input.quality.configReady) {
    return "needs_setup";
  }

  if (
    input.projectStatus === "blocked" ||
    input.tasks.blocked > 0 ||
    input.runtime.readiness.startsWith("blocked_") ||
    input.runtime.readiness === "failed_last_run" ||
    input.quality.latestRunStatus === "blocked" ||
    input.quality.latestRunStatus === "failed"
  ) {
    return "blocked";
  }

  if (
    input.tasks.review > 0 ||
    input.projectStatus === "reviewing" ||
    input.review.latestDecision === "pending" ||
    input.review.latestDecision === "revision_requested"
  ) {
    return "needs_review";
  }

  if (input.projectStatus === "active" || input.projectStatus === "quiet") {
    return "healthy";
  }

  return "unknown";
}

function recommendNextAction(summary: Omit<ProjectHealthSummary, "health" | "recommendedNextAction">): ProjectRecommendedNextAction {
  if (!summary.approvedPath.approved) {
    return "configure_approved_path";
  }

  if (summary.codexRuntime.readiness.startsWith("blocked_") || summary.codexRuntime.readiness === "failed_last_run") {
    return "review_codex_runtime";
  }

  if (!summary.quality.configReady || summary.quality.latestRunStatus === "failed" || summary.quality.latestRunStatus === "blocked" || summary.quality.latestRunStatus === "not_run") {
    return "run_quality_gates";
  }

  if (summary.tasks.review > 0 || summary.review.latestDecision === "pending" || summary.review.latestDecision === "revision_requested") {
    return "review_task";
  }

  if (summary.archive.recentActivityCount === 0 && summary.backup.backupCount === 0) {
    return "check_archive";
  }

  if (
    summary.projectStatus === "active" &&
    summary.tasks.blocked === 0 &&
    summary.tasks.review === 0 &&
    summary.quality.failedGateCount === 0
  ) {
    return "none";
  }

  return "open_project_room";
}

export function summarizeProjectHealth(input: ProjectHealthSummaryInput): ProjectHealthSummary {
  const approvedPath = summarizeApprovedPath(input);
  const codexRuntime = summarizeRuntime(input);
  const tasks = summarizeTasks(input.tasks);
  const latestReview = latestByTime(input.reviewRecords, (review) => review.createdAt);
  const qualitySummary = summarizeQualityGates(input.qualityGateConfigs, input.qualityGateRuns);
  const latestRun = latestByTime(input.qualityGateRuns, runTime);
  const latestSnapshot = latestByTime(input.gitSnapshots, (snapshot) => snapshot.createdAt);
  const latestBackup = latestByTime(input.backupRecords, (backup) => backup.createdAt);
  const archiveActivityCount =
    input.taskEvents.length +
    input.reviewRecords.length +
    input.qualityGateRuns.length +
    input.gitSnapshots.length;

  const baseSummary = {
    projectId: input.project.id,
    projectName: input.project.name,
    projectStatus: input.project.status,
    approvedPath,
    codexRuntime,
    tasks,
    review: {
      latestDecision: latestReview?.decision,
      latestDecisionAt: latestReview?.createdAt,
    },
    quality: {
      configReady: input.qualityGateConfigs.some((config) => config.enabled && config.allowlisted),
      latestRunStatus: latestRun?.status ?? (input.qualityGateConfigs.length ? "not_run" : undefined),
      failedGateCount: qualitySummary.failedCount,
    },
    git: {
      latestSnapshotKind: latestSnapshot?.snapshotKind,
      isDirty: latestSnapshot?.isDirty,
      changedFilesCount: latestSnapshot?.statusSummary.changedFileCount,
    },
    backup: {
      latestBackupAt: latestBackup?.createdAt,
      backupCount: input.backupRecords.length,
    },
    archive: {
      recentActivityCount: archiveActivityCount,
    },
  } satisfies Omit<ProjectHealthSummary, "health" | "recommendedNextAction">;

  const health = determineHealth({
    projectStatus: baseSummary.projectStatus,
    approvedPath: baseSummary.approvedPath,
    runtime: baseSummary.codexRuntime,
    tasks: baseSummary.tasks,
    quality: baseSummary.quality,
    review: baseSummary.review,
  });

  const summary = {
    ...baseSummary,
    health,
    recommendedNextAction: "open_project_room",
  } satisfies ProjectHealthSummary;

  return {
    ...summary,
    recommendedNextAction: recommendNextAction(summary),
  };
}

export { summarizeProjectWorkspace } from "./project-workspace-summary";
