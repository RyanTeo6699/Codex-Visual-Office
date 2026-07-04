# Phase 16 - Production 1.0 Scope Lock / Final RC Validation

## Phase Name

Phase 16 - Production 1.0 Scope Lock / Final RC Validation

## Goal

Freeze the Production 1.0 candidate boundary and validate the current local-first desktop beta / RC candidate without adding new product capabilities or expanding safety permissions.

This phase is a scope lock and final RC validation phase. It is not the Production 1.0 release, not a commercial launch, not a signed desktop distribution, and not a cloud expansion.

## Allowed

- Production 1.0 candidate scope lock.
- Final RC validation matrix.
- Product capability inventory.
- Release boundary freeze.
- Known limitations freeze.
- Risk register.
- Go / No-Go checklist.
- Manual QA checklist refinement.
- Version and status documentation.
- Minor docs and copy consistency fixes.
- Verification hardening.
- Final report.

## Forbidden

- New feature implementation.
- DB schema changes or migration changes.
- New dependencies.
- Codex runner behavior changes.
- Quality Gate runner policy changes.
- Backup / Restore behavior changes.
- Archive cleanup behavior changes.
- Tauri production packaging.
- Electron.
- Production release.
- Code signing.
- Notarization.
- Auto updater.
- Production installer release.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, MCP, or ChatGPT App.
- OpenAI API.
- Arbitrary shell runner.
- Command text box.
- Terminal emulator.
- node-pty.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 17 implementation.

## Production 1.0 Candidate Scope

The candidate scope is the existing local-first desktop beta / RC product:

- Visual Office Home.
- Project Room.
- Review Room 2.0.
- Local SQLite persistence.
- Selected local reads.
- Codex CLI detection and scoped runner safety boundaries.
- Git/file/diff observation.
- Scope Guard.
- Quality Gates.
- Settings Center.
- Approved Project Paths.
- Backup / Restore for local SQLite only.
- Archive Room with dry-run-only retention preview.
- Local App Shell status and browser-only launcher.
- Tauri packaging prototype / desktop beta candidate status.
- Safety / Permission Audit.
- Release Candidate QA documentation and stabilization baseline.

## Release Boundary Freeze

Production 1.0 candidate does not include:

- Cloud sync.
- Team workspace.
- MCP or ChatGPT App.
- GitHub, Vercel, or Supabase integration.
- Auth or payment.
- Production signed installer.
- Code signing.
- Notarization.
- Auto updater.
- Source code indexing.
- Full diff viewer.
- Semantic code review.
- Destructive cleanup.
- Backup file deletion.

## Safety Boundary

The product remains local-first. It must not store OpenAI tokens, read `~/.codex/auth.json`, read `.env` / `.env.local`, upload local data to cloud services, or run arbitrary commands.

Quality Gates remain allowlisted only. Codex execution remains scoped and confirmation-gated. Git observation remains bounded and does not mutate Git from app logic.

## Acceptance Criteria

- Production 1.0 scope and release boundary are documented.
- Product capability inventory exists and marks unsupported capabilities as not implemented.
- Risk register exists.
- Go / No-Go checklist exists.
- Final RC validation matrix exists.
- Static production scope verifier passes.
- Existing RC, docs, desktop beta, safety, agent, project, UI, runtime, launcher, shell, and Tauri prototype verifiers pass.
- No DB schema changes.
- No new dependencies.
- No forbidden implementation is added.

## Failure Criteria

- Any production release, signing, notarization, installer, or auto updater behavior is implemented.
- Any cloud, auth, payment, team, MCP, ChatGPT App, GitHub, Vercel, Supabase, or OpenAI API integration is added.
- Any DB schema or migration changes are introduced.
- Any new dependency is added.
- Any arbitrary shell, command text box, terminal emulator, or node-pty capability is added.
- Any destructive cleanup or backup deletion behavior is added.
- Phase 17 work starts.

## Phase 17 Status

Phase 17 has not started.
