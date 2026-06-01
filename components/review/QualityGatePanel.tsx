import clsx from "clsx";
import { buildStatusLabel, statusColor } from "@/lib/status";
import type { BuildCheck } from "@/lib/types";

export function QualityGatePanel({ checks }: { checks: BuildCheck[] }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <h2 className="text-sm font-bold tracking-tight text-slate-100">Quality Gate</h2>
      <div className="mt-4 space-y-2">
        {checks.map((check) => (
          <div key={check.id} className="flex items-center justify-between gap-3 rounded-[12px] border border-white/[0.04] bg-white/[0.035] p-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">{check.label}</p>
              <p className="mt-1 text-xs text-slate-500">{check.detail}</p>
            </div>
            <span className={clsx("rounded-md border px-2.5 py-1 text-[11px] font-semibold", statusColor[check.status])}>
              {buildStatusLabel[check.status]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
