import { Lock, ShieldAlert } from "lucide-react";
import type { RunnerSafetyStatus } from "@/lib/codex-cli/runner-types";

export function CodexRunnerSafetyPanel({ status }: { status: RunnerSafetyStatus }) {
  return (
    <section className="rounded-[18px] border border-amber-200/14 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Runner Safety Harness</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">{status.reason}</p>
        </div>
        <span className="rounded-md border border-rose-200/20 bg-rose-200/10 px-2 py-1 text-[10px] font-semibold text-rose-100">
          Can execute: No
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs md:grid-cols-2">
        <SafetyRow label="Execution mode" value={status.policy.executionMode} />
        <SafetyRow label="Approved project path" value={status.approvedProjectPath.approved ? status.approvedProjectPath.localPath : "Not configured"} />
        <SafetyRow label="Explicit confirmation" value="Required" />
        <SafetyRow label="Prompt preview" value="Required" />
        <SafetyRow label="Forbidden scope ack" value="Required" />
        <SafetyRow label="Auto push/deploy" value="Disabled" />
        <SafetyRow label="Arbitrary shell" value="Disabled" />
        <SafetyRow label="Codex task execution" value="Disabled in this step" />
      </div>

      <div className="mt-4 rounded-[14px] border border-white/8 bg-black/16 p-3">
        <p className="text-xs font-semibold text-slate-300">Missing requirements</p>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-400">
          {status.missingRequirements.map((requirement) => (
            <li key={requirement}>- {requirement}</li>
          ))}
        </ul>
      </div>

      <button disabled className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-[14px] border border-slate-600/70 bg-slate-700/20 px-4 py-2 text-sm font-semibold text-slate-400 opacity-70">
        <Lock className="h-4 w-4" />
        Available in later step
      </button>
    </section>
  );
}

function SafetyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-white/[0.025] px-3 py-2">
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}
