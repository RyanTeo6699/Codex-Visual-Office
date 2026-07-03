import type { SafetySummary } from "./safety-types";

export function getRunnerSafetySummary(): SafetySummary {
  return {
    overallSafetyStatus: "safe_local_only",
    warnings: [
      "Approved project path is required before scoped runner execution.",
      "Runner policy is summary-only here and does not change existing runner behavior.",
    ],
    blockedCapabilities: [
      "arbitrary_shell",
      "terminal_access",
      "node_pty",
      "auto_git_mutation",
      "auto_deploy",
    ],
    allowedCapabilities: ["approved_project_paths", "scoped_codex_runner"],
    recommendedNextAction:
      "Keep runner entry points scoped to approved project paths with shell:false, no arbitrary shell, no command textbox, no terminal, and no node-pty.",
  };
}
