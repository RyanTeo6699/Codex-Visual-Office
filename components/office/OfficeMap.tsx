"use client";

import { motion } from "framer-motion";
import { AgentSeat } from "./AgentSeat";
import { projectStatusLabel, taskStatusLabel } from "@/lib/status";
import type { AgentSeat as AgentSeatType, Project, Task } from "@/lib/types";

const progressByStatus: Record<Task["status"], number> = {
  backlog: 8,
  ready: 22,
  running: 58,
  waiting_review: 82,
  blocked: 43,
  done: 100,
};

export function OfficeMap({
  projects,
  tasks,
  agentSeats,
}: {
  projects: Project[];
  tasks: Task[];
  agentSeats: AgentSeatType[];
}) {
  const running = tasks.filter((task) => task.status === "running").length;
  const blocked = tasks.filter((task) => task.status === "blocked").length;
  const review = tasks.filter((task) => task.status === "waiting_review").length;
  const occupiedSeats = agentSeats.filter((agent) => agent.status !== "idle").length;

  return (
    <section id="projects" className="pixel-shell relative overflow-hidden border border-slate-700/80 bg-[#0f1722] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] lg:p-6">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/70 to-transparent" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100/70">2D Codex Operations Floor</p>
          <h2 className="pixel-title mt-2 text-2xl font-black text-white md:text-4xl">Project rooms with AI employees at work</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300/90">
            Every room has a task tray, Codex work pod, progress signal, and a path back to human review.
          </p>
        </div>
        <div className="pixel-hud grid grid-cols-4 gap-2 border border-slate-600/70 bg-[#141d2c] p-2 text-center">
          <Metric label="Running" value={running} />
          <Metric label="Blocked" value={blocked} />
          <Metric label="Review" value={review} />
          <Metric label="Seats" value={occupiedSeats} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="pixel-office-floor relative min-h-[520px] overflow-hidden border border-slate-700/80 bg-[#1e293b] p-4">
          <div className="pixel-window left-[8%] top-5" />
          <div className="pixel-window left-[43%] top-5" />
          <div className="pixel-window right-[8%] top-5" />
          <div className="pixel-planter left-[18%] bottom-8" />
          <div className="pixel-planter right-[22%] bottom-10" />

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {projects.map((project, index) => {
              const projectTasks = tasks.filter((task) => task.projectId === project.id);
              const agents = agentSeats.filter((agent) => project.agentSeatIds.includes(agent.id));

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <PixelProjectRoom project={project} tasks={projectTasks} agents={agents} />
                </motion.div>
              );
            })}
          </div>
        </div>

        <aside className="pixel-side-panel border border-slate-700/80 bg-[#101827] p-3">
          <div className="border-b border-slate-700/80 px-2 pb-3 pt-1">
            <h2 className="pixel-label text-xs font-black uppercase text-slate-300">Codex Work Pods</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Active AI employees and their current work item.</p>
          </div>
          <div className="space-y-3">
            {agentSeats.map((agent) => (
              <AgentSeat
                key={agent.id}
                agent={agent}
                project={projects.find((project) => project.id === agent.projectId)}
                task={tasks.find((task) => task.id === agent.taskId)}
              />
            ))}
          </div>
          <div className="mt-4 border border-cyan-200/10 bg-cyan-200/[0.035] p-3">
            <p className="pixel-label text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/70">Office protocol</p>
            <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-400">
              <p>1. Codex works inside an approved local path.</p>
              <p>2. Git evidence and quality gates are visible.</p>
              <p>3. Final approval stays human-controlled.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PixelProjectRoom({
  project,
  tasks,
  agents,
}: {
  project: Project;
  tasks: Task[];
  agents: AgentSeatType[];
}) {
  const activeTask = tasks.find((task) => task.status === "running" || task.status === "blocked" || task.status === "waiting_review") ?? tasks[0];
  const progress = activeTask ? progressByStatus[activeTask.status] : 0;
  const waitingCount = tasks.filter((task) => task.status === "waiting_review").length;
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;
  const nextAction = activeTask?.status === "waiting_review"
    ? "Open review desk"
    : activeTask?.status === "blocked"
      ? "Inspect blocker"
      : activeTask?.status === "running"
        ? "Monitor seat"
        : "Open room";

  return (
    <a href={`/projects/${project.id}`} className={`pixel-room pixel-room-${project.accent} group block min-h-[216px] border-4 p-3 transition hover:-translate-y-1 hover:brightness-110`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="pixel-room-title text-base font-black leading-tight text-white">{project.name}</h3>
          <p className="mt-1 text-[10px] font-bold uppercase text-slate-300">{project.phase}</p>
        </div>
        <div className="pixel-door" />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <div className="space-y-3">
          <PixelDesk />
          <div className="pixel-progress border border-[#0f172a] bg-[#0b1220]">
            <div className="h-2 bg-[#67e8f9]" style={{ width: `${progress}%` }} />
          </div>
          <p className="line-clamp-2 min-h-9 text-xs leading-relaxed text-slate-200">
            {activeTask ? activeTask.title : "No active task"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="pixel-task-chip bg-slate-700">{projectStatusLabel[project.status]}</span>
            {waitingCount ? <span className="pixel-task-chip pixel-task-waiting_review">{waitingCount} review</span> : null}
            {blockedCount ? <span className="pixel-task-chip pixel-task-blocked">{blockedCount} blocked</span> : null}
            {tasks.slice(0, 3).map((task) => (
              <span key={task.id} className={`pixel-task-chip pixel-task-${task.status}`}>{taskStatusLabel[task.status]}</span>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-300/80">{nextAction}</p>
        </div>

        <div className="flex min-w-20 flex-col items-center justify-end gap-2">
          {agents.length ? (
            agents.map((agent) => (
              <PixelWorker key={agent.id} agent={agent} task={activeTask} />
            ))
          ) : (
            <div className="pixel-empty-seat">
              <div className="pixel-chair" />
              <span>empty</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function PixelDesk() {
  return (
    <div className="pixel-desk">
      <div className="pixel-monitor">
        <span />
      </div>
      <div className="pixel-keyboard" />
      <div className="pixel-mug" />
    </div>
  );
}

function PixelWorker({ agent, task }: { agent: AgentSeatType; task?: Task }) {
  return (
    <div className={`pixel-worker-wrap pixel-worker-${agent.status}`}>
      <div className="pixel-speech">{task ? `${progressByStatus[task.status]}%` : "idle"}</div>
      <div className="pixel-worker">
        <div className="pixel-head" />
        <div className="pixel-body" />
        <div className="pixel-arm left" />
        <div className="pixel-arm right" />
        <div className="pixel-leg left" />
        <div className="pixel-leg right" />
      </div>
      <p>{agent.name.replace("Codex ", "")}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 px-3 py-2">
      <p className="text-xl font-bold text-slate-100">{value}</p>
      <p className="pixel-label mt-0.5 text-[10px] font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}
