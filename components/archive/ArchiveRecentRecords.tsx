import type { ArchiveRecentRecords as ArchiveRecentRecordsData } from "@/lib/archive/archive-types";

export function ArchiveRecentRecords({ records }: { records: ArchiveRecentRecordsData }) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <RecordGroup title="Task Activity History" items={records.taskEvents.map((item) => `${item.createdAt} / ${item.message}`)} />
      <RecordGroup title="Review Decisions" items={records.reviewRecords.map((item) => `${item.createdAt} / ${item.taskId} / ${item.decision}`)} />
      <RecordGroup title="Quality Gate Runs / Events" items={[
        ...records.qualityGateRuns.map((item) => `${item.createdAt} / run / ${item.command} / ${item.status}`),
        ...records.qualityGateEvents.map((item) => `${item.createdAt} / event / ${item.eventType}`),
      ]} />
      <RecordGroup title="Runner Output Preview Records" items={records.taskEvents.filter((item) => item.message.toLowerCase().includes("runner")).map((item) => `${item.createdAt} / ${item.message}`)} />
      <RecordGroup title="Git Snapshot History" items={records.gitSnapshots.map((item) => `${item.createdAt} / ${item.snapshotKind} / ${item.branch}`)} />
      <RecordGroup title="Changed Files History" items={records.fileChanges.map((item) => `${item.createdAt} / ${item.changeStatus} / ${item.filePath}`)} />
      <RecordGroup title="Diff Summary History" items={records.diffSummaries.map((item) => `${item.createdAt} / ${item.filesChanged} files`)} />
      <RecordGroup title="Scope Check History" items={records.scopeChecks.map((item) => `${item.createdAt} / ${item.status}`)} />
      <RecordGroup title="Backup Records" items={records.backupRecords.map((item) => `${item.createdAt} / ${item.backupKind} / ${item.status} / ${item.backupPath}`)} />
    </section>
  );
}

function RecordGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <h2 className="text-sm font-bold tracking-tight text-slate-100">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.slice(0, 8).map((item) => (
            <p key={item} className="break-words rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2 text-xs leading-relaxed text-slate-400">
              {item}
            </p>
          ))
        ) : (
          <p className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2 text-xs text-slate-500">No records available.</p>
        )}
      </div>
    </section>
  );
}
