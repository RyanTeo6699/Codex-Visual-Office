import clsx from "clsx";
import type { ReactNode } from "react";
import { Activity, Bot, ClipboardCheck, GitBranch, History, ShieldAlert, Sparkles } from "lucide-react";
import { agentStatusLabel, statusColor, taskStatusLabel } from "@/lib/status";
import type { AgentStatus, TaskStatus } from "@/lib/types";

export interface AgentWorkflowSeatState {
  id: string;
  name: string;
  status: AgentStatus;
  taskTitle?: string;
  visualState: string;
}

export interface AgentWorkflowSummary {
  id: string;
  label: string;
  scope: "office" | "project" | "task";
  activeSeatCount: number;
  runningTaskCount: number;
  waitingReviewCount: number;
  blockedTaskCount: number;
  failedCheckCount: number;
  promptReadiness: string;
  lastRunStatus: string;
  failureCategory?: string;
  recommendedAction: string;
  recommendedActionDetail: string;
  primaryTaskStatus?: TaskStatus;
  seats: AgentWorkflowSeatState[];
}

export function AgentWorkflowStatus({
  title = "Agent Workflow Status",
  eyebrow = "Phase 11 visual read",
  summaries,
}: {
  title?: string;
  eyebrow?: string;
  summaries: AgentWorkflowSummary[];
}) {
  if (!summaries.length) {
    return (
      <section className="border border-dashed border-white/10 bg-white/[0.025] p-4 text-sm text-slate-400">
        <p className="font-bold text-slate-200">{title}</p>
        <p className="mt-1 text-xs">No agent workflow summaries are available for this view.</p>
      </section>
    );
  }

  const totals = summaries.reduce(
    (acc, summary) => ({
      activeSeatCount: acc.activeSeatCount + summary.activeSeatCount,
      runningTaskCount: acc.runningTaskCount + summary.runningTaskCount,
      waitingReviewCount: acc.waitingReviewCount + summary.waitingReviewCount,
      blockedTaskCount: acc.blockedTaskCount + summary.blockedTaskCount,
      failedCheckCount: acc.failedCheckCount + summary.failedCheckCount,
    }),
    { activeSeatCount: 0, runningTaskCount: 0, waitingReviewCount: 0, blockedTaskCount: 0, failedCheckCount: 0 },
  );

  return (
    <section className="relative overflow-hidden border border-white/8 bg-[#0d1724]/76 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-100/80" />
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/65">{eyebrow}</p>
            </div>
            <h2 className="mt-1 text-sm font-bold tracking-tight text-slate-100">{title}</h2>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold text-slate-400">
            <WorkflowMetric label="Seats" value={totals.activeSeatCount} />
            <WorkflowMetric label="Run" value={totals.runningTaskCount} />
            <WorkflowMetric label="Review" value={totals.waitingReviewCount} />
            <WorkflowMetric label="Blocked" value={totals.blockedTaskCount} />
            <WorkflowMetric label="Failed" value={totals.failedCheckCount} />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {summaries.map((summary) => (
            <WorkflowSummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-14 border border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
      <p className="text-sm font-black text-white">{value}</p>
      <p className="mt-0.5 uppercase tracking-[0.1em]">{label}</p>
    </div>
  );
}

function WorkflowSummaryCard({ summary }: { summary: AgentWorkflowSummary }) {
  const riskCount = summary.blockedTaskCount + summary.failedCheckCount;
  const toneClass = riskCount
    ? "border-rose-200/14 bg-rose-200/[0.035]"
    : summary.waitingReviewCount
      ? "border-blue-200/14 bg-blue-200/[0.035]"
      : summary.runningTaskCount
        ? "border-emerald-200/14 bg-emerald-200/[0.035]"
        : "border-white/[0.06] bg-white/[0.025]";

  return (
    <article className={clsx("border p-3", toneClass)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{summary.label}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{summary.scope} workflow</p>
        </div>
        {summary.primaryTaskStatus ? (
          <span className={clsx("border px-2 py-1 text-[10px] font-bold", statusColor[summary.primaryTaskStatus])}>
            {taskStatusLabel[summary.primaryTaskStatus]}
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
        <WorkflowRow icon={<Activity className="h-3.5 w-3.5" />} label="Prompt readiness" value={summary.promptReadiness} />
        <WorkflowRow icon={<History className="h-3.5 w-3.5" />} label="Last run" value={summary.lastRunStatus} />
        <WorkflowRow icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Failure category" value={summary.failureCategory ?? "none"} />
        <WorkflowRow icon={<ClipboardCheck className="h-3.5 w-3.5" />} label="Recommended action" value={summary.recommendedAction} />
      </div>

      <p className="mt-3 border border-cyan-200/10 bg-cyan-200/[0.035] px-3 py-2 text-xs font-semibold leading-relaxed text-slate-300">
        {summary.recommendedActionDetail}
      </p>

      <div className="mt-3 space-y-2">
        {summary.seats.length ? summary.seats.slice(0, 3).map((seat) => (
          <div key={seat.id} className="grid grid-cols-[auto_1fr] gap-2 border border-white/[0.05] bg-black/12 px-3 py-2">
            <span className={clsx("mt-0.5 h-2.5 w-2.5 border border-black/40", seat.status === "blocked" || seat.status === "build_failed" ? "bg-rose-300" : seat.status === "waiting_review" ? "bg-blue-300" : seat.status === "idle" || seat.status === "done" ? "bg-slate-500" : "bg-emerald-300")} />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-100">{seat.name} · {agentStatusLabel[seat.status]}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">{seat.taskTitle ?? seat.visualState}</p>
            </div>
          </div>
        )) : (
          <div className="border border-dashed border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-slate-500">
            No Codex seat is attached to this workflow.
          </div>
        )}
      </div>
    </article>
  );
}

function WorkflowRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
