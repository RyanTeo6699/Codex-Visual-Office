import { SectionFrame } from "@/components/ui/SectionFrame";
import { StatusPill } from "@/components/ui/StatusPill";
import type { BetaOpsSummary } from "@/lib/beta-ops/beta-ops-types";

export function BetaTrackerStatusCard({ summary }: { summary: BetaOpsSummary }) {
  return (
    <SectionFrame
      eyebrow="Tracker Status"
      title="Local tracker and template readiness"
      description="Trackers are empty templates until real external tester submissions are provided. Placeholders do not count as tester evidence."
      action={<StatusPill status="info" label="Local templates only" />}
    >
      <div className="space-y-2">
        {summary.templateStatuses.map((template) => (
          <div key={template.path} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-white/8 bg-white/[0.04] px-3 py-3">
            <div>
              <p className="text-sm font-bold text-white">{template.label}</p>
              <p className="mt-1 text-xs text-slate-500">{template.path}</p>
            </div>
            <StatusPill status={template.ready ? "success" : "warning"} label={template.ready ? "Ready" : "Missing"} />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
