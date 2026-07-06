import type { BetaFeedbackRecord, BetaIssueRecord, BetaTesterRecord } from "@/lib/types";
import type { BetaIntakeSummary } from "./beta-intake-types";

const severityRank: Record<string, number> = {
  pending: 0,
  p3: 1,
  p2: 2,
  p1: 3,
  p0: 4,
};

function latestIso(values: Array<string | undefined>): string | undefined {
  return values.filter(Boolean).sort().at(-1);
}

export function summarizeBetaIntake(input: {
  testers: BetaTesterRecord[];
  feedback: BetaFeedbackRecord[];
  issues: BetaIssueRecord[];
}): BetaIntakeSummary {
  const highestSeverity = input.issues
    .map((issue) => issue.severity)
    .sort((a, b) => (severityRank[b] ?? 0) - (severityRank[a] ?? 0))[0] ?? "pending";

  return {
    testerCount: input.testers.length,
    externalRealTesterCount: input.testers.filter((tester) => tester.testerType === "external_real_tester").length,
    gmLocalValidationCount: input.testers.filter((tester) => tester.testerType === "gm_local_validation").length,
    supportObservationCount: input.testers.filter((tester) => tester.testerType === "support_observation").length,
    feedbackCount: input.feedback.length,
    externalFeedbackCount: input.feedback.filter((record) => record.sourceType === "external_real_tester").length,
    issueCount: input.issues.length,
    openIssueCount: input.issues.filter((issue) => !["closed"].includes(issue.status)).length,
    closedIssueCount: input.issues.filter((issue) => issue.status === "closed").length,
    highestSeverity,
    latestActivityAt: latestIso([
      ...input.testers.map((tester) => tester.updatedAt),
      ...input.feedback.map((record) => record.updatedAt),
      ...input.issues.map((issue) => issue.updatedAt),
    ]),
    sensitiveInputRejected: false,
    externalApiAttempted: false,
    autoSendAttempted: false,
    cloudSyncAttempted: false,
    betaCompletionClaimed: false,
  };
}
