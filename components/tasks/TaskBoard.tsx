import { TaskCard } from "./TaskCard";
import { taskStatusLabel } from "@/lib/status";
import type { AgentSeat, Project, Task, TaskStatus } from "@/lib/types";

const lanes: TaskStatus[] = ["backlog", "ready", "running", "waiting_review", "blocked", "done"];

const laneTone: Record<TaskStatus, string> = {
  backlog: "border-slate-300/10 bg-slate-200/[0.025]",
  ready: "border-sky-200/12 bg-sky-200/[0.03]",
  running: "border-emerald-200/14 bg-emerald-200/[0.035]",
  waiting_review: "border-blue-200/14 bg-blue-200/[0.035]",
  blocked: "border-rose-200/16 bg-rose-200/[0.04]",
  done: "border-emerald-200/12 bg-emerald-200/[0.025]",
};

export function TaskBoard({
  tasks,
  projects,
  agentSeats,
}: {
  tasks: Task[];
  projects: Project[];
  agentSeats: AgentSeat[];
}) {
  return (
    <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
      {lanes.map((lane) => {
        const laneTasks = tasks.filter((task) => task.status === lane);
        return (
          <div key={lane} className={`min-h-32 border p-3 ${laneTone[lane]}`}>
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.12em] text-slate-300">{taskStatusLabel[lane]}</h2>
                <p className="mt-1 text-[10px] font-semibold text-slate-600">Office tray</p>
              </div>
              <span className="border border-white/[0.08] bg-black/12 px-2 py-0.5 text-xs font-bold text-slate-400">{laneTasks.length}</span>
            </div>
            <div className="space-y-2">
              {laneTasks.slice(0, 2).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={projects.find((project) => project.id === task.projectId)}
                  agent={agentSeats.find((agent) => agent.id === task.agentSeatId)}
                  compact
                />
              ))}
              {laneTasks.length > 2 ? <p className="px-2 pb-1 text-xs text-slate-500">+{laneTasks.length - 2} more in tray</p> : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
