import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, CircleDot, FileText } from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import type { AgentSeat, Project, Task } from "@/lib/types";

const priorityTone: Record<Task["priority"], string> = {
  low: "text-slate-400",
  medium: "text-sky-200",
  high: "text-amber-200",
  critical: "text-rose-200",
};

export function TaskCard({
  task,
  project,
  agent,
  compact = false,
}: {
  task: Task;
  project?: Project;
  agent?: AgentSeat;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/review/${task.id}`}
      className={clsx(
        "group block border border-white/8 bg-white/[0.035] p-3 shadow-sm transition hover:border-sky-200/20 hover:bg-white/[0.06]",
        compact ? "" : "p-4"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <TaskStatusBadge status={task.status} />
        <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-slate-200" />
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-100">{task.title}</h3>
      <div className="mt-3 grid gap-1.5 text-[11px] text-slate-500">
        {project ? <span className="truncate font-semibold text-slate-400">{project.name}</span> : null}
        {agent ? <span className="truncate">{agent.name}</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-[10px] uppercase tracking-[0.12em]">
        <span className="inline-flex items-center gap-2">
          <CircleDot className={clsx("h-3.5 w-3.5", priorityTone[task.priority])} />
          <span className={priorityTone[task.priority]}>{task.priority}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-500">
          <FileText className="h-3.5 w-3.5" />
          {task.changedFiles.length} files
        </span>
      </div>
    </Link>
  );
}
