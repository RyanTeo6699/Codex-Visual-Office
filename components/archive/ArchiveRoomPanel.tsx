import Link from "next/link";
import { ArchiveSummaryCard } from "./ArchiveSummaryCard";
import { ArchiveRecentRecords } from "./ArchiveRecentRecords";
import { CleanupDryRunPreviewCard } from "./CleanupDryRunPreviewCard";
import { RetentionPoliciesCard } from "./RetentionPoliciesCard";
import type { ArchiveSummary, CleanupDryRunPreview } from "@/lib/archive/archive-types";

export function ArchiveRoomPanel({
  summary,
  dryRunPreview,
}: {
  summary: ArchiveSummary;
  dryRunPreview: CleanupDryRunPreview;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-[22px] border border-white/8 bg-[#111a25]/78 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phase 6 / Archive Room</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Archive Room</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              Local-only archive visibility for historical task, review, Git, quality, scope, and backup records.
            </p>
          </div>
          <Link href="/settings" className="rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/[0.1]">
            Settings
          </Link>
        </div>
        <div className="mt-5 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
          Cleanup preview is dry-run only. No data is deleted in this step. Backup files are never deleted by Phase 6 Step 4.
        </div>
      </section>

      <ArchiveSummaryCard summary={summary} />
      <CleanupDryRunPreviewCard preview={dryRunPreview} />
      <RetentionPoliciesCard policies={summary.retentionPolicies} />
      <ArchiveRecentRecords records={summary.recentRecords} />
    </div>
  );
}
