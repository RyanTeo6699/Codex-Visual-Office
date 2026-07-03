import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AgentSeat } from "@/components/office/AgentSeat";
import { ApprovedProjectPathStatus } from "@/components/office/ApprovedProjectPathStatus";
import { BuildWall } from "@/components/office/BuildWall";
import { EventTicker } from "@/components/office/EventTicker";
import { QualityGateConfigStatus } from "@/components/office/QualityGateConfigStatus";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { readSelectedProjectRoom } from "@/lib/local-db/selected-reads";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";
import { projectStatusLabel } from "@/lib/status";
import type { AgentSeat as AgentSeatType, BuildCheck, Project, Task, TaskEvent } from "@/lib/types";
import { ArrowLeft, DoorOpen, FolderLock, ShieldCheck, type LucideIcon } from "lucide-react";

export default async function ProjectRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let localRead: Awaited<ReturnType<typeof readSelectedProjectRoom>> | undefined;

  try {
    localRead = await readSelectedProjectRoom(id);
  } catch (error) {
    console.error("Project Room selected local read failed", error);
  }

  const mockProject = projects.find((item) => item.id === id);
  const project = localRead?.project ?? mockProject;

  if (!project) {
    notFound();
  }

  const projectTasks: Task[] = localRead?.tasks ?? tasks.filter((task) => task.projectId === project.id);
  const projectAgents: AgentSeatType[] = localRead?.agentSeats ?? agentSeats.filter((agent) => project.agentSeatIds.includes(agent.id));
  const projectChecks: BuildCheck[] = localRead?.buildChecks ?? buildChecks.filter((check) => check.projectId === project.id);
  const projectEvents: TaskEvent[] = localRead?.taskEvents ?? taskEvents.filter((event) => event.projectId === project.id);
  const allProjects: Project[] = localRead ? [project, ...projects.filter((item) => item.id !== project.id)] : projects;
  const allAgentSeats: AgentSeatType[] = localRead ? [...projectAgents, ...agentSeats.filter((agent) => !projectAgents.some((localAgent) => localAgent.id === agent.id))] : agentSeats;
  const activeTasks = projectTasks.filter((task) => task.status === "running" || task.status === "waiting_review" || task.status === "blocked");
  const waitingReview = projectTasks.filter((task) => task.status === "waiting_review").length;
  const blockedTasks = projectTasks.filter((task) => task.status === "blocked").length;
  const failedChecks = projectChecks.filter((check) => check.status === "failed").length;

  return (
    <AppShell>
      <div className="space-y-6">
        <section className={`pixel-room pixel-room-${project.accent} relative overflow-hidden border-4 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] lg:p-6`}>
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 border border-white/14 bg-black/18 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                <DoorOpen className="h-3.5 w-3.5" />
                Project Room
              </div>
              <h1 className="pixel-room-title mt-2 text-3xl font-black tracking-tight text-white">{project.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                <span className="border border-cyan-200/18 bg-cyan-200/10 px-3 py-2 text-cyan-100">Codex seats: {projectAgents.length}</span>
                <span className="border border-blue-200/18 bg-blue-200/10 px-3 py-2 text-blue-100">Waiting review: {waitingReview}</span>
                <span className="border border-rose-200/18 bg-rose-200/10 px-3 py-2 text-rose-100">Blocked: {blockedTasks}</span>
                <span className="border border-amber-200/18 bg-amber-200/10 px-3 py-2 text-amber-100">Failed checks: {failedChecks}</span>
              </div>
            </div>
            <div className="border border-white/10 bg-black/18 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Room console</p>
                <Link href="/" className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-slate-100 hover:bg-white/[0.1]">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Office Home
                </Link>
              </div>
              <div className="mt-4 grid gap-2">
                <ConsoleSignal
                  icon={FolderLock}
                  label="Approved path"
                  value={localRead?.primaryApprovedProjectPath ? "Configured" : "Not configured"}
                  tone={localRead?.primaryApprovedProjectPath ? "emerald" : "amber"}
                />
                <ConsoleSignal
                  icon={ShieldCheck}
                  label="Quality config"
                  value={`${localRead?.qualityGateConfigs?.filter((config) => config.enabled).length ?? 0} enabled`}
                  tone="cyan"
                />
              </div>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-400">
                Local-first status is displayed here only; no runner or quality command is triggered by this room.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <RoomField label="Phase" value={project.phase} />
            <RoomField label="Status" value={projectStatusLabel[project.status]} />
            <RoomField label="Active Work" value={`${activeTasks.length} tasks`} />
            <RoomField label="Assigned Seats" value={`${projectAgents.length} seats`} />
          </div>
        </section>
        <section className="grid gap-4 lg:grid-cols-3">
          {projectAgents.length ? (
            projectAgents.map((agent) => (
              <AgentSeat key={agent.id} agent={agent} project={project} task={projectTasks.find((task) => task.id === agent.taskId)} />
            ))
          ) : (
            <div className="rounded-[22px] border border-white/8 bg-[#121a24]/72 p-4 text-sm text-slate-400">No Codex seat assigned in this mock room.</div>
          )}
        </section>
        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div className="space-y-4">
            <div className="border border-white/8 bg-[#111a25]/58 p-4">
              <h2 className="text-sm font-bold tracking-tight text-slate-100">Room Task Trays</h2>
              <p className="mt-1 break-words text-xs text-slate-500">{project.localPathPlaceholder}</p>
            </div>
            <TaskBoard tasks={projectTasks} projects={allProjects} agentSeats={allAgentSeats} />
          </div>
          <div className="space-y-5">
            <ApprovedProjectPathStatus primaryPath={localRead?.primaryApprovedProjectPath} />
            <QualityGateConfigStatus configs={localRead?.qualityGateConfigs ?? []} />
            <BuildWall checks={projectChecks} projects={allProjects} />
            <EventTicker events={projectEvents} projects={allProjects} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function RoomField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/16 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function ConsoleSignal({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "emerald" | "amber" | "cyan";
}) {
  const toneClass = {
    emerald: "border-emerald-200/16 bg-emerald-200/8 text-emerald-100",
    amber: "border-amber-200/16 bg-amber-200/8 text-amber-100",
    cyan: "border-cyan-200/16 bg-cyan-200/8 text-cyan-100",
  }[tone];

  return (
    <div className={`grid grid-cols-[auto_1fr] items-center gap-3 border px-3 py-2.5 ${toneClass}`}>
      <Icon className="h-4 w-4" />
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.12em]">{label}</p>
        <p className="mt-0.5 truncate text-xs font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
