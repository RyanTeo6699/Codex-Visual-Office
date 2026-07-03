import { getLocalShellStatus } from "@/lib/local-shell/local-shell-status";
import { initializeLocalDb } from "@/lib/local-db/init";
import { upsertApprovedProjectPath } from "@/lib/local-db/operations/approved-project-paths";
import { seedDefaultLocalSettings } from "@/lib/local-db/operations/local-settings";
import { seedDefaultRetentionPolicies } from "@/lib/local-db/operations/retention-policies";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();
  await seedDefaultLocalSettings();
  await seedDefaultRetentionPolicies();
  await upsertApprovedProjectPath({
    projectId: "provider-workspace",
    localPath: "/Users/ryanteo/Desktop/上线版本/CODEX可视化办公室",
    label: "Verification local project",
    approved: true,
    note: "Seeded by local shell verification",
  });

  const status = await getLocalShellStatus();

  assert(status.localModeEnabled === true, "Local mode should be enabled");
  assert(status.localDatabaseConfigured === true, "Local DB path should be configured");
  assert(status.localDatabasePath.includes(".local/codex-visual-office.sqlite"), "Local DB path should be reported");
  assert(status.settingsCenterReady === true, "Settings Center should be summarized as ready");
  assert(status.approvedProjectPathsReady === true, "Approved project paths should be summarized");
  assert(status.backupRestoreReady === true, "Backup / Restore should be summarized");
  assert(status.archiveRoomReady === true, "Archive Room should be summarized");
  assert(status.qualityGatesConfigured === true, "Quality gate config should be summarized");
  assert(status.desktopPackagingStatus === "tauri_prototype_configured", "Desktop packaging status should reflect the Phase 7D Tauri prototype");
  assert(status.localLaunchScriptsAvailable.includes("dev"), "npm run dev should be listed");
  assert(status.localLaunchScriptsAvailable.includes("local:shell:status"), "local:shell:status should be listed");
  assert(status.localLaunchScriptsAvailable.includes("local:shell:verify"), "local:shell:verify should be listed");
  assert(status.shellReadiness !== "blocked", "Local shell readiness should not be blocked");
  assert(status.forbiddenCapabilities.tauri === false, "Only the Phase 7D Tauri prototype allowance may be present");
  assert(status.forbiddenCapabilities.electron === false, "Electron must not be added");
  assert(status.forbiddenCapabilities.autoUpdater === false, "Auto updater must not be added");
  assert(status.forbiddenCapabilities.backgroundDaemon === false, "Background daemon/cron/startup service must not be added");
  assert(status.forbiddenCapabilities.cloudSync === false, "Cloud sync must not be added");
  assert(status.forbiddenCapabilities.githubApi === false, "GitHub API integration must not be added");
  assert(status.forbiddenCapabilities.vercel === false, "Vercel integration must not be added");
  assert(status.forbiddenCapabilities.supabase === false, "Supabase integration must not be added");
  assert(status.forbiddenCapabilities.authPaymentMcp === false, "Auth/payment/MCP must not be added");
  assert(status.executionAttempted.codex === false, "Codex execution must not be attempted");
  assert(status.executionAttempted.git === false, "Git execution must not be attempted");
  assert(status.executionAttempted.qualityGate === false, "Quality Gate execution must not be attempted");

  console.log("Local app shell verification passed");
  console.log(JSON.stringify({
    shellReadiness: status.shellReadiness,
    localModeEnabled: status.localModeEnabled,
    localDatabaseConfigured: status.localDatabaseConfigured,
    approvedProjectPathsCount: status.counts.approvedProjectPaths,
    backupRecordsCount: status.counts.backupRecords,
    retentionPoliciesCount: status.counts.retentionPolicies,
    qualityGateConfigsCount: status.counts.qualityGateConfigs,
    codexCliDetected: status.codexCliDetected,
    localLaunchScriptsAvailable: status.localLaunchScriptsAvailable,
    desktopPackagingStatus: status.desktopPackagingStatus,
    forbiddenCapabilities: status.forbiddenCapabilities,
    executionAttempted: status.executionAttempted,
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local app shell verification failed");
  console.error(error);
  process.exit(1);
});
