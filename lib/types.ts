export type ProjectStatus = "active" | "quiet" | "attention" | "reviewing" | "blocked";
export type TaskStatus = "backlog" | "ready" | "running" | "waiting_review" | "blocked" | "done";
export type AgentStatus =
  | "idle"
  | "reading_repo"
  | "planning"
  | "editing"
  | "running_checks"
  | "build_failed"
  | "fixing"
  | "waiting_review"
  | "done"
  | "blocked";
export type BuildStatus = "pending" | "running" | "passed" | "failed" | "skipped";
export type EventTone = "info" | "success" | "warning" | "danger";
export type ReviewDecision = "pending" | "approved" | "rejected" | "revision_requested";
export type GitSnapshotKind = "before_runner" | "after_runner" | "manual";
export type FileChangeStatus = "modified" | "added" | "deleted" | "renamed" | "copied" | "unmerged" | "unknown";
export type ScopeCheckStatus = "pass" | "warning" | "blocked";
export type QualityGateCommandKey = "npm_typecheck" | "npm_build" | "npm_lint" | "npm_test" | "npm_run_test" | "git_diff_check";
export type QualityGateRunStatus = "pending" | "running" | "passed" | "failed" | "skipped" | "blocked";
export type QualityGateEventType =
  | "quality_gate_queued"
  | "quality_gate_started"
  | "quality_gate_passed"
  | "quality_gate_failed"
  | "quality_gate_skipped"
  | "quality_gate_blocked";

export interface Project {
  id: string;
  name: string;
  phase: string;
  status: ProjectStatus;
  localPathPlaceholder: string;
  summary: string;
  accent: "cyan" | "teal" | "amber" | "red" | "violet";
  agentSeatIds: string[];
}

export interface AgentSeat {
  id: string;
  name: string;
  status: AgentStatus;
  projectId: string;
  taskId?: string;
  focus: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  agentSeatId?: string;
  acceptanceCriteria: string[];
  forbiddenScope: string[];
  changedFiles: string[];
}

export interface BuildCheck {
  id: string;
  projectId: string;
  taskId?: string;
  label: string;
  status: BuildStatus;
  detail: string;
}

export interface TaskEvent {
  id: string;
  projectId: string;
  taskId?: string;
  agentSeatId?: string;
  time: string;
  tone: EventTone;
  message: string;
  payload?: Record<string, unknown>;
}

export interface GitSnapshot {
  id: string;
  taskId: string;
  projectId: string;
  snapshotKind: GitSnapshotKind;
  branch: string;
  headSha: string;
  repoRoot: string;
  porcelainStatus: string;
  isDirty: boolean;
  statusSummary: {
    changedFileCount: number;
    stagedCount: number;
    unstagedCount: number;
    untrackedCount: number;
  };
  createdAt: string;
}

export interface FileChange {
  id: string;
  taskId: string;
  projectId: string;
  gitSnapshotId?: string;
  changeStatus: FileChangeStatus;
  rawStatus: string;
  filePath: string;
  previousFilePath?: string;
  source: "git_diff_name_status";
  createdAt: string;
}

export interface DiffSummaryFile {
  filePath: string;
  additions?: number;
  deletions?: number;
  binary: boolean;
  rawLine: string;
}

export interface DiffSummary {
  id: string;
  taskId: string;
  projectId: string;
  gitSnapshotId?: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  numstat: DiffSummaryFile[];
  statSummary: string;
  stdoutTruncated: boolean;
  numstatTruncated: boolean;
  source: "git_diff_stat_numstat";
  createdAt: string;
}

export interface ScopeCheckRuleResult {
  rule: string;
  parsed: boolean;
  category: "supabase" | "auth" | "payment" | "deploy" | "generic" | "unknown";
  matchStrength: "none" | "weak" | "strong";
  status: ScopeCheckStatus;
  matchedFiles: string[];
  reason: string;
}

export interface ScopeCheck {
  id: string;
  taskId: string;
  projectId: string;
  status: ScopeCheckStatus;
  forbiddenScope: string[];
  matchedFiles: string[];
  unmatchedFiles: string[];
  ruleResults: ScopeCheckRuleResult[];
  reason: string;
  checkSource: "path_level_forbidden_scope";
  createdAt: string;
}

export interface QualityGateConfig {
  id: string;
  projectId: string;
  name: string;
  commandKey: QualityGateCommandKey;
  command: string;
  enabled: boolean;
  allowlisted: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface QualityGateRun {
  id: string;
  taskId: string;
  projectId: string;
  configId: string;
  commandKey: QualityGateCommandKey;
  command: string;
  status: QualityGateRunStatus;
  exitCode?: number;
  durationMs?: number;
  stdoutPreview: string;
  stderrPreview: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
  skippedReason?: string;
  failedReason?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface QualityGateEvent {
  id: string;
  runId: string;
  taskId: string;
  projectId: string;
  eventType: QualityGateEventType;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface ReviewRecord {
  taskId: string;
  diffSummary: string[];
  riskNotes: string[];
  qualityGateIds: string[];
  decision: ReviewDecision;
}
