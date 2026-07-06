# Phase 29 - Continue Real Private Beta Collection / External Tester Intake Scope Lock

## Phase Name

Phase 29 - Continue Real Private Beta Collection / External Tester Intake.

## Goal

Prepare and track external tester intake for private beta round 1 without fabricating tester feedback or implementing public release capabilities.

The current evidence state remains:

```txt
EXTERNAL_TESTER_INTAKE_READY_AWAITING_EXTERNAL_SUBMISSIONS
```

Phase 28 recorded one GM / local validation sample. That sample is not external tester feedback and is not counted as an external tester submission.

## Allowed

- External tester intake plan.
- External tester consent / safety acknowledgment template.
- External tester onboarding tracker.
- External feedback intake ledger.
- External issue intake ledger.
- External tester evidence checklist.
- Phase 30 decision gate.
- Documentation and verification.
- Roadmap and release status consistency updates.

## Forbidden

- Fake external tester feedback.
- Fake tester count.
- Fake submission count.
- Fake issue count.
- Beta completion claim.
- Public release implementation.
- Signed or notarized installer.
- Auto updater.
- Production package build.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, MCP, or ChatGPT App.
- OpenAI API.
- New app feature.
- DB schema changes or migrations.
- New dependencies or lockfile changes.
- Dangerous shell, command text box, terminal emulator, or node-pty.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup file deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Runner, Quality Gate, Backup / Restore, Archive, or Tauri safety-boundary changes.
- Phase 30 implementation.

## Intake Boundary

Phase 29 creates the external tester intake tracking layer only. It may record real external tester evidence after GM provides it, but this implementation does not invent tester names, tester counts, setup outcomes, feedback, submissions, or issues.

## Public Release Boundary

This is private beta intake preparation. It is not public beta, public release, commercial launch, signed distribution, notarization, auto update, or production deploy.

## Acceptance Criteria

- Required Phase 29 intake documents exist.
- The documents state that external tester feedback has not been recorded yet.
- GM local validation is clearly separated from external tester feedback.
- Phase 30 is a decision gate only and has not started.
- Verification confirms no fake tester, feedback, submission, or issue counts.
- No app behavior, schema, dependency, runner, Quality Gate, backup, archive, or Tauri behavior changes are introduced.

## Failure Criteria

- Any external tester or feedback is fabricated.
- GM local validation is counted as external tester feedback.
- The docs claim private beta completion or public release readiness without real external submissions.
- The implementation adds product features, schema changes, dependencies, release packaging, cloud sync, external APIs, auth/payment/team/MCP, OpenAI API, dangerous execution surfaces, or Phase 30 implementation.
