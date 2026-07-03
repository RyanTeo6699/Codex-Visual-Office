import type { CodexCliStatus } from "./types";

export type CodexCliAvailability = "not_found" | "found" | "version_detected" | "unknown";

export type CodexAuthCapability =
  | "not_checked"
  | "auth_unknown"
  | "auth_likely_available"
  | "auth_likely_missing"
  | "auth_check_unsupported"
  | "auth_check_failed";

export type CodexRuntimeReadiness =
  | "ready"
  | "available_auth_unknown"
  | "blocked_missing_cli"
  | "blocked_auth_likely_missing"
  | "blocked_policy"
  | "blocked_missing_approved_path"
  | "failed_last_run"
  | "unknown";

export type CodexLastRunStatus = "never_run" | "succeeded" | "failed" | "blocked" | "timed_out" | "unknown";

export type CodexFailureCategory =
  | "missing_cli"
  | "auth_required_or_missing"
  | "missing_approved_path"
  | "policy_blocked"
  | "sandbox_denied"
  | "timeout"
  | "nonzero_exit"
  | "output_parse_error"
  | "unknown";

export interface CodexRuntimeFailureClassification {
  category: CodexFailureCategory;
  reason: string;
  exitCode?: number;
  preview: string;
  previewTruncated: boolean;
}

export interface CodexRuntimeRunnerLike {
  status?: "completed" | "failed" | "blocked" | "running" | string;
  exitCode?: number;
  stdoutPreview?: string;
  stderrPreview?: string;
  outputPreview?: string;
  errorPreview?: string;
  stdoutTruncated?: boolean;
  stderrTruncated?: boolean;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  eventIds?: string[];
}

export interface CodexRuntimeTaskEventLike {
  id: string;
  taskId?: string;
  projectId?: string;
  time?: string;
  message?: string;
  payload?: Record<string, unknown>;
  createdAt?: string;
}

export interface CodexLastRunSummary {
  status: CodexLastRunStatus;
  taskId?: string;
  projectId?: string;
  eventId?: string;
  lifecycleEvent?: string;
  exitCode?: number;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  failureCategory?: CodexFailureCategory;
  reason: string;
  preview: string;
  previewTruncated: boolean;
}

export interface CodexRuntimePolicyState {
  allowPromptExecution?: boolean;
  requireApprovedProjectPath?: boolean;
  executionMode?: string;
  blocked?: boolean;
  reasons?: string[];
}

export interface CodexRuntimeApprovedPathState {
  approved?: boolean;
  localPath?: string | null;
}

export interface CodexRuntimeStatusInput {
  cliStatus?: CodexCliStatus;
  cliAvailability?: CodexCliAvailability;
  authCapability?: CodexAuthCapability;
  approvedProjectPath?: CodexRuntimeApprovedPathState;
  policy?: CodexRuntimePolicyState;
  lastRun?: CodexLastRunSummary;
  checkedAt?: string;
}

export interface CodexRuntimeStatus {
  codexCliAvailability: CodexCliAvailability;
  codexAuthCapability: CodexAuthCapability;
  codexRuntimeReadiness: CodexRuntimeReadiness;
  codexLastRunStatus: CodexLastRunStatus;
  codexFailureCategory?: CodexFailureCategory;
  reasons: string[];
  checkedAt: string;
}
