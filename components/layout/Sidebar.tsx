import Link from "next/link";
import { Boxes, CircuitBoard, ClipboardCheck, Home, MonitorCheck, Settings } from "lucide-react";
import { projects, tasks } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Office", icon: Home },
  { href: "/#projects", label: "Rooms", icon: Boxes },
  { href: "/#tasks", label: "Tasks", icon: CircuitBoard },
  { href: "/#build", label: "Build", icon: MonitorCheck },
  { href: `/review/${tasks.find((task) => task.status === "waiting_review")?.id ?? tasks[0].id}`, label: "Review", icon: ClipboardCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-20 shrink-0 border-r border-white/8 bg-[#0b1118]/82 p-3 lg:block">
      <Link href="/" className="mb-8 grid h-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-black text-slate-100 shadow-sm">
        CVO
      </Link>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className="grid h-11 place-items-center rounded-2xl border border-transparent text-slate-500 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-slate-100"
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 space-y-2">
        {projects.slice(0, 5).map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} title={project.name} className="mx-auto block h-1.5 w-8 rounded-full bg-white/10 hover:bg-sky-200/50" />
        ))}
      </div>
    </aside>
  );
}
