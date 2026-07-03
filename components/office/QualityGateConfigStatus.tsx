import { ShieldCheck } from "lucide-react";
import type { QualityGateConfig } from "@/lib/types";

export function QualityGateConfigStatus({ configs }: { configs: QualityGateConfig[] }) {
  const enabledCount = configs.filter((config) => config.enabled).length;

  return (
    <section className="border border-white/8 bg-[#121a24]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Quality Gate Config</h2>
        </div>
        <span className="border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100">
          {enabledCount} enabled / {configs.length} configured
        </span>
      </div>

      {configs.length ? (
        <div className="mt-4 space-y-2">
          {configs.map((config) => (
            <div key={config.id} className="border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-100">{config.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">{config.command}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                  <span className={config.enabled ? "border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-emerald-100" : "border border-slate-200/10 bg-slate-200/6 px-2 py-1 text-slate-400"}>
                    {config.enabled ? "enabled" : "disabled"}
                  </span>
                  <span className="border border-sky-200/14 bg-sky-200/8 px-2 py-1 text-sky-100">
                    allowlisted
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-slate-500">Status: Config only / Not run</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 bg-black/12 px-3 py-2 text-xs text-slate-500">No quality gate configs available.</p>
      )}

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        Config only. Quality gate execution starts in Phase 5 Step 2.
      </p>
    </section>
  );
}
