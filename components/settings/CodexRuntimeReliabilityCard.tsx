import clsx from "clsx";
import { Activity, ShieldCheck, Terminal, TriangleAlert } from "lucide-react";
import { computeCodexRuntimeStatus, summarizeCodexLastRun } from "@/lib/codex-cli/runtime-status";
import type { CodexLastRunSummary, CodexRuntimeStatus } from "@/lib/codex-cli/runtime-status";
import type { CodexCliStatus } from "@/lib/codex-cli/types";
import type { ApprovedProjectPath } from "@/lib/types";

const readinessTone: Record<CodexRuntimeStatus["codexRuntimeReadiness"], { label: string; className: string }> = {
  ready: { label: "Ready", className: "border-emerald-200/22 bg-emerald-200/9 text-emerald-100" },
  available_auth_unknown: { label: "Auth unknown", className: "border-sky-200/20 bg-sky-200/8 text-sky-100" },
  blocked_missing_cli: { label: "Missing CLI", className: "border-rose-200/24 bg-rose-200/10 text-rose-100" },
  blocked_auth_likely_missing: { label: "Auth likely missing", className: "border-rose-200/24 bg-rose-200/10 text-rose-100" },
  blocked_policy: { label: "Policy blocked", className: "border-amber-200/24 bg-amber-200/10 text-amber-100" },
  blocked_missing_approved_path: { label: "Missing path", className: "border-amber-200/24 bg-amber-200/10 text-amber-100" },
  failed_last_run: { label: "Last run failed", className: "border-rose-200/24 bg-rose-200/10 text-rose-100" },
  unknown: { label: "Unknown", className: "border-slate-200/12 bg-slate-200/6 text-slate-300" },
};

export function CodexRuntimeReliabilityCard({
  status,
  approvedPaths = [],
  lastRunSummary,
}: {
  status: CodexCliStatus;
  approvedPaths?: ApprovedProjectPath[];
  lastRunSummary?: CodexLastRunSummary;
}) {
  const primaryApprovedPath = approvedPaths.find((path) => path.approved);
  const lastRun = lastRunSummary ?? summarizeCodexLastRun({});
  const runtimeStatus = computeCodexRuntimeStatus({
    cliStatus: status,
    approvedProjectPath: {
      approved: Boolean(primaryApprovedPath),
      localPath: primaryApprovedPath?.localPath,
    },
    lastRun,
  });
  const readiness = readinessTone[runtimeStatus.codexRuntimeReadiness];

  return (
    <section className="rounded-[18px] border border-sky-200/12 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-sky-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Codex Runtime Reliability</h2>
        </div>
        <span className={clsx("rounded-md border px-2 py-1 text-[10px] font-semibold", readiness.className)}>
          {readiness.label}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs md:grid-cols-2">
        <RuntimeCell label="CLI availability" value={runtimeStatus.codexCliAvailability} />
        <RuntimeCell label="Version" value={status.version ?? "Not available"} />
        <RuntimeCell label="Auth capability" value={runtimeStatus.codexAuthCapability} />
        <RuntimeCell label="Runtime readiness" value={runtimeStatus.codexRuntimeReadiness} />
        <RuntimeCell label="Detection mode" value="Safe detection only" />
        <RuntimeCell label="Last run status" value={lastRun.status} />
        <RuntimeCell label="Last run category" value={lastRun.failureCategory ?? "none"} />
        <RuntimeCell label="Approved path" value={primaryApprovedPath ? "Configured" : "Missing"} />
      </div>

      {status.errors?.length ? (
        <div className="mt-3 flex gap-2 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{status.errors.slice(0, 2).join(" ")}</p>
        </div>
      ) : null}

      <div className="mt-3 flex gap-2 rounded-[14px] border border-emerald-200/12 bg-emerald-200/[0.04] p-3 text-xs leading-relaxed text-emerald-100">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Safety note: no token, auth file, ~/.codex/auth.json, .env, or .env.local content is read. Auth unknown means the app did not verify login state.</p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        <Activity className="h-3.5 w-3.5 text-sky-200/70" />
        <span>Checked {new Date(status.checkedAt).toLocaleString("en-US")}</span>
      </div>
    </section>
  );
}

function RuntimeCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold text-slate-200">{value || "Not available"}</p>
    </div>
  );
}
