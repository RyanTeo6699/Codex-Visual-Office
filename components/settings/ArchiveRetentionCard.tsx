import Link from "next/link";
import { Archive } from "lucide-react";
import type { RetentionPolicy } from "@/lib/types";

export function ArchiveRetentionCard({ policies }: { policies: RetentionPolicy[] }) {
  const enabledCount = policies.filter((policy) => policy.enabled).length;

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Archive className="h-4 w-4 text-cyan-100/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Archive / Retention</h2>
        </div>
        <span className="rounded-md border border-cyan-200/14 bg-cyan-200/8 px-2 py-1 text-[10px] font-semibold text-cyan-100">
          dry-run only
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Policies</p>
          <p className="mt-1 text-xs font-semibold text-slate-200">{enabledCount} enabled / {policies.length} configured</p>
        </div>
        <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Cleanup mode</p>
          <p className="mt-1 text-xs font-semibold text-slate-200">Preview only. No deletion is implemented in this step.</p>
        </div>
      </div>
      <Link href="/archive" className="mt-4 inline-flex rounded-[12px] border border-cyan-200/14 bg-cyan-200/8 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-200/12">
        Open Archive Room
      </Link>
    </section>
  );
}
