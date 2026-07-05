# Phase 21 - Private Beta Round 1 Execution Dry Run / Feedback Simulation Scope Lock

## Phase Name

Phase 21 - Private Beta Round 1 Execution Dry Run / Feedback Simulation.

## Goal

Validate the private beta test process, feedback intake workflow, triage model, and support runbook through internal dry-run scenarios before inviting real private beta testers.

## Allowed

- Simulated tester scenarios.
- Dry-run execution checklist.
- Sample feedback entries.
- Sample issue reports.
- Sample triage output.
- Regression decision output.
- Dry-run results report.
- Phase 22 recommendation.
- Documentation and static verification.
- Roadmap and release status consistency updates.

## Forbidden

- Real public release.
- Signed or notarized installer.
- Auto updater.
- Production package build.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP / ChatGPT App.
- OpenAI API.
- New app feature.
- DB schema changes or migrations.
- New dependencies or lockfile changes.
- Dangerous shell, command text box, terminal emulator, or node-pty.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup or backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 22 implementation.

## Boundary

Phase 21 is a simulated execution rehearsal. It validates whether the Phase 20 beta intake process is internally coherent, not whether real testers have completed the beta.

The dry-run remains local-first and no cloud sync is introduced or assumed.

No runner, quality gate, backup, archive, Tauri, local launcher, database, or UI behavior changes are allowed in this phase.

## Acceptance Criteria

- Simulated scenarios cover setup, launcher, Codex CLI present/missing, approved path, backup/restore caution, UI/responsive review, and safety review.
- Sample feedback and sample issues cover blocker/high/medium/low/cosmetic categories.
- Triage output maps issues to Phase 22 fix candidates, documentation clarification, known limitations, or no action.
- Dry-run results include a clear readiness conclusion.
- Static verifier confirms all required docs and forbidden-scope boundaries.

## Failure Criteria

- Any real beta completion is claimed.
- Any app feature, schema, dependency, runner, packaging, or UI behavior changes are introduced.
- Any docs imply public release, signing, notarization, auto updater, cloud/team/MCP, auth/payment, OpenAI API, or commercial launch is complete.
- Any process asks for tokens, `.env`, `.env.local`, private keys, passwords, or `auth.json`.
- Phase 22 implementation begins.

## Explicit Phase Status

Phase 21 begins and ends as private beta dry-run and simulated feedback preparation. Phase 22 has not started.
