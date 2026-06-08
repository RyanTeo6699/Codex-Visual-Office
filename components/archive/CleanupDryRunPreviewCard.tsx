import { Eye } from "lucide-react";
import type { CleanupDryRunPreview } from "@/lib/archive/archive-types";

export function CleanupDryRunPreviewCard({ preview }: { preview: CleanupDryRunPreview }) {
  return (
    <section className="rounded-[18px] border border-amber-200/12 bg-amber-200/[0.04] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-amber-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-amber-100">Cleanup Dry Run Preview</h2>
        </div>
        <span className="rounded-md border border-amber-200/18 bg-amber-200/10 px-2 py-1 text-[10px] font-semibold text-amber-100">
          {preview.mode}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-amber-100">
        Cleanup preview is dry-run only. No data is deleted in Phase 6 Step 4. Backup files are never deleted by this step.
      </p>
      <div className="mt-4 rounded-[14px] border border-amber-200/10 bg-black/12 px-3 py-2">
        <p className="text-[10px] font-bold uppercase text-amber-100/70">Total would-delete candidates</p>
        <p className="mt-1 text-2xl font-black text-amber-100">{preview.totalWouldDeleteCount}</p>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {preview.policyResults.map((result) => (
          <div key={result.target} className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-100">{result.target}</p>
              <span className="text-[10px] font-semibold text-slate-500">{result.retentionDays} days</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-400">Would delete: {result.wouldDeleteCount}</p>
            {result.candidatesPreview.length ? (
              <div className="mt-2 space-y-1">
                {result.candidatesPreview.map((candidate) => (
                  <p key={candidate.id} className="truncate text-[11px] text-slate-500">{candidate.createdAt} / {candidate.label}</p>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
