import type { BetaIntakeSummary } from "@/lib/beta-ops/beta-intake-types";

export function BetaIntakeSummaryCard({ summary }: { summary: BetaIntakeSummary }) {
  const stats = [
    ["Testers", summary.testerCount],
    ["External testers", summary.externalRealTesterCount],
    ["Feedback", summary.feedbackCount],
    ["Issues", summary.issueCount],
    ["Open issues", summary.openIssueCount],
    ["Highest severity", summary.highestSeverity.toUpperCase()],
  ];

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/60">Local intake</p>
          <h2 className="mt-1 text-lg font-black text-white">Feedback Intake Summary</h2>
        </div>
        <span className="border border-emerald-200/15 bg-emerald-200/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-100">
          Local SQLite only
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="border border-white/8 bg-black/20 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black text-slate-100">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        This ledger does not contact testers, upload data, call external APIs, or claim beta completion. Latest activity: {summary.latestActivityAt ?? "none"}.
      </p>
    </section>
  );
}
