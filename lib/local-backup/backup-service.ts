import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { sqliteClient } from "@/lib/local-db/client";
import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import {
  createBackupRecord,
  getBackupRecordById,
  markBackupRestored,
  updateBackupRecordStatus,
} from "@/lib/local-db/operations/backup-records";
import type { BackupKind } from "@/lib/types";
import { createBackupFilePath, LOCAL_BACKUP_DIR } from "./backup-paths";
import { assertBackupPathAllowed, assertLocalDatabaseSourcePath } from "./backup-safety";
import type {
  BackupVerificationResult,
  CreateLocalDatabaseBackupInput,
  LocalDatabaseBackupResult,
  RestoreDryRunResult,
  RestoreLocalDatabaseBackupInput,
  RestoreLocalDatabaseBackupResult,
} from "./backup-types";

const restoreTableOrder = [
  "projects",
  "settings",
  "local_settings",
  "approved_project_paths",
  "agent_seats",
  "tasks",
  "task_events",
  "build_checks",
  "review_records",
  "git_snapshots",
  "file_changes",
  "diff_summaries",
  "scope_checks",
  "quality_gate_configs",
  "quality_gate_runs",
  "quality_gate_events",
] as const;

const deleteTableOrder = [...restoreTableOrder].reverse();

function backupRecordId(kind: BackupKind, date = new Date()): string {
  return `backup-${kind}-${date.toISOString().replace(/[^0-9]/g, "").slice(0, 14)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function readBackupFileFacts(backupPath: string): Promise<{ fileSizeBytes: number; checksumSha256: string }> {
  assertBackupPathAllowed(backupPath);
  const fileStat = await stat(backupPath);
  if (!fileStat.isFile() || fileStat.size <= 0) {
    throw new Error("Backup file is missing or empty.");
  }

  return {
    fileSizeBytes: fileStat.size,
    checksumSha256: await sha256File(backupPath),
  };
}

async function assertBackupRecordUsable(id: string): Promise<NonNullable<Awaited<ReturnType<typeof getBackupRecordById>>>> {
  const record = await getBackupRecordById(id);
  if (!record) {
    throw new Error(`Backup record not found: ${id}`);
  }

  assertLocalDatabaseSourcePath(record.sourceDbPath);
  assertBackupPathAllowed(record.backupPath);
  const facts = await readBackupFileFacts(record.backupPath);
  if (facts.checksumSha256 !== record.checksumSha256) {
    throw new Error("Backup checksum does not match the recorded checksum.");
  }

  return record;
}

export async function createLocalDatabaseBackup(input: CreateLocalDatabaseBackupInput = {}): Promise<LocalDatabaseBackupResult> {
  initializeLocalDb();
  assertLocalDatabaseSourcePath(LOCAL_DB_PATH);
  await mkdir(LOCAL_BACKUP_DIR, { recursive: true });

  const backupPath = createBackupFilePath();
  assertBackupPathAllowed(backupPath);
  await sqliteClient.backup(backupPath);

  const facts = await readBackupFileFacts(backupPath);
  const record = await createBackupRecord({
    id: backupRecordId(input.backupKind ?? "manual"),
    backupPath,
    backupKind: input.backupKind ?? "manual",
    sourceDbPath: LOCAL_DB_PATH,
    fileSizeBytes: facts.fileSizeBytes,
    checksumSha256: facts.checksumSha256,
    status: "created",
    note: input.note,
  });

  return {
    record,
    sourceDbPath: LOCAL_DB_PATH,
  };
}

export async function verifyLocalDatabaseBackup(backupRecordId: string): Promise<BackupVerificationResult> {
  const record = await assertBackupRecordUsable(backupRecordId);
  const facts = await readBackupFileFacts(record.backupPath);
  const verifiedRecord = await updateBackupRecordStatus(record.id, "verified", record.note);

  return {
    ok: true,
    record: verifiedRecord,
    fileExists: true,
    checksumMatches: facts.checksumSha256 === record.checksumSha256,
    sizeBytes: facts.fileSizeBytes,
  };
}

export async function restoreDryRun(backupRecordId: string): Promise<RestoreDryRunResult> {
  const record = await assertBackupRecordUsable(backupRecordId);
  const dryRunRecord = await updateBackupRecordStatus(record.id, "dry_run_passed", record.note);

  return {
    ok: true,
    record: dryRunRecord,
    targetDbPath: LOCAL_DB_PATH,
    checksumMatches: true,
  };
}

function restoreApplicationTablesFromBackup(backupPath: string): void {
  assertBackupPathAllowed(backupPath);
  const escapedBackupPath = backupPath.replace(/'/g, "''");
  sqliteClient.exec(`ATTACH DATABASE '${escapedBackupPath}' AS restore_backup;`);
  try {
    sqliteClient.transaction(() => {
      sqliteClient.exec("PRAGMA foreign_keys = OFF;");
      for (const table of deleteTableOrder) {
        sqliteClient.exec(`DELETE FROM ${table};`);
      }
      for (const table of restoreTableOrder) {
        sqliteClient.exec(`INSERT INTO ${table} SELECT * FROM restore_backup.${table};`);
      }
      sqliteClient.exec("PRAGMA foreign_keys = ON;");
    })();
  } finally {
    sqliteClient.exec("DETACH DATABASE restore_backup;");
  }
}

export async function restoreLocalDatabaseBackup(input: RestoreLocalDatabaseBackupInput): Promise<RestoreLocalDatabaseBackupResult> {
  if (!input.confirmRestore) {
    throw new Error("Restore confirmation is required.");
  }

  const record = await assertBackupRecordUsable(input.backupRecordId);
  if (record.status !== "dry_run_passed") {
    throw new Error("Restore dry-run must pass before confirm restore.");
  }

  const normalizedBackupPath = path.resolve(record.backupPath);
  if (!normalizedBackupPath.startsWith(path.resolve(LOCAL_BACKUP_DIR))) {
    throw new Error("Restore source must be a registered local backup.");
  }

  const safetyBackup = await createLocalDatabaseBackup({
    backupKind: "pre_restore_safety",
    note: `Safety backup before restoring ${record.id}`,
  });

  restoreApplicationTablesFromBackup(record.backupPath);
  const restoredRecord = await markBackupRestored(record.id);

  return {
    ok: true,
    restoredRecord,
    safetyBackup,
  };
}
