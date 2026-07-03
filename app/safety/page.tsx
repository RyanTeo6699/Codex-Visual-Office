import { buildCleanupDryRunPreview } from "@/lib/archive/archive-retention-preview";
import { buildArchiveSummary } from "@/lib/archive/archive-summary";
import { createScopedCodexRunnerPolicy } from "@/lib/codex-cli/runner-policy";
import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listApprovedProjectPaths } from "@/lib/local-db/operations/approved-project-paths";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listLocalSettings, seedDefaultLocalSettings } from "@/lib/local-db/operations/local-settings";
import { listQualityGateConfigs } from "@/lib/local-db/operations/quality-gate-configs";
import { listRetentionPolicies, seedDefaultRetentionPolicies } from "@/lib/local-db/operations/retention-policies";
import type { LocalLauncherReport } from "@/lib/local-launcher/local-launcher-types";
import type { LocalShellStatus } from "@/lib/local-shell/local-shell-types";
import { getLocalFirstSafetySummary } from "@/lib/safety/safety-summary";
import { AppShell } from "@/components/layout/AppShell";
import { SafetyAuditPanel } from "@/components/safety/SafetyAuditPanel";

export const dynamic = "force-dynamic";

export default async function SafetyPage() {
  initializeLocalDb();
  await seedDefaultLocalSettings();
  await seedDefaultRetentionPolicies();

  const [settings, approvedPaths, backupRecords, retentionPolicies, qualityGateConfigs, archiveSummary, cleanupPreview] = await Promise.all([
    listLocalSettings(),
    listApprovedProjectPaths(),
    listBackupRecords(),
    listRetentionPolicies(),
    listQualityGateConfigs(),
    buildArchiveSummary(),
    buildCleanupDryRunPreview(),
  ]);
  const safetySummary = getLocalFirstSafetySummary();
  const approvedProjectPathsReady = approvedPaths.some((path) => path.approved);
  const qualityGatesConfigured = qualityGateConfigs.length > 0;
  const archiveRoomReady = retentionPolicies.length > 0;
  const localDatabaseConfigured = LOCAL_DB_PATH.includes(".local/codex-visual-office.sqlite");
  const settingsCenterReady = settings.length > 0;
  const localShellStatus: LocalShellStatus = {
    localModeEnabled: true,
    localDatabaseConfigured,
    localDatabasePath: LOCAL_DB_PATH,
    settingsCenterReady,
    approvedProjectPathsReady,
    backupRestoreReady: true,
    archiveRoomReady,
    codexCliDetected: false,
    codexCliStatusLabel: "not checked by Safety Audit Room",
    qualityGatesConfigured,
    localLaunchScriptsAvailable: [],
    desktopPackagingStatus: "future_evaluation",
    shellReadiness: localDatabaseConfigured && settingsCenterReady && approvedProjectPathsReady && archiveRoomReady && qualityGatesConfigured ? "ready_for_local_dev" : "partial",
    counts: {
      approvedProjectPaths: approvedPaths.length,
      backupRecords: backupRecords.length,
      retentionPolicies: retentionPolicies.length,
      qualityGateConfigs: qualityGateConfigs.length,
      archiveRecords: Object.values(archiveSummary.counts).reduce((total, count) => total + count, 0),
    },
    forbiddenCapabilities: {
      tauri: false,
      electron: false,
      autoUpdater: false,
      backgroundDaemon: false,
      cloudSync: false,
      githubApi: false,
      vercel: false,
      supabase: false,
      authPaymentMcp: false,
      dangerousCommandRunner: false,
    },
    executionAttempted: {
      codex: false,
      git: false,
      qualityGate: false,
      devServer: false,
      install: false,
      deploy: false,
    },
  };
  const launcherReport: LocalLauncherReport = {
    appUrl: "http://localhost:3000",
    localShellReadiness: localShellStatus.shellReadiness,
    localDatabasePath: LOCAL_DB_PATH,
    approvedProjectPathsReady,
    approvedProjectPathsCount: approvedPaths.length,
    codexCliDetected: false,
    codexCliStatusLabel: "not checked by Safety Audit Room",
    qualityGateConfigReady: qualityGatesConfigured,
    qualityGateConfigCount: qualityGateConfigs.length,
    browserOpenSupported: false,
    launchMode: "status_only",
    executionAttempted: {
      codex: false,
      git: false,
      qualityGate: false,
      devServer: false,
      packageInstall: false,
      desktopRuntime: false,
      cloudSync: false,
    },
  };

  return (
    <AppShell>
      <SafetyAuditPanel
        localShellStatus={localShellStatus}
        runnerPolicy={createScopedCodexRunnerPolicy()}
        approvedPaths={approvedPaths}
        backupRecords={backupRecords}
        retentionPolicies={retentionPolicies}
        cleanupPreview={cleanupPreview}
        launcherReport={launcherReport}
        safetySummary={safetySummary}
      />
    </AppShell>
  );
}
