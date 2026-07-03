import { AppShell } from "@/components/layout/AppShell";
import { BuildWall } from "@/components/office/BuildWall";
import { CodexRuntimeStatus } from "@/components/office/CodexRuntimeStatus";
import { EventTicker } from "@/components/office/EventTicker";
import { OfficeMap } from "@/components/office/OfficeMap";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";
import { Bot, ClipboardCheck, GitBranch, Map, RadioTower, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OfficeHome() {
  const codexCliStatus = await detectCodexCliStatus();
  const waiting = tasks.filter((task) => task.status === "waiting_review");
  const blocked = tasks.filter((task) => task.status === "blocked");
  const active = tasks.filter((task) => task.status === "running");
  const failedChecks = buildChecks.filter((check) => check.status === "failed");

  return (
    <AppShell>
      <div className="space-y-6">
        <CommandDeck
          runningCount={active.length}
          reviewCount={waiting.length}
          blockedCount={blocked.length}
          failedCheckCount={failedChecks.length}
          activeCodexCount={agentSeats.filter((seat) => seat.status !== "idle" && seat.status !== "done").length}
        />
        <OfficeMap projects={projects} tasks={tasks} agentSeats={agentSeats} />
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
            <CodexRuntimeStatus status={codexCliStatus} />
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

function CommandDeck({
  runningCount,
  reviewCount,
  blockedCount,
  failedCheckCount,
  activeCodexCount,
}: {
  runningCount: number;
  reviewCount: number;
  blockedCount: number;
  failedCheckCount: number;
  activeCodexCount: number;
}) {
  const deckItems = [
    { label: "Codex seats staffed", value: activeCodexCount, detail: "AI workers currently occupying a desk", icon: Bot, tone: "cyan" },
    { label: "Review desks lit", value: reviewCount, detail: "Human decisions waiting in review", icon: ClipboardCheck, tone: "violet" },
    { label: "Observable work", value: runningCount + reviewCount, detail: "Tasks visible on the office floor", icon: GitBranch, tone: "emerald" },
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
