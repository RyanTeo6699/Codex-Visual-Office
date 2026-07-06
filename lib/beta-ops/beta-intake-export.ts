import type { BetaFeedbackRecord, BetaIssueRecord, BetaTesterRecord } from "@/lib/types";
import type { BetaIntakeSummary } from "./beta-intake-types";

function csvEscape(value: string | number | boolean | undefined | null): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function renderBetaIntakeMarkdownReport(input: {
  summary: BetaIntakeSummary;
  testers: BetaTesterRecord[];
  feedback: BetaFeedbackRecord[];
  issues: BetaIssueRecord[];
}): string {
  return [
    "# Private Beta Local Intake Report",
    "",
    "This report is generated from local SQLite intake records only. It does not send, upload, sync, or contact testers.",
    "",
    "## Summary",
    "",
    `- Testers recorded: ${input.summary.testerCount}`,
    `- External real testers recorded: ${input.summary.externalRealTesterCount}`,
    `- Feedback records: ${input.summary.feedbackCount}`,
    `- Issue records: ${input.summary.issueCount}`,
    `- Open issues: ${input.summary.openIssueCount}`,
    `- Highest severity: ${input.summary.highestSeverity}`,
    `- Latest activity: ${input.summary.latestActivityAt ?? "none"}`,
    "",
    "## Boundaries",
    "",
    "- externalApiAttempted: false",
    "- autoSendAttempted: false",
    "- cloudSyncAttempted: false",
    "- betaCompletionClaimed: false",
  ].join("\n");
}

export function renderBetaTesterCsv(testers: BetaTesterRecord[]): string {
  const rows = testers.map((tester) => [
    tester.id,
    tester.testerLabel,
    tester.testerType,
    tester.consentStatus,
    tester.invitationStatus,
    tester.onboardingStatus,
    tester.feedbackStatus,
    tester.createdAt,
    tester.updatedAt,
  ].map(csvEscape).join(","));

  return ["id,tester_label,tester_type,consent_status,invitation_status,onboarding_status,feedback_status,created_at,updated_at", ...rows].join("\n");
}

export function renderBetaFeedbackCsv(records: BetaFeedbackRecord[]): string {
  const rows = records.map((record) => [
    record.id,
    record.testerId,
    record.sourceType,
    record.area,
    record.summary,
    record.evidenceType,
    record.severity,
    record.priority,
    record.status,
    record.sensitiveDataChecked,
    record.createdAt,
    record.updatedAt,
  ].map(csvEscape).join(","));

  return ["id,tester_id,source_type,area,summary,evidence_type,severity,priority,status,sensitive_data_checked,created_at,updated_at", ...rows].join("\n");
}

export function renderBetaIssueCsv(records: BetaIssueRecord[]): string {
  const rows = records.map((record) => [
    record.id,
    record.feedbackId,
    record.area,
    record.summary,
    record.severity,
    record.priority,
    record.reproStatus,
    record.decision,
    record.status,
    record.createdAt,
    record.updatedAt,
  ].map(csvEscape).join(","));

  return ["id,feedback_id,area,summary,severity,priority,repro_status,decision,status,created_at,updated_at", ...rows].join("\n");
}
