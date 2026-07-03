import clsx from "clsx";
import type { ReactNode } from "react";
import { Activity, Bot, FileText, GitBranch, History, Route, ShieldAlert, Sparkles } from "lucide-react";
import { agentStatusLabel, statusColor, taskStatusLabel } from "@/lib/status";
import type { AgentStatus, TaskStatus } from "@/lib/types";

export interface TaskLifecycleSummary {
  taskId: string;
  taskTitle: string;
  status: TaskStatus;
  lifecycleStage: string;
  progressPercent: number;
  promptReadiness: string;
  evidenceReadiness: string;
  failureCategory?: string;
  recommendedAction: string;
  recommendedActionDetail: string;
}

export interface PromptVersionSummary {
  versionLabel: string;
  mode: string;
  readiness: string;
  generatedAt?: string;
  handoffState: string;
  acceptanceCriteriaCount: number;
  forbiddenScopeCount: number;
  versionCount?: number;
  latestPromptReadyAt?: string;
  latestRunnerRequestedAt?: string;
}

export interface CodexRunHistoryItem {
  id: string;
  status: string;
  time: string;
  duration?: string;
  exitCode?: string;
  failureCategory?: string;
  preview: string;
}

export interface WorkflowTimelineItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: "info" | "success" | "warning" | "danger";
}

export interface AgentVisualStateSummary {
  agentName: string;
  status: AgentStatus | "unassigned";
  taskTitle: string;
  visualState: string;
  focus: string;
  progressPercent: number;
}

export function WorkflowInsightPanels({
  lifecycleSummary,
  promptSummary,
  runHistory,
  timeline,
  agentVisualState,
}: {
  lifecycleSummary: TaskLifecycleSummary;
  promptSummary: PromptVersionSummary;
  runHistory: CodexRunHistoryItem[];
  timeline: WorkflowTimelineItem[];
  agentVisualState: AgentVisualStateSummary;
}) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <TaskLifecycleCard summary={lifecycleSummary} />
        <AgentVisualStateCard summary={agentVisualState} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <PromptVersionCard summary={promptSummary} />
        <CodexRunHistoryCard items={runHistory} />
      </div>
      <WorkflowTimelineCard items={timeline} />
    </section>
  );
}

