import clsx from "clsx";
import { ShieldAlert } from "lucide-react";
import type { ScopeCheck } from "@/lib/types";

const statusLabels = {
  pass: "PASS",
  warning: "WARNING",
  blocked: "BLOCKED",
} as const;

const statusStyles = {
  pass: "border-emerald-200/18 bg-emerald-200/8 text-emerald-100",
  warning: "border-amber-200/22 bg-amber-200/10 text-amber-100",
  blocked: "border-rose-200/22 bg-rose-200/10 text-rose-100",
} as const;

export function ScopeGuardPanel({ scopeCheck, forbiddenScope }: { scopeCheck?: ScopeCheck; forbiddenScope: string[] }) {
  const rules = scopeCheck?.forbiddenScope.length ? scopeCheck.forbiddenScope : forbiddenScope;

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Scope Guard</h2>
        </div>
        <span className={clsx("rounded-md border px-2 py-1 text-[10px] font-semibold", scopeCheck ? statusStyles[scopeCheck.status] : "border-slate-200/12 bg-slate-200/6 text-slate-400")}>
          {scopeCheck ? statusLabels[scopeCheck.status] : "NOT RUN"}
        </span>
      </div>

      {!scopeCheck ? (
        <p className="mt-4 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No scope check captured yet.</p>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3">
            <p className="text-xs font-bold text-slate-200">Reason</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{scopeCheck.reason}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Check source: path-level only
            </p>
          </div>

          <div className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3">
            <p className="text-xs font-bold text-slate-200">Matched Changed Files</p>
            {scopeCheck.matchedFiles.length ? (
              <div className="mt-3 space-y-2">
                {scopeCheck.matchedFiles.slice(0, 8).map((filePath) => (
                  <p key={filePath} className="break-words rounded-[12px] bg-black/12 px-3 py-2 text-xs font-semibold text-rose-100">
                    {filePath}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No changed file paths matched forbidden scope rules.</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-[14px] border border-rose-200/10 bg-rose-200/[0.035] p-3">
        <p className="text-xs font-bold text-rose-100">Forbidden Scope Rules</p>
        {rules.length ? (
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {rules.map((rule) => (
              <li key={rule} className="rounded-[12px] bg-black/12 px-3 py-2 text-xs leading-relaxed text-slate-300">{rule}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No forbidden scope rules configured for this task.</p>
        )}
      </div>

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        This is a path-level guard, not semantic code review. No full diff, file content, model-written review, quality gate action, auto fix, rollback, commit, push, or deploy action is available here.
      </p>
    </section>
  );
}
