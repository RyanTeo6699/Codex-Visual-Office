import path from "node:path";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { LOCAL_BACKUP_DIR } from "./backup-paths";

const forbiddenBackupPathPatterns = [
  /~\/\.codex/i,
  /auth\.json/i,
  /(^|\/)\.env(?:\.local)?$/i,
  /(^|\/)id_(?:rsa|dsa|ecdsa|ed25519)$/i,
  /private[_-]?key/i,
  /\.(?:pem|key)$/i,
];

export function assertLocalDatabaseSourcePath(sourcePath: string): void {
  if (path.resolve(sourcePath) !== path.resolve(LOCAL_DB_PATH)) {
    throw new Error("Backup source must be the Codex Visual Office local SQLite database.");
  }
}

export function assertBackupPathAllowed(backupPath: string): void {
  const resolvedBackupPath = path.resolve(backupPath);
  const resolvedBackupDir = path.resolve(LOCAL_BACKUP_DIR);

  if (!resolvedBackupPath.startsWith(`${resolvedBackupDir}${path.sep}`)) {
    throw new Error("Backup path must be inside .local/backups.");
  }

  if (!resolvedBackupPath.endsWith(".sqlite")) {
    throw new Error("Backup path must be a SQLite file.");
  }

  if (forbiddenBackupPathPatterns.some((pattern) => pattern.test(resolvedBackupPath))) {
    throw new Error("Backup path cannot target auth, env, token, or private key files.");
  }
}
