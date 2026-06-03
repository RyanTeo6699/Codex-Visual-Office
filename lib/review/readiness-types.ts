import type { QualityGateSummary } from "@/lib/quality-gates/quality-gate-summary-types";
import type { ReviewDecision, ScopeCheck, TaskStatus } from "@/lib/types";

export type ReviewReadiness =
  | "not_ready"
  | "ready_for_review"
  | "blocked_by_scope"
  | "blocked_by_quality"
  | "runner_not_completed"
  | "approved"
  | "revision_requested"
  | "rejected"
  | "mixed";

export interface ReviewReadinessInput {
  taskStatus: TaskStatus;
  reviewDecision: ReviewDecision;
  runnerStatus?: "completed" | "failed" | "blocked" | "running";
  scopeCheck?: ScopeCheck;
  changedFilesCount: number;
  diffSummaryAvailable: boolean;
  qualityGateSummary: QualityGateSummary;
}

export interface ReviewReadinessSummary {
  reviewReadiness: ReviewReadiness;
  label: string;
  message: string;
  warnings: string[];
  signals: {
    taskStatus: TaskStatus;
    reviewDecision: ReviewDecision;
    runnerStatus: string;
    scopeStatus: string;
    changedFilesCount: number;
    diffSummaryAvailable: boolean;
    qualityStatus: QualityGateSummary["overallStatus"];
  };
}
