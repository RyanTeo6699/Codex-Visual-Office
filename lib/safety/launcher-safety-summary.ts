import type { SafetySummary } from "./safety-types";

export function getLauncherSafetySummary(): SafetySummary {
  return {
    overallSafetyStatus: "safe_local_only",
    warnings: [
      "Launcher must remain localhost/status-only and must not start a development server.",
      "Tauri summary is prototype-only and does not enable production desktop capabilities.",
    ],
    blockedCapabilities: [
      "dev_server_start",
      "auto_git_mutation",
      "auto_deploy",
      "production_installer",
      "updater",
      "shell_plugin",
      "expanded_filesystem_access",
    ],
    allowedCapabilities: ["localhost_status", "tauri_prototype_core"],
    recommendedNextAction:
      "Keep launcher limited to localhost status checks with no Codex, Git, quality execution, dev server start, production installer, updater, shell plugin, or filesystem expansion.",
  };
}
