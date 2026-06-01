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

  return (
    <section className="relative overflow-hidden rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Build Wall</h2>
          <span className="text-xs text-slate-500">{checks.length} checks</span>
        </div>
        <div className="space-y-2">
          {displayChecks.map((check) => {
            const Icon = iconMap[check.status];
            const project = projects.find((item) => item.id === check.projectId);
            return (
              <div key={check.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[14px] bg-white/[0.035] p-3">
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
          })}
        </div>
      </div>
    </section>
  );
}
