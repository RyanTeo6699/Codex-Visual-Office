import type { ReactNode } from "react";
import { Boxes, CloudOff, Database, Github, HardDrive, KeyRound, Laptop, ListChecks, MonitorCog, ShieldCheck } from "lucide-react";
import { ApprovedProjectPathsCard, type SaveApprovedProjectPathAction, type SettingsProjectOption } from "./ApprovedProjectPathsCard";
import { BackupRestoreCard, type BackupFormAction } from "./BackupRestoreCard";
import type { CodexCliStatus } from "@/lib/codex-cli/types";
import type { ApprovedProjectPath, BackupRecord, LocalSetting } from "@/lib/types";

export function SettingsPanel({
  settings,
  codexStatus,
  localDbPath,
  projects,
  approvedPaths,
  backupDir,
  backupRecords,
  saveApprovedProjectPathAction,
  createBackupNowAction,
  restoreDryRunAction,
  confirmRestoreAction,
}: {
  settings: LocalSetting[];
  codexStatus: CodexCliStatus;
  localDbPath: string;
  projects: SettingsProjectOption[];
  approvedPaths: ApprovedProjectPath[];
  backupDir: string;
  backupRecords: BackupRecord[];
  saveApprovedProjectPathAction: SaveApprovedProjectPathAction;
  createBackupNowAction: BackupFormAction;
  restoreDryRunAction: BackupFormAction;
  confirmRestoreAction: BackupFormAction;
}) {
  const settingMap = new Map(settings.map((setting) => [setting.key, setting]));
  const localMode = settingMap.get("app.localMode")?.value;
  const themePreference = settingMap.get("app.themePreference")?.value;
  const qualityDefaults = settingMap.get("quality.defaultEnabledGateKeys")?.value;
  const desktopPackaging = settingMap.get("desktopPackaging.statusDisplay")?.value;

  return (
    <div className="space-y-5">
      <section className="rounded-[22px] border border-white/8 bg-[#111a25]/78 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phase 6 / Local Productization</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Settings Center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              Local-only settings and runtime status. Backup / Restore is limited to the local SQLite database under .local.
            </p>
          </div>
          <span className="rounded-md border border-emerald-200/16 bg-emerald-200/8 px-3 py-1.5 text-xs font-bold text-emerald-100">
            Local-first
          </span>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <SettingsCard
          icon={<ShieldCheck className="h-4 w-4 text-emerald-100/80" />}
          title="Local-first status"
          badge={readString(localMode?.label) || "Local-first mode"}
          rows={[
            ["Enabled", readBoolean(localMode?.enabled) ? "Yes" : "No"],
            ["Theme preference", readString(themePreference?.theme) || "dark"],
            ["Cloud sync", "Not implemented"],
          ]}
        />

        <SettingsCard
          icon={<MonitorCog className="h-4 w-4 text-sky-100/80" />}
          title="Codex CLI status"
          badge={codexStatus.installed ? "Installed" : "Unavailable"}
          rows={[
            ["Installed", codexStatus.installed ? "Yes" : "No"],
            ["Version", codexStatus.version ?? "Not available"],
            ["Path", codexStatus.path ?? "Not available"],
            ["Auth", codexStatus.authStatus],
            ["Detection", codexStatus.detectionMode],
          ]}
          note="Safe detection only. Tokens and ~/.codex/auth.json are not read."
        />

        <SettingsCard
          icon={<Database className="h-4 w-4 text-cyan-100/80" />}
          title="Local DB status"
          badge="SQLite local-only"
          rows={[
            ["Path", localDbPath],
            ["Storage", "Local SQLite"],
            ["Remote sync", "Not implemented"],
          ]}
        />

        <SettingsCard
          icon={<Github className="h-4 w-4 text-slate-100/80" />}
          title="GitHub remote status"
          badge="Remote configured"
          rows={[
            ["Remote", "https://github.com/RyanTeo6699/Codex-Visual-Office.git"],
            ["GitHub API", "Not connected"],
            ["Cloud sync", "Not implemented"],
          ]}
          note="Static project remote display only. No GitHub API call is made."
        />

        <SettingsCard
          icon={<ListChecks className="h-4 w-4 text-emerald-100/80" />}
          title="Quality Gate Defaults"
          badge="Display only"
          rows={[
            ["Enabled keys", readStringArray(qualityDefaults?.keys).join(", ")],
            ["Command execution", "Not triggered from Settings"],
          ]}
        />

        <ApprovedProjectPathsCard projects={projects} approvedPaths={approvedPaths} saveApprovedProjectPathAction={saveApprovedProjectPathAction} />

        <BackupRestoreCard
          dbPath={localDbPath}
          backupDir={backupDir}
          backupRecords={backupRecords}
          createBackupNowAction={createBackupNowAction}
          restoreDryRunAction={restoreDryRunAction}
          confirmRestoreAction={confirmRestoreAction}
        />

        <SettingsCard
          icon={<Laptop className="h-4 w-4 text-slate-100/80" />}
          title="Desktop Packaging"
          badge="Future evaluation"
          rows={[
            ["Status", readString(desktopPackaging?.status) || "planned"],
            ["Note", readString(desktopPackaging?.note) || "Desktop packaging is planning-only in Phase 6"],
            ["Tauri", "Not installed"],
            ["Electron", "Not installed"],
          ]}
        />
      </div>

      <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
        <div className="flex items-center gap-2">
          <CloudOff className="h-4 w-4 text-sky-100/80" />
          <h2 className="text-sm font-bold text-slate-100">Safety Boundary</h2>
        </div>
        <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-400 md:grid-cols-2 xl:grid-cols-4">
          <BoundaryItem icon={<KeyRound className="h-3.5 w-3.5" />} label="No token storage" />
          <BoundaryItem icon={<CloudOff className="h-3.5 w-3.5" />} label="No cloud sync" />
          <BoundaryItem icon={<Boxes className="h-3.5 w-3.5" />} label="Manual paths only" />
          <BoundaryItem icon={<HardDrive className="h-3.5 w-3.5" />} label="SQLite backup only" />
        </div>
      </section>
    </div>
  );
}

function SettingsCard({
  icon,
  title,
  badge,
  rows,
  note,
}: {
  icon: ReactNode;
  title: string;
  badge: string;
  rows: Array<[string, string]>;
  note?: string;
}) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold tracking-tight text-slate-100">{title}</h2>
        </div>
        <span className="rounded-md border border-slate-200/12 bg-slate-200/6 px-2 py-1 text-[10px] font-semibold text-slate-300">
          {badge}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 break-words text-xs font-semibold text-slate-200">{value || "Not available"}</p>
          </div>
        ))}
      </div>
      {note ? <p className="mt-3 text-[11px] font-semibold text-slate-500">{note}</p> : null}
    </section>
  );
}

function BoundaryItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      {icon}
      {label}
    </div>
  );
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
