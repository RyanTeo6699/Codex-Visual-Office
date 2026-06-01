export interface RunnerPolicy {
  allowlistedExecutable: "codex";
  allowArbitraryShell: false;
  allowPromptExecution: boolean;
  allowAutoPush: false;
  allowAutoDeploy: false;
  requireApprovedProjectPath: true;
  requireExplicitUserConfirmation: true;
  requirePromptPreview: true;
  requireForbiddenScopeAcknowledgement: true;
  executionMode: "safety_harness_only" | "scoped_codex_runner";
}

export interface ApprovedProjectPath {
  projectId: string;
  localPath: string;
  approved: boolean;
  approvedAt?: string;
  approvalSource: "manual_future_step" | "not_configured";
  note: string;
}

export interface RunnerSafetyStatus {
  canExecute: false;
  reason: "Phase 3 Step 3A safety harness only";
  missingRequirements: string[];
  policy: RunnerPolicy;
  approvedProjectPath: ApprovedProjectPath;
}
