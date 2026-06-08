import type { BackupKind, BackupRecord, BackupRecordStatus } from "@/lib/types";
import {
  createBackupRecordRow,
  getBackupRecordRowById,
  getLatestBackupRecordRow,
  listBackupRecordRows,
  updateBackupRecordRow,
  type BackupRecordRow,
} from "../repositories/backup-records";
import { nowIso } from "./time";

export interface CreateBackupRecordInput {
  id: string;
  backupPath: string;
  backupKind: BackupKind;
  sourceDbPath: string;
  fileSizeBytes: number;
  checksumSha256: string;
  status?: BackupRecordStatus;
  note?: string;
}

export function mapBackupRecordRow(row: BackupRecordRow): BackupRecord {
  return {
    id: row.id,
    backupPath: row.backupPath,
    backupKind: row.backupKind,
    sourceDbPath: row.sourceDbPath,
    fileSizeBytes: row.fileSizeBytes,
    checksumSha256: row.checksumSha256,
    status: row.status,
    note: row.note ?? undefined,
    createdAt: row.createdAt,
    restoredAt: row.restoredAt ?? undefined,
  };
}

export async function createBackupRecord(input: CreateBackupRecordInput): Promise<BackupRecord> {
  await createBackupRecordRow({
    id: input.id,
    backupPath: input.backupPath,
    backupKind: input.backupKind,
    sourceDbPath: input.sourceDbPath,
    fileSizeBytes: input.fileSizeBytes,
    checksumSha256: input.checksumSha256,
    status: input.status ?? "created",
    note: input.note?.trim() || null,
    createdAt: nowIso(),
    restoredAt: null,
  });

  const row = await getBackupRecordRowById(input.id);
  if (!row) {
    throw new Error(`Backup record was not persisted: ${input.id}`);
  }

  return mapBackupRecordRow(row);
}

export async function updateBackupRecordStatus(
  id: string,
  status: BackupRecordStatus,
  note?: string,
): Promise<BackupRecord> {
  await updateBackupRecordRow(id, {
    status,
    note: note?.trim() || undefined,
  });

  const row = await getBackupRecordRowById(id);
  if (!row) {
    throw new Error(`Backup record not found after status update: ${id}`);
  }

  return mapBackupRecordRow(row);
}

export async function listBackupRecords(): Promise<BackupRecord[]> {
  return (await listBackupRecordRows()).map(mapBackupRecordRow);
}

export async function getBackupRecordById(id: string): Promise<BackupRecord | undefined> {
  const row = await getBackupRecordRowById(id);
  return row ? mapBackupRecordRow(row) : undefined;
}

export async function getLatestBackupRecord(): Promise<BackupRecord | undefined> {
  const row = await getLatestBackupRecordRow();
  return row ? mapBackupRecordRow(row) : undefined;
}

export async function markBackupRestored(id: string): Promise<BackupRecord> {
  await updateBackupRecordRow(id, {
    status: "restored",
    restoredAt: nowIso(),
  });

  const row = await getBackupRecordRowById(id);
  if (!row) {
    throw new Error(`Backup record not found after restore mark: ${id}`);
  }

  return mapBackupRecordRow(row);
}
