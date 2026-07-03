import type { AgentStatus, BuildStatus, ReviewDecision, TaskStatus } from "@/lib/types";
import type { WorkflowNextAction } from "@/lib/workflow/task-lifecycle-types";

export type AgentWorkflowActivity = "idle" | "active" | "checking" | "reviewing" | "blocked" | "done";
export type AgentWorkflowRisk = "none" | "attention" | "blocked";
export type AgentVisualState =
  | "idle"
  | "ready"
  | "running"
  | "reviewing"
  | "revision_requested"
  | "blocked"
  | "failed"
  | "done"
  | "auth_unknown"
  | "missing_approved_path"
  | "unknown";

export interface AgentSeatWorkflowState {
  seatId: string;
  name: string;
  status: AgentStatus;
  state: AgentVisualState;
  projectId?: string;
  taskId?: string;
  focus: string;
  currentTaskTitle?: string;
  currentTaskStatus?: TaskStatus;
  currentTaskPriority?: "low" | "medium" | "high" | "critical";
  currentRunId?: string;
  lastPromptVersionId?: string;
  lastActivityAt?: string;
  manualNextAction: WorkflowNextAction;
  safetyBoundary: string;
  activity: AgentWorkflowActivity;
  visualState: AgentVisualState;
  risk: AgentWorkflowRisk;
  reviewDecision?: ReviewDecision;
  latestBuildStatus?: BuildStatus;
  failedBuildCheckCount: number;
  pendingBuildCheckCount: number;
  eventCount: number;
  lastEventAt?: string;
  lastEventMessage?: string;
}

export interface AgentWorkflowSummary {
  projectId?: string;
  taskId?: string;
  source: "local_sqlite_records";
  seats: AgentSeatWorkflowState[];
  activeSeatCount: number;
  blockedSeatCount: number;
  waitingReviewSeatCount: number;
  runningTaskCount: number;
  reviewTaskCount: number;
  failedBuildCheckCount: number;
  recentEventCount: number;
  summaryMessage: string;
}
