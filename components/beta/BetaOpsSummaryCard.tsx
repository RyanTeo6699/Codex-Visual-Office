import { SectionFrame } from "@/components/ui/SectionFrame";
import { StatusPill } from "@/components/ui/StatusPill";
import type { BetaOpsSummary } from "@/lib/beta-ops/beta-ops-types";

export function BetaOpsSummaryCard({ summary }: { summary: BetaOpsSummary }) {
  const metrics = [
    { label: "GM/local validation samples", value: summary.gmLocalValidationCount },
    { label: "External tester feedback", value: summary.externalTesterFeedbackCount },
    { label: "External tester issues", value: summary.externalIssueCount },
    { label: "Private beta completion claimed", value: summary.betaCompletionClaimed ? "yes" : "no" },
    { label: "Public release ready claimed", value: summary.publicReleaseReadyClaimed ? "yes" : "no" },
  ];

  return (
    <SectionFrame
      eyebrow="Beta Ops Summary"
      title="Current private beta status"
      description="Status is derived from local docs and tracked evidence only. GM local validation is not counted as external tester feedback."
      surface="base"
      action={<StatusPill status="warning" label="Awaiting external submissions" />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[14px] border border-white/8 bg-white/[0.045] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {summary.warningNotes.map((note) => (
          <div key={note} className="rounded-[12px] border border-amber-200/10 bg-amber-200/[0.035] px-3 py-2 text-xs font-semibold text-amber-100/85">
            {note}
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
