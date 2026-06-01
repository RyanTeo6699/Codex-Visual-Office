import clsx from "clsx";
import { Activity } from "lucide-react";
import { statusColor } from "@/lib/status";
import type { Project, TaskEvent } from "@/lib/types";

export function EventTicker({ events, projects }: { events: TaskEvent[]; projects: Project[] }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-sky-200/70" />
        <h2 className="text-sm font-bold tracking-tight text-slate-100">Activity Feed</h2>
      </div>
      <div className="thin-scroll max-h-72 space-y-2 overflow-y-auto pr-1">
        {events.slice(0, 8).map((event) => {
          const project = projects.find((item) => item.id === event.projectId);
          return (
            <div key={event.id} className="grid grid-cols-[42px_1fr] gap-3 rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
              <span className="text-[11px] text-slate-500">{event.time}</span>
              <div>
                <span className={clsx("rounded-md border px-2 py-0.5 text-[10px] font-medium", statusColor[event.tone])}>
                  {project?.name}
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{event.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
