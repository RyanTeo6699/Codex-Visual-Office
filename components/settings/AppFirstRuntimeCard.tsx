import { LaptopMinimal, ShieldCheck } from "lucide-react";
import type { AppRuntimeStatus } from "@/lib/app-runtime/app-runtime-types";

export function AppFirstRuntimeCard({ status }: { status: AppRuntimeStatus }) {
  return (
    <section className="rounded-[18px] border border-cyan-200/12 bg-[linear-gradient(135deg,rgba(14,31,43,0.82),rgba(10,16,25,0.92))] p-4 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <LaptopMinimal className="h-4 w-4 text-cyan-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">App-first Desktop Runtime</h2>
        </div>
        <span className="rounded-md border border-cyan-200/14 bg-cyan-200/8 px-2 py-1 text-[10px] font-semibold text-cyan-100">
          {status.readiness}
        </span>
      </div>

      <p className="mt-3 max-w-4xl text-xs font-semibold leading-relaxed text-slate-400">
        Codex Visual Office is moving to an App-first desktop runtime. The desktop app should own runtime readiness and show the office in an independent app window. Manual localhost access remains a contributor/support fallback, not the final end-user path.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <StatusTile label="App-first mode" value={status.appFirstMode ? "Enabled" : "Not enabled"} />
        <StatusTile label="Manual localhost for end users" value={status.manualLocalhostRequiredForEndUser ? "Required" : "Not required"} />
        <StatusTile label="Browser fallback" value={status.browserFallbackAvailable ? "Available" : "Needs review"} />
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {status.modes.map((mode) => (
          <div key={mode.mode} className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">{mode.label}</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-300">{mode.description}</p>
            <p className="mt-2 text-[11px] font-semibold text-slate-500">End-user primary: {mode.endUserPrimaryPath ? "yes" : "no"}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[14px] border border-emerald-200/12 bg-emerald-200/[0.035] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-100/80" />
            <h3 className="text-xs font-bold text-emerald-100">Runtime safety boundary</h3>
          </div>
          <div className="mt-2 grid gap-1 text-xs font-semibold text-slate-300 md:grid-cols-2">
            <p>Production packaging not implemented.</p>
            <p>Code signing not implemented.</p>
            <p>Notarization not implemented.</p>
            <p>Auto updater not implemented.</p>
            <p>Electron not implemented.</p>
            <p>Cloud sync not implemented.</p>
          </div>
        </div>
        <div className="rounded-[14px] border border-amber-200/12 bg-amber-200/[0.04] p-3">
          <h3 className="text-xs font-bold text-amber-100">Runtime health</h3>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-300">{status.health.diagnostic}</p>
          <p className="mt-2 text-[11px] font-semibold text-slate-500">Health mode: {status.healthCheckMode}. Target URL remains an internal implementation detail: {status.targetUrl}.</p>
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
