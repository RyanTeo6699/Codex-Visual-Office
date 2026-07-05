import { Boxes, CheckCircle2, PlusCircle, ShieldCheck, XCircle } from "lucide-react";
import type { ApprovedProjectPath } from "@/lib/types";

export interface SettingsProjectOption {
  id: string;
  name: string;
}

export type SaveApprovedProjectPathAction = (formData: FormData) => Promise<void>;

export function ApprovedProjectPathsCard({
  projects,
  approvedPaths,
  saveApprovedProjectPathAction,
}: {
  projects: SettingsProjectOption[];
  approvedPaths: ApprovedProjectPath[];
  saveApprovedProjectPathAction: SaveApprovedProjectPathAction;
}) {
  const projectNameById = new Map(projects.map((project) => [project.id, project.name]));

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4 xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-amber-100/80" />
            <h2 className="text-sm font-bold tracking-tight text-slate-100">Approved Project Paths</h2>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-500">
            Register workspace paths by typing them here. The runner can target only paths that appear in this approved list.
          </p>
        </div>
        <span className="rounded-md border border-amber-200/14 bg-amber-200/8 px-2 py-1 text-[10px] font-semibold text-amber-100">
          Manual registration only
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-[11px] font-semibold text-slate-400 md:grid-cols-2 xl:grid-cols-4">
        <GuardrailItem allowed label="Typed path records only" />
        <GuardrailItem allowed={false} label="No full disk scan" />
        <GuardrailItem allowed={false} label="No source reads" />
        <GuardrailItem allowed={false} label="No package.json auto-detect" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-2">
          {approvedPaths.length ? (
            approvedPaths.map((path) => (
              <div key={path.id} className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-100">{path.label || "Approved local project"}</p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">{projectNameById.get(path.projectId) ?? path.projectId}</p>
                  </div>
                  <span className={path.approved ? "rounded-md border border-emerald-200/16 bg-emerald-200/8 px-2 py-1 text-[10px] font-semibold text-emerald-100" : "rounded-md border border-slate-200/10 bg-slate-200/6 px-2 py-1 text-[10px] font-semibold text-slate-400"}>
                    {path.approved ? "approved" : "not approved"}
                  </span>
                </div>
                <p className="mt-2 break-words rounded-[12px] bg-black/12 px-3 py-2 text-xs font-semibold text-slate-200">{path.localPath}</p>
                <div className="mt-2 grid gap-2 text-[11px] font-semibold text-slate-500 md:grid-cols-2">
                  <p>Approved at: {path.approvedAt ?? "Not approved"}</p>
                  <p>Source: {path.approvalSource}</p>
                </div>
                {path.note ? <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{path.note}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-[14px] border border-white/[0.04] bg-white/[0.025] p-3 text-xs leading-relaxed text-slate-500">
              No approved project path is configured yet. Add one manually below; Settings stores the typed record without browsing, scanning, or reading project files.
            </div>
          )}
        </div>

        <form action={saveApprovedProjectPathAction} className="rounded-[14px] border border-amber-200/12 bg-amber-200/[0.035] p-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-amber-100/80" />
            <h3 className="text-xs font-bold text-amber-100">Add manual path</h3>
          </div>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase text-slate-500">Project</span>
              <select name="projectId" required className="mt-1 w-full rounded-[12px] border border-white/10 bg-[#0b111a] px-3 py-2 text-xs font-semibold text-slate-100">
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase text-slate-500">Absolute local path</span>
              <input
                name="localPath"
                required
                placeholder="/Users/you/Projects/example"
                className="mt-1 w-full rounded-[12px] border border-white/10 bg-[#0b111a] px-3 py-2 text-xs font-semibold text-slate-100 placeholder:text-slate-600"
              />
              <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">
                Paste the exact workspace path. There is no folder picker, repo scan, source read, or framework detection.
              </span>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase text-slate-500">Label</span>
              <input name="label" placeholder="Local workspace" className="mt-1 w-full rounded-[12px] border border-white/10 bg-[#0b111a] px-3 py-2 text-xs font-semibold text-slate-100 placeholder:text-slate-600" />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase text-slate-500">Note</span>
              <textarea name="note" rows={3} placeholder="Optional note" className="mt-1 w-full resize-none rounded-[12px] border border-white/10 bg-[#0b111a] px-3 py-2 text-xs font-semibold text-slate-100 placeholder:text-slate-600" />
            </label>
            <label className="flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-black/12 px-3 py-2 text-xs font-semibold text-slate-200">
              <input type="checkbox" name="approved" defaultChecked className="h-4 w-4 accent-amber-200" />
              Mark as approved
            </label>
            <button className="inline-flex items-center gap-2 rounded-[12px] border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-xs font-bold text-amber-100 hover:bg-amber-200/14">
              <ShieldCheck className="h-4 w-4" />
              Save Approved Path
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            String validation only. Saving marks this typed string as approved; it does not verify the folder exists, inspect files, parse project manifests, register projects automatically, run Git, start Codex, or trigger Quality Gates.
          </p>
        </form>
      </div>
    </section>
  );
}

function GuardrailItem({ allowed, label }: { allowed: boolean; label: string }) {
  const Icon = allowed ? CheckCircle2 : XCircle;

  return (
    <div className="inline-flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.025] px-3 py-2">
      <Icon className={allowed ? "h-3.5 w-3.5 text-emerald-100/80" : "h-3.5 w-3.5 text-rose-100/75"} />
      {label}
    </div>
  );
}
