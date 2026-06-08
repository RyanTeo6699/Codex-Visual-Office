import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { initializeLocalDb } from "@/lib/local-db/init";
import { getProjectById } from "@/lib/local-db/repositories/projects";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import {
  createLocalDatabaseBackup,
  restoreDryRun,
  restoreLocalDatabaseBackup,
  verifyLocalDatabaseBackup,
} from "@/lib/local-backup/backup-service";
import { LOCAL_BACKUP_DIR } from "@/lib/local-backup/backup-paths";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const beforeProject = await getProjectById("provider-workspace");
  assert(beforeProject, "Seeded provider-workspace project should exist before backup");

  const manualBackup = await createLocalDatabaseBackup({
    note: "Verification manual backup",
  });

  assert(manualBackup.record.backupKind === "manual", "Manual backup should use manual kind");
  assert(manualBackup.record.backupPath.startsWith(LOCAL_BACKUP_DIR), "Backup must be written under .local/backups");
  assert(existsSync(manualBackup.record.backupPath), "Backup file should exist");
  assert(manualBackup.record.fileSizeBytes > 0, "Backup size should be greater than zero");
  assert(manualBackup.record.checksumSha256.length === 64, "Backup checksum should be SHA256 hex");
  assert(!manualBackup.record.backupPath.includes(".env"), "Backup path must not target env files");
  assert(!manualBackup.record.backupPath.includes(".codex"), "Backup path must not target Codex auth files");

  const verification = await verifyLocalDatabaseBackup(manualBackup.record.id);
  assert(verification.ok, "Backup verification should pass");
  assert(verification.record.status === "verified", "Backup record should be marked verified");

  const backupStatBeforeDryRun = await stat(manualBackup.record.backupPath);
  const dryRun = await restoreDryRun(manualBackup.record.id);
  const backupStatAfterDryRun = await stat(manualBackup.record.backupPath);
  const projectAfterDryRun = await getProjectById("provider-workspace");
  assert(dryRun.ok, "Restore dry-run should pass");
  assert(dryRun.record.status === "dry_run_passed", "Dry-run should mark the record dry_run_passed");
  assert(projectAfterDryRun, "Dry-run should leave current DB readable");
  assert(backupStatAfterDryRun.mtimeMs === backupStatBeforeDryRun.mtimeMs, "Dry-run must not rewrite the backup file");

  const restore = await restoreLocalDatabaseBackup({
    backupRecordId: manualBackup.record.id,
    confirmRestore: true,
  });
  assert(restore.ok, "Confirmed restore should pass");
  assert(restore.safetyBackup.record.backupKind === "pre_restore_safety", "Restore must create a pre-restore safety backup");
  assert(existsSync(restore.safetyBackup.record.backupPath), "Safety backup file should exist");
  assert(restore.restoredRecord.status === "restored", "Restored record should be marked restored");

  initializeLocalDb();
  const afterProject = await getProjectById("provider-workspace");
  assert(afterProject, "DB should remain readable after restore");

  const summary = {
    backupDirectory: LOCAL_BACKUP_DIR,
    manualBackupPath: manualBackup.record.backupPath,
    manualBackupSize: manualBackup.record.fileSizeBytes,
    checksumShort: manualBackup.record.checksumSha256.slice(0, 12),
    dryRunPassed: dryRun.ok,
    dryRunOverwroteCurrentDb: false,
    safetyBackupPath: restore.safetyBackup.record.backupPath,
    restoredStatus: restore.restoredRecord.status,
    projectSourceBackupAttempted: false,
    codexAuthBackupAttempted: false,
    envBackupAttempted: false,
    cloudUploadAttempted: false,
    gitExecutionAttempted: false,
    codexExecutionAttempted: false,
    qualityGateExecutionAttempted: false,
  };

  console.log("Local backup restore verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local backup restore verification failed");
  console.error(error);
  process.exit(1);
});
