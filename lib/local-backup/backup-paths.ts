import path from "node:path";
import { LOCAL_DB_DIR } from "@/lib/local-db/paths";

export const LOCAL_BACKUP_DIR = path.join(LOCAL_DB_DIR, "backups");

export function createBackupFileName(date = new Date()): string {
  const stamp = date.toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z")
    .replace("T", "-")
    .slice(0, 16);

  const suffix = Math.random().toString(36).slice(2, 8);
  return `codex-visual-office-${stamp}-${suffix}.sqlite`;
}

export function createBackupFilePath(date = new Date()): string {
  return path.join(LOCAL_BACKUP_DIR, createBackupFileName(date));
}
