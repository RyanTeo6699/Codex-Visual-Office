# Phase 17 - Production 1.0 Finalization / Release Freeze Scope Lock

## Phase Name

Phase 17 - Production 1.0 Finalization / Release Freeze

## Goal

Freeze the local-first Production 1.0 baseline for Codex Visual Office by finalizing release status, release notes, acceptance report, verification manifest, and known limitations without adding new capabilities or expanding permissions.

This phase creates a local-first production baseline. It is not a public commercial launch, not a signed installer release, not notarization, not an auto updater, and not a cloud/team/account expansion.

## Allowed

- Release freeze docs.
- Release notes.
- Final acceptance report.
- Final verification manifest.
- Known limitations register.
- Docs consistency updates.
- Version/status metadata if safe.
- Final QA verification.
- Final commit and push.

## Forbidden

- New feature implementation.
- DB schema changes or migrations.
- New dependencies.
- Lockfile changes unless required for safe package metadata, which this phase should avoid.
- Production signed installer.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
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
- Phase 18 implementation.

## Release Freeze Boundary

The frozen baseline is:

```txt
Codex Visual Office 1.0 Local-First Baseline
```

It includes the current local-first workflow product and documentation baseline. It excludes production installer distribution, signing, notarization, updater, cloud, team, auth, payment, MCP, ChatGPT App, external service integrations, and dangerous command surfaces.

## Acceptance Criteria

- Release notes exist.
- Final acceptance report exists.
- Final verification manifest exists.
- Known limitations register exists.
- Release status file exists.
- Production freeze verifier passes.
- Existing production scope, RC, docs, desktop, safety, agent, project, UI, runtime, launcher, shell, and Tauri prototype verifiers pass.
- Browser/manual QA passes on core routes.
- No schema, dependency, lockfile, runner, Quality Gate, Backup / Restore, Archive cleanup, or Tauri behavior changes.

## Phase 18 Status

Phase 18 has not started.
