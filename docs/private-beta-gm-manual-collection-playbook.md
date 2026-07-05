# Private Beta GM Manual Collection Playbook

## Purpose

This playbook explains how GM can manually send invitations, collect real tester feedback, update trackers, and prepare Phase 28 feedback review without mixing simulated feedback with real feedback.

## How To Send Invites Manually

1. Choose real invitees outside the repository.
2. Copy one message from `docs/private-beta-outbound-invitation-messages.md`.
3. Replace placeholders.
4. Send manually through GM-approved contact channels.
5. Update the invitee shortlist only with real invitee metadata GM is allowed to store.

Do not automate email. Do not call Gmail, GitHub, Vercel, Supabase, or other SaaS APIs.

## How To Record Invitation Status

Use invitation status values:

- `not_sent`
- `sent`
- `declined`
- `bounced`
- `paused`

Do not count a draft as sent. Do not count placeholder rows as invitees.

## How To Record Onboarding Status

Use the existing onboarding tracker from Phase 26. Record only real tester reports:

- Setup not started.
- Setup in progress.
- Setup blocked.
- Setup complete.
- Declined.

Do not infer setup success from silence.

## How To Record Feedback

1. Confirm the feedback is from a real tester.
2. Confirm sensitive data is not retained.
3. Redact or reject unsafe evidence.
4. Record the submission in the existing submission tracker.
5. Link the evidence source by a safe internal reference.

Do not record simulated feedback in the real feedback ledger.

## How To Identify Duplicate Issues

Compare:

- Route or workflow.
- Repro steps.
- Actual behavior.
- Error text after redaction.
- Environment.

If two reports describe the same failure mode, mark one as the primary issue and link the duplicate.

## How To Classify Severity / Priority

Severity:

- P0: Data exposure, credential risk, or total inability to evaluate.
- P1: Major setup or core workflow blocker.
- P2: Important problem with workaround.
- P3: Minor usability, copy, or visual issue.

Priority should consider severity, number of real reports, reproduction confidence, and impact on private beta continuation.

## How To Escalate P0/P1

For P0/P1:

1. Stop requesting additional sensitive evidence.
2. Preserve only redacted, bounded information.
3. Notify GM.
4. Decide whether to pause outreach.
5. Add the issue to the Phase 28 candidate review materials.

## How To Prepare Phase 28 Feedback Review

Phase 28 may begin only when:

- At least one real feedback submission exists, or GM explicitly chooses a no-submission review.
- Feedback ledger is updated.
- Issue triage ledger is updated if issues exist.
- Sensitive data has been removed or rejected.
- GM confirms the evidence source.

## How To Avoid Mixing Simulated And Real Feedback

- Label simulated dry-run artifacts as simulated.
- Keep real submissions in the real feedback tracker only.
- Do not copy Phase 21 simulated examples into real submission counts.
- Do not claim tester feedback exists unless it came from a real tester.

