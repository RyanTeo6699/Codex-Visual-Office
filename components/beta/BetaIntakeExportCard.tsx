export function BetaIntakeExportCard() {
  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/60">Local report helper</p>
      <h2 className="mt-1 text-lg font-black text-white">Beta Intake Export</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        Generate bounded local Markdown and CSV files from SQLite intake records with <span className="font-semibold text-slate-200">npm run beta:intake:export</span>. The helper writes local report files only.
      </p>
      <div className="mt-3 border border-white/8 bg-black/20 p-3 text-xs text-slate-400">
        Output directory: <span className="text-slate-200">docs/private-beta-ops-export/local-intake/</span>
      </div>
      <p className="mt-3 text-xs text-amber-100">No email sending, cloud storage, external API calls, or beta completion claims are performed.</p>
    </section>
  );
}
