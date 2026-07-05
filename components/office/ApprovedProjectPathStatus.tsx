import Link from "next/link";
import { FolderLock } from "lucide-react";
import type { ApprovedProjectPath } from "@/lib/types";

export function ApprovedProjectPathStatus({
  primaryPath,
}: {
  primaryPath?: ApprovedProjectPath;
}) {
  return (
    <section className="border border-white/8 bg-[#121a24]/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderLock className="h-4 w-4 text-amber-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Local Project Path</h2>
        </div>
        <span className={primaryPath ? "border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100" : "border border-amber-200/14 bg-amber-200/8 px-2 py-1 text-[10px] font-semibold text-amber-100"}>
          {primaryPath ? "typed approved path saved" : "not configured"}
        </span>
      </div>

      {primaryPath ? (
        <div className="mt-4 space-y-2">
          <div className="border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase text-slate-500">Local path</p>
            <p className="mt-1 break-words text-xs font-semibold text-slate-200">{primaryPath.localPath}</p>
          </div>
          <div className="grid gap-2 text-[11px] font-semibold text-slate-500 md:grid-cols-2">
            <p>Approval: {primaryPath.approved ? "approved" : "not approved"}</p>
            <p>Approved at: {primaryPath.approvedAt ?? "Not approved"}</p>
          </div>
          {primaryPath.note ? <p className="text-[11px] leading-relaxed text-slate-500">{primaryPath.note}</p> : null}
        </div>
      ) : (
        <p className="mt-4 border border-white/[0.04] bg-white/[0.025] px-3 py-2.5 text-xs leading-relaxed text-slate-500">
          No approved local path is saved for this project yet. Add one manually in Settings; the app does not scan folders or read source files to find it.
        </p>
      )}

      <Link href="/settings" className="mt-4 inline-flex border border-amber-200/14 bg-amber-200/8 px-3 py-2 text-xs font-bold text-amber-100 hover:bg-amber-200/12">
        Manage in Settings
      </Link>
    </section>
  );
}
