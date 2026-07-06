import type { BetaFeedbackRecord, BetaIssueRecord } from "@/lib/types";

export function BetaIssueLedger({ issues, feedback }: { issues: BetaIssueRecord[]; feedback: BetaFeedbackRecord[] }) {
  const feedbackAreas = new Map(feedback.map((record) => [record.id, record.area]));

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-lg font-black text-white">Issue Ledger</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">Issue records are triage notes derived from local feedback records. They are not automated bug reports.</p>
      <div className="mt-4 space-y-2">
        {issues.length === 0 ? (
          <p className="border border-white/8 bg-black/20 p-3 text-xs text-slate-500">No local issue records yet.</p>
        ) : issues.slice(0, 12).map((issue) => (
          <article key={issue.id} className="border border-white/8 bg-black/20 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-slate-100">{issue.area}</p>
                <p className="mt-1 text-xs text-slate-400">{issue.summary}</p>
              </div>
              <span className="border border-amber-200/15 bg-amber-200/[0.06] px-2 py-1 text-[10px] font-black uppercase text-amber-100">{issue.status}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-4">
              <span>From: {feedbackAreas.get(issue.feedbackId) ?? "unknown feedback"}</span>
              <span>Severity: {issue.severity}</span>
              <span>Priority: {issue.priority}</span>
              <span>Decision: {issue.decision}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
