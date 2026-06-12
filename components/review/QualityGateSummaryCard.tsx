import clsx from "clsx";
import { Activity, Timer, ShieldCheck } from "lucide-react";
import type { QualityGateSummary } from "@/lib/quality-gates/quality-gate-summary-types";

const overallStyles: Record<QualityGateSummary["overallStatus"], string> = {
  not_run: "border-slate-200/12 bg-slate-200/6 text-slate-200",
  passed: "border-emerald-200/18 bg-emerald-200/10 text-emerald-100",
  failed: "border-rose-200/18 bg-rose-200/10 text-rose-100",
  skipped: "border-amber-200/18 bg-amber-200/10 text-amber-100",
  blocked: "border-rose-200/18 bg-rose-200/10 text-rose-100",
  mixed: "border-sky-200/16 bg-sky-200/8 text-sky-100",
};

export function QualityGateSummaryCard({ summary }: { summary: QualityGateSummary }) {
  return (
    <div className="mt-4 rounded-[16px] border border-white/[0.06] bg-black/14 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-100/80" />
            <h3 className="text-sm font-bold text-slate-100">Quality Gate Summary</h3>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400">{summary.summaryMessage}</p>
        </div>
        <span className={clsx("rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase", overallStyles[summary.overallStatus])}>
          {summary.overallStatus.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Passed" value={summary.passedCount} tone="emerald" />
        <Metric label="Failed" value={summary.failedCount} tone="rose" />
        <Metric label="Skipped" value={summary.skippedCount} tone="amber" />
        <Metric label="Blocked" value={summary.blockedCount} tone="rose" />
      </div>

      <div className="mt-3 grid gap-2 text-[11px] font-semibold text-slate-400 md:grid-cols-3">
        <p className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
          Enabled: <span className="text-slate-100">{summary.enabledCount}</span> / Disabled: <span className="text-slate-100">{summary.disabledCount}</span>
        </p>
        <p className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
          <Activity className="h-3.5 w-3.5" />
          Latest: <span className="text-slate-100">{summary.latestRunAt ? formatTimestamp(summary.latestRunAt) : "not run"}</span>
        </p>
        <p className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
          <Timer className="h-3.5 w-3.5" />
          Total: <span className="text-slate-100">{summary.totalDurationMs}ms</span>
        </p>
      </div>

      {summary.failedGateNames.length ? (
        <p className="mt-3 rounded-[12px] border border-rose-200/12 bg-rose-200/[0.035] px-3 py-2 text-xs font-semibold text-rose-100">
          Failed gates: {summary.failedGateNames.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "emerald" | "rose" | "amber" }) {
  const toneClass = {
    emerald: "text-emerald-100",
    rose: "text-rose-100",
    amber: "text-amber-100",
  }[tone];

  return (
    <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className={clsx("mt-1 text-lg font-bold", toneClass)}>{value}</p>
    </div>
  );
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
