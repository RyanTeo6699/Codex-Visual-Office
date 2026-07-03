import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AgentSeat } from "@/components/office/AgentSeat";
import { ApprovedProjectPathStatus } from "@/components/office/ApprovedProjectPathStatus";
import { BuildWall } from "@/components/office/BuildWall";
import { EventTicker } from "@/components/office/EventTicker";
import { QualityGateConfigStatus } from "@/components/office/QualityGateConfigStatus";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listRetentionPolicies } from "@/lib/local-db/operations/retention-policies";
import { readSelectedProjectRoom } from "@/lib/local-db/selected-reads";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";
import { projectStatusLabel, taskStatusLabel } from "@/lib/status";
import type { AgentSeat as AgentSeatType, BackupRecord, BuildCheck, Project, RetentionPolicy, Task, TaskEvent } from "@/lib/types";
import { ArrowLeft, ArrowUpRight, Archive, Bot, ClipboardCheck, DoorOpen, FolderLock, ShieldCheck, Sparkles, TriangleAlert, type LucideIcon } from "lucide-react";

export default async function ProjectRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let localRead: Awaited<ReturnType<typeof readSelectedProjectRoom>> | undefined;
  const localRecordsSummary = await readLocalRecordsSummary();

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
  const recommendedAction = getRecommendedRoomAction({
    project,
    tasks: projectTasks,
    hasApprovedPath: Boolean(localRead?.primaryApprovedProjectPath),
    failedChecks,
  });

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
              <Link href="/settings" className="mt-4 inline-flex items-center gap-2 border border-amber-200/14 bg-amber-200/8 px-3 py-2 text-xs font-bold text-amber-100 hover:bg-amber-200/12">
                <FolderLock className="h-3.5 w-3.5" />
                Approved Path Settings
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <RoomField label="Phase" value={project.phase} />
            <RoomField label="Status" value={projectStatusLabel[project.status]} />
            <RoomField label="Active Work" value={`${activeTasks.length} tasks`} />
            <RoomField label="Assigned Seats" value={`${projectAgents.length} seats`} />
          </div>
        </section>
        <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <ProjectHealthSummary
            project={project}
            tasks={projectTasks}
            checks={projectChecks}
            hasApprovedPath={Boolean(localRead?.primaryApprovedProjectPath)}
            qualityConfigCount={localRead?.qualityGateConfigs?.length ?? 0}
            enabledQualityConfigCount={localRead?.qualityGateConfigs?.filter((config) => config.enabled).length ?? 0}
            backupRecords={localRecordsSummary.backupRecords}
            retentionPolicies={localRecordsSummary.retentionPolicies}
          />
          <Link href={recommendedAction.href} className="group flex min-h-32 flex-col justify-between border border-cyan-200/14 bg-cyan-200/[0.045] p-4 transition hover:border-cyan-100/30 hover:bg-cyan-200/[0.07]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/80">Recommended next action</p>
              <ArrowUpRight className="h-4 w-4 text-cyan-100/70 transition group-hover:text-white" />
            </div>
            <div>
              <p className="text-lg font-black text-white">{recommendedAction.label}</p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-300">{recommendedAction.detail}</p>
            </div>
          </Link>
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
            <ProjectCodexReadiness hasApprovedPath={Boolean(localRead?.primaryApprovedProjectPath)} events={projectEvents} />
            <QualityGateConfigStatus configs={localRead?.qualityGateConfigs ?? []} />
            <BuildWall checks={projectChecks} projects={allProjects} />
            <EventTicker events={projectEvents} projects={allProjects} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

async function readLocalRecordsSummary(): Promise<{ backupRecords: BackupRecord[]; retentionPolicies: RetentionPolicy[] }> {
  try {
    const [backupRecords, retentionPolicies] = await Promise.all([
      listBackupRecords(),
      listRetentionPolicies(),
    ]);

    return { backupRecords, retentionPolicies };
  } catch (error) {
    console.error("Project Room local records summary read failed", error);
    return { backupRecords: [], retentionPolicies: [] };
  }
}

