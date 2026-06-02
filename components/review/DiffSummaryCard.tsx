import { BarChart3 } from "lucide-react";
import type { DiffSummary } from "@/lib/types";

export function DiffSummaryCard({ diffSummary }: { diffSummary?: DiffSummary }) {
  const topRows = diffSummary?.numstat.slice(0, 8) ?? [];

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-amber-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Diff Summary</h2>
        </div>
        <span className="rounded-md border border-amber-200/16 bg-amber-200/8 px-2 py-1 text-[10px] font-semibold text-amber-100">
          Stats only
        </span>
      </div>

      {!diffSummary ? (
        <p className="mt-4 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No diff summary captured yet.</p>
      ) : (
        <>
          <div className="mt-4 grid gap-2 text-xs md:grid-cols-3">
            <Metric label="Files changed" value={String(diffSummary.filesChanged)} />
            <Metric label="Insertions" value={String(diffSummary.insertions)} />
            <Metric label="Deletions" value={String(diffSummary.deletions)} />
          </div>

          <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
            <Metric label="Stat truncated" value={diffSummary.stdoutTruncated ? "Yes" : "No"} />
            <Metric label="Numstat truncated" value={diffSummary.numstatTruncated ? "Yes" : "No"} />
          </div>

          <div className="mt-4 rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3">
            <p className="text-xs font-bold text-slate-200">Top Changed Files</p>
            {topRows.length ? (
              <div className="mt-3 space-y-2">
                {topRows.map((row) => (
                  <div key={`${row.rawLine}-${row.filePath}`} className="rounded-[12px] bg-black/12 px-3 py-2 text-xs">
                    <p className="break-words font-semibold text-slate-200">{row.filePath}</p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-500">
                      {row.binary ? "binary or unparseable" : `+${row.additions ?? 0} / -${row.deletions ?? 0}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No per-file stat rows captured.</p>
            )}
          </div>
        </>
      )}

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        Bounded stats only. No patch, complete diff view, file content, scope guard, commit, push, or deploy action is available here.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-white/[0.025] px-3 py-2">
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}
