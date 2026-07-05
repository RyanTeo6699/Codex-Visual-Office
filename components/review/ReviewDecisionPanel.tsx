"use client";

import clsx from "clsx";
import { Check, Gavel, RotateCcw, X } from "lucide-react";
import { reviewDecisionLabel, statusColor } from "@/lib/status";
import type { ReactNode } from "react";
import type { ReviewDecision } from "@/lib/types";
import type { ReviewReadinessSummary } from "@/lib/review/readiness-types";

export function ReviewDecisionPanel({
  decision,
  isPending,
  error,
  readiness,
  onDecision,
}: {
  decision: ReviewDecision;
  isPending: boolean;
  error: string | null;
  readiness: ReviewReadinessSummary;
  onDecision: (decision: ReviewDecision) => void;
}) {
  return (
    <section className="border border-cyan-200/14 bg-[#0b1623]/88 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-cyan-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Final Decision</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">Human decision remains manual. Readiness only gives review context.</p>
        </div>
        <span className={clsx("border px-3 py-1.5 text-xs font-semibold", statusColor[decision])}>
          {reviewDecisionLabel[decision]}
        </span>
      </div>

      {readiness.reviewReadiness === "blocked_by_scope" ? (
        <p className="mt-3 border border-rose-200/14 bg-rose-200/8 px-3 py-2 text-xs font-semibold text-rose-100">
          Scope Guard blocked. Review carefully before approving.
        </p>
      ) : null}
      {readiness.reviewReadiness === "blocked_by_quality" ? (
        <p className="mt-3 border border-amber-200/14 bg-amber-200/8 px-3 py-2 text-xs font-semibold text-amber-100">
          Quality gates failed or blocked. Review output before approving.
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DecisionButton
          icon={<Check className="h-4 w-4" />}
          title="Approve"
          description="Confirm current result is acceptable."
          disabled={isPending}
          className="border-emerald-200/24 bg-emerald-200/10 text-emerald-100 hover:bg-emerald-200/16"
          onClick={() => onDecision("approved")}
        />
        <DecisionButton
          icon={<X className="h-4 w-4" />}
          title="Reject"
          description="Current result is not acceptable."
          disabled={isPending}
          className="border-rose-200/20 bg-rose-200/8 text-rose-100 hover:bg-rose-200/14"
          onClick={() => onDecision("rejected")}
        />
        <DecisionButton
          icon={<RotateCcw className="h-4 w-4" />}
          title="Ask Revision"
          description="Record that revision is needed."
          disabled={isPending}
          className="border-amber-200/24 bg-amber-200/10 text-amber-100 hover:bg-amber-200/16"
          onClick={() => onDecision("revision_requested")}
        />
      </div>
      {error ? <p className="mt-3 text-sm font-semibold text-rose-100">{error}</p> : null}
    </section>
  );
}

function DecisionButton({ icon, title, description, disabled, className, onClick }: { icon: ReactNode; title: string; description: string; disabled: boolean; className: string; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx("border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50", className)}
    >
      <span className="inline-flex items-center gap-2 text-sm font-bold">
        {icon}
        {title}
      </span>
      <span className="mt-2 block text-xs leading-relaxed opacity-80">{description}</span>
    </button>
  );
}
