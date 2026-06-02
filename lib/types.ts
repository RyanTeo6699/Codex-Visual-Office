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

export interface ReviewRecord {
  taskId: string;
  diffSummary: string[];
  riskNotes: string[];
  qualityGateIds: string[];
  decision: ReviewDecision;
}
