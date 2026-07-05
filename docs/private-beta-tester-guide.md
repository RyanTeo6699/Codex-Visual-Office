# Private Beta Tester Guide

## What This Beta Is

This is a private local beta for Codex Visual Office. It validates the local-first workflow through source checkout, local npm scripts, local SQLite, and browser-based launcher flow.

## What This Beta Is Not

- Not a public commercial release.
- Not a signed installer.
- Not a notarized app.
- Not an auto-updating desktop app.
- Not a cloud product.
- Not a team workspace.
- Not MCP / ChatGPT App.
- Not payment or auth.

## How To Start The App

1. Open a terminal in the repository.
2. Install dependencies using the project-approved npm workflow.
3. Run `npm run db:init`.
4. Run `npm run db:seed` if seed data is needed.
5. Run `npm run db:verify`.
6. Run `npm run dev`.
7. Open `http://localhost:3000`.

## How To Open Browser Launcher

- Run `npm run local:launcher:verify` to verify launcher readiness.
- Run `npm run local:launcher -- --json` for status-only launcher output.
- Use browser fallback if desktop shell is not available.

## How To Configure Approved Project Path

1. Open `/settings`.
2. Find Approved Project Paths.
3. Add an explicit local project path manually.
4. Do not add token files, `.env`, `.env.local`, or `~/.codex/auth.json`.
5. Do not expect folder picker or full-disk scan behavior.

## How To Inspect Office Home

- Open `/`.
- Confirm projects, Codex seats, running/review states, and local-first cues are visible.

## How To Inspect Project Room

- Open `/projects/provider-workspace`.
- Confirm approved path status, local project health, task state, Quality Gate status, and workspace summaries.

## How To Inspect Review Room

- Open `/review/task-provider-review`.
- Confirm Prompt Handoff, Scoped Runner, Git Snapshot, Changed Files, Diff Summary, Scope Guard, Quality Gates, Review Readiness, Final Decision, and Activity Timeline are visible.
- Do not treat advisory readiness as automatic approval.

## How To Inspect Safety Audit

- Open `/safety`.
- Confirm no cloud sync, no token storage, no terminal, no command text box, no auto Git mutation, and no destructive cleanup.

## How To Inspect Backup / Restore

- Open `/settings`.
- Review Backup / Restore status.
- Use dry-run before confirm restore.
- Confirm backup is only for the app SQLite DB, not source projects or credentials.

## How To Report Issues

Use `docs/private-beta-issue-report-template.md` for bugs and `docs/private-beta-feedback-template.md` for general beta feedback.

## What Not To Test

- Cloud sync.
- Team workspace.
- MCP / ChatGPT App.
- Payment/auth.
- Signed installer.
- Auto updater.
- Production package build.
- Token handling.
- Destructive cleanup.
