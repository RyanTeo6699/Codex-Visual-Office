"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import type { BetaFeedbackRecord, BetaTesterRecord } from "@/lib/types";
import type { BetaIntakeActionState } from "@/app/beta/actions";

type Action = (state: BetaIntakeActionState, formData: FormData) => Promise<BetaIntakeActionState>;

const initialState: BetaIntakeActionState = { ok: false, message: "" };

function ActionMessage({ state }: { state: BetaIntakeActionState }) {
  if (!state.message) return null;
  return (
    <p className={`mt-3 border px-3 py-2 text-xs font-semibold ${state.ok ? "border-emerald-200/20 bg-emerald-200/[0.06] text-emerald-100" : "border-rose-200/20 bg-rose-200/[0.06] text-rose-100"}`}>
      {state.message}
    </p>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{children}</label>;
}

function inputClass() {
  return "mt-1 w-full border border-white/10 bg-black/24 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-200/40";
}

export function BetaIntakeForm({
  testers,
  feedback,
  createTesterAction,
  createFeedbackAction,
  createIssueAction,
}: {
  testers: BetaTesterRecord[];
  feedback: BetaFeedbackRecord[];
  createTesterAction: Action;
  createFeedbackAction: Action;
  createIssueAction: Action;
}) {
  const [testerState, testerFormAction, testerPending] = useActionState(createTesterAction, initialState);
  const [feedbackState, feedbackFormAction, feedbackPending] = useActionState(createFeedbackAction, initialState);
  const [issueState, issueFormAction, issuePending] = useActionState(createIssueAction, initialState);

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-100/65">Manual intake only</p>
          <h2 className="mt-1 text-lg font-black text-white">Record Tester Feedback Locally</h2>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-400">
            Paste only redacted notes. Do not paste tokens, auth files, env contents, private keys, source dumps, SQLite dumps, contact details, or private credentials.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <form action={testerFormAction} className="border border-white/8 bg-black/18 p-4">
          <h3 className="text-sm font-black text-white">Tester record</h3>
          <div className="mt-3 space-y-3">
            <div>
              <FieldLabel>Tester label</FieldLabel>
              <input name="testerLabel" required placeholder="tester-001" className={inputClass()} />
            </div>
            <div>
              <FieldLabel>Tester type</FieldLabel>
              <select name="testerType" className={inputClass()} defaultValue="external_real_tester">
                <option value="external_real_tester">External real tester</option>
                <option value="gm_local_validation">GM local validation</option>
                <option value="support_observation">Support observation</option>
              </select>
            </div>
            <div>
              <FieldLabel>Environment summary</FieldLabel>
              <textarea name="environmentJson" rows={3} placeholder='{"device":"Mac","browser":"Chrome"}' className={inputClass()} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <select name="consentStatus" className={inputClass()} defaultValue="pending">
                <option value="not_sent">Consent not sent</option>
                <option value="pending">Consent pending</option>
                <option value="acknowledged">Consent acknowledged</option>
                <option value="declined">Consent declined</option>
              </select>
              <select name="invitationStatus" className={inputClass()} defaultValue="invited">
                <option value="not_invited">Not invited</option>
                <option value="invited">Invited</option>
                <option value="declined">Declined</option>
                <option value="accepted">Accepted</option>
                <option value="no_response">No response</option>
              </select>
              <select name="onboardingStatus" className={inputClass()} defaultValue="not_started">
                <option value="not_started">Onboarding not started</option>
                <option value="attempted">Onboarding attempted</option>
                <option value="passed">Onboarding passed</option>
                <option value="failed">Onboarding failed</option>
                <option value="blocked">Onboarding blocked</option>
              </select>
              <select name="feedbackStatus" className={inputClass()} defaultValue="pending">
                <option value="not_requested">Feedback not requested</option>
                <option value="pending">Feedback pending</option>
                <option value="submitted">Feedback submitted</option>
                <option value="triaged">Feedback triaged</option>
                <option value="closed">Feedback closed</option>
              </select>
            </div>
            <textarea name="notes" rows={3} placeholder="Redacted local notes" className={inputClass()} />
            <label className="flex gap-2 text-xs leading-relaxed text-slate-400">
              <input name="sensitiveDataChecked" type="checkbox" required className="mt-1" />
              <span>I confirm this record is redacted and local-only.</span>
            </label>
            <button type="submit" disabled={testerPending} className="w-full border border-cyan-200/20 bg-cyan-200/[0.08] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 disabled:opacity-50">
              Record local tester
            </button>
            <ActionMessage state={testerState} />
          </div>
        </form>

        <form action={feedbackFormAction} className="border border-white/8 bg-black/18 p-4">
          <h3 className="text-sm font-black text-white">Feedback record</h3>
          <div className="mt-3 space-y-3">
            <select name="testerId" className={inputClass()} required disabled={testers.length === 0}>
              {testers.length === 0 ? <option value="">Record a tester first</option> : testers.map((tester) => <option key={tester.id} value={tester.id}>{tester.testerLabel}</option>)}
            </select>
            <select name="sourceType" className={inputClass()} defaultValue="external_real_tester">
              <option value="external_real_tester">External real tester</option>
              <option value="gm_local_validation">GM local validation</option>
              <option value="support_observation">Support observation</option>
            </select>
            <input name="area" required placeholder="Area, route, or workflow" className={inputClass()} />
            <textarea name="summary" required rows={4} placeholder="Redacted feedback summary" className={inputClass()} />
            <div className="grid gap-2 sm:grid-cols-2">
              <select name="evidenceType" className={inputClass()} defaultValue="none">
                <option value="none">No evidence file</option>
                <option value="redacted_screenshot">Redacted screenshot note</option>
                <option value="redacted_log_note">Redacted log note</option>
                <option value="environment_summary">Environment summary</option>
                <option value="repro_steps">Repro steps</option>
                <option value="route_page">Route page</option>
                <option value="observed_error">Observed error</option>
              </select>
              <select name="severity" className={inputClass()} defaultValue="pending">
                <option value="pending">Severity pending</option>
                <option value="p3">P3</option>
                <option value="p2">P2</option>
                <option value="p1">P1</option>
                <option value="p0">P0</option>
              </select>
              <select name="priority" className={inputClass()} defaultValue="pending">
                <option value="pending">Priority pending</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select name="status" className={inputClass()} defaultValue="submitted">
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="triaged">Triaged</option>
                <option value="closed">Closed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <textarea name="notes" rows={3} placeholder="Redacted triage notes" className={inputClass()} />
            <label className="flex gap-2 text-xs leading-relaxed text-slate-400">
              <input name="sensitiveDataChecked" type="checkbox" required className="mt-1" />
              <span>I confirm no sensitive data is included.</span>
            </label>
            <button type="submit" disabled={feedbackPending || testers.length === 0} className="w-full border border-emerald-200/20 bg-emerald-200/[0.08] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-100 disabled:opacity-50">
              Record local feedback
            </button>
            <ActionMessage state={feedbackState} />
          </div>
        </form>

        <form action={issueFormAction} className="border border-white/8 bg-black/18 p-4">
          <h3 className="text-sm font-black text-white">Issue record</h3>
          <div className="mt-3 space-y-3">
            <select name="feedbackId" className={inputClass()} required disabled={feedback.length === 0}>
              {feedback.length === 0 ? <option value="">Record feedback first</option> : feedback.map((record) => <option key={record.id} value={record.id}>{record.area}: {record.summary.slice(0, 42)}</option>)}
            </select>
            <input name="area" required placeholder="Issue area" className={inputClass()} />
            <textarea name="summary" required rows={4} placeholder="Redacted issue summary" className={inputClass()} />
            <div className="grid gap-2 sm:grid-cols-2">
              <select name="severity" className={inputClass()} defaultValue="pending">
                <option value="pending">Severity pending</option>
                <option value="p3">P3</option>
                <option value="p2">P2</option>
                <option value="p1">P1</option>
                <option value="p0">P0</option>
              </select>
              <select name="priority" className={inputClass()} defaultValue="pending">
                <option value="pending">Priority pending</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select name="reproStatus" className={inputClass()} defaultValue="not_attempted">
                <option value="not_attempted">Not attempted</option>
                <option value="reproduced">Reproduced</option>
                <option value="not_reproduced">Not reproduced</option>
                <option value="needs_more_info">Needs more info</option>
                <option value="not_applicable">Not applicable</option>
              </select>
              <select name="decision" className={inputClass()} defaultValue="needs_more_evidence">
                <option value="fix_batch_candidate">Fix batch candidate</option>
                <option value="known_limitation">Known limitation</option>
                <option value="needs_more_evidence">Needs more evidence</option>
                <option value="no_action">No action</option>
                <option value="defer">Defer</option>
              </select>
              <select name="status" className={inputClass()} defaultValue="pending">
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="triaged">Triaged</option>
                <option value="closed">Closed</option>
                <option value="blocked">Blocked</option>
              </select>
              <input name="targetPhase" placeholder="Target phase" className={inputClass()} />
            </div>
            <textarea name="safetyDataImpact" rows={2} placeholder="Safety / data impact, redacted" className={inputClass()} />
            <textarea name="notes" rows={3} placeholder="Redacted issue notes" className={inputClass()} />
            <button type="submit" disabled={issuePending || feedback.length === 0} className="w-full border border-amber-200/20 bg-amber-200/[0.08] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-100 disabled:opacity-50">
              Record local issue
            </button>
            <ActionMessage state={issueState} />
          </div>
        </form>
      </div>
    </section>
  );
}
