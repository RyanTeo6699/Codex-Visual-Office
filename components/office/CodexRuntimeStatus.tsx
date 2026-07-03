import clsx from "clsx";
import { Bot, ShieldCheck, TriangleAlert } from "lucide-react";
import { computeCodexRuntimeStatus, summarizeCodexLastRun } from "@/lib/codex-cli/runtime-status";
import type { CodexRuntimeStatus as CodexRuntimeStatusModel } from "@/lib/codex-cli/runtime-status";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";
import type { CodexCliStatus } from "@/lib/codex-cli/types";

const statusTone: Record<CodexRuntimeStatusModel["codexRuntimeReadiness"], { label: "Ready" | "Auth unknown" | "Missing CLI" | "Blocked" | "Last run failed"; detail: string; className: string }> = {
  ready: {
    label: "Ready",
    detail: "Safe runtime checks did not report a blocker.",
    className: "border-emerald-200/22 bg-emerald-200/9 text-emerald-100",
  },
  available_auth_unknown: {
    label: "Auth unknown",
    detail: "CLI is present; auth capability is not verified by design.",
    className: "border-sky-200/20 bg-sky-200/8 text-sky-100",
  },
  blocked_missing_cli: {
    label: "Missing CLI",
    detail: "Codex CLI was not found on PATH.",
    className: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  },
  blocked_auth_likely_missing: {
    label: "Blocked",
    detail: "Codex auth appears unavailable.",
    className: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  },
  blocked_policy: {
    label: "Blocked",
    detail: "Runtime policy blocks Codex execution.",
    className: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  },
  blocked_missing_approved_path: {
    label: "Blocked",
    detail: "A task run needs an approved project path.",
    className: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  },
  failed_last_run: {
    label: "Last run failed",
    detail: "The most recent scoped run failed.",
    className: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  },
  unknown: {
    label: "Blocked",
    detail: "Codex runtime readiness is unknown.",
    className: "border-slate-200/12 bg-slate-200/6 text-slate-300",
  },
};

export function CodexRuntimeStatus({ status, lastRun }: { status: CodexCliStatus; lastRun?: ScopedCodexRunnerOutput }) {
  const lastRunSummary = summarizeCodexLastRun({ runnerResult: lastRun });
  const runtimeStatus = computeCodexRuntimeStatus({
    cliStatus: status,
    policy: { requireApprovedProjectPath: false },
    lastRun: lastRunSummary,
  });
  const summary = statusTone[runtimeStatus.codexRuntimeReadiness];

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-sky-200/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Local Codex Runtime</h2>
        </div>
        <span
          className={clsx(
            "rounded-md border px-2 py-1 text-[10px] font-semibold",
            summary.className,
          )}
        >
          {summary.label}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <RuntimeRow label="Readiness" value={summary.detail} />
        <RuntimeRow label="Version" value={status.version ?? "Not available"} />
        <RuntimeRow label="Path" value={status.path ?? "Not detected"} />
        <RuntimeRow label="Auth" value={runtimeStatus.codexAuthCapability} />
        <RuntimeRow label="Last run" value={lastRunSummary.status} />
        <RuntimeRow label="Failure" value={lastRunSummary.failureCategory ?? "none"} />
      </div>

      <div className="mt-4 flex gap-2 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>No Codex task execution, prompt dispatch, terminal runner, or token inspection is enabled in this step.</p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-sky-200/70" />
        <span>Checked {new Date(status.checkedAt).toLocaleString("en-US")}</span>
      </div>
    </section>
  );
}

function RuntimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[76px_1fr] gap-3 rounded-[12px] bg-white/[0.025] px-3 py-2">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="min-w-0 break-words font-semibold text-slate-200">{value}</span>
    </div>
  );
}
