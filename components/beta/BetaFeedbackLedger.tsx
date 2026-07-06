import type { BetaFeedbackRecord, BetaTesterRecord } from "@/lib/types";

export function BetaFeedbackLedger({ feedback, testers }: { feedback: BetaFeedbackRecord[]; testers: BetaTesterRecord[] }) {
  const testerLabels = new Map(testers.map((tester) => [tester.id, tester.testerLabel]));

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-lg font-black text-white">Feedback Ledger</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">Feedback is copied in manually after external testers respond through channels outside this app.</p>
      <div className="mt-4 space-y-2">
        {feedback.length === 0 ? (
          <p className="border border-white/8 bg-black/20 p-3 text-xs text-slate-500">No local feedback records yet.</p>
        ) : feedback.slice(0, 12).map((record) => (
          <article key={record.id} className="border border-white/8 bg-black/20 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-slate-100">{record.area}</p>
                <p className="mt-1 text-xs text-slate-400">{record.summary}</p>
              </div>
              <span className="border border-emerald-200/15 bg-emerald-200/[0.06] px-2 py-1 text-[10px] font-black uppercase text-emerald-100">{record.status}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-4">
              <span>Tester: {testerLabels.get(record.testerId) ?? "unknown"}</span>
              <span>Severity: {record.severity}</span>
              <span>Priority: {record.priority}</span>
              <span>Evidence: {record.evidenceType}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
