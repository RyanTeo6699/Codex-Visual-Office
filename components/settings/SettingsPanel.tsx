import type { ReactNode } from "react";
import Link from "next/link";
import { Boxes, CloudOff, Database, Github, HardDrive, KeyRound, Laptop, ListChecks, Radar, ShieldAlert, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ApprovedProjectPathsCard, type SaveApprovedProjectPathAction, type SettingsProjectOption } from "./ApprovedProjectPathsCard";
import { AppFirstRuntimeCard } from "./AppFirstRuntimeCard";
import { ArchiveRetentionCard } from "./ArchiveRetentionCard";
import { BackupRestoreCard, type BackupFormAction } from "./BackupRestoreCard";
import { CodexRuntimeReliabilityCard } from "./CodexRuntimeReliabilityCard";
import { LocalAppShellCard } from "./LocalAppShellCard";
import type { CodexCliStatus } from "@/lib/codex-cli/types";
import type { AppRuntimeStatus } from "@/lib/app-runtime/app-runtime-types";
import type { DesktopBetaStatus } from "@/lib/desktop/desktop-beta-types";
import type { LocalShellStatus } from "@/lib/local-shell/local-shell-types";
import type { ApprovedProjectPath, BackupRecord, LocalSetting, RetentionPolicy } from "@/lib/types";

export function SettingsPanel({
  settings,
  codexStatus,
  localDbPath,
  projects,
  approvedPaths,
  backupDir,
  backupRecords,
  retentionPolicies,
  localShellStatus,
  desktopBetaStatus,
  appRuntimeStatus,
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
  retentionPolicies: RetentionPolicy[];
  localShellStatus: LocalShellStatus;
  desktopBetaStatus: DesktopBetaStatus;
  appRuntimeStatus: AppRuntimeStatus;
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
      <section className="overflow-hidden rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(135deg,rgba(17,26,37,0.92),rgba(7,12,20,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-200/14 bg-cyan-200/[0.055] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Settings / Local Control
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Settings Center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              Product controls for the local visual office. Approved project paths are registered manually, Settings performs no workspace discovery, and runner access stays limited to approved path records.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-2 text-xs font-semibold text-slate-300">
            <span className="inline-flex items-center justify-between rounded-[14px] border border-emerald-200/16 bg-emerald-200/8 px-3 py-2 text-emerald-100">
              <span>Local-first</span>
              <Radar className="h-4 w-4" />
            </span>
            <span className="rounded-[14px] border border-white/[0.06] bg-white/[0.035] px-3 py-2">
              {approvedPaths.filter((path) => path.approved).length} approved path records
            </span>
            <span className="rounded-[14px] border border-white/[0.06] bg-white/[0.035] px-3 py-2">
              {retentionPolicies.filter((policy) => policy.enabled).length} dry-run policies enabled
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <AppFirstRuntimeCard status={appRuntimeStatus} />
        <LocalAppShellCard status={localShellStatus} desktopBetaStatus={desktopBetaStatus} />

        <section className="rounded-[18px] border border-emerald-200/12 bg-emerald-200/[0.04] p-4 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-100/80" />
              <h2 className="text-sm font-bold tracking-tight text-slate-100">Safety Audit</h2>
            </div>
            <span className="rounded-md border border-emerald-200/14 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100">
              read-only
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-xs font-semibold leading-relaxed text-slate-400">
            Review local-only safety status, runner permission, backup and retention boundaries, credential safety, and forbidden capability signals. The audit room has no execution controls.
          </p>
          <Link href="/safety" className="mt-4 inline-flex rounded-[12px] border border-emerald-200/16 bg-emerald-200/8 px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-200/12">
            Open Safety Audit
          </Link>
        </section>

        <SettingsCard
          icon={<ShieldCheck className="h-4 w-4 text-emerald-100/80" />}
          title="Local-first status"
          badge={readString(localMode?.label) || "Local-first mode"}
          rows={[
            ["Enabled", readBoolean(localMode?.enabled) ? "Yes" : "No"],
            ["Theme preference", readString(themePreference?.theme) || "dark"],
            ["Remote account sync", "Not implemented"],
          ]}
        />

        <CodexRuntimeReliabilityCard status={codexStatus} approvedPaths={approvedPaths} />

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
          badge="Static remote display"
          rows={[
            ["Remote", "https://github.com/RyanTeo6699/Codex-Visual-Office.git"],
            ["GitHub API", "Not connected"],
            ["Remote account sync", "Not implemented"],
          ]}
          note="Static project remote display only. No GitHub API call is made and no remote sync is attempted."
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

        <ArchiveRetentionCard policies={retentionPolicies} />

        <SettingsCard
          icon={<Laptop className="h-4 w-4 text-slate-100/80" />}
          title="Desktop Packaging"
          badge={desktopBetaStatus.safetyStatus}
          rows={[
            ["Status", desktopBetaStatus.desktopBetaCandidateConfigured ? "Desktop beta candidate configured" : readString(desktopPackaging?.status) || "Needs review"],
            ["App", `${desktopBetaStatus.appName} ${desktopBetaStatus.appVersion}`],
            ["Mac-first", desktopBetaStatus.macFirst ? "Yes" : "No"],
            ["Tauri prototype", desktopBetaStatus.tauriPrototypeConfigured ? "Configured" : "Needs review"],
            ["Browser fallback", desktopBetaStatus.browserLauncherFallbackAvailable ? "Available" : "Needs review"],
            ["Production release", desktopBetaStatus.productionReleaseImplemented ? "Implemented" : "Not implemented"],
            ["Code signing", desktopBetaStatus.codeSigningImplemented ? "Implemented" : "Not implemented"],
            ["Notarization", desktopBetaStatus.notarizationImplemented ? "Implemented" : "Not implemented"],
            ["Auto updater", desktopBetaStatus.autoUpdaterImplemented ? "Implemented" : "Not implemented"],
            ["Electron", desktopBetaStatus.electronImplemented ? "Implemented" : "Not implemented"],
            ["Cloud sync", desktopBetaStatus.cloudSyncImplemented ? "Implemented" : "Not implemented"],
          ]}
          note={desktopBetaStatus.warnings[0] ?? "Desktop beta is local-only and not a signed or notarized production release."}
        />
      </div>

      <section className="rounded-[18px] border border-sky-200/10 bg-[linear-gradient(135deg,rgba(14,23,34,0.82),rgba(7,12,20,0.88))] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudOff className="h-4 w-4 text-sky-100/80" />
            <h2 className="text-sm font-bold text-slate-100">Safety Boundary</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500">Workspace guardrails for manual project registration and local records.</p>
        </div>
        <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-400 md:grid-cols-2 xl:grid-cols-4">
          <BoundaryItem icon={<KeyRound className="h-3.5 w-3.5" />} label="No token storage" />
          <BoundaryItem icon={<CloudOff className="h-3.5 w-3.5" />} label="No cloud workspace sync" />
          <BoundaryItem icon={<Boxes className="h-3.5 w-3.5" />} label="Manual paths only" />
          <BoundaryItem icon={<HardDrive className="h-3.5 w-3.5" />} label="Runner uses approved paths" />
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
