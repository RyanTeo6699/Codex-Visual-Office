import { LaptopMinimal, ShieldCheck } from "lucide-react";
import type { DesktopBetaStatus } from "@/lib/desktop/desktop-beta-types";
import type { LocalShellStatus } from "@/lib/local-shell/local-shell-types";
import { DEFAULT_LOCAL_APP_URL, LOCAL_APP_URL_ENV } from "@/lib/local-launcher/local-launcher-config";

export function LocalAppShellCard({ status, desktopBetaStatus }: { status: LocalShellStatus; desktopBetaStatus: DesktopBetaStatus }) {
  const rows = [
    ["Local-first mode", status.localModeEnabled ? "Ready" : "Needs setup"],
    ["Local database status", status.localDatabaseConfigured ? status.localDatabasePath : "Not configured"],
    ["Settings Center ready", status.settingsCenterReady ? "Ready" : "Needs setup"],
    ["Approved Project Paths", status.approvedProjectPathsReady ? `${status.counts.approvedProjectPaths} configured` : "Not configured"],
    ["Backup / Restore", status.backupRestoreReady ? `${status.counts.backupRecords} records` : "Not ready"],
    ["Archive Room", status.archiveRoomReady ? `${status.counts.retentionPolicies} dry-run policies` : "Not ready"],
    ["Quality Gates ready", status.qualityGatesConfigured ? `${status.counts.qualityGateConfigs} configs` : "Not configured"],
    ["Codex CLI", status.codexCliDetected ? status.codexCliStatusLabel : "Not detected"],
    ["Local Launcher URL", DEFAULT_LOCAL_APP_URL],
    ["Desktop shell prototype", "Tauri prototype configured"],
    ["Desktop beta candidate", desktopBetaStatus.desktopBetaCandidateConfigured ? desktopBetaStatus.safetyStatus : "Needs review"],
    ["Desktop beta app", `${desktopBetaStatus.appName} ${desktopBetaStatus.appVersion}`],
    ["Mac-first beta", desktopBetaStatus.macFirst ? "Yes" : "No"],
    ["Browser launcher fallback", desktopBetaStatus.browserLauncherFallbackAvailable ? "Available" : "Needs review"],
    ["Production desktop packaging", desktopBetaStatus.productionReleaseImplemented ? "Detected" : "Not implemented"],
    ["Code signing", desktopBetaStatus.codeSigningImplemented ? "Detected" : "Not implemented"],
    ["Notarization", desktopBetaStatus.notarizationImplemented ? "Detected" : "Not implemented"],
    ["Auto updater", desktopBetaStatus.autoUpdaterImplemented ? "Detected" : "Not implemented"],
    ["Electron runtime", desktopBetaStatus.electronImplemented ? "Detected" : "Not implemented"],
    ["Cloud sync", desktopBetaStatus.cloudSyncImplemented ? "Detected" : "Not implemented"],
  ] as const;

  return (
    <section className="rounded-[18px] border border-emerald-200/12 bg-[linear-gradient(135deg,rgba(17,26,37,0.82),rgba(10,16,25,0.9))] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <LaptopMinimal className="h-4 w-4 text-emerald-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Local App Shell</h2>
        </div>
        <span className="rounded-md border border-emerald-200/14 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100">
          {status.shellReadiness}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <StatusTile label="App-first runtime" value={desktopBetaStatus.desktopBetaCandidateConfigured ? "Strategy configured" : "Needs review"} />
        <StatusTile label="Shell readiness" value={status.shellReadiness} />
        <StatusTile label="Browser launcher" value={desktopBetaStatus.browserLauncherFallbackAvailable ? "Fallback available" : "Needs review"} />
      </div>

      <p className="mt-3 rounded-[12px] border border-cyan-200/10 bg-cyan-200/[0.035] px-3 py-2 text-xs font-semibold leading-relaxed text-slate-300">
        App-first direction: the desktop app should own runtime readiness. Manual localhost/browser launch remains contributor fallback, not the intended end-user path.
      </p>

      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 break-words text-xs font-semibold text-slate-200">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[14px] border border-emerald-200/12 bg-emerald-200/[0.035] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-100/80" />
            <h3 className="text-xs font-bold text-emerald-100">Launch method</h3>
          </div>
          <div className="mt-2 space-y-1 text-xs font-semibold text-slate-300">
            <p>npm run dev</p>
            <p>npm run local:shell:status</p>
            <p>npm run local:shell:verify</p>
            <p>npm run local:launcher</p>
            <p>npm run local:launcher:open</p>
            <p>npm run local:launcher:verify</p>
            <p>{LOCAL_APP_URL_ENV}=http://localhost:3000</p>
          </div>
        </div>
        <div className="rounded-[14px] border border-amber-200/12 bg-amber-200/[0.04] p-3">
          <h3 className="text-xs font-bold text-amber-100">Runtime boundary</h3>
          <div className="mt-2 grid gap-1 text-xs font-semibold text-slate-300 md:grid-cols-2">
            <p>{desktopBetaStatus.tauriPrototypeConfigured ? "Tauri prototype configured." : "Tauri prototype needs review."}</p>
            <p>{desktopBetaStatus.desktopBetaCandidateConfigured ? "Desktop beta candidate configured." : "Desktop beta candidate needs review."}</p>
            <p>{desktopBetaStatus.browserLauncherFallbackAvailable ? "Browser fallback available." : "Browser fallback needs review."}</p>
            <p>{desktopBetaStatus.productionReleaseImplemented ? "Production packaging detected: review required." : "Production packaging not implemented."}</p>
            <p>{desktopBetaStatus.autoUpdaterImplemented ? "Auto updater detected: review required." : "Auto updater not implemented."}</p>
            <p>{desktopBetaStatus.codeSigningImplemented || desktopBetaStatus.notarizationImplemented ? "Signing or notarization detected: review required." : "Code signing / notarization not implemented."}</p>
            <p>{desktopBetaStatus.electronImplemented ? "Electron detected: review required." : "Electron not implemented."}</p>
            <p>Local-only runtime.</p>
            <p>No background daemon.</p>
            <p>No remote account sync.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.035] px-3 py-3">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-100">{value}</p>
    </div>
  );
}
