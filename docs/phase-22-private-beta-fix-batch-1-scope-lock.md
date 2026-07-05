# Phase 22 - Private Beta Fix Batch 1 Scope Lock

## Phase Name

Phase 22 - Private Beta Fix Batch 1.

## Goal

Resolve low-risk documentation, copy, UI clarity, responsive, and verification issues discovered during the Phase 21 private beta dry-run before inviting real private beta testers.

## Allowed

- Documentation clarity fixes.
- Setup and tester guide fixes.
- Support runbook fixes.
- Private beta feedback and issue template fixes.
- Small UI copy and help-text fixes.
- Small responsive and layout fixes.
- Static verifier hardening.
- Beta readiness status updates.
- Docs and verification updates.

## Forbidden

- Real private beta execution.
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
- New core app feature.
- DB schema or migration changes.
- New dependencies or lockfile changes.
- Codex runner behavior changes.
- Quality Gate runner policy changes.
- Backup / Restore behavior changes.
- Archive cleanup behavior changes.
- Tauri production packaging.
- Arbitrary shell runner.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup file deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 23 implementation.

## Fix Categories

- Safety wording: prominent no-token and no-secret reminders.
- Setup wording: expected local DB and launcher success markers.
- Runtime wording: Codex CLI optionality and `auth_unknown` interpretation.
- Path wording: manual approved path setup and missing-path recovery.
- Backup wording: dry-run restore and safety backup expectations.
- Archive wording: dry-run only, no data deletion, no backup deletion.
- Status wording: private beta local-first baseline, not public release.
- Verification: static `beta:verify:fix-batch` coverage.

## Acceptance Criteria

- Phase 22 scope lock exists.
- Fix Batch 1 issue list exists and maps Phase 21 dry-run findings to low-risk fixes.
- Secret-handling warnings are prominent in feedback, issue, tester, and support docs.
- Approved path, Codex auth unknown, DB verify, backup dry-run, archive dry-run, and localhost wording are clarified.
- Static verifier confirms the fix batch remains docs/copy/status/verifier hardening only.
- No product capability, permission, dependency, schema, release, or private beta execution boundary expands.

## Failure Criteria

- Any DB schema, migration, dependency, or lockfile change.
- Any runner, Quality Gate, backup, archive, or Tauri behavior change.
- Any public release, signing, notarization, updater, cloud, auth, payment, team, MCP, OpenAI, GitHub API, Vercel, or Supabase implementation.
- Any real private beta completion claim.
- Any Phase 23 implementation.

## Explicit Phase Status

Phase 22 is a private beta fix batch only. It does not execute a real private beta round, does not implement public release packaging, and does not start Phase 23.
