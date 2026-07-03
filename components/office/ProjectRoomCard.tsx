import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, Armchair, FolderKanban, Route } from "lucide-react";
import { projectStatusLabel, statusColor } from "@/lib/status";
import type { AgentSeat, Project, Task } from "@/lib/types";

const accentClass: Record<Project["accent"], string> = {
  cyan: "from-sky-200/14 via-slate-800/64 to-slate-900/68 border-sky-100/18",
  teal: "from-emerald-200/13 via-slate-800/64 to-slate-900/68 border-emerald-100/18",
  amber: "from-amber-200/14 via-slate-800/64 to-slate-900/68 border-amber-100/20",
  red: "from-rose-200/12 via-slate-800/64 to-slate-900/68 border-rose-100/18",
  violet: "from-blue-200/12 via-slate-800/64 to-slate-900/68 border-blue-100/18",
};

export function ProjectRoomCard({
  project,
  tasks,
  agents,
}: {
  project: Project;
  tasks: Task[];
  agents: AgentSeat[];
}) {
  const activeTask = tasks.find((task) => task.status === "running" || task.status === "blocked" || task.status === "waiting_review");
  const waitingCount = tasks.filter((task) => task.status === "waiting_review").length;
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;

  return (
    <Link
      href={`/projects/${project.id}`}
      className={clsx("iso-tile group relative block min-h-64 overflow-hidden border bg-gradient-to-br p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-white/20", accentClass[project.accent])}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="iso-content relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.06] text-slate-100">
            <FolderKanban className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-slate-100" />
        </div>
        <h3 className="mt-5 text-xl font-bold leading-tight tracking-tight text-white">{project.name}</h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{project.phase}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className={clsx("border px-3 py-1 text-[11px] font-semibold", statusColor[project.status])}>
            {projectStatusLabel[project.status]}
          </span>
          <span className="border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">{tasks.length} tasks</span>
          {waitingCount ? <span className="border border-blue-200/14 bg-blue-200/8 px-3 py-1 text-[11px] text-blue-100">{waitingCount} review</span> : null}
          {blockedCount ? <span className="border border-rose-200/14 bg-rose-200/8 px-3 py-1 text-[11px] text-rose-100">{blockedCount} blocked</span> : null}
        </div>
        <div className="mt-6 grid gap-2">
          {agents.length ? (
            agents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-3 border border-white/8 bg-black/14 p-3 text-[11px] text-slate-300">
                <span className="grid h-8 w-8 place-items-center border border-white/8 bg-white/[0.05] text-slate-200">
                  <Armchair className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-100">{agent.name.replace("Codex ", "")}</span>
                  {agent.status.replace("_", " ")}
                </span>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-white/10 bg-black/12 p-3 text-[11px] text-slate-500">No seat assigned</div>
          )}
        </div>
        {activeTask ? (
          <div className="mt-5 border border-white/[0.06] bg-black/14 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <Route className="h-3.5 w-3.5" />
              Active path
            </div>
            <p className="text-sm font-semibold leading-relaxed text-slate-300">{activeTask.title}</p>
          </div>
        ) : null}
      </div>
      <div className="absolute -bottom-5 left-10 h-20 w-36 border border-white/8 bg-white/[0.035]" />
      <div className="absolute right-5 top-5 h-16 w-16 border border-white/8 bg-black/10" />
    </Link>
  );
}
