import type { BetaTesterRecord } from "@/lib/types";

export function BetaTesterLedger({ testers }: { testers: BetaTesterRecord[] }) {
  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-lg font-black text-white">Tester Ledger</h2>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">Manual local records only. No contact fields are stored.</p>
      <div className="mt-4 space-y-2">
        {testers.length === 0 ? (
          <p className="border border-white/8 bg-black/20 p-3 text-xs text-slate-500">No local tester records yet.</p>
        ) : testers.slice(0, 12).map((tester) => (
          <article key={tester.id} className="border border-white/8 bg-black/20 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-black text-slate-100">{tester.testerLabel}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-slate-500">{tester.testerType}</p>
              </div>
              <span className="border border-cyan-200/15 bg-cyan-200/[0.06] px-2 py-1 text-[10px] font-black uppercase text-cyan-100">{tester.feedbackStatus}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
              <span>Consent: {tester.consentStatus}</span>
              <span>Invite: {tester.invitationStatus}</span>
              <span>Onboarding: {tester.onboardingStatus}</span>
            </div>
            {tester.notes ? <p className="mt-2 text-xs text-slate-500">{tester.notes}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
