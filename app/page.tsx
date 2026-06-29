import { AppShell } from "@/components/layout/AppShell";
import { BuildWall } from "@/components/office/BuildWall";
import { CodexRuntimeStatus } from "@/components/office/CodexRuntimeStatus";
import { EventTicker } from "@/components/office/EventTicker";
import { OfficeMap } from "@/components/office/OfficeMap";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";
import { Bot, ClipboardCheck, GitBranch, ShieldCheck } from "lucide-react";

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
          <Signal title="Active Task" value={active[0]?.title ?? "None"} tone="cyan" />
          <Signal title="Blocked Task" value={blocked[0]?.title ?? "None"} tone="red" />
          <Signal title="Needs Review" value={waiting[0]?.title ?? "None"} tone="violet" />
        </section>
        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div id="tasks" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-slate-100">Task Trays</h2>
                <p className="mt-1 text-xs text-slate-500">Compact mock work queues for each office lane.</p>
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
    { label: "AI staff online", value: activeCodexCount, detail: "Codex seats with active work", icon: Bot, tone: "cyan" },
    { label: "Review desks", value: reviewCount, detail: "Human decisions waiting", icon: ClipboardCheck, tone: "violet" },
    { label: "Git evidence", value: runningCount + reviewCount, detail: "Tasks with observable state", icon: GitBranch, tone: "emerald" },
    { label: "Safety flags", value: blockedCount + failedCheckCount, detail: "Blockers or failed checks", icon: ShieldCheck, tone: "rose" },
  ] as const;

  return (
    <section className="relative overflow-hidden border border-white/8 bg-[#0c1521]/82 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] lg:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <div>
          <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            AI engineering office for Codex work.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Control projects, Codex seats, runner status, Git evidence, quality gates, and final human review from one local-first operations floor.
          </p>
          <div className="mt-5 grid gap-2 text-xs font-semibold text-slate-400 sm:grid-cols-3">
            <span className="border border-emerald-200/12 bg-emerald-200/[0.035] px-3 py-2 text-emerald-100">No auto push / deploy</span>
            <span className="border border-sky-200/12 bg-sky-200/[0.035] px-3 py-2 text-sky-100">Allowlisted runners</span>
            <span className="border border-amber-200/12 bg-amber-200/[0.035] px-3 py-2 text-amber-100">Manual approval desk</span>
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

function Signal({ title, value, tone }: { title: string; value: string; tone: "cyan" | "red" | "violet" }) {
  const toneClass = {
    cyan: "border-sky-200/14 text-sky-100",
    red: "border-rose-200/16 text-rose-100",
    violet: "border-blue-200/14 text-blue-100",
  }[tone];

  return (
    <div className={`border bg-[#111a25]/70 p-4 shadow-sm ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.16em]">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-white">{value}</p>
    </div>
  );
}
