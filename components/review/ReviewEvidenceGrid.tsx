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
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GitSnapshotPanel before={gitSnapshots.before} after={gitSnapshots.after} />
        <ChangedFilesPanel fileChanges={fileChanges} />
      </div>
      <DiffSummaryCard diffSummary={diffSummary} />
    </section>
  );
}
