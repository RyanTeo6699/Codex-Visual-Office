import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <TopBar />
          <main className="mx-auto max-w-[1540px] p-4 md:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
