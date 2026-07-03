import { AppShell } from "@/components/layout/AppShell";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { getDesktopBetaStatus } from "@/lib/desktop/desktop-beta-status";
import { getLocalShellStatus } from "@/lib/local-shell/local-shell-status";
import { LOCAL_BACKUP_DIR } from "@/lib/local-backup/backup-paths";
import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listApprovedProjectPaths } from "@/lib/local-db/operations/approved-project-paths";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listLocalSettings, seedDefaultLocalSettings } from "@/lib/local-db/operations/local-settings";
import { listRetentionPolicies, seedDefaultRetentionPolicies } from "@/lib/local-db/operations/retention-policies";
import { listProjects } from "@/lib/local-db/repositories/projects";
import { confirmRestoreAction, createBackupNowAction, restoreDryRunAction, saveApprovedProjectPathAction } from "./actions";

export default async function SettingsPage() {
  initializeLocalDb();
  await seedDefaultLocalSettings();
  await seedDefaultRetentionPolicies();

  const [settings, codexStatus, projectRows, approvedPaths, backupRecords, retentionPolicies, localShellStatus] = await Promise.all([
    listLocalSettings(),
    detectCodexCliStatus(),
    listProjects(),
    listApprovedProjectPaths(),
    listBackupRecords(),
    listRetentionPolicies(),
    getLocalShellStatus(),
  ]);
  const desktopBetaStatus = getDesktopBetaStatus();

  return (
    <AppShell>
      <SettingsPanel
        settings={settings}
        codexStatus={codexStatus}
        localDbPath={LOCAL_DB_PATH}
        projects={projectRows.map((project) => ({ id: project.id, name: project.name }))}
        approvedPaths={approvedPaths}
        backupDir={LOCAL_BACKUP_DIR}
        backupRecords={backupRecords}
        retentionPolicies={retentionPolicies}
        localShellStatus={localShellStatus}
        desktopBetaStatus={desktopBetaStatus}
        saveApprovedProjectPathAction={saveApprovedProjectPathAction}
        createBackupNowAction={createBackupNowAction}
        restoreDryRunAction={restoreDryRunAction}
        confirmRestoreAction={confirmRestoreAction}
      />
    </AppShell>
  );
}
