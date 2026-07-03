import clsx from "clsx";
import { Activity, ClipboardCheck, FileText, History, Route, Sparkles } from "lucide-react";
import { statusColor, taskStatusLabel } from "@/lib/status";
import type { TaskStatus } from "@/lib/types";

export interface ProjectTaskLifecycleItem {
  id: string;
  title: string;
  status: TaskStatus;
  stage: string;
  progressPercent: number;
}

export interface ProjectRunHistoryItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  status: string;
}

export function ProjectWorkflowSummary({
  taskLifecycle,
  runHistory,
  promptReadiness,
  recommendedAction,
  recommendedActionDetail,
}: {
  taskLifecycle: ProjectTaskLifecycleItem[];
  runHistory: ProjectRunHistoryItem[];
  promptReadiness: string;
  recommendedAction: string;
  recommendedActionDetail: string;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="border border-white/8 bg-[#0d1724]/72 p-4">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-cyan-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Task Lifecycle Summary</h2>
        </div>
        <div className="mt-4 space-y-2">
          {taskLifecycle.length ? taskLifecycle.slice(0, 5).map((item) => (
            <div key={item.id} className="grid gap-3 border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 md:grid-cols-[1fr_120px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-xs font-bold text-slate-100">{item.title}</p>
                  <span className={clsx("border px-2 py-0.5 text-[10px] font-bold", statusColor[item.status])}>
                    {taskStatusLabel[item.status]}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{item.stage}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 border border-slate-800 bg-[#08111d]">
                  <div className="h-full bg-cyan-300" style={{ width: `${item.progressPercent}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{item.progressPercent}%</span>
              </div>
            </div>
          )) : (
            <div className="border border-dashed border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-500">
              No task lifecycle records are available in this room.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-sky-200/12 bg-sky-200/[0.035] p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Prompt Readiness</h2>
          </div>
          <p className="mt-3 text-sm font-black text-white">{promptReadiness}</p>
          <div className="mt-3 border border-cyan-200/10 bg-cyan-200/[0.035] px-3 py-2 text-xs font-semibold leading-relaxed text-slate-300">
            <div className="mb-1 flex items-center gap-2 text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Recommended Action</span>
            </div>
            <p className="font-black text-white">{recommendedAction}</p>
            <p className="mt-1 text-slate-400">{recommendedActionDetail}</p>
          </div>
        </div>

        <div className="border border-emerald-200/12 bg-[#0d1724]/72 p-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Codex Run History</h2>
          </div>
          <div className="mt-4 space-y-2">
            {runHistory.length ? runHistory.slice(0, 4).map((item) => (
              <div key={item.id} className="grid grid-cols-[56px_1fr] gap-3 border border-white/[0.05] bg-white/[0.025] px-3 py-2">
                <span className="text-[11px] font-semibold text-slate-500">{item.time}</span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-100">{item.title}</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">{item.status.replaceAll("_", " ")} · {item.detail}</span>
                </span>
              </div>
            )) : (
              <div className="border border-dashed border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-500">
                No Codex runner lifecycle event is recorded for this room.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
