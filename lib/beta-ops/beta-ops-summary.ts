import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { BetaOpsSummary, BetaOpsTemplateStatus } from "./beta-ops-types";

const rootDir = process.cwd();

const sourceDocuments = [
  "docs/phase-29-external-tester-intake.md",
  "docs/private-beta-external-feedback-intake-ledger.md",
  "docs/private-beta-external-issue-intake-ledger.md",
  "docs/private-beta-round-1-local-validation-feedback-record.md",
  "RELEASE_STATUS.md",
];

const templateStatuses: BetaOpsTemplateStatus[] = [
  {
    label: "Invitee tracker",
    path: "docs/private-beta-ops-export/invitee-tracker-template.csv",
    ready: false,
  },
  {
    label: "Feedback ledger",
    path: "docs/private-beta-ops-export/feedback-ledger-template.csv",
    ready: false,
  },
  {
    label: "Issue ledger",
    path: "docs/private-beta-ops-export/issue-ledger-template.csv",
    ready: false,
  },
  {
    label: "Invitation message pack",
    path: "docs/private-beta-ops-export/invitation-message-pack.md",
    ready: false,
  },
  {
    label: "Feedback submission template",
    path: "docs/private-beta-ops-export/feedback-submission-template.md",
    ready: false,
  },
  {
    label: "Issue report template",
    path: "docs/private-beta-ops-export/issue-report-template.md",
    ready: false,
  },
  {
    label: "GM next actions",
    path: "docs/private-beta-ops-export/gm-next-actions.md",
    ready: false,
  },
];

function readText(relativePath: string) {
  const absolutePath = path.join(rootDir, relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

function countPattern(text: string, pattern: RegExp) {
  return (text.match(pattern) ?? []).length;
}

export function getBetaOpsSummary(): BetaOpsSummary {
  const externalFeedbackLedger = readText("docs/private-beta-external-feedback-intake-ledger.md");
  const externalIssueLedger = readText("docs/private-beta-external-issue-intake-ledger.md");
  const localValidationRecord = readText("docs/private-beta-round-1-local-validation-feedback-record.md");

  const statuses = templateStatuses.map((template) => ({
    ...template,
    ready: existsSync(path.join(rootDir, template.path)),
  }));

  const gmLocalValidationCount = /LOCAL_VALIDATION_SAMPLE_PASS/i.test(localValidationRecord)
    ? 1
    : countPattern(localValidationRecord, /gm_local_validation|GM \/ local validation/gi);

  const feedbackCountMatch = externalFeedbackLedger.match(/External tester feedback submissions\s*\|\s*(\d+)/i);
  const issueCountMatch = externalIssueLedger.match(/External issue reports recorded\s*\|\s*(\d+)/i);

  const externalTesterFeedbackCount = feedbackCountMatch ? Number(feedbackCountMatch[1]) : 0;
  const externalIssueCount = issueCountMatch ? Number(issueCountMatch[1]) : 0;

  const inviteeTrackerReady = statuses.some((template) => template.path.endsWith("invitee-tracker-template.csv") && template.ready);
  const feedbackTemplateReady = statuses.some((template) => template.path.endsWith("feedback-submission-template.md") && template.ready);
  const issueTemplateReady = statuses.some((template) => template.path.endsWith("issue-report-template.md") && template.ready);
  const outreachPacketReady = statuses.every((template) => template.ready);

  return {
    currentStatus: "BETA_OPS_READY_AWAITING_EXTERNAL_TESTER_SUBMISSIONS",
    gmLocalValidationCount,
    externalTesterFeedbackCount,
    externalIssueCount,
    inviteeTrackerReady,
    feedbackTemplateReady,
    issueTemplateReady,
    outreachPacketReady,
    betaCompletionClaimed: false,
    publicReleaseReadyClaimed: false,
    nextRecommendedAction: "collect_external_tester_submissions",
    warningNotes: [
      "No fake tester feedback.",
      "No external submissions recorded yet.",
      "No public release.",
      "No cloud sync.",
      "No token collection.",
      "No auto-send or external communication API.",
    ],
    templateStatuses: statuses,
    sourceDocuments,
  };
}
