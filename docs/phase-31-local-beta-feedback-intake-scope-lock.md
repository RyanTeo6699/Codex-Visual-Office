# Phase 31 - Local Beta Feedback Intake / Ledger UI Scope Lock

## Phase Goal

Phase 31 upgrades the Beta Ops Room from static packet/status tracking into a local-only manual intake desk for private beta tester records, feedback records, and issue records.

## Allowed Work

- Add local SQLite beta intake tables.
- Add manual tester, feedback, and issue record operations.
- Add `/beta` intake summary, forms, and ledgers.
- Add string-level sensitive input guard.
- Add bounded local report export helper.
- Add local verification script and documentation.

## Forbidden Work

- No auto-send invitations.
- No email, Gmail, Slack, Discord, GitHub, Vercel, Supabase, OpenAI API, or cloud service integration.
- No fake tester submissions, fake feedback, fake issues, fake external counts, or beta completion claim.
- No token, credential, `.env`, `.env.local`, `~/.codex/auth.json`, private key, source dump, or SQLite dump storage.
- No command input, arbitrary shell runner, terminal emulator, `node-pty`, automatic Codex execution, Git mutation, or Quality Gate execution.
- No Phase 32 implementation.

## Data Boundary

Phase 31 may persist only:

- anonymized tester labels
- tester type and status fields
- bounded redacted feedback summaries
- bounded redacted issue summaries
- non-sensitive environment summaries
- local triage metadata

Phase 31 must not persist direct contact fields, tokens, auth files, source dumps, database dumps, or raw unbounded logs.

## UI Boundary

The `/beta` page may show:

- intake summary
- manual local forms
- tester ledger
- feedback ledger
- issue ledger
- local report helper

The UI must not show external connect buttons, upload flows, command boxes, terminal controls, automatic invite controls, or completion claims.

## Acceptance Criteria

- `beta_tester_records`, `beta_feedback_records`, and `beta_issue_records` exist.
- Manual records can be created locally.
- Sensitive markers are rejected before persistence.
- Ledgers display actual local records only.
- Summary counts are derived from local SQLite rows.
- Export helper writes local files only.
- `npm run beta:verify:intake-ui` passes.
- Existing verification remains passing.

## Failure Criteria

- Any external API or messaging integration is added.
- Any fake tester/feedback/issue record is seeded as real evidence.
- Any direct contact field or sensitive credential content is stored.
- Any command execution capability is added.
- Any beta completion or public release claim is made without real evidence.

## Phase 32 Status

Phase 32 has not started.
