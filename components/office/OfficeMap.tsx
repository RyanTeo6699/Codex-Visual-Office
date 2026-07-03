"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CircleAlert, ClipboardCheck, FolderLock, Route, type LucideIcon } from "lucide-react";
import { AgentSeat } from "./AgentSeat";
import { projectStatusLabel, taskStatusLabel } from "@/lib/status";
import type { AgentSeat as AgentSeatType, ApprovedProjectPath, Project, Task } from "@/lib/types";

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
  approvedPaths = [],
}: {
  projects: Project[];
  tasks: Task[];
  agentSeats: AgentSeatType[];
  approvedPaths?: ApprovedProjectPath[];
}) {
  const running = tasks.filter((task) => task.status === "running").length;
  const blocked = tasks.filter((task) => task.status === "blocked").length;
  const review = tasks.filter((task) => task.status === "waiting_review").length;
  const occupiedSeats = agentSeats.filter((agent) => agent.status !== "idle").length;
  const reviewTask = tasks.find((task) => task.status === "waiting_review");
  const blockedTask = tasks.find((task) => task.status === "blocked");

  return (
    <section id="projects" className="pixel-shell relative overflow-hidden border border-slate-700/80 bg-[#0f1722] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] lg:p-6">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/70 to-transparent" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100/70">2D Codex Operations Floor</p>
          <h2 className="pixel-title mt-2 text-2xl font-black text-white md:text-4xl">Entrance map to project rooms</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300/90">
            Each room exposes its current task, active Codex seats, blocked work, and the next review doorway.
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
          <div className="pointer-events-none absolute inset-x-8 top-[86px] z-0 h-3 border-y border-sky-200/10 bg-sky-200/[0.035]" />
          <div className="pointer-events-none absolute bottom-20 left-1/2 top-[86px] z-0 w-3 -translate-x-1/2 border-x border-sky-200/10 bg-sky-200/[0.035]" />

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {projects.length ? projects.map((project, index) => {
              const projectTasks = tasks.filter((task) => task.projectId === project.id);
              const agents = agentSeats.filter((agent) => project.agentSeatIds.includes(agent.id));
              const approvedPath = approvedPaths.find((path) => path.projectId === project.id && path.approved);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <PixelProjectRoom project={project} tasks={projectTasks} agents={agents} approvedPath={approvedPath} />
                </motion.div>
              );
            }) : (
              <div className="grid min-h-[360px] place-items-center border border-dashed border-slate-600/70 bg-black/12 p-6 text-center">
                <div>
                  <p className="text-lg font-black text-white">No project rooms yet</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Once projects exist, this map will show room health, Codex seats, active tasks, blockers, and review doors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="pixel-side-panel border border-slate-700/80 bg-[#101827] p-3">
          <div className="border-b border-slate-700/80 px-2 pb-3 pt-1">
            <h2 className="pixel-label text-xs font-black uppercase text-slate-300">Codex Staff Board</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Active seats and the work item currently attached to each desk.</p>
          </div>
          <div className="mt-3 grid gap-2">
            <OfficeAlert
              icon={ClipboardCheck}
              label="Review doorway"
              value={reviewTask?.title ?? "No review task waiting"}
              tone="blue"
            />
            <OfficeAlert
              icon={CircleAlert}
              label="Blocked doorway"
              value={blockedTask?.title ?? "No blocked task"}
              tone="rose"
            />
          </div>
          <div className="mt-3 space-y-3">
            {agentSeats.length ? agentSeats.map((agent) => (
              <AgentSeat
                key={agent.id}
                agent={agent}
                project={projects.find((project) => project.id === agent.projectId)}
                task={tasks.find((task) => task.id === agent.taskId)}
              />
            )) : (
              <div className="border border-dashed border-white/10 bg-white/[0.025] p-3 text-xs leading-relaxed text-slate-500">
                No Codex seats are active. Seats will appear here when a project has assigned local work.
              </div>
            )}
          </div>
          <div className="mt-4 border border-cyan-200/10 bg-cyan-200/[0.035] p-3">
            <div className="flex items-center gap-2">
              <Route className="h-3.5 w-3.5 text-cyan-100/80" />
              <p className="pixel-label text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/70">Office protocol</p>
            </div>
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
  approvedPath,
}: {
  project: Project;
  tasks: Task[];
  agents: AgentSeatType[];
  approvedPath?: ApprovedProjectPath;
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
    <Link href={`/projects/${project.id}`} className={`pixel-room pixel-room-${project.accent} group block min-h-[236px] border-4 p-3 transition hover:-translate-y-1 hover:brightness-110`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="pixel-room-title text-base font-black leading-tight text-white">{project.name}</h3>
          <p className="mt-1 text-[10px] font-bold uppercase text-slate-300">{project.phase}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`project-dot-${project.accent} h-2.5 w-2.5 border border-black/50`} />
          <ArrowUpRight className="h-4 w-4 text-slate-200/80 transition group-hover:text-white" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <div className="space-y-3">
          <PixelDesk />
          <div className="pixel-progress border border-[#0f172a] bg-[#0b1220]">
            <div className="h-2 bg-[#67e8f9]" style={{ width: `${progress}%` }} />
          </div>
          <p className="line-clamp-2 min-h-9 text-xs font-semibold leading-relaxed text-slate-100">
            {activeTask ? activeTask.title : "No active task"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="pixel-task-chip bg-slate-700">{projectStatusLabel[project.status]}</span>
            <span className={approvedPath ? "pixel-task-chip bg-emerald-700/70 text-emerald-50" : "pixel-task-chip bg-amber-700/70 text-amber-50"}>
              {approvedPath ? "approved path" : "path setup"}
            </span>
            {waitingCount ? <span className="pixel-task-chip pixel-task-waiting_review">{waitingCount} review</span> : null}
            {blockedCount ? <span className="pixel-task-chip pixel-task-blocked">{blockedCount} blocked</span> : null}
            {tasks.slice(0, 3).map((task) => (
              <span key={task.id} className={`pixel-task-chip pixel-task-${task.status}`}>{taskStatusLabel[task.status]}</span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 border border-black/20 bg-black/14 px-2 py-1.5">
            <p className="flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-300/80">
              <FolderLock className="h-3 w-3 shrink-0" />
              <span className="truncate">{approvedPath ? nextAction : "Approve path in Settings"}</span>
            </p>
            <span className="text-[10px] font-black text-white">{progress}%</span>
          </div>
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
    </Link>
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

function OfficeAlert({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "blue" | "rose";
}) {
  const toneClass = tone === "blue"
    ? "border-blue-200/12 bg-blue-200/[0.045] text-blue-100"
    : "border-rose-200/14 bg-rose-200/[0.045] text-rose-100";

  return (
    <div className={`grid grid-cols-[auto_1fr] gap-3 border p-3 ${toneClass}`}>
      <Icon className="mt-0.5 h-4 w-4" />
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]">{label}</p>
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-200">{value}</p>
      </div>
    </div>
  );
}
