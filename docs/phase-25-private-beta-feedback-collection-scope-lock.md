# Phase 25 - Continue Real Private Beta Round 1 / Collect Tester Feedback Scope Lock

## Phase Name

Phase 25 - Continue Real Private Beta Round 1 / Collect Tester Feedback.

## Goal

Prepare the real private beta feedback collection package, tester invitation materials, submission instructions, data handling policy, and GM collection workflow without fabricating tester feedback or implementing public release capabilities.

## Current Status

```txt
REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS
```

No real tester feedback, tester count, issue count, setup success rate, launch success rate, or beta completion claim is recorded by this phase.

## Allowed

- Tester invitation packet.
- Onboarding message template.
- Feedback submission instructions.
- Real feedback intake checklist.
- Tester data handling policy.
- GM collection checklist.
- Feedback import/review procedure.
- Beta collection status report.
- Phase 26 decision worksheet.
- Docs and verification.
- Roadmap and release status consistency updates.

## Forbidden

- Fake tester feedback.
- Fake tester count.
- Fake issue count.
- Fake beta completion.
- Fake setup success rate.
- Public release implementation.
- Signed or notarized installer.
- Auto updater.
- Production package build.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP.
- OpenAI API.
- New app feature.
- DB schema changes.
- DB migration changes.
- New dependencies.
- Lockfile changes.
- App UI behavior changes.
- Codex runner behavior changes.
- Quality Gate runner policy changes.
- Backup / Restore behavior changes.
- Archive cleanup behavior changes.
- Dangerous shell, terminal emulator, command text box, or node-pty.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup file deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 26 implementation.

## Evidence Rule

Phase 25 prepares collection materials only. It does not convert placeholders, simulated references, support examples, or GM planning notes into real tester feedback.

If no real tester submission exists, all collection outputs must remain in awaiting-submissions status.

## Acceptance Criteria

- Collection docs exist and are ready for GM use.
- Tester-facing docs clearly explain local-first private beta boundaries.
- Submission instructions explicitly prohibit tokens, auth files, environment files, private keys, credentials, and proprietary source snippets.
- Collection status remains awaiting submissions when no real feedback exists.
- Phase 26 is described only as a future decision gate, not implemented.

## Failure Criteria

- Any tester feedback, tester count, issue count, or setup success rate is invented.
- The beta round is marked complete without real tester evidence.
- Any forbidden integration, release capability, dependency, schema change, command runner, destructive cleanup, or Phase 26 implementation is added.

