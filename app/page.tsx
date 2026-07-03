import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentWorkflowStatus } from "@/components/office/AgentWorkflowStatus";
import type { AgentWorkflowSummary } from "@/components/office/AgentWorkflowStatus";
import { BuildWall } from "@/components/office/BuildWall";
import { EventTicker } from "@/components/office/EventTicker";
import { OfficeMap } from "@/components/office/OfficeMap";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { listApprovedProjectPaths } from "@/lib/local-db/operations/approved-project-paths";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import * as selectedReads from "@/lib/local-db/selected-reads";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";
import { projectStatusLabel } from "@/lib/status";
import type { ApprovedProjectPath, BackupRecord, Project, Task } from "@/lib/types";
import { ArrowUpRight, Bot, ClipboardCheck, FolderLock, GitBranch, HardDrive, History, Map, RadioTower, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OfficeHome() {
  const localSummary = await readHomeLocalSummary();
  const agentWorkflowSummaries = await readOfficeAgentWorkflowSummaries();
  const waiting = tasks.filter((task) => task.status === "waiting_review");
  const blocked = tasks.filter((task) => task.status === "blocked");
  const active = tasks.filter((task) => task.status === "running");
  const failedChecks = buildChecks.filter((check) => check.status === "failed");
  const approvedPaths = localSummary.approvedPaths.filter((path) => path.approved);
  const recentProjects = getRecentProjects();
  const recommendedAction = getRecommendedOfficeAction({
    activeTasks: active,
    waitingTasks: waiting,
    blockedTasks: blocked,
    failedChecks: failedChecks.length,
    approvedPathCount: approvedPaths.length,
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <CommandDeck
          runningCount={active.length}
          reviewCount={waiting.length}
          blockedCount={blocked.length}
          failedCheckCount={failedChecks.length}
          activeCodexCount={agentSeats.filter((seat) => seat.status !== "idle" && seat.status !== "done").length}
          approvedPathCount={approvedPaths.length}
        />
        <WorkspaceReadiness
          projects={projects}
          tasks={tasks}
          approvedPaths={approvedPaths}
          backupRecords={localSummary.backupRecords}
          recommendedAction={recommendedAction}
        />
        <AgentWorkflowStatus summaries={agentWorkflowSummaries} />
        <OfficeMap projects={projects} tasks={tasks} agentSeats={agentSeats} approvedPaths={approvedPaths} />
        <RecentProjects projects={recentProjects} tasks={tasks} approvedPaths={approvedPaths} />
        <section className="grid gap-3 md:grid-cols-3">
          <Signal title="Active Workbench" value={active[0]?.title ?? "No running task"} tone="cyan" detail={`${active.length} running`} />
          <Signal title="Blocked Doorway" value={blocked[0]?.title ?? "No blocked task"} tone="red" detail={`${blocked.length} blocked`} />
          <Signal title="Review Desk" value={waiting[0]?.title ?? "No task waiting"} tone="violet" detail={`${waiting.length} waiting`} />
        </section>
        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div id="tasks" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-slate-100">Task Trays</h2>
                <p className="mt-1 text-xs text-slate-500">Office lanes from backlog through final review handoff.</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">{tasks.length} mock tasks</span>
            </div>
            <TaskBoard tasks={tasks} projects={projects} agentSeats={agentSeats} />
          </div>
          <div className="space-y-5">
            <OfficeCodexReadiness approvedPathCount={approvedPaths.length} activeCodexCount={agentSeats.filter((seat) => seat.status !== "idle" && seat.status !== "done").length} />
            <div id="build">
              <BuildWall checks={buildChecks} projects={projects} />
            </div>
            <EventTicker events={taskEvents} projects={projects} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

type OptionalPhase11SelectedReads = {
  getAgentWorkflowSummaryForProject?: (projectId: string) => Promise<unknown> | unknown;
};

const phase11SelectedReads = selectedReads as typeof selectedReads & OptionalPhase11SelectedReads;

async function readOfficeAgentWorkflowSummaries(): Promise<AgentWorkflowSummary[]> {
  const fallbackSummaries = projects.slice(0, 5).map((project) => buildProjectAgentWorkflowSummary(project));
  const helper = phase11SelectedReads.getAgentWorkflowSummaryForProject;

  if (typeof helper !== "function") {
    return fallbackSummaries;
  }

  try {
    const helperSummaries = await Promise.all(projects.slice(0, 5).map((project) => helper(project.id)));
    return helperSummaries.map((summary, index) => normalizeAgentWorkflowSummary(summary, fallbackSummaries[index]));
  } catch (error) {
    console.error("Office Home Phase 11 agent workflow summary read failed", error);
    return fallbackSummaries;
  }
}

function buildProjectAgentWorkflowSummary(project: Project): AgentWorkflowSummary {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const projectAgents = agentSeats.filter((agent) => project.agentSeatIds.includes(agent.id));
  const projectChecks = buildChecks.filter((check) => check.projectId === project.id);
  const primaryTask = projectTasks.find((task) => task.status === "waiting_review" || task.status === "blocked" || task.status === "running") ?? projectTasks[0];
  const failedCheckCount = projectChecks.filter((check) => check.status === "failed").length;
  const blockedTaskCount = projectTasks.filter((task) => task.status === "blocked").length;
  const waitingReviewCount = projectTasks.filter((task) => task.status === "waiting_review").length;
  const runningTaskCount = projectTasks.filter((task) => task.status === "running").length;

  return {
    id: project.id,
    label: project.name,
    scope: "project",
    activeSeatCount: projectAgents.filter((agent) => agent.status !== "idle" && agent.status !== "done").length,
    runningTaskCount,
    waitingReviewCount,
    blockedTaskCount,
    failedCheckCount,
    promptReadiness: waitingReviewCount ? "ready for human review" : runningTaskCount ? "active prompt in flight" : "no active prompt",
    lastRunStatus: getProjectLastRunStatus(project.id),
    failureCategory: failedCheckCount ? "quality_check_failed" : blockedTaskCount ? "workflow_blocked" : undefined,
    recommendedAction: getProjectWorkflowAction(projectTasks, failedCheckCount),
    recommendedActionDetail: primaryTask?.title ?? "Open the project room to inspect queued work.",
    primaryTaskStatus: primaryTask?.status,
    seats: projectAgents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: agent.status,
      taskTitle: projectTasks.find((task) => task.id === agent.taskId)?.title,
      visualState: agent.focus,
    })),
  };
}

function getProjectLastRunStatus(projectId: string): string {
  const runnerEvent = taskEvents.find((event) => event.projectId === projectId && typeof event.payload?.lifecycleEvent === "string");
  if (runnerEvent && typeof runnerEvent.payload?.lifecycleEvent === "string") {
    return runnerEvent.payload.lifecycleEvent;
  }

  return "no codex run recorded";
}

function getProjectWorkflowAction(projectTasks: Task[], failedCheckCount: number): string {
  if (projectTasks.some((task) => task.status === "waiting_review")) {
    return "review waiting task";
  }

  if (projectTasks.some((task) => task.status === "blocked") || failedCheckCount) {
    return "inspect blocked workflow";
  }

  if (projectTasks.some((task) => task.status === "running")) {
    return "monitor active seat";
  }

  return "open project room";
}

function normalizeAgentWorkflowSummary(value: unknown, fallback: AgentWorkflowSummary): AgentWorkflowSummary {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;
  return {
    ...fallback,
    activeSeatCount: readNumber(record.activeSeatCount) ?? fallback.activeSeatCount,
    runningTaskCount: readNumber(record.runningTaskCount) ?? fallback.runningTaskCount,
    waitingReviewCount: readNumber(record.waitingReviewCount) ?? readNumber(record.reviewTaskCount) ?? fallback.waitingReviewCount,
    blockedTaskCount: readNumber(record.blockedTaskCount) ?? fallback.blockedTaskCount,
    failedCheckCount: readNumber(record.failedCheckCount) ?? readNumber(record.failedBuildCheckCount) ?? fallback.failedCheckCount,
    promptReadiness: readString(record.promptReadiness) ?? fallback.promptReadiness,
    lastRunStatus: readString(record.lastRunStatus) ?? fallback.lastRunStatus,
    failureCategory: readString(record.failureCategory) ?? fallback.failureCategory,
    recommendedAction: readString(record.recommendedAction) ?? fallback.recommendedAction,
    recommendedActionDetail: readString(record.recommendedActionDetail) ?? readString(record.summaryMessage) ?? fallback.recommendedActionDetail,
  };
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function OfficeCodexReadiness({ approvedPathCount, activeCodexCount }: { approvedPathCount: number; activeCodexCount: number }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-sky-200/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Codex Readiness</h2>
        </div>
        <span className="rounded-md border border-sky-200/20 bg-sky-200/8 px-2 py-1 text-[10px] font-semibold text-sky-100">
          Recorded state
        </span>
      </div>
      <div className="space-y-2 text-xs">
        <OfficeRuntimeRow label="Approved paths" value={`${approvedPathCount} configured`} />
        <OfficeRuntimeRow label="Active seats" value={`${activeCodexCount} visually active`} />
        <OfficeRuntimeRow label="Runtime check" value="not executed on Office Home" />
      </div>
      <div className="mt-4 flex gap-2 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
        <RadioTower className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Office Home summarizes local records only. It does not detect Codex CLI, run Git, or run Quality Gates during page load.</p>
      </div>
    </section>
  );
}

function OfficeRuntimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[104px_1fr] gap-3 rounded-[12px] bg-white/[0.025] px-3 py-2">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="min-w-0 break-words font-semibold text-slate-200">{value}</span>
    </div>
  );
}

