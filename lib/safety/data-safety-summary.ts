import type { SafetySummary } from "./safety-types";

export function getDataSafetySummary(): SafetySummary {
  return {
    overallSafetyStatus: "safe_local_only",
    warnings: [
      "Restore must remain dry-run first, then explicit confirm, then safety backup before replacement.",
      "Archive behavior is summary-only here and does not change backup or archive behavior.",
    ],
    blockedCapabilities: ["credential_access"],
    allowedCapabilities: ["local_sqlite_backup", "restore_dry_run", "archive_dry_run"],
    recommendedNextAction:
      "Keep backup sqlite-only and local-only, with no source backup and no token backup; keep archive dry-run only with no real deletion, no backup deletion, and no scheduled cleanup.",
  };
}
