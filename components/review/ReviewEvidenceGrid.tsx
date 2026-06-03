import { ChangedFilesPanel } from "./ChangedFilesPanel";
import { DiffSummaryCard } from "./DiffSummaryCard";
import { GitSnapshotPanel } from "./GitSnapshotPanel";
import type { DiffSummary, FileChange, GitSnapshot } from "@/lib/types";

export function ReviewEvidenceGrid({
  gitSnapshots,
  fileChanges,
  diffSummary,
}: {
  gitSnapshots: {
    before?: GitSnapshot;
    after?: GitSnapshot;
  };
  fileChanges: FileChange[];
  diffSummary?: DiffSummary;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Evidence</p>
        <h2 className="mt-1 text-lg font-bold text-slate-100">Git / Files / Diff</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <GitSnapshotPanel before={gitSnapshots.before} after={gitSnapshots.after} />
        <ChangedFilesPanel fileChanges={fileChanges} />
      </div>
      <DiffSummaryCard diffSummary={diffSummary} />
    </section>
  );
}
