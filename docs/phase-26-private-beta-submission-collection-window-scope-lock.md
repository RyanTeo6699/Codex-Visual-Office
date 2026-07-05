# Phase 26 - Continue Real Private Beta Round 1 / Submission Collection Window Scope Lock

## Phase Name

Phase 26 - Continue Real Private Beta Round 1 / Submission Collection Window.

## Goal

Establish the real private beta submission collection window management layer, including invitation status, onboarding status, submission status, non-response tracking, evidence requirements, and decision criteria without fabricating tester feedback or implementing public release capabilities.

## Current Status

```txt
REAL_PRIVATE_BETA_COLLECTION_WINDOW_READY_AWAITING_SUBMISSIONS
```

No real tester feedback, tester count, submission count, issue count, setup success rate, launch success rate, or beta completion claim is recorded by this phase.

## Allowed

- Invitation status tracker.
- Onboarding status tracker.
- Submission status tracker.
- Non-response tracker.
- Follow-up checklist.
- Evidence requirements.
- Collection window decision report.
- Phase 27 review readiness worksheet.
- Docs and verification.
- Roadmap and release status consistency updates.

## Forbidden

- Fake tester feedback.
- Fake tester count.
- Fake submission count.
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
- Phase 27 implementation.

## Evidence Rule

Phase 26 may track the submission collection window structure only. It must not convert planned testers, pending rows, placeholders, simulated references, support examples, or GM planning notes into real tester feedback or submission counts.

## Acceptance Criteria

- Collection window trackers exist.
- Trackers remain empty or pending unless real tester data is provided.
- Submission status docs explicitly state no real feedback submissions have been recorded yet when applicable.
- Evidence requirements prohibit token, auth, env, private key, credential, and proprietary source collection.
- Decision report recommends continued collection when no real submissions exist.
- Phase 27 is described only as a future review readiness gate, not implemented.

## Failure Criteria

- Any tester, submission, issue, setup success, or beta completion metric is fabricated.
- Any forbidden integration, release capability, dependency, schema change, command runner, destructive cleanup, or Phase 27 implementation is added.

