import type { QualityGateConfig, QualityGateRun } from "@/lib/types";
import type { QualityGateOverallStatus, QualityGateSummary, QualityGateSummaryItem } from "./quality-gate-summary-types";

function runTime(run: QualityGateRun): string {
  return run.endedAt ?? run.startedAt ?? run.createdAt;
}

function isNewerRun(candidate: QualityGateRun, current: QualityGateRun): boolean {
  return runTime(candidate).localeCompare(runTime(current)) > 0;
}

function latestRunsByConfig(runs: QualityGateRun[]): Map<string, QualityGateRun> {
  const latest = new Map<string, QualityGateRun>();
  for (const run of runs) {
    const current = latest.get(run.configId);
    if (!current || isNewerRun(run, current)) {
      latest.set(run.configId, run);
    }
  }

  return latest;
}

function determineOverallStatus(input: {
  totalRuns: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
  blockedCount: number;
  notRunCount: number;
  enabledCount: number;
}): QualityGateOverallStatus {
  if (input.totalRuns === 0) {
    return "not_run";
  }

  if (input.blockedCount > 0) {
    return "blocked";
  }

  if (input.failedCount > 0) {
    return "failed";
  }

  if (input.passedCount === input.enabledCount && input.enabledCount > 0) {
    return "passed";
  }

  if (input.skippedCount > 0 && input.passedCount === 0 && input.failedCount === 0 && input.blockedCount === 0) {
    return "skipped";
  }

  return "mixed";
}

function summaryMessage(status: QualityGateOverallStatus, input: { passedCount: number; failedCount: number; skippedCount: number; blockedCount: number; notRunCount: number }): string {
  if (status === "not_run") {
    return "No quality gates have run yet.";
  }

  if (status === "blocked") {
    return `${input.blockedCount} quality gate${input.blockedCount === 1 ? "" : "s"} blocked.`;
  }

  if (status === "failed") {
    return `${input.failedCount} quality gate${input.failedCount === 1 ? "" : "s"} failed.`;
  }

  if (status === "passed") {
    return "All enabled quality gates passed.";
  }

  if (status === "skipped") {
    return "Quality gates were skipped.";
  }

  return "Quality gates have mixed results.";
}

export function summarizeQualityGates(configs: QualityGateConfig[], runs: QualityGateRun[]): QualityGateSummary {
  const latest = latestRunsByConfig(runs);
  const items: QualityGateSummaryItem[] = configs.map((config) => {
    const run = latest.get(config.id);
    return {
      configId: config.id,
      name: config.name,
      command: config.command,
      enabled: config.enabled,
      allowlisted: config.allowlisted,
      status: run?.status ?? "not_run",
      latestRunAt: run ? runTime(run) : undefined,
      durationMs: run?.durationMs,
      exitCode: run?.exitCode,
      skippedReason: run?.skippedReason,
      failedReason: run?.failedReason,
      stdoutTruncated: run?.stdoutTruncated ?? false,
      stderrTruncated: run?.stderrTruncated ?? false,
    };
  });

  const passedCount = items.filter((item) => item.status === "passed").length;
  const failedCount = items.filter((item) => item.status === "failed").length;
  const skippedCount = items.filter((item) => item.status === "skipped").length;
  const blockedCount = items.filter((item) => item.status === "blocked").length;
  const notRunCount = items.filter((item) => item.status === "not_run").length;
  const enabledCount = configs.filter((config) => config.enabled).length;
  const disabledCount = configs.length - enabledCount;
  const latestRunAt = items
    .map((item) => item.latestRunAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const totalDurationMs = items.reduce((total, item) => total + (item.durationMs ?? 0), 0);
  const failedGateNames = items.filter((item) => item.status === "failed").map((item) => item.name);
  const overallStatus = determineOverallStatus({
    totalRuns: latest.size,
    passedCount,
    failedCount,
    skippedCount,
    blockedCount,
    notRunCount,
    enabledCount,
  });

  return {
    overallStatus,
    passedCount,
    failedCount,
    skippedCount,
    blockedCount,
    notRunCount,
    enabledCount,
    disabledCount,
    latestRunAt,
    totalDurationMs,
    failedGateNames,
    summaryMessage: summaryMessage(overallStatus, { passedCount, failedCount, skippedCount, blockedCount, notRunCount }),
    items,
  };
}
