"use client";

import { useMemo, useState, useTransition } from "react";
import { Play, ShieldCheck } from "lucide-react";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";

type RunScopedCodexTaskAction = (
  taskId: string,
  confirmations: {
    projectPathApproved: boolean;
    promptReviewed: boolean;
    forbiddenScopeAcknowledged: boolean;
    noAutoCommitPushDeployAcknowledged: boolean;
  },
) => Promise<ScopedCodexRunnerOutput>;

export function ScopedCodexRunnerPanel({
  taskId,
  approvedProjectPath,
  initialResult,
  runScopedCodexTaskAction,
}: {
  taskId: string;
  approvedProjectPath: string;
  initialResult?: ScopedCodexRunnerOutput;
  runScopedCodexTaskAction: RunScopedCodexTaskAction;
}) {
  const [projectPathApproved, setProjectPathApproved] = useState(false);
  const [promptReviewed, setPromptReviewed] = useState(false);
  const [forbiddenScopeAcknowledged, setForbiddenScopeAcknowledged] = useState(false);
  const [noAutoCommitPushDeployAcknowledged, setNoAutoCommitPushDeployAcknowledged] = useState(false);
  const [result, setResult] = useState<ScopedCodexRunnerOutput | null>(initialResult ?? null);
  const [isPending, startTransition] = useTransition();

  const canRun = useMemo(
    () => projectPathApproved && promptReviewed && forbiddenScopeAcknowledged && noAutoCommitPushDeployAcknowledged,
    [forbiddenScopeAcknowledged, noAutoCommitPushDeployAcknowledged, projectPathApproved, promptReviewed],
  );

  function runScopedTask() {
    const startedAt = new Date().toISOString();
    setResult({
      status: "running",
      startedAt,
      endedAt: "",
      outputPreview: "",
      errorPreview: "",
      taskExecutionAttempted: true,
      autoPushAttempted: false,
      autoDeployAttempted: false,
      eventIds: [],
    });

    startTransition(async () => {
      const nextResult = await runScopedCodexTaskAction(taskId, {
        projectPathApproved,
        promptReviewed,
        forbiddenScopeAcknowledged,
        noAutoCommitPushDeployAcknowledged,
      });
      setResult(nextResult);
    });
  }

  return (
    <section className="rounded-[18px] border border-emerald-200/14 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Scoped Codex Runner</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">Codex executable only. Generated prompt only. No shell commands.</p>
        </div>
        <span className="rounded-md border border-emerald-200/20 bg-emerald-200/10 px-2 py-1 text-[10px] font-semibold text-emerald-100">
          Scoped runner
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs md:grid-cols-2">
        <RunnerRow label="Approved project path" value={approvedProjectPath} />
        <RunnerRow label="Command shape" value="codex exec --cd [approved] --sandbox read-only --json [generated prompt]" />
        <RunnerRow label="Auto push" value="Disabled" />
        <RunnerRow label="Auto deploy" value="Disabled" />
        <RunnerRow label="Arbitrary shell" value="Disabled" />
        <RunnerRow label="Output storage" value="Bounded preview only" />
      </div>

      <div className="mt-4 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
        This will run Codex CLI locally for this task only. It will not auto commit, push, or deploy.
      </div>

      <div className="mt-4 space-y-2">
        <ConfirmRow checked={projectPathApproved} onChange={setProjectPathApproved} label="I approve this project path" />
        <ConfirmRow checked={promptReviewed} onChange={setPromptReviewed} label="I reviewed the prompt" />
        <ConfirmRow checked={forbiddenScopeAcknowledged} onChange={setForbiddenScopeAcknowledged} label="I acknowledge forbidden scope" />
        <ConfirmRow checked={noAutoCommitPushDeployAcknowledged} onChange={setNoAutoCommitPushDeployAcknowledged} label="Do not auto commit/push/deploy" />
      </div>

      <button
        disabled={!canRun || isPending}
        onClick={runScopedTask}
        className="mt-4 inline-flex items-center gap-2 rounded-[14px] border border-emerald-200/20 bg-emerald-200/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-200/14 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play className="h-4 w-4" />
        Run Scoped Codex Task
      </button>

      {result ? <RunnerStatusBlock result={result} /> : null}
    </section>
  );
}

function RunnerStatusBlock({ result }: { result: ScopedCodexRunnerOutput }) {
  return (
    <div className="mt-4 rounded-[14px] border border-white/8 bg-black/16 p-3 text-xs">
      <p className="text-sm font-bold text-slate-100">Runner Status</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <RunnerRow label="Status" value={result.status} />
        <RunnerRow label="Started" value={result.startedAt || "Not available"} />
        <RunnerRow label="Ended" value={result.endedAt || "Not available"} />
        <RunnerRow label="Exit code" value={typeof result.exitCode === "number" ? String(result.exitCode) : "Not available"} />
      </div>
      <p className="mt-3 font-semibold text-slate-400">No auto commit / push / deploy.</p>
      {result.outputPreview ? (
        <div className="mt-3">
          <p className="mb-2 font-semibold text-slate-300">Output preview</p>
          <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded-[12px] bg-white/[0.025] p-3 text-slate-300">{result.outputPreview}</pre>
        </div>
      ) : null}
      {result.errorPreview ? (
        <div className="mt-3">
          <p className="mb-2 font-semibold text-rose-100">Error preview</p>
          <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded-[12px] bg-rose-950/20 p-3 text-rose-100">{result.errorPreview}</pre>
        </div>
      ) : null}
    </div>
  );
}

function RunnerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-white/[0.025] px-3 py-2">
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function ConfirmRow({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-[12px] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-300"
      />
      {label}
    </label>
  );
}
