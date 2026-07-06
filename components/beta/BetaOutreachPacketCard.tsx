import Link from "next/link";
import { SectionFrame } from "@/components/ui/SectionFrame";
import { StatusPill } from "@/components/ui/StatusPill";
import type { BetaOpsSummary } from "@/lib/beta-ops/beta-ops-types";

export function BetaOutreachPacketCard({ summary }: { summary: BetaOpsSummary }) {
  const docs = [
    { label: "Invitation message pack", href: "/docs/private-beta-ops-export/invitation-message-pack.md" },
    { label: "Feedback submission template", href: "/docs/private-beta-ops-export/feedback-submission-template.md" },
    { label: "Issue report template", href: "/docs/private-beta-ops-export/issue-report-template.md" },
    { label: "GM next actions", href: "/docs/private-beta-ops-export/gm-next-actions.md" },
  ];

  return (
    <SectionFrame
      eyebrow="Outreach Packet"
      title="Exportable message and template locations"
      description="These are local templates for manual GM use. The app has no external messaging integration, no external service connection, no upload flow, and no automated invitation action."
      action={<StatusPill status={summary.outreachPacketReady ? "success" : "warning"} label={summary.outreachPacketReady ? "Packet ready" : "Packet incomplete"} />}
    >
      <div className="space-y-2">
        {docs.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="flex items-center justify-between rounded-[14px] border border-white/8 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.07]"
          >
            <span>{doc.label}</span>
            <span className="text-xs text-cyan-100/65">docs/private-beta-ops-export</span>
          </Link>
        ))}
      </div>
        <div className="mt-4 rounded-[14px] border border-red-200/10 bg-red-200/[0.035] p-3 text-xs leading-relaxed text-red-100/80">
        Forbidden operations remain absent: external message sending, external service connection, feedback upload, token collection, command entry, interactive console surface, automated invitation, and automated submission.
      </div>
    </SectionFrame>
  );
}
