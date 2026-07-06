export type BetaOpsNextRecommendedAction =
  | "collect_external_tester_submissions"
  | "send_invitation_packet"
  | "review_feedback"
  | "prepare_fix_batch"
  | "unknown";

export interface BetaOpsTemplateStatus {
  label: string;
  path: string;
  ready: boolean;
}

export interface BetaOpsSummary {
  currentStatus: "BETA_OPS_READY_AWAITING_EXTERNAL_TESTER_SUBMISSIONS";
  gmLocalValidationCount: number;
  externalTesterFeedbackCount: number;
  externalIssueCount: number;
  inviteeTrackerReady: boolean;
  feedbackTemplateReady: boolean;
  issueTemplateReady: boolean;
  outreachPacketReady: boolean;
  betaCompletionClaimed: false;
  publicReleaseReadyClaimed: false;
  nextRecommendedAction: BetaOpsNextRecommendedAction;
  warningNotes: string[];
  templateStatuses: BetaOpsTemplateStatus[];
  sourceDocuments: string[];
}
