import Link from "next/link";
import { Archive, Boxes, CircuitBoard, ClipboardCheck, Home, MonitorCheck, Settings, ShieldCheck, UsersRound } from "lucide-react";
import { projects, tasks } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Office", icon: Home },
  { href: "/#projects", label: "Rooms", icon: Boxes },
  { href: "/#tasks", label: "Tasks", icon: CircuitBoard },
  { href: "/#build", label: "Build", icon: MonitorCheck },
  { href: `/review/${tasks.find((task) => task.status === "waiting_review")?.id ?? tasks[0].id}`, label: "Review", icon: ClipboardCheck },
  { href: "/beta", label: "Beta Ops", icon: UsersRound },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/safety", label: "Safety", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-60 shrink-0 border-r border-white/8 bg-[#071019]/88 p-3 lg:block">
      <Link href="/" className="mb-5 flex items-center gap-3 border border-white/10 bg-white/[0.045] p-3 text-slate-100 shadow-sm">
        <span className="grid h-11 w-11 place-items-center border border-cyan-200/20 bg-cyan-200/10 text-sm font-black">CVO</span>
        <span>
          <span className="block text-sm font-black leading-tight text-white">Codex Visual Office</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100/55">Local AI floor</span>
        </span>
      </Link>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className="flex h-11 items-center gap-3 border border-transparent px-3 text-xs font-bold uppercase tracking-[0.08em] text-slate-500 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-slate-100"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border border-white/8 bg-black/18 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Project Rooms</p>
        <div className="mt-3 space-y-2">
        {projects.slice(0, 5).map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} title={project.name} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-100">
            <span className={`h-1.5 w-6 bg-white/10 project-dot-${project.accent}`} />
            <span className="truncate">{project.name}</span>
          </Link>
        ))}
        </div>
      </div>
      <div className="mt-3 border border-emerald-200/10 bg-emerald-200/[0.035] p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/70">Runtime rule</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">Local-first. Human review. No auto push or deploy.</p>
      </div>
    </aside>
  );
}
