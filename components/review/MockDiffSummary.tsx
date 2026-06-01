import { FileCode2 } from "lucide-react";
import type { ReviewRecord, Task } from "@/lib/types";

export function MockDiffSummary({ task, review }: { task: Task; review?: ReviewRecord }) {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#111a25]/72 p-4">
      <h2 className="text-sm font-bold tracking-tight text-slate-100">Mock Diff Summary</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-medium text-slate-500">Changed Files</p>
          <div className="space-y-2">
            {task.changedFiles.map((file) => (
              <div key={file} className="flex items-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.035] px-3 py-2 text-sm text-slate-200">
                <FileCode2 className="h-4 w-4 text-sky-200/80" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium text-slate-500">Summary</p>
          <ul className="space-y-2">
            {(review?.diffSummary ?? ["No specific mock summary recorded for this task."]).map((item) => (
              <li key={item} className="rounded-[12px] border border-white/[0.04] bg-white/[0.03] px-3 py-2 text-sm leading-relaxed text-slate-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
