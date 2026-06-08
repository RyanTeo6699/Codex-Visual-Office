import { DatabaseBackup, ShieldCheck } from "lucide-react";
import type { BackupRecord } from "@/lib/types";

export type BackupFormAction = (formData: FormData) => Promise<void>;

export function BackupRestoreCard({
  dbPath,
  backupDir,
  backupRecords,
  createBackupNowAction,
  restoreDryRunAction,
  confirmRestoreAction,
}: {
  dbPath: string;
  backupDir: string;
  backupRecords: BackupRecord[];
  createBackupNowAction: BackupFormAction;
  restoreDryRunAction: BackupFormAction;
  confirmRestoreAction: BackupFormAction;
}) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <DatabaseBackup className="h-4 w-4 text-violet-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Backup / Restore</h2>
        </div>
        <span className="rounded-md border border-violet-200/14 bg-violet-200/8 px-2 py-1 text-[10px] font-semibold text-violet-100">
          SQLite only
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoRow label="Database path" value={dbPath} />
        <InfoRow label="Backup directory" value={backupDir} />
      </div>

      <form action={createBackupNowAction} className="mt-4 rounded-[14px] border border-violet-200/12 bg-violet-200/[0.035] p-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[220px] flex-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Backup note</span>
            <input name="note" placeholder="Manual SQLite backup" className="mt-1 w-full rounded-[12px] border border-white/10 bg-[#0b111a] px-3 py-2 text-xs font-semibold text-slate-100 placeholder:text-slate-600" />
          </label>
          <button className="inline-flex items-center gap-2 rounded-[12px] border border-violet-200/20 bg-violet-200/10 px-3 py-2 text-xs font-bold text-violet-100 hover:bg-violet-200/14">
            <ShieldCheck className="h-4 w-4" />
            Backup Now: local SQLite database only
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          Creates one local SQLite backup under .local/backups. No source directory, env file, token, remote storage, or scheduled job is involved.
        </p>
      </form>

      <div className="mt-4 space-y-2">
        {backupRecords.length ? (
          backupRecords.map((record) => (
            <div key={record.id} className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-100">{record.backupKind === "pre_restore_safety" ? "Pre-restore safety backup" : "Manual backup"}</p>
                  <p className="mt-1 break-words text-[11px] font-semibold text-slate-500">{record.backupPath}</p>
                </div>
                <span className="rounded-md border border-slate-200/12 bg-slate-200/6 px-2 py-1 text-[10px] font-semibold text-slate-300">
                  {record.status}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-[11px] font-semibold text-slate-500 md:grid-cols-4">
                <p>Created: {record.createdAt}</p>
                <p>Size: {record.fileSizeBytes} bytes</p>
                <p>Checksum: {record.checksumSha256.slice(0, 12)}</p>
                <p>Restored: {record.restoredAt ?? "No"}</p>
              </div>
              {record.note ? <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{record.note}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={restoreDryRunAction}>
                  <input type="hidden" name="backupRecordId" value={record.id} />
                  <button className="rounded-[12px] border border-sky-200/16 bg-sky-200/8 px-3 py-2 text-xs font-bold text-sky-100 hover:bg-sky-200/12">
                    Dry Run Restore: check only
                  </button>
                </form>
                <form action={confirmRestoreAction}>
                  <input type="hidden" name="backupRecordId" value={record.id} />
                  <button
                    disabled={record.status !== "dry_run_passed"}
                    className="rounded-[12px] border border-amber-200/16 bg-amber-200/8 px-3 py-2 text-xs font-bold text-amber-100 hover:bg-amber-200/12 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirm Restore: safety backup first
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3 text-xs leading-relaxed text-slate-500">
            No local SQLite backup records yet.
          </p>
        )}
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold text-slate-200">{value}</p>
    </div>
  );
}
