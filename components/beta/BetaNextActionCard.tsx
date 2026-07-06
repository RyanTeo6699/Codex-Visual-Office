import Link from "next/link";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { StatusPill } from "@/components/ui/StatusPill";
import type { BetaOpsSummary } from "@/lib/beta-ops/beta-ops-types";

const actionCopy = {
  collect_external_tester_submissions: "Collect real external tester submissions",
  send_invitation_packet: "Use invitation packet manually",
  review_feedback: "Review real feedback",
  prepare_fix_batch: "Prepare a fix batch from real evidence",
  unknown: "Confirm next beta ops action",
} as const;

export function BetaNextActionCard({ summary }: { summary: BetaOpsSummary }) {
  return (
    <SectionFrame
      eyebrow="Next Action"
      title={actionCopy[summary.nextRecommendedAction]}
      description="Codex Visual Office can organize the local beta ops package. It cannot recruit humans, contact testers, or fabricate feedback."
      action={<StatusPill status="warning" label="Manual outreach required" />}
    >
      <div className="space-y-3">
        <div className="rounded-[14px] border border-cyan-200/12 bg-cyan-200/[0.035] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100/70">Recommended action</p>
          <p className="mt-2 text-lg font-black text-white">{summary.nextRecommendedAction}</p>
        </div>
        <div className="rounded-[14px] border border-white/8 bg-white/[0.04] p-3 text-sm leading-relaxed text-slate-300">
          Use the exported invitation packet and trackers to collect real external tester submissions. Keep all evidence redacted and do not submit tokens, auth files, env files, source packages, or local SQLite databases.
        </div>
        <div className="flex flex-wrap gap-2">
          {summary.sourceDocuments.map((doc) => (
            <Link key={doc} href={`/${doc}`} className="rounded-[12px] border border-white/8 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.07]">
              {doc}
            </Link>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
