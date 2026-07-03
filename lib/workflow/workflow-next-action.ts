import type { DiffSummary, QualityGateRun, ReviewRecord, ScopeCheck, Task } from "@/lib/types";
import type { QualityGateSummary } from "@/lib/quality-gates/quality-gate-summary-types";
import type { CodexRunHistorySummary } from "./codex-run-history";
import type { WorkflowNextAction } from "./task-lifecycle-types";

export interface DetermineWorkflowNextActionInput {
  task: Task;
  review?: ReviewRecord;
  scopeCheck?: ScopeCheck;
  diffSummary?: DiffSummary;
  qualitySummary?: QualityGateSummary;
  qualityGateRuns?: QualityGateRun[];
  codexRunHistory?: CodexRunHistorySummary;
}

export function determineWorkflowNextAction(input: DetermineWorkflowNextActionInput): WorkflowNextAction {
  if (input.task.status === "blocked" || input.scopeCheck?.status === "blocked" || input.codexRunHistory?.lastRun.status === "blocked") {
    return "inspect_output";
  }

  if (input.review?.decision === "revision_requested" || input.review?.decision === "rejected") {
    return "revise_task";
  }

  if (input.qualitySummary?.overallStatus === "failed" || input.qualitySummary?.overallStatus === "blocked") {
    return "run_quality_gates";
  }

  if (input.qualityGateRuns?.some((run) => run.status === "failed" || run.status === "blocked")) {
    return "run_quality_gates";
  }

  if (input.task.status === "waiting_review" || input.review?.decision === "pending") {
    return "review_decision";
  }

  if (input.task.status === "running") {
    return "inspect_output";
  }

  if (input.task.status === "ready") {
    return "run_scoped_codex";
  }

  if (input.task.status === "done" && input.review?.decision === "approved") {
    return "none";
  }

  if (input.task.status === "done") {
    return "close_task";
  }

  if (input.task.status === "backlog") {
    return "prepare_prompt";
  }

  return input.diffSummary ? "inspect_git_evidence" : "prepare_prompt";
}
