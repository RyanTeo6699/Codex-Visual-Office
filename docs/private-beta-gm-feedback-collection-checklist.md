# Private Beta GM Feedback Collection Checklist

## Status

```txt
REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS
```

## Before Inviting Testers

- Confirm tester roster.
- Confirm tester IDs.
- Send tester invitation packet.
- Send onboarding message.
- Send feedback submission instructions.
- Send issue report template.
- Confirm no-token/no-auth/no-env safety rules.
- Confirm support contact.
- Confirm feedback ledger is ready.
- Confirm issue triage ledger is ready.

## During Test Window

- Track invitations sent.
- Track responses received.
- Track blocked setup attempts.
- Track support observations.
- Remind testers not to send secrets.
- Escalate P0/P1 safety or data issues immediately.
- Keep simulated references separate from real feedback.

## After Receiving Feedback

- Confirm source classification.
- Assign feedback ID.
- Assign or verify anonymized tester ID.
- Redact sensitive material.
- Check for duplicates.
- Link actionable feedback to issue triage.
- Update collection status report.
- Preserve safety/data notes.

## How To Classify Feedback

- `real_tester`: actual tester-submitted feedback.
- `support_observation`: GM/support note from a real tester interaction.
- `gm_note`: GM decision or coordination note.
- `simulated_reference`: historical context only.
- `placeholder`: pending/template row only.

## How To Update Ledgers

- Add feedback to `docs/private-beta-round-1-feedback-ledger.md`.
- Add issue rows to `docs/private-beta-round-1-issue-triage-ledger.md`.
- Update execution milestones in `docs/private-beta-round-1-execution-log.md`.
- Update results only after real evidence exists.

## How To Escalate P0/P1

- Stop expansion.
- Record sanitized summary.
- Notify GM.
- Do not paste secrets.
- Do not upload to external SaaS.
- Do not create public issues.

## How To Prepare Phase 26 Decision

Before Phase 26, collect:

- Tester count.
- Feedback count.
- P0/P1/P2/P3 counts.
- Setup success evidence.
- Launch success evidence.
- Safety/data incident notes.
- Repeated confusion themes.
- Fix batch candidate list.

If no real tester feedback exists, recommend continued collection.

## Anti-Fabrication Rule

Do not mix fake, simulated, placeholder, or inferred feedback into real beta evidence.

