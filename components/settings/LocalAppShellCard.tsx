import { LaptopMinimal, ShieldCheck } from "lucide-react";
import type { LocalShellStatus } from "@/lib/local-shell/local-shell-types";

export function LocalAppShellCard({ status }: { status: LocalShellStatus }) {
  const rows = [
    ["Local-first mode", status.localModeEnabled ? "Ready" : "Needs setup"],
    ["Local database status", status.localDatabaseConfigured ? status.localDatabasePath : "Not configured"],
    ["Settings Center ready", status.settingsCenterReady ? "Ready" : "Needs setup"],
    ["Approved Project Paths", status.approvedProjectPathsReady ? `${status.counts.approvedProjectPaths} configured` : "Not configured"],
    ["Backup / Restore", status.backupRestoreReady ? `${status.counts.backupRecords} records` : "Not ready"],
    ["Archive Room", status.archiveRoomReady ? `${status.counts.retentionPolicies} dry-run policies` : "Not ready"],
    ["Quality Gates ready", status.qualityGatesConfigured ? `${status.counts.qualityGateConfigs} configs` : "Not configured"],
    ["Codex CLI", status.codexCliDetected ? status.codexCliStatusLabel : "Not detected"],
    ["Desktop Packaging", "Future evaluation only"],
  ] as const;

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <LaptopMinimal className="h-4 w-4 text-emerald-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Local App Shell</h2>
        </div>
        <span className="rounded-md border border-emerald-200/14 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100">
          {status.shellReadiness}
        </span>
      </div>

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
          </div>
        </div>
        <div className="rounded-[14px] border border-amber-200/12 bg-amber-200/[0.04] p-3">
          <h3 className="text-xs font-bold text-amber-100">Runtime boundary</h3>
          <div className="mt-2 grid gap-1 text-xs font-semibold text-slate-300 md:grid-cols-2">
            <p>No desktop packaging yet.</p>
            <p>No auto update.</p>
            <p>No background daemon.</p>
            <p>No cloud sync.</p>
            <p>Local-only runtime.</p>
            <p>Tauri / Electron not implemented.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
