import type { QualityGateRunStatus } from "@/lib/types";

export type QualityGateOverallStatus = "not_run" | "passed" | "failed" | "skipped" | "blocked" | "mixed";

export interface QualityGateSummaryItem {
  configId: string;
  name: string;
  command: string;
  enabled: boolean;
  allowlisted: boolean;
  status: QualityGateRunStatus | "not_run";
  latestRunAt?: string;
  durationMs?: number;
  exitCode?: number;
  skippedReason?: string;
  failedReason?: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
}

export interface QualityGateSummary {
  overallStatus: QualityGateOverallStatus;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  blockedCount: number;
  notRunCount: number;
  enabledCount: number;
  disabledCount: number;
  latestRunAt?: string;
  totalDurationMs: number;
  failedGateNames: string[];
  summaryMessage: string;
  items: QualityGateSummaryItem[];
}
