import Link from "next/link";
import type { BetaIntakeActionState } from "@/app/beta/actions";
import { BetaNextActionCard } from "./BetaNextActionCard";
import { BetaFeedbackLedger } from "./BetaFeedbackLedger";
import { BetaIntakeExportCard } from "./BetaIntakeExportCard";
import { BetaIntakeForm } from "./BetaIntakeForm";
import { BetaIntakeSummaryCard } from "./BetaIntakeSummaryCard";
import { BetaIssueLedger } from "./BetaIssueLedger";
import { BetaOpsSummaryCard } from "./BetaOpsSummaryCard";
import { BetaOutreachPacketCard } from "./BetaOutreachPacketCard";
import { BetaTesterLedger } from "./BetaTesterLedger";
import { BetaTrackerStatusCard } from "./BetaTrackerStatusCard";
import type { BetaIntakeSummary } from "@/lib/beta-ops/beta-intake-types";
import type { BetaOpsSummary } from "@/lib/beta-ops/beta-ops-types";
import type { BetaFeedbackRecord, BetaIssueRecord, BetaTesterRecord } from "@/lib/types";

type Action = (state: BetaIntakeActionState, formData: FormData) => Promise<BetaIntakeActionState>;

export function BetaOpsPanel({
  summary,
  intakeSummary,
  testers,
  feedback,
  issues,
  createTesterAction,
  createFeedbackAction,
  createIssueAction,
}: {
  summary: BetaOpsSummary;
  intakeSummary: BetaIntakeSummary;
  testers: BetaTesterRecord[];
  feedback: BetaFeedbackRecord[];
  issues: BetaIssueRecord[];
  createTesterAction: Action;
  createFeedbackAction: Action;
  createIssueAction: Action;
}) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,13,22,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/60">Private Beta Operations</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Beta Ops Room</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              A local operating room for private beta outreach packets, tracker templates, external submission status, and GM next actions. It does not send messages or connect to external services.
            </p>
          </div>
          <Link href="/settings" className="rounded-[14px] border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/[0.1]">
            Settings
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[14px] border border-cyan-200/14 bg-cyan-200/[0.045] p-3">
            <p className="text-[10px] font-bold uppercase text-cyan-100/70">Current status</p>
            <p className="mt-1 text-xs font-bold text-cyan-100">{summary.currentStatus}</p>
          </div>
          <div className="rounded-[14px] border border-emerald-200/12 bg-emerald-200/[0.035] p-3">
            <p className="text-[10px] font-bold uppercase text-emerald-100/70">GM local validation</p>
            <p className="mt-1 text-xs font-bold text-emerald-100">{summary.gmLocalValidationCount} passed sample</p>
          </div>
          <div className="rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3">
            <p className="text-[10px] font-bold uppercase text-amber-100/70">External submissions</p>
            <p className="mt-1 text-xs font-bold text-amber-100">{summary.externalTesterFeedbackCount} feedback / {summary.externalIssueCount} issues</p>
          </div>
        </div>
        <div className="mt-3 rounded-[14px] border border-amber-200/14 bg-amber-200/[0.045] p-3 text-xs leading-relaxed text-amber-100">
          No fake tester feedback. No external submissions recorded yet. No public release. No cloud sync. No token collection. No auto-send capability.
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <BetaOpsSummaryCard summary={summary} />
        <BetaNextActionCard summary={summary} />
      </div>
      <BetaIntakeSummaryCard summary={intakeSummary} />
      <BetaIntakeForm
        testers={testers}
        feedback={feedback}
        createTesterAction={createTesterAction}
        createFeedbackAction={createFeedbackAction}
        createIssueAction={createIssueAction}
      />
      <div className="grid gap-5 xl:grid-cols-3">
        <BetaTesterLedger testers={testers} />
        <BetaFeedbackLedger testers={testers} feedback={feedback} />
        <BetaIssueLedger feedback={feedback} issues={issues} />
      </div>
      <BetaIntakeExportCard />
      <div className="grid gap-5 xl:grid-cols-2">
        <BetaOutreachPacketCard summary={summary} />
        <BetaTrackerStatusCard summary={summary} />
      </div>
    </div>
  );
}