async function readHomeLocalSummary(): Promise<{ approvedPaths: ApprovedProjectPath[]; backupRecords: BackupRecord[] }> {
  try {
    const [approvedPaths, backupRecords] = await Promise.all([
      listApprovedProjectPaths(),
      listBackupRecords(),
    ]);

    return { approvedPaths, backupRecords };
  } catch (error) {
    console.error("Office Home local summary read failed", error);
    return { approvedPaths: [], backupRecords: [] };
  }
}

function getRecentProjects(): Project[] {
  const projectIds = [...new Set(taskEvents.map((event) => event.projectId))];
  return [
    ...projectIds
      .map((projectId) => projects.find((project) => project.id === projectId))
      .filter((project): project is Project => Boolean(project)),
    ...projects.filter((project) => !projectIds.includes(project.id)),
  ].slice(0, 4);
}

function getRecommendedOfficeAction({
  activeTasks,
  waitingTasks,
  blockedTasks,
  failedChecks,
  approvedPathCount,
}: {
  activeTasks: Task[];
  waitingTasks: Task[];
  blockedTasks: Task[];
  failedChecks: number;
  approvedPathCount: number;
}) {
  if (!approvedPathCount) {
    return {
      label: "Set approved paths",
      detail: "Open Settings and approve the local paths that Codex seats may use.",
      href: "/settings",
    };
  }

  if (waitingTasks.length) {
    return {
      label: "Review waiting task",
      detail: waitingTasks[0].title,
      href: `/review/${waitingTasks[0].id}`,
    };
  }

  if (blockedTasks.length || failedChecks) {
    return {
      label: "Inspect blocked room",
      detail: blockedTasks[0]?.title ?? `${failedChecks} failed quality signal${failedChecks === 1 ? "" : "s"}`,
      href: blockedTasks[0] ? `/review/${blockedTasks[0].id}` : "#build",
    };
  }

  if (activeTasks.length) {
    return {
      label: "Monitor active work",
      detail: activeTasks[0].title,
      href: `/review/${activeTasks[0].id}`,
    };
  }

  return {
    label: "Open a project room",
    detail: "No active task is running; choose a room from the office map.",
    href: "#projects",
  };
}

