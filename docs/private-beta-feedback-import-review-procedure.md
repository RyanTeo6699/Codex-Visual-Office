# Private Beta Feedback Import / Review Procedure

## Purpose

Describe how GM manually transfers real private beta feedback into existing ledgers without automated import, remote APIs, or database schema changes.

## Accepted Sources

- `real_tester`
- `support_observation`
- `gm_note`

## Non-Evidence Sources

- `simulated_reference`
- `placeholder`

## Manual Import Procedure

1. Confirm the submission came from an approved private beta channel.
2. Assign a feedback ID.
3. Record tester as an anonymized ID such as `T01`.
4. Record date, environment, workflow area, summary, expected result, actual result, severity, priority, and safety/data impact.
5. Redact tokens, passwords, private keys, `.env`, `.env.local`, `~/.codex/auth.json`, credential logs, full source archives, proprietary source, and local database files.
6. Deduplicate by workflow area, reproduction steps, expected/actual result, and environment.
7. Link actionable issues to the issue triage ledger.
8. Mark decision path as continue collection, fix batch candidate, known limitation, blocked safety/data response, or no action.
9. Update the beta collection status report.
10. GM reviews only real evidence before any Phase 26 decision.

## Source Marking

Use the existing source labels:

- `real_tester`
- `support_observation`
- `gm_note`
- `simulated_reference`
- `placeholder`

## Linking Feedback To Issues

Link feedback to an issue only when:

- Repro or impact is clear enough to triage.
- Severity and priority can be assigned.
- Sensitive data has been removed.
- Duplicate status has been checked.

## Severity / Priority

- `P0`: safety/data loss/security concern.
- `P1`: blocks setup or core review.
- `P2`: major confusion or broken workflow with workaround.
- `P3`: docs/copy/polish issue.

## Safety/Data Notes

Preserve safety/data notes as sanitized summaries. Do not paste secrets, credentials, private keys, full logs, full source files, or raw database content.

## Placeholder Separation

Placeholder rows remain structural only. They must not be counted as feedback, issue evidence, setup success, launch success, or blocker proof.

## No Automated Import

Phase 25 does not implement automated import, GitHub API import, external SaaS intake, cloud upload, new database schema, or new backend service.

