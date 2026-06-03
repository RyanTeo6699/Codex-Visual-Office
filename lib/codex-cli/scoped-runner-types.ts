export interface ScopedCodexRunnerInput {
  taskId: string;
  projectId: string;
  approvedProjectPath: string;
  prompt: string;
  forbiddenScope?: string[];
  explicitConfirmation: boolean;
  promptReviewed: boolean;
  forbiddenScopeAcknowledged: boolean;
  noAutoCommitPushDeployAcknowledged: boolean;
}

export interface ScopedCodexRunnerOutput {
  status: "completed" | "failed" | "blocked" | "running";
  exitCode?: number;
  startedAt: string;
  endedAt: string;
  durationMs?: number;
  stdoutPreview: string;
  stderrPreview: string;
  stdoutTruncated: boolean;
  stderrTruncated: boolean;
  outputPreview: string;
  errorPreview: string;
  taskExecutionAttempted: boolean;
  autoPushAttempted: false;
  autoDeployAttempted: false;
  eventIds: string[];
}

export interface ScopedCodexRunnerValidationInput {
  executableName?: string;
  codexInstalled: boolean;
  approvedProjectPath?: string;
  projectPathApproved: boolean;
  explicitConfirmation: boolean;
  promptReviewed: boolean;
  forbiddenScopeAcknowledged: boolean;
  noAutoCommitPushDeployAcknowledged: boolean;
  prompt: string;
}

export interface ScopedCodexRunnerValidationResult {
  allowed: boolean;
  reasons: string[];
}