function TaskLifecycleCard({ summary }: { summary: TaskLifecycleSummary }) {
  const toneClass = summary.status === "blocked"
    ? "border-rose-200/16 bg-rose-200/[0.04]"
    : summary.status === "waiting_review"
      ? "border-blue-200/16 bg-blue-200/[0.04]"
      : summary.status === "running"
        ? "border-emerald-200/16 bg-emerald-200/[0.04]"
        : "border-white/8 bg-white/[0.03]";

  return (
    <article className={clsx("relative overflow-hidden border p-4", toneClass)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-cyan-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Task Lifecycle Summary</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">{summary.lifecycleStage}</p>
        </div>
        <span className={clsx("border px-2 py-1 text-[10px] font-bold", statusColor[summary.status])}>
          {taskStatusLabel[summary.status]}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
          <span>Lifecycle progress</span>
          <span>{summary.progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 border border-slate-800 bg-[#08111d]">
          <div className="h-full bg-cyan-300" style={{ width: `${summary.progressPercent}%` }} />
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs md:grid-cols-2">
        <InsightRow icon={<FileText className="h-3.5 w-3.5" />} label="Prompt readiness" value={summary.promptReadiness} />
        <InsightRow icon={<GitBranch className="h-3.5 w-3.5" />} label="Evidence readiness" value={summary.evidenceReadiness} />
        <InsightRow icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Failure category" value={summary.failureCategory ?? "none"} />
        <InsightRow icon={<Sparkles className="h-3.5 w-3.5" />} label="Recommended action" value={summary.recommendedAction} />
      </div>
      <p className="mt-3 border border-cyan-200/10 bg-cyan-200/[0.035] px-3 py-2 text-xs font-semibold leading-relaxed text-slate-300">
        {summary.recommendedActionDetail}
      </p>
    </article>
  );
}

function PromptVersionCard({ summary }: { summary: PromptVersionSummary }) {
  return (
    <article className="border border-sky-200/12 bg-[#0d1724]/72 p-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-sky-100/80" />
        <h2 className="text-sm font-bold tracking-tight text-slate-100">Prompt Version Summary</h2>
      </div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
        <InsightRow icon={<Activity className="h-3.5 w-3.5" />} label="Prompt version" value={summary.versionLabel} />
        <InsightRow icon={<Route className="h-3.5 w-3.5" />} label="Mode" value={summary.mode} />
        <InsightRow icon={<Sparkles className="h-3.5 w-3.5" />} label="Readiness" value={summary.readiness} />
        <InsightRow icon={<History className="h-3.5 w-3.5" />} label="Handoff state" value={summary.handoffState} />
      </div>
      <div className="mt-3 grid gap-2 text-[11px] font-semibold text-slate-400 sm:grid-cols-3">
        <p className="border border-white/[0.04] bg-white/[0.025] px-3 py-2">Generated: {summary.generatedAt ?? "not recorded"}</p>
        <p className="border border-white/[0.04] bg-white/[0.025] px-3 py-2">Versions: {summary.versionCount ?? 0}</p>
        <p className="border border-white/[0.04] bg-white/[0.025] px-3 py-2">Runner requested: {summary.latestRunnerRequestedAt ?? "not recorded"}</p>
      </div>
      <div className="mt-2 grid gap-2 text-[11px] font-semibold text-slate-400 sm:grid-cols-3">
        <p className="border border-white/[0.04] bg-white/[0.025] px-3 py-2">Prompt ready: {summary.latestPromptReadyAt ?? "not recorded"}</p>
        <p className="border border-white/[0.04] bg-white/[0.025] px-3 py-2">Acceptance: {summary.acceptanceCriteriaCount}</p>
        <p className="border border-white/[0.04] bg-white/[0.025] px-3 py-2">Forbidden: {summary.forbiddenScopeCount}</p>
      </div>
    </article>
  );
}

function CodexRunHistoryCard({ items }: { items: CodexRunHistoryItem[] }) {
  return (
    <article className="border border-emerald-200/12 bg-[#0d1724]/72 p-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-emerald-100/80" />
        <h2 className="text-sm font-bold tracking-tight text-slate-100">Codex Run History</h2>
      </div>
      <div className="mt-4 space-y-2">
        {items.length ? items.slice(0, 4).map((item) => (
          <div key={item.id} className="grid gap-2 border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 md:grid-cols-[130px_1fr]">
            <div>
              <p className="text-xs font-black text-slate-100">{item.status.replaceAll("_", " ")}</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-500">{item.time}</p>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {item.duration ? <span>{item.duration}</span> : null}
                {item.exitCode ? <span>exit {item.exitCode}</span> : null}
                <span>{item.failureCategory ?? "no failure"}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-300">{item.preview || "No bounded preview recorded."}</p>
            </div>
          </div>
        )) : (
          <div className="border border-dashed border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-500">
            No Codex runner lifecycle event is recorded for this task.
          </div>
        )}
      </div>
    </article>
  );
}

function WorkflowTimelineCard({ items }: { items: WorkflowTimelineItem[] }) {
  return (
    <article className="border border-white/8 bg-[#0d1724]/72 p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-cyan-100/80" />
        <h2 className="text-sm font-bold tracking-tight text-slate-100">Workflow Timeline</h2>
      </div>
      <div className="mt-4 grid gap-2">
        {items.length ? items.slice(0, 8).map((item) => (
          <div key={item.id} className="grid grid-cols-[64px_auto_1fr] gap-3 border border-white/[0.045] bg-white/[0.025] px-3 py-2.5">
            <span className="text-[11px] font-semibold text-slate-500">{item.time}</span>
            <span className={clsx("mt-1 h-2.5 w-2.5 border border-black/40", timelineToneClass[item.tone])} />
            <span className="min-w-0">
              <span className="block text-xs font-bold text-slate-100">{item.title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.detail}</span>
            </span>
          </div>
        )) : (
          <div className="border border-dashed border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-500">
            No workflow events are recorded for this task.
          </div>
        )}
      </div>
    </article>
  );
}

function AgentVisualStateCard({ summary }: { summary: AgentVisualStateSummary }) {
  const statusLabel = summary.status === "unassigned" ? "Unassigned" : agentStatusLabel[summary.status];

  return (
    <article className="relative overflow-hidden border border-cyan-200/12 bg-[#101b2b]/74 p-4">
      <div className="absolute right-5 top-5 h-12 w-12 border border-cyan-200/10 bg-cyan-200/[0.035]" />
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-cyan-100/80" />
        <h2 className="text-sm font-bold tracking-tight text-slate-100">Agent Visual State</h2>
      </div>
      <div className="mt-4 grid grid-cols-[56px_1fr] gap-3">
        <div className="relative grid h-14 w-14 place-items-center border border-slate-700 bg-[#202c40]">
          <span className={clsx("absolute -right-1 -top-1 h-3 w-3 border border-[#0f1722]", summary.status === "blocked" || summary.status === "build_failed" ? "bg-rose-300" : summary.status === "waiting_review" ? "bg-blue-300" : summary.status === "unassigned" || summary.status === "idle" || summary.status === "done" ? "bg-slate-500" : "bg-emerald-300")} />
          <Bot className="h-6 w-6 text-sky-100" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{summary.agentName}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{statusLabel} · {summary.visualState}</p>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{summary.focus}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold leading-relaxed text-slate-300">{summary.taskTitle}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 border border-slate-800 bg-[#08111d]">
            <div className="h-full bg-emerald-300" style={{ width: `${summary.progressPercent}%` }} />
          </div>
          <span className="text-[10px] font-bold text-slate-400">{summary.progressPercent}%</span>
        </div>
      </div>
    </article>
  );
}

function InsightRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <span className="text-cyan-100/70">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</span>
        <span className="mt-0.5 block break-words font-semibold text-slate-200">{value.replaceAll("_", " ")}</span>
      </span>
    </div>
  );
}

const timelineToneClass: Record<WorkflowTimelineItem["tone"], string> = {
  info: "bg-sky-300",
  success: "bg-emerald-300",
  warning: "bg-amber-300",
  danger: "bg-rose-300",
};
