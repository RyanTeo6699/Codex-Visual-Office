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
      <section className="overflow-hidden rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_85%_10%,rgba(251,191,36,0.14),transparent_28%),linear-gradient(135deg,rgba(17,26,37,0.92),rgba(7,12,20,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100/60">Archive / Local Records</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Archive Room</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              A local records room for historical task, review, Git, quality, scope, and backup evidence. This view explains retention impact without adding cleanup execution.
            </p>
          </div>
          <Link href="/settings" className="rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/[0.1]">
            Settings
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3">
            <p className="text-[10px] font-bold uppercase text-amber-100/70">Cleanup preview</p>
            <p className="mt-1 text-xs font-bold text-amber-100">dry-run only</p>
          </div>
          <div className="rounded-[14px] border border-emerald-200/12 bg-emerald-200/[0.035] p-3">
            <p className="text-[10px] font-bold uppercase text-emerald-100/70">Data deletion</p>
            <p className="mt-1 text-xs font-bold text-emerald-100">No data is deleted</p>
          </div>
          <div className="rounded-[14px] border border-cyan-200/12 bg-cyan-200/[0.035] p-3">
            <p className="text-[10px] font-bold uppercase text-cyan-100/70">Backup files</p>
            <p className="mt-1 text-xs font-bold text-cyan-100">Backup files are never deleted</p>
          </div>
        </div>
        <div className="mt-3 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
          Cleanup preview is dry-run only for the private beta. No data is deleted. Backup files are never deleted by this room.
        </div>
      </section>

      <ArchiveSummaryCard summary={summary} />
      <CleanupDryRunPreviewCard preview={dryRunPreview} />
      <RetentionPoliciesCard policies={summary.retentionPolicies} />
      <ArchiveRecentRecords records={summary.recentRecords} />
    </div>
  );
}
