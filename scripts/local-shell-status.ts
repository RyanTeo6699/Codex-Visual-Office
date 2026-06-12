import { getLocalShellStatus } from "@/lib/local-shell/local-shell-status";

async function main(): Promise<void> {
  const status = await getLocalShellStatus();

  console.log("Local App Shell status");
  console.log(JSON.stringify({
    shellReadiness: status.shellReadiness,
    localModeEnabled: status.localModeEnabled,
    localDatabaseConfigured: status.localDatabaseConfigured,
    localDatabasePath: status.localDatabasePath,
    settingsCenterReady: status.settingsCenterReady,
    approvedProjectPathsReady: status.approvedProjectPathsReady,
    backupRestoreReady: status.backupRestoreReady,
    archiveRoomReady: status.archiveRoomReady,
    qualityGatesConfigured: status.qualityGatesConfigured,
    codexCliDetected: status.codexCliDetected,
    localLaunchScriptsAvailable: status.localLaunchScriptsAvailable,
    desktopPackagingStatus: status.desktopPackagingStatus,
    counts: status.counts,
    forbiddenCapabilities: status.forbiddenCapabilities,
    executionAttempted: status.executionAttempted,
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local App Shell status failed");
  console.error(error);
  process.exit(1);
});
