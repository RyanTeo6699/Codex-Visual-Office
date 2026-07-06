import type { ReactNode } from "react";
import Link from "next/link";
import {
  Archive,
  BadgeCheck,
  CloudOff,
  DatabaseBackup,
  FolderLock,
  KeyRound,
  LaptopMinimal,
  ListChecks,
  OctagonAlert,
  PackageX,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import type { CleanupDryRunPreview } from "@/lib/archive/archive-types";
import type { AppRuntimeStatus } from "@/lib/app-runtime/app-runtime-types";
import type { RunnerPolicy } from "@/lib/codex-cli/runner-types";
import type { DesktopBetaStatus } from "@/lib/desktop/desktop-beta-types";
import type { LocalLauncherReport } from "@/lib/local-launcher/local-launcher-types";
import type { LocalShellStatus } from "@/lib/local-shell/local-shell-types";
import type { SafetySummary } from "@/lib/safety/safety-types";
import type { ApprovedProjectPath, BackupRecord, RetentionPolicy } from "@/lib/types";

type SafetyLevel = "pass" | "watch" | "blocked";

export function SafetyAuditPanel({
  localShellStatus,
  runnerPolicy,
  approvedPaths,
  backupRecords,
  retentionPolicies,
  cleanupPreview,
  launcherReport,
  safetySummary,
  desktopBetaStatus,
  appRuntimeStatus,
}: {
  localShellStatus: LocalShellStatus;
  runnerPolicy: RunnerPolicy;
  approvedPaths: ApprovedProjectPath[];
  backupRecords: BackupRecord[];
  retentionPolicies: RetentionPolicy[];
  cleanupPreview: CleanupDryRunPreview;
  launcherReport: LocalLauncherReport;
  safetySummary: SafetySummary;
  desktopBetaStatus: DesktopBetaStatus;
  appRuntimeStatus: AppRuntimeStatus;
}) {
  const forbiddenEntries = Object.entries(localShellStatus.forbiddenCapabilities);
  const detectedForbidden = forbiddenEntries.filter(([, detected]) => detected);
  const executionAttempted = Object.values(localShellStatus.executionAttempted).some(Boolean) || Object.values(launcherReport.executionAttempted).some(Boolean);
  const approvedPathCount = approvedPaths.filter((path) => path.approved).length;
  const enabledRetentionPolicies = retentionPolicies.filter((policy) => policy.enabled).length;
  const desktopBetaLevel = desktopBetaStatus.safetyStatus === "blocked" ? "blocked" : desktopBetaStatus.desktopBetaCandidateConfigured ? "pass" : "watch";
  const overallLevel: SafetyLevel = detectedForbidden.length || executionAttempted || desktopBetaLevel === "blocked" ? "blocked" : localShellStatus.shellReadiness === "ready_for_local_dev" && desktopBetaLevel === "pass" ? "pass" : "watch";
  const warnings = buildWarnings({
    approvedPathCount,
    detectedForbidden,
    executionAttempted,
    localShellStatus,
    backupRecords,
    cleanupPreview,
    helperWarnings: safetySummary.warnings,
  });

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[22px] border border-emerald-200/12 bg-[radial-gradient(circle_at_16%_0%,rgba(16,185,129,0.18),transparent_32%),linear-gradient(135deg,rgba(10,18,27,0.96),rgba(6,10,16,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200/16 bg-emerald-200/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              Safety / Permission Audit
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Safety Audit Room</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              Read-only private beta safety review for the local visual office. This room checks permissions, launch boundaries, storage behavior, and forbidden capability signals without adding execution controls.
            </p>
          </div>
          <div className="grid min-w-[240px] gap-2 text-xs font-semibold text-slate-300">
            <StatusBanner level="pass" label="Local-only safety status" value={localShellStatus.localModeEnabled ? "Local mode active" : "Needs local mode review"} />
            <StatusBanner level={overallLevel} label="Overall safety status" value={formatOverallStatus(overallLevel)} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <AuditCard
          icon={<LaptopMinimal className="h-4 w-4 text-cyan-100/80" />}
          title="App-first Runtime"
          level={appRuntimeStatus.appFirstMode && !appRuntimeStatus.manualLocalhostRequiredForEndUser ? "pass" : "watch"}
          badge={appRuntimeStatus.readiness}
          rows={[
            ["Runtime strategy", appRuntimeStatus.internalRuntimeStrategy],
            ["Manual localhost for end users", appRuntimeStatus.manualLocalhostRequiredForEndUser ? "Required" : "Not required"],
            ["Browser fallback", appRuntimeStatus.browserFallbackAvailable ? "Available" : "Needs review"],
            ["Health check mode", appRuntimeStatus.healthCheckMode],
            ["Production packaging", appRuntimeStatus.productionPackagingImplemented ? "Implemented" : "Not implemented"],
            ["Auto updater", appRuntimeStatus.autoUpdaterImplemented ? "Implemented" : "Not implemented"],
          ]}
        />

        <AuditCard
          icon={<FolderLock className="h-4 w-4 text-cyan-100/80" />}
          title="Approved Path Permission"
          level={approvedPathCount > 0 ? "pass" : "watch"}
          badge={`${approvedPathCount} approved`}
          rows={[
            ["Approval model", "Manual approved project path records only"],
            ["Runner path gate", runnerPolicy.requireApprovedProjectPath ? "Required before scoped runner use" : "Not required"],
            ["Path discovery", "No automatic workspace discovery from this room"],
            ["Permission helper", safetySummary.allowedCapabilities.includes("approved_project_paths") ? "Approved path capability modeled" : "Needs helper review"],
          ]}
        />

        <AuditCard
          icon={<Terminal className="h-4 w-4 text-emerald-100/80" />}
          title="Runner Permission"
          level={runnerPolicy.allowArbitraryShell ? "blocked" : "pass"}
          badge={runnerPolicy.executionMode}
          rows={[
            ["Allowlisted executable", runnerPolicy.allowlistedExecutable],
            ["Arbitrary shell", boolToNoYes(runnerPolicy.allowArbitraryShell)],
            ["Prompt preview", runnerPolicy.requirePromptPreview ? "Required" : "Not required"],
            ["Auto push / deploy", runnerPolicy.allowAutoPush || runnerPolicy.allowAutoDeploy ? "Allowed" : "Not allowed"],
            ["Safety helper", safetySummary.blockedCapabilities.includes("arbitrary_shell") ? "Arbitrary shell blocked" : "Needs helper review"],
          ]}
        />

        <AuditCard
          icon={<DatabaseBackup className="h-4 w-4 text-violet-100/80" />}
          title="Backup / Restore Safety"
          level="pass"
          badge="SQLite scoped"
          rows={[
            ["Backup records", `${backupRecords.length} local records`],
            ["Source scope", "Local SQLite database only"],
            ["Credential guard", "Backup paths reject auth, env, token, and private key patterns"],
          ]}
        />

        <AuditCard
          icon={<Archive className="h-4 w-4 text-sky-100/80" />}
          title="Archive / Retention Safety"
          level={cleanupPreview.dataDeleted || cleanupPreview.backupFilesDeleted ? "blocked" : "pass"}
          badge="dry-run only"
          rows={[
            ["Retention policies", `${enabledRetentionPolicies} enabled / ${retentionPolicies.length} configured`],
            ["Cleanup preview", `${cleanupPreview.totalWouldDeleteCount} records marked would-delete`],
            ["Data deletion", cleanupPreview.dataDeleted ? "Detected" : "No delete action available"],
            ["Backup deletion", cleanupPreview.backupFilesDeleted ? "Detected" : "No delete action available"],
          ]}
        />

        <AuditCard
          icon={<LaptopMinimal className="h-4 w-4 text-emerald-100/80" />}
          title="Local Launcher Safety"
          level={launcherReport.launchMode === "status_only" && !Object.values(launcherReport.executionAttempted).some(Boolean) ? "pass" : "watch"}
          badge={launcherReport.launchMode}
          rows={[
            ["App URL", launcherReport.appUrl],
            ["Browser opener support", launcherReport.browserOpenSupported ? "Available" : "Unavailable"],
            ["Execution attempted", Object.values(launcherReport.executionAttempted).some(Boolean) ? "Yes" : "No"],
            ["Cloud sync attempted", launcherReport.executionAttempted.cloudSync ? "Yes" : "No"],
          ]}
        />

        <AuditCard
          icon={<PackageX className="h-4 w-4 text-amber-100/80" />}
          title="Tauri Prototype Safety"
          level={desktopBetaLevel}
          badge={desktopBetaStatus.safetyStatus}
          rows={[
            ["Desktop beta candidate", desktopBetaStatus.desktopBetaCandidateConfigured ? "Configured" : "Needs review"],
            ["App", `${desktopBetaStatus.appName} ${desktopBetaStatus.appVersion}`],
            ["Mac-first", desktopBetaStatus.macFirst ? "Yes" : "No"],
            ["Tauri prototype", desktopBetaStatus.tauriPrototypeConfigured ? "Configured" : localShellStatus.desktopPackagingStatus],
            ["Browser fallback", desktopBetaStatus.browserLauncherFallbackAvailable ? "Available" : "Needs review"],
            ["Production packaging", desktopBetaStatus.productionReleaseImplemented ? "Implemented" : "Not implemented"],
            ["Code signing", desktopBetaStatus.codeSigningImplemented ? "Implemented" : "Not implemented"],
            ["Notarization", desktopBetaStatus.notarizationImplemented ? "Implemented" : "Not implemented"],
            ["Auto updater", desktopBetaStatus.autoUpdaterImplemented ? "Implemented" : "Not implemented"],
            ["Electron", desktopBetaStatus.electronImplemented ? "Implemented" : "Not implemented"],
            ["Cloud sync", desktopBetaStatus.cloudSyncImplemented ? "Implemented" : "Not implemented"],
            ["Desktop runtime attempted", launcherReport.executionAttempted.desktopRuntime ? "Yes" : "No"],
          ]}
        />

        <AuditCard
          icon={<KeyRound className="h-4 w-4 text-rose-100/80" />}
          title="Credential Safety"
          level="pass"
          badge="read blocked"
          rows={[
            ["Credential storage", "Not implemented in this room"],
            ["Token/auth/env access", "no token/auth/env read"],
            ["Remote account sync", "Not implemented"],
            ["Secrets in backup scope", "Rejected by backup safety patterns"],
          ]}
        />

        <section className="rounded-[18px] border border-rose-200/12 bg-[linear-gradient(135deg,rgba(39,14,24,0.58),rgba(13,18,28,0.9))] p-4 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <OctagonAlert className="h-4 w-4 text-rose-100/80" />
              <h2 className="text-sm font-bold tracking-tight text-slate-100">Forbidden Capabilities</h2>
            </div>
            <span className={pillClass(detectedForbidden.length ? "blocked" : "pass")}>{detectedForbidden.length ? `${detectedForbidden.length} detected` : "none detected"}</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {forbiddenEntries.map(([name, detected]) => (
              <div key={name} className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
                <p className="text-[10px] font-bold uppercase text-slate-500">{formatCapabilityName(name)}</p>
                <p className={detected ? "mt-1 text-xs font-semibold text-rose-100" : "mt-1 text-xs font-semibold text-emerald-100"}>{detected ? "Detected" : "Not detected"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[18px] border border-cyan-200/10 bg-[linear-gradient(135deg,rgba(14,23,34,0.82),rgba(7,12,20,0.9))] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudOff className="h-4 w-4 text-cyan-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Safety Boundary Statements</h2>
          </div>
          <span className={pillClass("pass")}>local-only boundary</span>
        </div>
        <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-300 md:grid-cols-2 xl:grid-cols-4">
          {[
            "no arbitrary shell",
            "no command text box",
            "no terminal emulator",
            "no node-pty",
            "no token/auth/env read",
            "no cloud sync",
            "no production desktop packaging",
            "no code signing",
            "no notarization",
            "no auto updater",
            "no Electron",
            "no destructive cleanup",
          ].map((item) => (
            <BoundaryItem key={item} label={item} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[18px] border border-amber-200/12 bg-amber-200/[0.04] p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-amber-100">Safety warnings</h2>
          </div>
          <div className="mt-3 space-y-2">
            {warnings.map((warning) => (
              <p key={warning} className="rounded-[12px] border border-amber-200/10 bg-black/15 px-3 py-2 text-xs font-semibold leading-relaxed text-slate-300">
                {warning}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-emerald-200/12 bg-emerald-200/[0.04] p-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-emerald-100">Recommended next action</h2>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-200">{recommendedNextAction(overallLevel, warnings, approvedPathCount)}</p>
          <p className="mt-3 rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2 text-xs font-semibold leading-relaxed text-slate-400">
            Helper guidance: {safetySummary.recommendedNextAction}
          </p>
          <Link href="/settings" className="mt-4 inline-flex rounded-[12px] border border-emerald-200/16 bg-emerald-200/8 px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-200/12">
            View Settings Center
          </Link>
        </div>
      </section>
    </div>
  );
}

function AuditCard({
  icon,
  title,
  level,
  badge,
  rows,
}: {
  icon: ReactNode;
  title: string;
  level: SafetyLevel;
  badge: string;
  rows: Array<[string, string]>;
}) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold tracking-tight text-slate-100">{title}</h2>
        </div>
        <span className={pillClass(level)}>{badge}</span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 break-words text-xs font-semibold text-slate-200">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBanner({ level, label, value }: { level: SafetyLevel; label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.035] px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className={level === "blocked" ? "mt-1 text-sm font-black text-rose-100" : level === "watch" ? "mt-1 text-sm font-black text-amber-100" : "mt-1 text-sm font-black text-emerald-100"}>{value}</p>
    </div>
  );
}

function BoundaryItem({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <ShieldCheck className="h-3.5 w-3.5 text-emerald-100/70" />
      {label}
    </div>
  );
}

function pillClass(level: SafetyLevel): string {
  if (level === "blocked") {
    return "rounded-md border border-rose-200/16 bg-rose-200/8 px-2 py-1 text-[10px] font-semibold text-rose-100";
  }

  if (level === "watch") {
    return "rounded-md border border-amber-200/16 bg-amber-200/8 px-2 py-1 text-[10px] font-semibold text-amber-100";
  }

  return "rounded-md border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100";
}

function boolToNoYes(value: boolean): string {
  return value ? "Yes" : "No";
}

function formatOverallStatus(level: SafetyLevel): string {
  if (level === "blocked") {
    return "Blocked by forbidden signal";
  }

  if (level === "watch") {
    return "Watch items need review";
  }

  return "Safety boundary clear";
}

function formatCapabilityName(name: string): string {
  if (name === "autoUpdater") return "Updater";
  if (name === "cloudSync") return "Remote sync";
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function buildWarnings(input: {
  approvedPathCount: number;
  detectedForbidden: Array<[string, boolean]>;
  executionAttempted: boolean;
  localShellStatus: LocalShellStatus;
  backupRecords: BackupRecord[];
  cleanupPreview: CleanupDryRunPreview;
  helperWarnings: string[];
}): string[] {
  const warnings: string[] = [...input.helperWarnings];

  if (input.detectedForbidden.length) {
    warnings.push(`Forbidden capability signals detected: ${input.detectedForbidden.map(([name]) => formatCapabilityName(name)).join(", ")}.`);
  }

  if (input.executionAttempted) {
    warnings.push("Execution-attempt telemetry is not fully clean. Review scripts before expanding permissions.");
  }

  if (input.approvedPathCount === 0) {
    warnings.push("No approved project paths are currently active, so runner permission should remain review-only.");
  }

  if (!input.localShellStatus.qualityGatesConfigured) {
    warnings.push("Quality gate configuration is incomplete; keep review decisions manual.");
  }

  if (input.backupRecords.length === 0) {
    warnings.push("No local backup records exist yet; restore safety should remain conservative.");
  }

  if (input.cleanupPreview.totalWouldDeleteCount > 0) {
    warnings.push("Archive retention has would-delete candidates, but cleanup remains dry-run only.");
  }

  if (!warnings.length) {
    warnings.push("No safety warnings are currently active.");
  }

  return warnings;
}

function recommendedNextAction(level: SafetyLevel, warnings: string[], approvedPathCount: number): string {
  if (level === "blocked") {
    return "Keep the audit room read-only and resolve detected forbidden capability signals before widening permissions.";
  }

  if (approvedPathCount === 0) {
    return "Register an approved project path in Settings before relying on any scoped runner flow.";
  }

  if (warnings.length && warnings[0] !== "No safety warnings are currently active.") {
    return "Review the warning list, then re-run desktop beta verification before marking Phase 13 desktop beta candidate review complete.";
  }

  return "Keep Safety Audit visible in navigation and continue Phase 13 desktop beta review with no new execution controls.";
}
