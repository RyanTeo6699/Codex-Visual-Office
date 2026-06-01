import clsx from "clsx";
import { Bot, ShieldCheck, TriangleAlert } from "lucide-react";
import type { CodexCliStatus } from "@/lib/codex-cli/types";

const authStatusLabel: Record<CodexCliStatus["authStatus"], string> = {
  unknown: "Auth unknown",
  not_checked: "Auth not checked",
  cli_unavailable: "CLI unavailable",
  cli_available_auth_not_verified: "CLI available, auth not verified",
};

export function CodexRuntimeStatus({ status }: { status: CodexCliStatus }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-sky-200/80" />
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Local Codex Runtime</h2>
        </div>
        <span
          className={clsx(
            "rounded-md border px-2 py-1 text-[10px] font-semibold",
            status.installed
              ? "border-emerald-200/22 bg-emerald-200/9 text-emerald-100"
              : "border-rose-200/24 bg-rose-200/10 text-rose-100",
          )}
        >
          {status.installed ? "Installed" : "Not found"}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <RuntimeRow label="Version" value={status.version ?? "Not available"} />
        <RuntimeRow label="Path" value={status.path ?? "Not detected"} />
        <RuntimeRow label="Auth" value={authStatusLabel[status.authStatus]} />
        <RuntimeRow label="Mode" value="Safe detection only" />
      </div>

      <div className="mt-4 flex gap-2 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>No Codex task execution, prompt dispatch, terminal runner, or token inspection is enabled in this step.</p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-sky-200/70" />
        <span>Checked {new Date(status.checkedAt).toLocaleString()}</span>
      </div>
    </section>
  );
}

function RuntimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[76px_1fr] gap-3 rounded-[12px] bg-white/[0.025] px-3 py-2">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="min-w-0 break-words font-semibold text-slate-200">{value}</span>
    </div>
  );
}
