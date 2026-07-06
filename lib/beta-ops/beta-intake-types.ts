import type { BetaFeedbackRecord, BetaIssueRecord, BetaTesterRecord } from "@/lib/types";

export interface BetaIntakeSummary {
  testerCount: number;
  externalRealTesterCount: number;
  gmLocalValidationCount: number;
  supportObservationCount: number;
  feedbackCount: number;
  externalFeedbackCount: number;
  issueCount: number;
  openIssueCount: number;
  closedIssueCount: number;
  highestSeverity: string;
  latestActivityAt?: string;
  sensitiveInputRejected: boolean;
  externalApiAttempted: false;
  autoSendAttempted: false;
  cloudSyncAttempted: false;
  betaCompletionClaimed: false;
}

export interface BetaIntakeDataset {
  testers: BetaTesterRecord[];
  feedback: BetaFeedbackRecord[];
  issues: BetaIssueRecord[];
}

export interface BetaIntakeGuardResult {
  safe: boolean;
  violations: string[];
}