function ProjectCodexReadiness({ hasApprovedPath, events }: { hasApprovedPath: boolean; events: TaskEvent[] }) {
  const latestRunnerEvent = events.find((event) => event.message.toLowerCase().includes("runner"));
  const label = hasApprovedPath ? "Recorded status only" : "Missing approved path";
  const detail = hasApprovedPath
    ? "This room summarizes existing local records only. It does not detect Codex CLI or execute commands during page load."
    : "Manual approved path setup is required before any scoped runner workflow can be requested.";

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-sky-200/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Codex Readiness</h2>
        </div>
        <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${hasApprovedPath ? "border-sky-200/20 bg-sky-200/8 text-sky-100" : "border-amber-200/24 bg-amber-200/10 text-amber-100"}`}>
          {label}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <RuntimeReadinessRow label="Approved path" value={hasApprovedPath ? "configured" : "missing"} />
        <RuntimeReadinessRow label="Runtime check" value="not executed on this page" />
        <RuntimeReadinessRow label="Last runner event" value={latestRunnerEvent ? `${latestRunnerEvent.message} / ${latestRunnerEvent.time}` : "none recorded"} />
      </div>

      <div className="mt-4 flex gap-2 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{detail}</p>
      </div>
    </section>
  );
}

function RuntimeReadinessRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3 rounded-[12px] bg-white/[0.025] px-3 py-2">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="min-w-0 break-words font-semibold text-slate-200">{value}</span>
    </div>
  );
}

function getRecommendedRoomAction({
  project,
  tasks,
  hasApprovedPath,
  failedChecks,
}: {
  project: Project;
  tasks: Task[];
  hasApprovedPath: boolean;
  failedChecks: number;
}) {
  const waitingTask = tasks.find((task) => task.status === "waiting_review");
  const blockedTask = tasks.find((task) => task.status === "blocked");
  const runningTask = tasks.find((task) => task.status === "running");

  if (!hasApprovedPath) {
    return {
      label: "Set approved path",
      detail: "Open Settings and approve the local project path before Codex runtime work.",
      href: "/settings",
    };
  }

  if (waitingTask) {
    return {
      label: "Review waiting task",
      detail: waitingTask.title,
      href: `/review/${waitingTask.id}`,
    };
  }

  if (blockedTask || failedChecks) {
    return {
      label: "Inspect project risk",
      detail: blockedTask?.title ?? `${failedChecks} failed quality signal${failedChecks === 1 ? "" : "s"}`,
      href: blockedTask ? `/review/${blockedTask.id}` : "#build",
    };
  }

  if (runningTask) {
    return {
      label: "Monitor running task",
      detail: runningTask.title,
      href: `/review/${runningTask.id}`,
    };
  }

  return {
    label: "Return to office map",
    detail: `${project.name} has no active task demanding review.`,
    href: "/#projects",
  };
}

function ProjectHealthSummary({
  project,
  tasks,
  checks,
  hasApprovedPath,
  qualityConfigCount,
  enabledQualityConfigCount,
  backupRecords,
  retentionPolicies,
}: {
  project: Project;
  tasks: Task[];
  checks: BuildCheck[];
  hasApprovedPath: boolean;
  qualityConfigCount: number;
  enabledQualityConfigCount: number;
  backupRecords: BackupRecord[];
  retentionPolicies: RetentionPolicy[];
}) {
  const statusCounts = tasks.reduce<Record<Task["status"], number>>(
    (counts, task) => ({ ...counts, [task.status]: counts[task.status] + 1 }),
    { backlog: 0, ready: 0, running: 0, waiting_review: 0, blocked: 0, done: 0 },
  );
  const failedChecks = checks.filter((check) => check.status === "failed").length;
  const latestBackup = [...backupRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return (
    <div className="border border-white/8 bg-[#111a25]/58 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-100/70" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Project Health Summary</h2>
        </div>
        <span className="border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-black uppercase text-slate-300">
          {projectStatusLabel[project.status]}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <HealthTile icon={FolderLock} label="Approved path" value={hasApprovedPath ? "Configured" : "Needs setup"} detail={hasApprovedPath ? project.localPathPlaceholder : "Use Settings for manual approval."} tone={hasApprovedPath ? "emerald" : "amber"} />
        <HealthTile icon={ClipboardCheck} label="Task breakdown" value={`${tasks.length} tasks`} detail={`Running ${statusCounts.running} / Review ${statusCounts.waiting_review} / Blocked ${statusCounts.blocked}`} tone={statusCounts.blocked ? "rose" : "cyan"} />
        <HealthTile icon={ShieldCheck} label="Quality / review" value={`${enabledQualityConfigCount}/${qualityConfigCount} enabled`} detail={`${failedChecks} failed check${failedChecks === 1 ? "" : "s"} / ${statusCounts.waiting_review} waiting review`} tone={failedChecks ? "rose" : "emerald"} />
        <HealthTile icon={Archive} label="Backup / archive" value={latestBackup ? latestBackup.status : "No backup record"} detail={`${backupRecords.length} backups / ${retentionPolicies.length} dry-run policies`} tone={latestBackup ? "cyan" : "slate"} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {(Object.keys(statusCounts) as Array<Task["status"]>).map((status) => (
          <span key={status} className="border border-white/[0.06] bg-black/12 px-2 py-1">
            {taskStatusLabel[status]}: {statusCounts[status]}
          </span>
        ))}
      </div>
    </div>
  );
}

function HealthTile({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: "cyan" | "emerald" | "amber" | "rose" | "slate";
}) {
  const toneClass = {
    cyan: "border-cyan-200/14 bg-cyan-200/[0.04] text-cyan-100",
    emerald: "border-emerald-200/14 bg-emerald-200/[0.04] text-emerald-100",
    amber: "border-amber-200/16 bg-amber-200/[0.045] text-amber-100",
    rose: "border-rose-200/16 bg-rose-200/[0.045] text-rose-100",
    slate: "border-white/8 bg-white/[0.03] text-slate-300",
  }[tone];

  return (
    <div className={`border p-3 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]">{label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-sm font-black text-white">{value}</p>
      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-400">{detail}</p>
    </div>
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
