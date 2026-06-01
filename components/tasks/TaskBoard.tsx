import { TaskCard } from "./TaskCard";
import { taskStatusLabel } from "@/lib/status";
import type { AgentSeat, Project, Task, TaskStatus } from "@/lib/types";

const lanes: TaskStatus[] = ["backlog", "ready", "running", "waiting_review", "blocked", "done"];

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
          <div key={lane} className="min-h-28 rounded-[18px] border border-white/8 bg-[#111a25]/58 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-300">{taskStatusLabel[lane]}</h2>
              <span className="rounded-md bg-white/7 px-2 py-0.5 text-xs text-slate-400">{laneTasks.length}</span>
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
