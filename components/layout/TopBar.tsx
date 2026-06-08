import Link from "next/link";
import { Archive, Circle, Settings, ShieldCheck } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#0b1118]/86 px-4 py-3 backdrop-blur-xl md:px-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-xs font-black text-slate-100">CVO</span>
          <span className="text-sm font-bold text-white">Codex Visual Office</span>
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          <Circle className="h-2.5 w-2.5 fill-emerald-300/80 text-emerald-300/80" />
          <span className="text-xs font-medium text-slate-400">Phase 1 visual office</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-sky-200/80" />
            <span>Local mock workspace</span>
          </div>
          <Link href="/archive" className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.04] px-2 py-1 font-semibold text-slate-300 hover:text-white">
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Link>
          <Link href="/settings" className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.04] px-2 py-1 font-semibold text-slate-300 hover:text-white">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
        </div>
      </div>
    </header>
  );
}
