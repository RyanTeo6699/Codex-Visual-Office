import type { BackupKind, BackupRecord } from "@/lib/types";

export interface CreateLocalDatabaseBackupInput {
  backupKind?: BackupKind;
  note?: string;
}

export interface LocalDatabaseBackupResult {
  record: BackupRecord;
  sourceDbPath: string;
}

export interface BackupVerificationResult {
  ok: boolean;
  record: BackupRecord;
  fileExists: boolean;
  checksumMatches: boolean;
  sizeBytes: number;
}

export interface RestoreDryRunResult {
  ok: boolean;
  record: BackupRecord;
  targetDbPath: string;
  checksumMatches: boolean;
}

export interface RestoreLocalDatabaseBackupInput {
  backupRecordId: string;
  confirmRestore: boolean;
}

export interface RestoreLocalDatabaseBackupResult {
  ok: boolean;
  restoredRecord: BackupRecord;
  safetyBackup: LocalDatabaseBackupResult;
}