function CommandDeck({
  runningCount,
  reviewCount,
  blockedCount,
  failedCheckCount,
  activeCodexCount,
  approvedPathCount,
}: {
  runningCount: number;
  reviewCount: number;
  blockedCount: number;
  failedCheckCount: number;
  activeCodexCount: number;
  approvedPathCount: number;
}) {
  const deckItems = [
    { label: "Codex seats staffed", value: activeCodexCount, detail: "AI workers currently occupying a desk", icon: Bot, tone: "cyan" },
    { label: "Review desks lit", value: reviewCount, detail: "Human decisions waiting in review", icon: ClipboardCheck, tone: "violet" },
    { label: "Observable work", value: runningCount + reviewCount, detail: "Tasks visible on the office floor", icon: GitBranch, tone: "emerald" },
    { label: "Approved paths", value: approvedPathCount, detail: "Local project paths approved for workspace use", icon: FolderLock, tone: "emerald" },
    { label: "Risk beacons", value: blockedCount + failedCheckCount, detail: "Blocked tasks or failed checks", icon: ShieldCheck, tone: "rose" },
  ] as const;

  return (
    <section className="relative overflow-hidden border border-white/8 bg-[#0c1521]/82 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] lg:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 border border-cyan-200/14 bg-cyan-200/[0.045] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
            <RadioTower className="h-3.5 w-3.5" />
            Local-first command floor
          </div>
          <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Enter the Codex visual office.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Project rooms, Codex seats, task trays, build checks, quality signals, and review handoff are arranged as one dark engineering floor.
          </p>
          <div className="mt-5 grid gap-2 text-xs font-semibold text-slate-400 sm:grid-cols-3">
            <span className="border border-emerald-200/12 bg-emerald-200/[0.035] px-3 py-2 text-emerald-100">Local-first status</span>
            <span className="border border-sky-200/12 bg-sky-200/[0.035] px-3 py-2 text-sky-100">Codex staff map</span>
            <span className="border border-amber-200/12 bg-amber-200/[0.035] px-3 py-2 text-amber-100">Human review desk</span>
          </div>
          <div className="mt-5 flex items-center gap-3 border border-white/8 bg-black/16 px-3 py-3 text-xs text-slate-400">
            <Map className="h-4 w-4 text-sky-100" />
            <span>Start at the floor map, then open a room or task card to inspect work.</span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {deckItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`command-card command-card-${item.tone}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-4xl font-black text-white">{item.value}</p>
                  </div>
                  <Icon className="h-5 w-5 text-slate-300" />
                </div>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-400">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkspaceReadiness({
  projects,
  tasks,
  approvedPaths,
  backupRecords,
  recommendedAction,
}: {
  projects: Project[];
  tasks: Task[];
  approvedPaths: ApprovedProjectPath[];
  backupRecords: BackupRecord[];
  recommendedAction: { label: string; detail: string; href: string };
}) {
  const activeTasks = tasks.filter((task) => task.status === "running");
  const waitingTasks = tasks.filter((task) => task.status === "waiting_review");
  const blockedTasks = tasks.filter((task) => task.status === "blocked");
  const latestBackup = [...backupRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ReadinessTile icon={Sparkles} label="Project health" value={`${projects.length} rooms`} detail={`${blockedTasks.length} blocked / ${waitingTasks.length} waiting review`} tone={blockedTasks.length ? "rose" : "emerald"} />
        <ReadinessTile icon={Bot} label="Codex readiness" value={activeTasks.length ? `${activeTasks.length} active` : "No active task"} detail={activeTasks[0]?.title ?? "Seats are visible even when idle."} tone={activeTasks.length ? "cyan" : "slate"} />
        <ReadinessTile icon={FolderLock} label="Approved paths" value={approvedPaths.length ? `${approvedPaths.length} approved` : "None approved"} detail={approvedPaths.length ? "Local-first path approvals are present." : "Settings is the only setup path."} tone={approvedPaths.length ? "emerald" : "amber"} />
        <ReadinessTile icon={HardDrive} label="Backup/archive" value={latestBackup ? latestBackup.status : "No backup record"} detail={latestBackup?.createdAt ?? "Archive and backup summaries stay passive here."} tone={latestBackup ? "cyan" : "slate"} />
      </div>
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
  );
}

function RecentProjects({ projects, tasks, approvedPaths }: { projects: Project[]; tasks: Task[]; approvedPaths: ApprovedProjectPath[] }) {
  if (!projects.length) {
    return <EmptyBand title="No recent projects" detail="Project rooms will appear here after the workspace has projects." />;
  }

  return (
    <section className="border border-white/8 bg-[#111a25]/58 p-4">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-4 w-4 text-sky-100/70" />
        <h2 className="text-sm font-bold tracking-tight text-slate-100">Recent Projects</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => {
          const projectTasks = tasks.filter((task) => task.projectId === project.id);
          const activeTask = projectTasks.find((task) => task.status === "running" || task.status === "waiting_review" || task.status === "blocked");
          const hasApprovedPath = approvedPaths.some((path) => path.projectId === project.id);

          return (
            <Link key={project.id} href={`/projects/${project.id}`} className="border border-white/[0.06] bg-black/14 p-3 transition hover:border-sky-200/24 hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">{project.name}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{projectStatusLabel[project.status]}</p>
                </div>
                <span className={hasApprovedPath ? "border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-[10px] font-bold text-emerald-100" : "border border-amber-200/14 bg-amber-200/8 px-2 py-1 text-[10px] font-bold text-amber-100"}>
                  {hasApprovedPath ? "path" : "setup"}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 min-h-9 text-xs font-semibold leading-relaxed text-slate-300">{activeTask?.title ?? "No active task in this room."}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ReadinessTile({
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
    <div className={`border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-lg font-black text-white">{value}</p>
      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-400">{detail}</p>
    </div>
  );
}

function EmptyBand({ title, detail }: { title: string; detail: string }) {
  return (
    <section className="border border-dashed border-white/10 bg-white/[0.025] p-4 text-sm text-slate-400">
      <p className="font-bold text-slate-200">{title}</p>
      <p className="mt-1 text-xs">{detail}</p>
    </section>
  );
}

function Signal({ title, value, tone, detail }: { title: string; value: string; tone: "cyan" | "red" | "violet"; detail: string }) {
  const toneClass = {
    cyan: "border-sky-200/14 text-sky-100 bg-sky-200/[0.035]",
    red: "border-rose-200/16 text-rose-100 bg-rose-200/[0.035]",
    violet: "border-blue-200/14 text-blue-100 bg-blue-200/[0.035]",
  }[tone];

  return (
    <div className={`relative overflow-hidden border p-4 shadow-sm ${toneClass}`}>
      <div className="absolute right-3 top-3 h-2 w-2 bg-current" />
      <p className="text-[10px] font-black uppercase tracking-[0.16em]">{title}</p>
      <p className="mt-2 min-h-10 text-sm font-semibold leading-relaxed text-white">{value}</p>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{detail}</p>
    </div>
  );
}
