import type {
  CodexAuthCapability,
  CodexCliAvailability,
  CodexRuntimeReadiness,
  CodexRuntimeStatus,
  CodexRuntimeStatusInput,
} from "./runtime-status-types";

export type {
  CodexAuthCapability,
  CodexCliAvailability,
  CodexFailureCategory,
  CodexLastRunStatus,
  CodexLastRunSummary,
  CodexRuntimeFailureClassification,
  CodexRuntimeReadiness,
  CodexRuntimeStatus,
  CodexRuntimeStatusInput,
} from "./runtime-status-types";
export { classifyCodexRuntimeFailure, createBoundedRuntimePreview, redactRuntimeStatusText } from "./runtime-failure-classification";
export { summarizeCodexLastRun } from "./runtime-last-run";

export function getCodexCliAvailability(input: CodexRuntimeStatusInput): CodexCliAvailability {
  if (input.cliAvailability) {
    return input.cliAvailability;
  }

  if (!input.cliStatus) {
    return "unknown";
  }

  if (!input.cliStatus.installed) {
    return "not_found";
  }

  if (input.cliStatus.version) {
    return "version_detected";
  }

  if (input.cliStatus.path) {
    return "found";
  }

  return "unknown";
}

export function getCodexAuthCapability(input: CodexRuntimeStatusInput): CodexAuthCapability {
  if (input.authCapability) {
    return input.authCapability;
  }

  if (!input.cliStatus) {
    return "not_checked";
  }

  if (!input.cliStatus.installed) {
    return "auth_check_unsupported";
  }

  if (input.cliStatus.authStatus === "cli_available_auth_not_verified" || input.cliStatus.authStatus === "unknown") {
    return "auth_unknown";
  }

  if (input.cliStatus.authStatus === "not_checked") {
    return "not_checked";
  }

  return "auth_unknown";
}

function hasApprovedProjectPath(input: CodexRuntimeStatusInput): boolean {
  return Boolean(input.approvedProjectPath?.approved && input.approvedProjectPath.localPath?.trim());
}

function policyBlocksRuntime(input: CodexRuntimeStatusInput): boolean {
  if (!input.policy) {
    return false;
  }

  if (input.policy.blocked) {
    return true;
  }

  if (input.policy.allowPromptExecution === false) {
    return true;
  }

  return false;
}

export function computeCodexRuntimeReadiness(input: CodexRuntimeStatusInput): CodexRuntimeReadiness {
  const cliAvailability = getCodexCliAvailability(input);
  const authCapability = getCodexAuthCapability(input);
  const lastRunStatus = input.lastRun?.status ?? "unknown";

  if (cliAvailability === "not_found") {
    return "blocked_missing_cli";
  }

  if (cliAvailability === "unknown") {
    return "unknown";
  }

  if (authCapability === "auth_likely_missing") {
    return "blocked_auth_likely_missing";
  }

  if (policyBlocksRuntime(input)) {
    return "blocked_policy";
  }

  if (input.policy?.requireApprovedProjectPath !== false && !hasApprovedProjectPath(input)) {
    return "blocked_missing_approved_path";
  }

  if (lastRunStatus === "failed" || lastRunStatus === "timed_out") {
    return "failed_last_run";
  }

  if (authCapability === "auth_unknown" || authCapability === "not_checked" || authCapability === "auth_check_unsupported" || authCapability === "auth_check_failed") {
    return "available_auth_unknown";
  }

  if (authCapability === "auth_likely_available") {
    return "ready";
  }

  return "unknown";
}

function collectRuntimeReasons(input: CodexRuntimeStatusInput, readiness: CodexRuntimeReadiness): string[] {
  const reasons: string[] = [];

  if (readiness === "blocked_missing_cli") {
    reasons.push("Codex CLI is not available from safe local detection.");
  }

  if (readiness === "blocked_auth_likely_missing") {
    reasons.push("Codex authentication appears to be missing.");
  }

  if (readiness === "blocked_policy") {
    reasons.push(...(input.policy?.reasons?.length ? input.policy.reasons : ["Runtime policy blocks Codex execution."]));
  }

  if (readiness === "blocked_missing_approved_path") {
    reasons.push("Approved project path is missing or not approved.");
  }

  if (readiness === "failed_last_run" && input.lastRun) {
    reasons.push(input.lastRun.reason);
  }

  if (readiness === "available_auth_unknown") {
    reasons.push("Codex CLI is available, but authentication is not verified by this local-only model.");
  }

  if (!reasons.length && readiness === "ready") {
    reasons.push("Codex CLI, auth capability, policy, approved path, and last run status are ready.");
  }

  if (!reasons.length) {
    reasons.push("Codex runtime readiness is unknown.");
  }

  return reasons;
}

export function computeCodexRuntimeStatus(input: CodexRuntimeStatusInput): CodexRuntimeStatus {
  const codexCliAvailability = getCodexCliAvailability(input);
  const codexAuthCapability = getCodexAuthCapability(input);
  const codexRuntimeReadiness = computeCodexRuntimeReadiness(input);
  const codexLastRunStatus = input.lastRun?.status ?? "unknown";

  return {
    codexCliAvailability,
    codexAuthCapability,
    codexRuntimeReadiness,
    codexLastRunStatus,
    codexFailureCategory: input.lastRun?.failureCategory,
    reasons: collectRuntimeReasons(input, codexRuntimeReadiness),
    checkedAt: input.checkedAt ?? new Date().toISOString(),
  };
}
