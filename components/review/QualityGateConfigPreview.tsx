import { ListChecks } from "lucide-react";
import type { QualityGateConfig } from "@/lib/types";

export function QualityGateConfigPreview({ configs }: { configs: QualityGateConfig[] }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-emerald-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Quality Gates Config Preview</h2>
        </div>
        <span className="rounded-md border border-slate-200/12 bg-slate-200/6 px-2 py-1 text-[10px] font-semibold text-slate-300">
          Config only
        </span>
      </div>

      <p className="mt-3 rounded-[12px] border border-emerald-200/10 bg-emerald-200/[0.035] px-3 py-2 text-xs font-semibold text-emerald-100">
        Config only -- execution starts in Phase 5 Step 2
      </p>

      {configs.length ? (
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {configs.map((config) => (
            <div key={config.id} className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-100">{config.name}</p>
                  <p className="mt-1 break-words text-[11px] font-semibold text-slate-500">{config.command}</p>
                </div>
                <span className={config.enabled ? "rounded-md border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100" : "rounded-md border border-slate-200/10 bg-slate-200/6 px-2 py-1 text-[10px] font-semibold text-slate-400"}>
                  {config.enabled ? "enabled" : "disabled"}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                <span className="rounded-md border border-sky-200/14 bg-sky-200/8 px-2 py-1 text-sky-100">allowlisted</span>
                <span className="rounded-md border border-slate-200/10 bg-black/12 px-2 py-1 text-slate-400">Not run</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No configured quality gates for this project.</p>
      )}

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        No command execution, terminal output, automatic repair, commit, push, or deploy action exists in this preview.
      </p>
    </section>
  );
}
