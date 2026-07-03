import { GitBranch } from "lucide-react";
import type { GitSnapshot } from "@/lib/types";

export function GitSnapshotPanel({
  before,
  after,
}: {
  before?: GitSnapshot;
  after?: GitSnapshot;
}) {
  const sameBranch = before && after ? before.branch === after.branch : undefined;
  const sameHead = before && after ? before.headSha === after.headSha : undefined;

  return (
    <section className="min-w-0 border border-white/8 bg-[#0d1724]/78 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-sky-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Git Snapshot</h2>
        </div>
        <span className="border border-sky-200/16 bg-sky-200/8 px-2 py-1 text-[10px] font-semibold text-sky-100">
          Observation only
        </span>
      </div>

      <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-2">
        <SnapshotCard title="Before snapshot" snapshot={before} />
        <SnapshotCard title="After snapshot" snapshot={after} />
      </div>

      <div className="mt-3 grid min-w-0 gap-2 text-xs md:grid-cols-3">
        <SummaryCell label="Branch comparison" value={sameBranch === undefined ? "Waiting for before / after" : sameBranch ? "same branch" : "branch changed"} />
        <SummaryCell label="HEAD comparison" value={sameHead === undefined ? "Waiting for before / after" : sameHead ? "same head" : "head changed"} />
        <SummaryCell
          label="Dirty comparison"
          value={
            before && after
              ? `before ${before.isDirty ? "dirty" : "clean"} / after ${after.isDirty ? "dirty" : "clean"}`
              : "Waiting for snapshots"
          }
        />
      </div>

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        Read-only Git snapshot. No changed files, diff, commit, push, or deploy action is available here.
      </p>
    </section>
  );
}

function SnapshotCard({ title, snapshot }: { title: string; snapshot?: GitSnapshot }) {
  return (
    <div className="min-w-0 border border-white/[0.04] bg-white/[0.025] p-3">
      <p className="text-xs font-bold text-slate-200">{title}</p>
      {snapshot ? (
        <div className="mt-3 grid gap-2 text-xs">
          <SnapshotRow label="Branch" value={snapshot.branch} />
          <SnapshotRow label="HEAD" value={shortSha(snapshot.headSha)} />
          <SnapshotRow label="State" value={snapshot.isDirty ? "dirty" : "clean"} />
          <SnapshotRow label="Created" value={snapshot.createdAt} />
        </div>
      ) : (
        <p className="mt-3 border border-white/[0.04] bg-black/12 px-3 py-2 text-xs text-slate-500">No snapshot recorded yet.</p>
      )}
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/[0.04] bg-black/12 px-3 py-2">
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function shortSha(value: string): string {
  return value.length > 7 ? value.slice(0, 7) : value;
}
