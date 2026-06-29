import { Files } from "lucide-react";
import type { FileChange, FileChangeStatus } from "@/lib/types";

const statusLabels: Record<FileChangeStatus, string> = {
  modified: "Modified",
  added: "Added",
  deleted: "Deleted",
  renamed: "Renamed",
  copied: "Copied",
  unmerged: "Unmerged",
  unknown: "Unknown",
};

const statusOrder: FileChangeStatus[] = ["modified", "added", "deleted", "renamed", "copied", "unmerged", "unknown"];

export function ChangedFilesPanel({ fileChanges }: { fileChanges: FileChange[] }) {
  const grouped = statusOrder.map((status) => ({
    status,
    items: fileChanges.filter((change) => change.changeStatus === status),
  })).filter((group) => group.items.length > 0);

  return (
    <section className="min-w-0 rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Files className="h-4 w-4 text-cyan-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Changed Files</h2>
        </div>
        <span className="rounded-md border border-cyan-200/16 bg-cyan-200/8 px-2 py-1 text-[10px] font-semibold text-cyan-100">
          {fileChanges.length} total
        </span>
      </div>

      {fileChanges.length === 0 ? (
        <p className="mt-4 rounded-[12px] bg-black/12 px-3 py-2 text-xs text-slate-500">No changed files captured yet.</p>
      ) : (
        <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-2">
          {grouped.map((group) => (
            <div key={group.status} className="min-w-0 rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3">
              <p className="text-xs font-bold text-slate-200">{statusLabels[group.status]} ({group.items.length})</p>
              <div className="mt-3 space-y-2">
                {group.items.map((change) => (
                  <div key={change.id} className="rounded-[12px] bg-black/12 px-3 py-2 text-xs">
                    {change.previousFilePath ? <p className="break-words text-slate-500">{change.previousFilePath}</p> : null}
                    <p className="break-words font-semibold text-slate-200">{change.filePath}</p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-500">status {change.rawStatus}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        Path/status only. No full diff, file content, additions, deletions, commit, push, or deploy action is available here.
      </p>
    </section>
  );
}
