import { getDataSafetySummary } from "./data-safety-summary";
import { getLauncherSafetySummary } from "./launcher-safety-summary";
import { createLocalPermissionModel } from "./local-permission-model";
import { getRunnerSafetySummary } from "./runner-safety-summary";
import type { LocalPermissionModel, OverallSafetyStatus, SafetyCapability, SafetySummary } from "./safety-types";

function uniqueCapabilities(capabilities: SafetyCapability[]): SafetyCapability[] {
  return Array.from(new Set(capabilities));
}

function combineOverallSafetyStatus(summaries: SafetySummary[]): OverallSafetyStatus {
  if (summaries.some((summary) => summary.overallSafetyStatus === "blocked")) {
    return "blocked";
  }

  if (summaries.some((summary) => summary.overallSafetyStatus === "needs_review")) {
    return "needs_review";
  }

  if (summaries.some((summary) => summary.overallSafetyStatus === "unknown")) {
    return "unknown";
  }

  return "safe_local_only";
}

export function getLocalFirstSafetySummary(): SafetySummary & { permissionModel: LocalPermissionModel } {
  const summaries = [getRunnerSafetySummary(), getDataSafetySummary(), getLauncherSafetySummary()];

  return {
    overallSafetyStatus: combineOverallSafetyStatus(summaries),
    warnings: summaries.flatMap((summary) => summary.warnings),
    blockedCapabilities: uniqueCapabilities(summaries.flatMap((summary) => summary.blockedCapabilities)),
    allowedCapabilities: uniqueCapabilities(summaries.flatMap((summary) => summary.allowedCapabilities)),
    recommendedNextAction:
      "Keep Phase 12 local-first: require approved paths, block credentials and cloud sync, and preserve scoped runner, local data, launcher, and Tauri safety defaults.",
    permissionModel: createLocalPermissionModel(),
  };
}
