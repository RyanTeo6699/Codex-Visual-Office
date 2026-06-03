import type { ReviewReadiness, ReviewReadinessInput, ReviewReadinessSummary } from "./readiness-types";

const labels: Record<ReviewReadiness, string> = {
  not_ready: "Not Ready",
  ready_for_review: "Ready for Review",
  blocked_by_scope: "Blocked by Scope",
  blocked_by_quality: "Blocked by Quality",
  runner_not_completed: "Runner Not Completed",
  approved: "Approved",
  revision_requested: "Revision Requested",
  rejected: "Rejected",
  mixed: "Mixed",
};

function determineReviewReadiness(input: ReviewReadinessInput): ReviewReadiness {
  if (input.reviewDecision === "approved") {
    return "approved";
  }

  if (input.reviewDecision === "revision_requested") {
    return "revision_requested";
  }

  if (input.reviewDecision === "rejected") {
    return "rejected";
  }

  if (input.scopeCheck?.status === "blocked") {
    return "blocked_by_scope";
  }

  if (input.qualityGateSummary.overallStatus === "failed" || input.qualityGateSummary.overallStatus === "blocked") {
    return "blocked_by_quality";
  }

  if (input.runnerStatus !== "completed") {
    return "runner_not_completed";
  }

  const scopeAcceptable = !input.scopeCheck || input.scopeCheck.status === "pass" || input.scopeCheck.status === "warning";
  const qualityAcceptable = input.qualityGateSummary.overallStatus === "passed" || input.qualityGateSummary.overallStatus === "mixed";
  if (scopeAcceptable && qualityAcceptable) {
    return "ready_for_review";
  }

  if (!input.diffSummaryAvailable && input.changedFilesCount === 0) {
    return "not_ready";
  }

  return "mixed";
}

function messageFor(readiness: ReviewReadiness): string {
  if (readiness === "approved") {
    return "The human review decision is approved.";
  }

  if (readiness === "revision_requested") {
    return "The human review decision asks for revision.";
  }

  if (readiness === "rejected") {
    return "The human review decision rejected the current result.";
  }

  if (readiness === "blocked_by_scope") {
    return "Scope Guard is blocked. Review carefully before approving.";
  }

  if (readiness === "blocked_by_quality") {
    return "Quality gates failed or blocked. Review output before approving.";
  }

  if (readiness === "runner_not_completed") {
    return "Runner has not completed yet.";
  }

  if (readiness === "ready_for_review") {
    return "Evidence is ready for human review.";
  }

  if (readiness === "not_ready") {
    return "Evidence is not ready yet.";
  }

  return "Review evidence has mixed signals.";
}

function warningsFor(input: ReviewReadinessInput): string[] {
  const warnings: string[] = [];
  if (input.scopeCheck?.status === "blocked") {
    warnings.push("Scope Guard blocked. This is still a path-level guard, not semantic code review.");
  } else if (input.scopeCheck?.status === "warning") {
    warnings.push("Scope Guard warning requires human attention.");
  }

  if (input.qualityGateSummary.overallStatus === "failed" || input.qualityGateSummary.overallStatus === "blocked") {
    warnings.push("Quality gates did not pass.");
  }

  if (input.runnerStatus !== "completed") {
    warnings.push("Scoped runner is not completed.");
  }

  if (!input.diffSummaryAvailable) {
    warnings.push("Diff summary is not available.");
  }

  return warnings;
}

export function evaluateReviewReadiness(input: ReviewReadinessInput): ReviewReadinessSummary {
  const reviewReadiness = determineReviewReadiness(input);
  return {
    reviewReadiness,
    label: labels[reviewReadiness],
    message: messageFor(reviewReadiness),
    warnings: warningsFor(input),
    signals: {
      taskStatus: input.taskStatus,
      reviewDecision: input.reviewDecision,
      runnerStatus: input.runnerStatus ?? "not_available",
      scopeStatus: input.scopeCheck?.status ?? "not_available",
      changedFilesCount: input.changedFilesCount,
      diffSummaryAvailable: input.diffSummaryAvailable,
      qualityStatus: input.qualityGateSummary.overallStatus,
    },
  };
}
