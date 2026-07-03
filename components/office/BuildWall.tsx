import clsx from "clsx";
import { CheckCircle2, CircleDashed, Loader2, MinusCircle, XCircle } from "lucide-react";
import { buildStatusLabel, statusColor } from "@/lib/status";
import type { BuildCheck, Project } from "@/lib/types";

const iconMap = {
  pending: CircleDashed,
  running: Loader2,
  passed: CheckCircle2,
  failed: XCircle,
  skipped: MinusCircle,
};

export function BuildWall({ checks, projects }: { checks: BuildCheck[]; projects: Project[] }) {
  const visibleChecks = checks.filter((check) => check.status === "failed" || check.status === "running" || check.status === "pending").slice(0, 4);
  const displayChecks = visibleChecks.length ? visibleChecks : checks.slice(0, 4);
  const failedCount = checks.filter((check) => check.status === "failed").length;

  return (
    <section className="relative overflow-hidden border border-white/8 bg-[#111a25]/72 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Build / Quality Wall</h2>
            <p className="mt-1 text-[11px] text-slate-500">Mock check state visible before review.</p>
          </div>
          <span className={clsx("border px-2 py-1 text-[10px] font-black uppercase", failedCount ? "border-rose-200/20 bg-rose-200/10 text-rose-100" : "border-emerald-200/18 bg-emerald-200/8 text-emerald-100")}>
            {failedCount ? `${failedCount} failed` : `${checks.length} checks`}
          </span>
        </div>
        <div className="space-y-2">
          {displayChecks.length ? displayChecks.map((check) => {
            const Icon = iconMap[check.status];
            const project = projects.find((item) => item.id === check.projectId);
            return (
              <div key={check.id} className={clsx("grid grid-cols-[auto_1fr_auto] items-center gap-3 border p-3", check.status === "failed" ? "border-rose-200/16 bg-rose-200/[0.045]" : "border-white/[0.05] bg-white/[0.03]")}>
                <Icon className={clsx("h-4 w-4", check.status === "running" ? "animate-spin text-sky-200" : check.status === "failed" ? "text-rose-200" : "text-slate-400")} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-100">{check.label}</p>
                  <p className="truncate text-[11px] text-slate-500">{project?.name} / {check.detail}</p>
                </div>
                <span className={clsx("rounded-md border px-2 py-1 text-[10px] font-semibold", statusColor[check.status])}>
                  {buildStatusLabel[check.status]}
                </span>
              </div>
            );
          }) : (
            <div className="border border-dashed border-white/10 bg-white/[0.025] p-3 text-xs leading-relaxed text-slate-500">
              No quality or build checks are recorded for this room yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
