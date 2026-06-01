import { AppShell } from "@/components/layout/AppShell";
import { BuildWall } from "@/components/office/BuildWall";
import { CodexRuntimeStatus } from "@/components/office/CodexRuntimeStatus";
import { EventTicker } from "@/components/office/EventTicker";
import { OfficeMap } from "@/components/office/OfficeMap";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { agentSeats, buildChecks, projects, taskEvents, tasks } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function OfficeHome() {
  const codexCliStatus = await detectCodexCliStatus();
  const waiting = tasks.filter((task) => task.status === "waiting_review");
  const blocked = tasks.filter((task) => task.status === "blocked");
  const active = tasks.filter((task) => task.status === "running");

  return (
    <AppShell>
      <div className="space-y-6">
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

function Signal({ title, value, tone }: { title: string; value: string; tone: "cyan" | "red" | "violet" }) {
  const toneClass = {
    cyan: "border-sky-200/14 text-sky-100",
    red: "border-rose-200/16 text-rose-100",
    violet: "border-blue-200/14 text-blue-100",
  }[tone];

  return (
    <div className={`rounded-[18px] border bg-[#111a25]/62 p-4 shadow-sm ${toneClass}`}>
      <p className="text-xs font-bold">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-white">{value}</p>
    </div>
  );
}
