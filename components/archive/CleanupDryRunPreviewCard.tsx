import { Eye } from "lucide-react";
import type { CleanupDryRunPreview } from "@/lib/archive/archive-types";

export function CleanupDryRunPreviewCard({ preview }: { preview: CleanupDryRunPreview }) {
  return (
    <section className="rounded-[18px] border border-amber-200/16 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(17,26,37,0.84))] p-4">
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
        Cleanup preview is dry-run only for the private beta. No data or backup files are deleted by this room.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[14px] border border-amber-200/14 bg-black/18 px-3 py-3">
          <p className="text-[10px] font-bold uppercase text-amber-100/70">Total would-delete candidates</p>
          <p className="mt-1 text-3xl font-black text-amber-100">{preview.totalWouldDeleteCount}</p>
          <p className="mt-1 text-[11px] font-semibold text-amber-100/70">Count only. No cleanup control is rendered.</p>
        </div>
        <div className="rounded-[14px] border border-emerald-200/12 bg-emerald-200/[0.035] px-3 py-3">
          <p className="text-[10px] font-bold uppercase text-emerald-100/70">Deletion state</p>
          <p className="mt-1 text-sm font-black text-emerald-100">No data is deleted by this preview.</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">Each row below is a retention estimate so the records room can show age and impact without adding a destructive archive action.</p>
        </div>
      </div>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 md:grid-cols-2">
        {preview.policyResults.map((result) => (
          <div key={result.target} className="min-w-0 rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="min-w-0 break-words text-xs font-bold text-slate-100">{result.target}</p>
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
