import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AgentSeat } from "@/components/office/AgentSeat";
import { BuildWall } from "@/components/office/BuildWall";
import { EventTicker } from "@/components/office/EventTicker";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";
import { projectStatusLabel } from "@/lib/status";

export default async function ProjectRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const projectAgents = agentSeats.filter((agent) => project.agentSeatIds.includes(agent.id));
  const projectChecks = buildChecks.filter((check) => check.projectId === project.id);
  const projectEvents = taskEvents.filter((event) => event.projectId === project.id);
  const activeTasks = projectTasks.filter((task) => task.status === "running" || task.status === "waiting_review" || task.status === "blocked");

  return (
    <AppShell>
      <div className="space-y-6">
        <section className={`pixel-room pixel-room-${project.accent} relative overflow-hidden border-4 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Project Room</p>
              <h1 className="pixel-room-title mt-2 text-3xl font-black tracking-tight text-white">{project.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{project.summary}</p>
            </div>
            <Link href="/" className="rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/[0.1]">
              Office Home
            </Link>
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
              <AgentSeat key={agent.id} agent={agent} project={project} task={tasks.find((task) => task.id === agent.taskId)} />
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
            <TaskBoard tasks={projectTasks} projects={projects} agentSeats={agentSeats} />
          </div>
          <div className="space-y-5">
            <BuildWall checks={projectChecks} projects={projects} />
            <EventTicker events={projectEvents} projects={projects} />
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
