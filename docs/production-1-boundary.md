# Production 1.0 Boundary

## What Production 1.0 Candidate Includes

The Production 1.0 candidate includes the current local-first desktop beta / RC feature set:

- Local visual office experience.
- Local SQLite persistence for projects, tasks, events, reviews, settings, approved paths, backups, archive metadata, Git observation records, scope checks, and quality gate records.
- Codex CLI detection and scoped runner workflow with explicit confirmations.
- Read-only Git/file/diff observation.
- Path-level Scope Guard.
- Allowlisted Quality Gates.
- Review Room 2.0 with manual final decisions.
- Settings Center.
- Approved Project Paths.
- Local SQLite Backup / Restore.
- Archive Room with dry-run-only retention preview.
- Safety Audit Room.
- Browser-only local launcher.
- Tauri desktop beta candidate / prototype configuration.
- User, developer, safety, recovery, and RC QA documentation.

## What Production 1.0 Candidate Excludes

- Production release.
- Production installer.
- Production signed installer.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
- Cloud sync.
- Team workspace.
- GitHub API.
- Vercel.
- Supabase.
- Auth.
- Payment.
- MCP server.
- ChatGPT App.
- OpenAI API.
- Source code indexing.
- Full diff viewer.
- Semantic code review.
- Destructive cleanup.
- Backup file deletion.

## Local-First Policy

The app is local-first. The local SQLite database remains the source of truth for this candidate. No cloud database, remote sync, or external account is required for the current candidate.

## Desktop Beta Candidate Status

Tauri remains beta/prototype/candidate only. There is no production installer yet, no code signing, no notarization, and no auto updater.

## Data Safety Boundaries

- No token storage.
- No OpenAI token storage.
- No reading `~/.codex/auth.json`.
- No reading `.env` or `.env.local`.
- No cloud upload.
- No source code backup.
- No destructive cleanup.
- Backup / Restore only targets `.local/codex-visual-office.sqlite`.

## Codex Execution Boundaries

- Codex CLI detection may report path/version/coarse status.
- Scoped runner requires approved path and explicit confirmations.
- The app must not expose arbitrary command input.
- The app must not provide a terminal emulator.
- The app must not use node-pty.
- The app must not automatically commit, push, deploy, or run destructive commands.

## No-Cloud Policy

Cloud sync is not implemented. GitHub, Vercel, Supabase, remote storage, team workspace, and cloud accounts are not part of this candidate.

## No-Token-Storage Policy

The app must not store tokens, credentials, `.env` content, `.env.local` content, or Codex auth files.

## No-Production-Installer-Yet Policy

The current desktop work is a beta/prototype candidate only. A production installer requires a later GM-approved phase covering signing, notarization, installer QA, update strategy, rollback strategy, and support boundaries.

## Release Blocker Definition

A release blocker is any issue that:

- Breaks core local routes.
- Breaks local database initialization or verification.
- Breaks bounded Codex runner safety.
- Adds forbidden integrations or forbidden command execution.
- Claims unsupported production capability in docs or UI.
- Risks token/env/auth exposure.
- Enables destructive cleanup or backup deletion.

## Non-Blocking Limitations

- UI still has beta-grade areas.
- Codex CLI auth status remains coarse/unknown.
- Tauri is not production signed or notarized.
- Backup / Restore requires careful local operation.
- Archive retention is dry-run only.
- No full source indexing.
- No semantic code review.
- No cloud sync or team workspace.
