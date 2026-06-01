import Link from "next/link";
import clsx from "clsx";
import { Armchair, Bot } from "lucide-react";
import { agentStatusLabel, statusColor } from "@/lib/status";
import type { AgentSeat as AgentSeatType, Project, Task } from "@/lib/types";

const progressByStatus: Record<Task["status"], number> = {
  backlog: 8,
  ready: 22,
  running: 58,
  waiting_review: 82,
  blocked: 43,
  done: 100,
};

export function AgentSeat({
  agent,
  project,
  task,
}: {
  agent: AgentSeatType;
  project?: Project;
  task?: Task;
}) {
  const progress = task ? progressByStatus[task.status] : 0;
  const role = agent.status === "build_failed" || agent.status === "blocked"
    ? "Intervention needed"
    : agent.status === "waiting_review"
      ? "Review handoff"
      : agent.status === "editing"
        ? "Implementation seat"
        : "Work pod";

  const seat = (
    <article className="relative overflow-hidden border border-slate-700/80 bg-[#141d2d] p-4 transition hover:border-sky-200/40 hover:bg-[#192438]">
      <div className="absolute right-4 top-4 h-11 w-11 border border-slate-600/60 bg-slate-200/[0.025]" />
      <div className="relative z-10 flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center border border-slate-700 bg-[#202c40]">
          {agent.status === "idle" ? <Armchair className="h-5 w-5 text-slate-300" /> : <Bot className="h-5 w-5 text-sky-100" />}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white">{agent.name}</h3>
          <p className="mt-1 truncate text-xs text-slate-400">{role}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={clsx("inline-flex border px-3 py-1 text-[11px] font-bold", statusColor[agent.status])}>
          {agentStatusLabel[agent.status]}
        </span>
        {project ? <span className="text-xs text-slate-500">{project.name}</span> : null}
      </div>
      <p className="mt-4 min-h-10 text-xs leading-relaxed text-slate-300">{agent.focus}</p>
      {task ? (
        <div className="mt-3 border border-slate-800 bg-black/14 p-3">
          <p className="text-xs leading-relaxed text-slate-200">{task.title}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 border border-slate-800 bg-[#0b1220]">
              <div className="h-full bg-sky-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-bold text-slate-400">{progress}%</span>
          </div>
        </div>
      ) : null}
    </article>
  );

  return task ? <Link href={`/review/${task.id}`}>{seat}</Link> : seat;
}
