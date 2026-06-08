"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import { ListChecks, Play } from "lucide-react";
import { summarizeQualityGates } from "@/lib/quality-gates/quality-gate-summary";
import type { QualityGateConfig, QualityGateRun, QualityGateRunStatus } from "@/lib/types";
import { QualityGateSummaryCard } from "./QualityGateSummaryCard";

type RunEnabledQualityGatesAction = (taskId: string) => Promise<{
  ok: boolean;
  runs: QualityGateRun[];
  error?: string;
}>;

const statusStyles: Record<QualityGateRunStatus | "not_run", string> = {
  pending: "border-slate-200/12 bg-slate-200/6 text-slate-200",
  running: "border-sky-200/16 bg-sky-200/8 text-sky-100",
  passed: "border-emerald-200/16 bg-emerald-200/8 text-emerald-100",
  failed: "border-rose-200/18 bg-rose-200/8 text-rose-100",
  skipped: "border-amber-200/18 bg-amber-200/8 text-amber-100",
  blocked: "border-rose-200/18 bg-rose-200/8 text-rose-100",
  not_run: "border-slate-200/10 bg-black/12 text-slate-400",
};

export function QualityGateResultsPanel({
  taskId,
  configs,
  initialRuns,
  runEnabledQualityGatesAction,
  onRunsChange,
}: {
  taskId: string;
  configs: QualityGateConfig[];
  initialRuns: QualityGateRun[];
  runEnabledQualityGatesAction: RunEnabledQualityGatesAction;
  onRunsChange?: (runs: QualityGateRun[]) => void;
}) {
  const [runs, setRuns] = useState<QualityGateRun[]>(initialRuns);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const latestRunsByConfig = useMemo(() => {
    const latest = new Map<string, QualityGateRun>();
    for (const run of runs) {
      if (!latest.has(run.configId)) {
        latest.set(run.configId, run);
      }
    }

    return latest;
  }, [runs]);
  const summary = useMemo(() => summarizeQualityGates(configs, runs), [configs, runs]);

  function handleRunEnabledGates() {
    setError(null);
    startTransition(async () => {
      const result = await runEnabledQualityGatesAction(taskId);
      if (!result.ok) {
        setError(result.error ?? "Quality gates could not run.");
        return;
      }

      const nextRuns = [...result.runs, ...runs];
      setRuns(nextRuns);
      onRunsChange?.(nextRuns);
    });
  }

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-emerald-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Quality Gates</h2>
        </div>
        <button
          type="button"
          disabled={isPending || configs.length === 0}
          onClick={handleRunEnabledGates}
          className="inline-flex items-center gap-2 rounded-[12px] border border-emerald-200/18 bg-emerald-200/10 px-3 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-200/16 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" />
          {isPending ? "Running Quality Gates" : "Run Enabled Quality Gates"}
        </button>
      </div>

      <p className="mt-3 rounded-[12px] border border-emerald-200/10 bg-emerald-200/[0.035] px-3 py-2 text-xs font-semibold text-emerald-100">
        Only allowlisted commands are executed. No auto fix, commit, push, or deploy.
      </p>
      {error ? <p className="mt-3 rounded-[12px] border border-rose-200/16 bg-rose-200/8 px-3 py-2 text-xs font-semibold text-rose-100">{error}</p> : null}
      <QualityGateSummaryCard summary={summary} />

      {configs.length ? (
        <div className="mt-4 space-y-3">
          {configs.map((config) => {
            const run = latestRunsByConfig.get(config.id);
            const status = run?.status ?? "not_run";
            return (
              <div key={config.id} className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-100">{config.name}</p>
                    <p className="mt-1 break-words text-[11px] font-semibold text-slate-500">{config.command}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                    <span className={config.enabled ? "rounded-md border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-emerald-100" : "rounded-md border border-slate-200/10 bg-slate-200/6 px-2 py-1 text-slate-400"}>
                      {config.enabled ? "enabled" : "disabled"}
                    </span>
                    <span className="rounded-md border border-sky-200/14 bg-sky-200/8 px-2 py-1 text-sky-100">allowlisted</span>
                    <span className={clsx("rounded-md border px-2 py-1 uppercase", statusStyles[status])}>{status.replace("_", " ")}</span>
                  </div>
                </div>

                {run ? (
                  <div className="mt-3 grid gap-2 text-[11px] text-slate-400 md:grid-cols-3">
                    <p>Exit: <span className="font-semibold text-slate-200">{run.exitCode ?? "none"}</span></p>
                    <p>Duration: <span className="font-semibold text-slate-200">{run.durationMs ?? 0}ms</span></p>
                    <p>Reason: <span className="font-semibold text-slate-200">{run.skippedReason ?? run.failedReason ?? "none"}</span></p>
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] font-semibold text-slate-500">Not run yet.</p>
                )}

                {run?.stdoutPreview ? <OutputPreview title={`stdout${run.stdoutTruncated ? " / truncated" : ""}`} value={run.stdoutPreview} truncated={run.stdoutTruncated} /> : null}
                {run?.stderrPreview ? <OutputPreview title={`stderr${run.stderrTruncated ? " / truncated" : ""}`} value={run.stderrPreview} tone="warning" truncated={run.stderrTruncated} /> : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No configured quality gates for this project.</p>
      )}

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        No custom command entry, arbitrary shell, terminal emulator, automatic repair, commit, push, or deploy action is available.
      </p>
    </section>
  );
}

function OutputPreview({ title, value, tone = "default", truncated = false }: { title: string; value: string; tone?: "default" | "warning"; truncated?: boolean }) {
  return (
    <details className={clsx("mt-3 rounded-[12px] border p-3", tone === "warning" ? "border-amber-200/12 bg-amber-950/10" : "border-slate-200/10 bg-black/14")}>
      <summary className={clsx("cursor-pointer text-[10px] font-bold uppercase", tone === "warning" ? "text-amber-100" : "text-slate-400")}>
        {title}
        {truncated ? <span className="ml-2 rounded-md border border-amber-200/14 bg-amber-200/8 px-1.5 py-0.5 text-amber-100">bounded preview</span> : null}
        <span className="ml-2 text-slate-500">redacted if sensitive markers appear</span>
      </summary>
      <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-slate-300">{value}</pre>
    </details>
  );
}
