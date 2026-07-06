# Phase 31 - Local Beta Feedback Intake / Ledger UI

## What Was Implemented

Phase 31 adds a local-only feedback intake layer to the Beta Ops Room.

Implemented:

- `beta_tester_records` SQLite table.
- `beta_feedback_records` SQLite table.
- `beta_issue_records` SQLite table.
- Local repositories and operations for tester, feedback, and issue records.
- String-level sensitive input guard.
- `/beta` intake summary.
- `/beta` manual tester, feedback, and issue forms.
- `/beta` tester, feedback, and issue ledgers.
- Local export helper for bounded Markdown and CSV reports.
- `beta:verify:intake-ui` verification script.

## Data Model

### beta_tester_records

- `id`
- `tester_label`
- `tester_type`
- `environment_json`
- `consent_status`
- `invitation_status`
- `onboarding_status`
- `feedback_status`
- `notes`
- `created_at`
- `updated_at`

### beta_feedback_records

- `id`
- `tester_id`
- `source_type`
- `area`
- `summary`
- `evidence_type`
- `severity`
- `priority`
- `status`
- `sensitive_data_checked`
- `notes`
- `created_at`
- `updated_at`

### beta_issue_records

- `id`
- `feedback_id`
- `area`
- `summary`
- `severity`
- `priority`
- `repro_status`
- `safety_data_impact`
- `decision`
- `target_phase`
- `status`
- `notes`
- `created_at`
- `updated_at`

## Sensitive Input Guard

The guard rejects local intake text containing markers for:

- placeholders such as `PLACEHOLDER_DO_NOT_COUNT` or `TBD_BY_GM`
- fake, seeded, sample, or demo tester labels
- `~/.codex/auth.json`
- `.env` or `.env.local`
- token or secret markers
- private key markers
- SQLite database dumps
- source dump markers

The guard is string-level only. It does not scan folders, read files, call external APIs, or classify content with AI.

## Beta Ops UI Changes

The `/beta` page now includes:

- Feedback Intake Summary.
- Manual local tester record form.
- Manual local feedback record form.
- Manual local issue record form.
- Tester Ledger.
- Feedback Ledger.
- Issue Ledger.
- Local report helper.

The page still clearly states:

- no auto-send
- no external API
- no cloud sync
- no token collection
- no beta completion claim

## Local Export Helper

Script:

```bash
npm run beta:intake:export
```

Output directory:

```txt
docs/private-beta-ops-export/local-intake/
```

Generated files:

- `beta-intake-report.md`
- `beta-testers.csv`
- `beta-feedback.csv`
- `beta-issues.csv`

The export is local-only and does not upload or send data.

## What Has Not Been Implemented

- No invitation sending.
- No email/Gmail integration.
- No Slack or Discord integration.
- No GitHub/Vercel/Supabase integration.
- No external feedback upload.
- No fake tester submissions.
- No public beta completion claim.
- No Phase 32 implementation.

## Verification

Required command:

```bash
npm run beta:verify:intake-ui
```

The verifier checks:

- tables exist
- package scripts exist
- guard rejects sensitive markers
- operations can create and read records inside a transaction
- verification transaction is rolled back
- no external API/send/cloud implementation markers are present

## Next Recommended Step

Continue collecting real external tester feedback through manual channels. Phase 32 should not begin until GM confirms sufficient real intake records or explicitly chooses a no-submission review path.
