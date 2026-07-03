import clsx from "clsx";
import { Activity } from "lucide-react";
import { statusColor } from "@/lib/status";
import type { Project, TaskEvent } from "@/lib/types";

export function EventTicker({ events, projects }: { events: TaskEvent[]; projects: Project[] }) {
  return (
    <section className="border border-white/8 bg-[#111a25]/66 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-200/70" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Activity Ticker</h2>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{events.length} events</span>
      </div>
      <div className="thin-scroll max-h-72 space-y-2 overflow-y-auto pr-1">
        {events.length ? events.slice(0, 8).map((event) => {
          const project = projects.find((item) => item.id === event.projectId);
          return (
            <div key={event.id} className="grid grid-cols-[48px_1fr] gap-3 border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
              <span className="border-r border-white/[0.06] pr-2 text-[11px] font-bold text-slate-500">{event.time}</span>
              <div>
                <span className={clsx("border px-2 py-0.5 text-[10px] font-medium", statusColor[event.tone])}>
                  {project?.name}
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{event.message}</p>
              </div>
            </div>
          );
        }) : (
          <div className="border border-dashed border-white/10 bg-white/[0.025] p-3 text-xs leading-relaxed text-slate-500">
            No local task events have been recorded for this room yet.
          </div>
        )}
      </div>
    </section>
  );
}
