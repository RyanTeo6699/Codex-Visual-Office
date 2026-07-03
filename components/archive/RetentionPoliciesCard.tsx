import { ShieldCheck } from "lucide-react";
import type { RetentionPolicy } from "@/lib/types";

export function RetentionPoliciesCard({ policies }: { policies: RetentionPolicy[] }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Retention Policies</h2>
        </div>
        <span className="rounded-md border border-emerald-200/14 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100">
          dry-run only
        </span>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {policies.map((policy) => (
          <div key={policy.id} className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-100">{policy.target}</p>
              <span className="rounded-md border border-emerald-200/14 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100">
                {policy.mode}
              </span>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500">{policy.retentionDays} days / {policy.enabled ? "enabled" : "disabled"}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{policy.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
