import type { RunnerPolicy } from "./runner-types";

export function createPhase3Step3ARunnerPolicy(): RunnerPolicy {
  return {
    allowlistedExecutable: "codex",
    allowArbitraryShell: false,
    allowPromptExecution: false,
    allowAutoPush: false,
    allowAutoDeploy: false,
    requireApprovedProjectPath: true,
    requireExplicitUserConfirmation: true,
    requirePromptPreview: true,
    requireForbiddenScopeAcknowledgement: true,
    executionMode: "safety_harness_only",
  };
}

export function createScopedCodexRunnerPolicy(): RunnerPolicy {
  return {
    allowlistedExecutable: "codex",
    allowArbitraryShell: false,
    allowPromptExecution: true,
    allowAutoPush: false,
    allowAutoDeploy: false,
    requireApprovedProjectPath: true,
    requireExplicitUserConfirmation: true,
    requirePromptPreview: true,
    requireForbiddenScopeAcknowledgement: true,
    executionMode: "scoped_codex_runner",
  };
}
