import type { BuildStatus, EventTone, QualityGateRunStatus, ReviewDecision, ScopeCheckStatus, TaskStatus } from "@/lib/types";
import type { CodexLastRunStatus } from "@/lib/codex-cli/runtime-status";
import type { QualityGateOverallStatus } from "@/lib/quality-gates/quality-gate-summary-types";

export type TaskLifecycleStage =
  | "planned"
  | "draft"
  | "ready"
  | "queued"
  | "assigned"
  | "prompt_ready"
  | "prompt_prepared"
  | "running"
  | "run_completed"
  | "reviewing"
  | "waiting_for_review"
  | "revision_requested"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "blocked"
  | "done"
  | "paused"
  | "archived"
  | "unknown";

export type TaskLifecyclePhase = TaskLifecycleStage;

export type WorkflowNextAction =
  | "prepare_prompt"
  | "mark_prompt_ready"
  | "run_scoped_codex"
  | "inspect_output"
  | "inspect_git_evidence"
  | "run_quality_gates"
  | "review_decision"
  | "revise_task"
  | "close_task"
  | "configure_approved_path"
  | "check_codex_runtime"
  | "none";

export interface TaskLifecycleSummary {
  taskId: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  currentTaskStatus: TaskStatus;
  priority: "low" | "medium" | "high" | "critical";
  assignedSeatId?: string;
  lifecycleStage: TaskLifecycleStage;
  phase: TaskLifecycleStage;
  reviewDecision?: ReviewDecision;
  codexFailureCategory?: string;
  scopeGuardStatus?: ScopeCheckStatus;
  qualityGateSummaryStatus: QualityGateOverallStatus;
  qualityOverallStatus: QualityGateOverallStatus;
  latestBuildStatus?: BuildStatus;
  scopeStatus?: ScopeCheckStatus;
  codexLastRunStatus: CodexLastRunStatus;
  eventCount: number;
  buildCheckCount: number;
  failedBuildCheckCount: number;
  failedQualityGateCount: number;
  blockedQualityGateCount: number;
  changedFileCount: number;
  diffFileCount?: number;
  lastEventAt?: string;
  lastEventTone?: EventTone;
  lastEventMessage?: string;
  recommendedNextAction: WorkflowNextAction;
  timelineEvents: number;
  warnings: string[];
  summaryMessage: string;
}

export type WorkflowTimelineItemKind =
  | "task_event"
  | "build_check"
  | "quality_gate_run"
  | "review_decision"
  | "diff_summary"
  | "scope_check";

export interface WorkflowTimelineItem {
  id: string;
  taskId: string;
  projectId: string;
  kind: WorkflowTimelineItemKind;
  tone: EventTone;
  label: string;
  detail: string;
  status?: string;
  createdAt: string;
}

export interface WorkflowTimeline {
  taskId: string;
  projectId: string;
  source: "local_sqlite_records";
  items: WorkflowTimelineItem[];
  latestItemAt?: string;
  hasBlockingItem: boolean;
}
