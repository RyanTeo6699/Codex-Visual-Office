# Private Beta External Tester Intake Plan

## Intake Objective

Move private beta round 1 from internal GM / local validation evidence to a structured external tester intake process while preserving local-first safety boundaries and evidence integrity.

Current status:

```txt
EXTERNAL_TESTER_INTAKE_READY_AWAITING_EXTERNAL_SUBMISSIONS
```

No external tester feedback has been recorded yet. No external tester count, submission count, setup success rate, or issue count is claimed.

## External Tester Criteria

External testers should be people who can:

- Run a local source-checkout or local launcher flow.
- Follow written setup instructions.
- Report environment details without sharing secrets.
- Provide redacted screenshots or bounded notes when something fails.
- Understand that this is private beta software, not a public release.
- Avoid submitting tokens, credentials, private keys, `.env` files, local SQLite databases, or proprietary source files.

## Intake Stages

| Stage | Meaning | Required Evidence |
| --- | --- | --- |
| shortlisted | Candidate identified by GM | Candidate note only; no tester count claim until GM records a real candidate |
| invited | Manual invitation sent | Invitation date and channel |
| consent_acknowledged | Tester accepted safety notice | Acknowledgment fields completed |
| onboarded | Tester received setup packet | Onboarding note |
| setup_attempted | Tester attempted local setup | Environment summary and command/result summary |
| feedback_submitted | Tester submitted feedback | Redacted feedback entry and evidence type |
| triaged | Feedback reviewed | Linked issue or no-action decision |
| closed | Feedback cycle closed | Final disposition |

## Required Safety Notice

Every tester must be told:

- This is a private beta.
- This is local-first.
- There is no cloud sync.
- There is no signed or notarized installer.
- There is no auto updater.
- They must not submit tokens, auth files, `.env` files, private keys, proprietary source, or the local SQLite DB.
- Feedback evidence must be redacted before sharing.

## Required Data Handling Notice

External tester records should only capture:

- Tester ID assigned by GM, not unnecessary personal data.
- Tester type.
- Consent and setup status.
- Redacted environment summary.
- Redacted issue or feedback summary.
- Evidence type, not sensitive evidence content.

## No-Token / No-Auth / No-Env / No-Source Policy

External tester intake must reject:

- Tokens.
- `~/.codex/auth.json`.
- `.env` or `.env.local`.
- Private keys.
- Unredacted logs with secrets.
- Proprietary source files.
- Local SQLite database files.

## No Public Release Claim

Phase 29 does not make the product public beta ready, commercial launch ready, production release ready, signed, notarized, auto-updating, or cloud-enabled.

## Exit Criteria

Phase 29 exits when:

- Intake templates and ledgers are ready.
- Safety acknowledgment requirements are documented.
- The Phase 30 decision gate is defined.
- Verification confirms no fabricated external tester feedback or counts.

If no real external submissions exist, the recommended next action remains:

```txt
CONTINUE_EXTERNAL_TESTER_INTAKE
```
