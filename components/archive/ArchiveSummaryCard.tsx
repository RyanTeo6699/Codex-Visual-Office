import { Archive, Clock } from "lucide-react";
import type { ArchiveSummary } from "@/lib/archive/archive-types";

export function ArchiveSummaryCard({ summary }: { summary: ArchiveSummary }) {
  const rows = [
    ["Task Activity History", summary.counts.taskEvents],
    ["Review Decisions", summary.counts.reviewRecords],
    ["Runner Output Preview Records", summary.counts.runnerOutputPreviewRecords],
    ["Quality Gate Runs", summary.counts.qualityGateRuns],
    ["Quality Gate Events", summary.counts.qualityGateEvents],
    ["Git Snapshot History", summary.counts.gitSnapshots],
    ["Changed Files History", summary.counts.fileChanges],
    ["Diff Summary History", summary.counts.diffSummaries],
    ["Scope Check History", summary.counts.scopeChecks],
    ["Backup Records", summary.counts.backupRecords],
  ] as const;

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Archive className="h-4 w-4 text-cyan-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Archive Summary</h2>
        </div>
        <span className="rounded-md border border-cyan-200/14 bg-cyan-200/8 px-2 py-1 text-[10px] font-semibold text-cyan-100">
          local-only
        </span>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {rows.map(([label, count]) => (
          <div key={label} className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black text-slate-100">{count}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-500 md:grid-cols-2">
        <p className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Latest activity: {summary.latestActivityTime ?? "Not available"}</p>
        <p className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Latest backup: {summary.latestBackupTime ?? "Not available"}</p>
      </div>
    </section>
  );
}
