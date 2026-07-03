import type {
  GitSnapshotKind,
  ProjectStatus,
  QualityGateRunStatus,
  ReviewDecision,
  TaskStatus,
} from "@/lib/types";
import type {
  CodexAuthCapability,
  CodexFailureCategory,
  CodexLastRunStatus,
  CodexRuntimeReadiness,
} from "@/lib/codex-cli/runtime-status";

export type ProjectHealth = "healthy" | "needs_setup" | "needs_review" | "blocked" | "unknown";

export type ProjectRecommendedNextAction =
  | "configure_approved_path"
  | "review_codex_runtime"
  | "run_quality_gates"
  | "review_task"
  | "open_project_room"
  | "check_archive"
  | "none";

export type ProjectApprovedPathSource = "approved_project_path" | "project_local_path" | "none";

export interface ProjectHealthApprovedPathSummary {
  configured: boolean;
  approved: boolean;
  localPath?: string;
  source: ProjectApprovedPathSource;
}

export interface ProjectHealthRuntimeSummary {
  readiness: CodexRuntimeReadiness;
  authCapability: CodexAuthCapability;
  lastRunStatus: CodexLastRunStatus;
  failureCategory?: CodexFailureCategory;
}

export type ProjectTaskStatusCounts = Record<TaskStatus, number>;

export interface ProjectHealthTaskSummary extends ProjectTaskStatusCounts {
  total: number;
  review: number;
}

export interface ProjectHealthReviewSummary {
  latestDecision?: ReviewDecision;
  latestDecisionAt?: string;
}

export interface ProjectHealthQualitySummary {
  configReady: boolean;
  latestRunStatus?: QualityGateRunStatus | "not_run";
  failedGateCount: number;
}

export interface ProjectHealthGitSummary {
  latestSnapshotKind?: GitSnapshotKind;
  isDirty?: boolean;
  changedFilesCount?: number;
}

export interface ProjectHealthBackupSummary {
  latestBackupAt?: string;
  backupCount: number;
}

export interface ProjectHealthArchiveSummary {
  recentActivityCount: number;
}

export interface ProjectHealthSummary {
  projectId: string;
  projectName: string;
  projectStatus: ProjectStatus;
  approvedPath: ProjectHealthApprovedPathSummary;
  codexRuntime: ProjectHealthRuntimeSummary;
  tasks: ProjectHealthTaskSummary;
  review: ProjectHealthReviewSummary;
  quality: ProjectHealthQualitySummary;
  git: ProjectHealthGitSummary;
  backup: ProjectHealthBackupSummary;
  archive: ProjectHealthArchiveSummary;
  health: ProjectHealth;
  recommendedNextAction: ProjectRecommendedNextAction;
}

export interface ProjectWorkspaceSummary {
  projectId: string;
  projectName: string;
  projectStatus: ProjectStatus;
  health: ProjectHealth;
  recommendedNextAction: ProjectRecommendedNextAction;
  approvedPathConfigured: boolean;
  approvedPathApproved: boolean;
  codexRuntimeReadiness: CodexRuntimeReadiness;
  runningTaskCount: number;
  reviewTaskCount: number;
  blockedTaskCount: number;
  failedGateCount: number;
  isGitDirty?: boolean;
  latestActivityAt?: string;
}
