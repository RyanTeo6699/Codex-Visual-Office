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

  return (
    <AppShell>
      <div className="space-y-6">
        <section className={`pixel-room pixel-room-${project.accent} relative overflow-hidden border-4 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]`}>
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Project Room</p>
              <h1 className="pixel-room-title mt-2 text-3xl font-black tracking-tight text-white">{project.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                <span className="border border-cyan-200/18 bg-cyan-200/10 px-3 py-2 text-cyan-100">Codex seats: {projectAgents.length}</span>
                <span className="border border-blue-200/18 bg-blue-200/10 px-3 py-2 text-blue-100">Waiting review: {waitingReview}</span>
                <span className="border border-rose-200/18 bg-rose-200/10 px-3 py-2 text-rose-100">Blocked: {blockedTasks}</span>
              </div>
            </div>
            <div className="border border-white/10 bg-black/18 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Room objective</p>
                <Link href="/" className="border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-slate-100 hover:bg-white/[0.1]">
                  Office Home
                </Link>
              </div>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-white">
                Keep Codex work observable: approved path, active task tray, build wall, quality gate config, and review handoff.
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
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-100">Room Task Trays</h2>
              <p className="mt-1 text-xs text-slate-500">{project.localPathPlaceholder}</p>
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
    <div className="rounded-[14px] border border-white/10 bg-black/16 p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
