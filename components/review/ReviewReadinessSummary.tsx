import clsx from "clsx";
import { AlertTriangle, CheckCircle2, CircleDashed, GitBranch, ShieldAlert } from "lucide-react";
import type { ReviewReadinessSummary as ReviewReadinessSummaryModel } from "@/lib/review/readiness-types";

const readinessStyles: Record<ReviewReadinessSummaryModel["reviewReadiness"], string> = {
  not_ready: "border-slate-200/12 bg-slate-200/6 text-slate-200",
  ready_for_review: "border-emerald-200/18 bg-emerald-200/10 text-emerald-100",
  blocked_by_scope: "border-rose-200/18 bg-rose-200/10 text-rose-100",
  blocked_by_quality: "border-rose-200/18 bg-rose-200/10 text-rose-100",
  runner_not_completed: "border-amber-200/18 bg-amber-200/10 text-amber-100",
  approved: "border-emerald-200/18 bg-emerald-200/10 text-emerald-100",
  revision_requested: "border-amber-200/18 bg-amber-200/10 text-amber-100",
  rejected: "border-rose-200/18 bg-rose-200/10 text-rose-100",
  mixed: "border-sky-200/16 bg-sky-200/8 text-sky-100",
};

export function ReviewReadinessSummary({ summary }: { summary: ReviewReadinessSummaryModel }) {
  const Icon = summary.reviewReadiness === "ready_for_review" || summary.reviewReadiness === "approved"
    ? CheckCircle2
    : summary.reviewReadiness === "blocked_by_scope" || summary.reviewReadiness === "blocked_by_quality" || summary.reviewReadiness === "rejected"
      ? ShieldAlert
      : summary.reviewReadiness === "mixed"
        ? GitBranch
        : CircleDashed;

  return (
    <section className="rounded-[22px] border border-white/8 bg-[#111a25]/82 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-[16px] border border-white/8 bg-white/[0.04] p-3">
            <Icon className="h-5 w-5 text-emerald-100/80" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Review Readiness Summary</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">{summary.label}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">{summary.message}</p>
          </div>
        </div>
        <span className={clsx("rounded-md border px-3 py-1.5 text-xs font-bold uppercase", readinessStyles[summary.reviewReadiness])}>
          {summary.reviewReadiness.replaceAll("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid gap-2 text-[11px] font-semibold text-slate-400 md:grid-cols-3 lg:grid-cols-6">
        <Signal label="Task" value={summary.signals.taskStatus} />
        <Signal label="Decision" value={summary.signals.reviewDecision} />
        <Signal label="Runner" value={summary.signals.runnerStatus} />
        <Signal label="Scope" value={summary.signals.scopeStatus} />
        <Signal label="Quality" value={summary.signals.qualityStatus} />
        <Signal label="Changed" value={String(summary.signals.changedFilesCount)} />
      </div>

      {summary.warnings.length ? (
        <div className="mt-4 space-y-2">
          {summary.warnings.map((warning) => (
            <p key={warning} className="flex items-start gap-2 rounded-[12px] border border-amber-200/12 bg-amber-200/[0.045] px-3 py-2 text-xs font-semibold text-amber-100">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {warning}
            </p>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-[11px] font-semibold text-slate-500">
        Readiness is advisory only. It does not approve, reject, revise, fix, commit, push, or deploy.
      </p>
    </section>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <p className="uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-slate-100">{value.replaceAll("_", " ")}</p>
    </div>
  );
}
