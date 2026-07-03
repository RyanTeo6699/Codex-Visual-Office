# Phase 12 - Safety / Permission Hardening Scope Lock

## Phase Name

Phase 12 - Safety / Permission Hardening

## Goal

Consolidate existing local-first safety boundaries into a visible, verifiable, and auditable safety/permission layer without adding dangerous execution capabilities.

Phase 12 is a safety hardening, UI visibility, and verification phase. It may make existing permission state easier to inspect, summarize, and verify. It must not expand runtime authority, source-read authority, credential authority, cloud authority, or destructive cleanup behavior.

## Core Positioning

Codex Visual Office should make local safety posture clear before the user starts work.

Phase 12 should help the user understand:

- Which local permissions are known to the app.
- Which approved paths are registered.
- Which sensitive paths remain blocked.
- Which runner, backup, archive, launcher, and Tauri safety boundaries apply.
- Which permissions are intentionally absent.
- Where safety status can be reviewed in the product.

The phase does not grant the app permission to run commands, inspect source trees, read credentials, delete backups, connect to cloud services, or package a production desktop release.

## Allowed

- Local permission model.
- Sensitive path guard consolidation.
- Approved path permission summary.
- Runner safety summary.
- Backup/restore safety summary.
- Archive/retention safety summary.
- Launcher/Tauri safety summary.
- `/safety` UI.
- Documentation.
- Verification.

## Forbidden

- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Arbitrary shell execution.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Project source reads.
- `package.json` auto-detection from approved paths.
- Folder picker.
- File browser.
- Source viewer.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- OpenAI API.
- Cloud sync.
- GitHub integration.
- Vercel integration.
- Supabase integration.
- Auth.
- Payment.
- Team workspace or team permissions.
- MCP.
- ChatGPT App.
- Production Tauri packaging.
- Electron.
- Auto updater.
- Destructive cleanup.
- Backup file deletion.
- Phase 13 implementation.

## Permission Boundary

An approved path is a user-declared workspace boundary, not permission to inspect project contents.

Phase 12 may summarize approved path records owned by the app. It must not:

- Crawl approved directories.
- Read source files.
- Read dependency manifests.
- Read lockfiles.
- Read framework configs.
- Read build or test configs.
- Read `.git` internals.
- Infer project type from files on disk.
- Automatically discover projects.

## No-New-Permissions Policy

Phase 12 may organize and display safety state, but it must not create a new capability that was not already allowed by an earlier approved phase.

New summaries must be derived from app-owned local records, static policy definitions, or bounded verification scripts. They must not require broader filesystem, process, credential, cloud, or network permissions.

## No-Auto-Execution Policy

Phase 12 must not automatically execute work.

Forbidden automatic execution includes:

- Starting or resuming Codex runs.
- Running Git commands.
- Running Quality Gate commands.
- Running package manager scripts.
- Running install, build, test, deploy, cleanup, or archive deletion commands.
- Running arbitrary user-entered commands.
- Executing commands discovered from project files.

Every execution-capable future feature requires a separate GM-approved scope lock.

## Credential Boundary

Phase 12 must not inspect, validate, store, copy, display, or transmit secrets.

Forbidden credential handling includes:

- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Reading token files, SSH keys, API keys, OAuth credentials, cloud credentials, or CLI credential stores.
- Storing tokens or refresh tokens.
- Inferring auth status from private credential files.

Credential status may only be represented as policy text, user-facing safety notes, or existing bounded local records that do not contain secrets.

## Safety UI Boundary

The `/safety` UI may show:

- Local permission summaries.
- Approved path permission summaries.
- Sensitive path guard summaries.
- Runner safety summaries.
- Backup/restore summaries.
- Archive/retention summaries.
- Launcher/Tauri summaries.
- Credential safety summaries.
- Forbidden capability summaries.
- Verification status.

The `/safety` UI must not show:

- Command entry.
- Terminal output streaming.
- File browsing.
- Source code viewing.
- Credential contents.
- Automatic repair buttons that execute commands.
- Destructive cleanup or backup deletion actions.

## Verification Boundary

Verification may check that safety documentation, helpers, or UI surfaces exist and that forbidden strings or capabilities are absent from Phase 12-owned files.

Verification must not:

- Run real Codex tasks.
- Run Git mutations.
- Run Quality Gate commands against project source.
- Read approved project source.
- Read secrets.
- Delete backup files.
- Launch production Tauri packaging.
- Connect to cloud services.

## Completion Criteria

Phase 12 is complete only if:

1. Safety and permission boundaries are documented.
2. The local permission model is visible and auditable.
3. Sensitive path guard behavior is consolidated or clearly summarized.
4. Approved path permission summaries preserve the no-source-read boundary.
5. Runner, backup/restore, archive/retention, launcher/Tauri, and credential safety summaries exist.
6. Forbidden capabilities remain absent.
7. No source-read, credential-read, cloud, automatic execution, destructive cleanup, production packaging, or Phase 13 behavior is added.

## Next Phase Gate

Do not start Phase 13 unless GM explicitly approves it.

Any future phase that adds new execution, source inspection, project file browsing, credential handling, cloud sync, external integrations, production packaging, destructive cleanup, or backup deletion must receive a separate scope lock and verification plan before implementation.
