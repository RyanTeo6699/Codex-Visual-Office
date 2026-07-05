# Private Beta Round 1 Test Plan

## Test Round Name

Private Beta Round 1 - Local-First Production 1.0 Feedback Intake.

## Goal

Validate whether selected technical testers can set up, launch, inspect, and safely evaluate Codex Visual Office through source checkout and browser-only local launcher workflows.

## Target Tester Profile

- Developer familiar with local tools.
- Codex CLI user or evaluator.
- Project owner / GM workflow user.
- UI/UX reviewer.
- Safety-conscious tester.

## Recommended Tester Count

Start with 5-8 testers. Expand only after setup, safety, and feedback intake flow are stable.

## Test Duration

Recommended window: 5-7 calendar days.

## Required Prerequisites

- macOS primary test environment.
- Node.js and npm installed.
- Browser available for local app routes.
- Git/source checkout access or approved source archive.
- Optional Codex CLI present for runtime status observations.
- Tester agrees not to submit tokens, `auth.json`, `.env`, `.env.local`, passwords, private keys, or secrets.

## Setup Path

1. Obtain repository access or approved source archive.
2. Install dependencies locally.
3. Initialize and verify local SQLite.
4. Run local verification commands from the tester guide.
5. Start the local app.
6. Use browser routes for testing.

## Required Test Flows

### Local Setup

Confirm dependency install, local database initialization, seed behavior, and baseline verification instructions are understandable.

### Local Launcher

Confirm browser-only launcher guidance works and does not imply signed installer, notarization, auto updater, or production desktop packaging.

### Settings

Confirm Settings Center clearly shows local-first status, Codex CLI status, local DB status, approved project paths, backup/restore, archive/retention, and local app shell posture.

### Safety Audit

Confirm Safety Audit is understandable and does not request tokens, credentials, `.env`, `.env.local`, or `auth.json`.

### Approved Project Path

Confirm manual approved path entry is understandable and does not scan the filesystem, auto-run Codex, auto-run Git, or auto-run quality gates.

### Office Home

Confirm the office metaphor, project rooms, Codex seats, build wall, and activity surfaces communicate product status.

### Project Room

Confirm local project state, approved path status, task board, quality gate summary, and project workflow surfaces are understandable.

### Review Room

Confirm Review Room 2.0 shows prompt handoff, scoped runner status, Git evidence, changed files, diff summary, scope guard, quality gates, readiness summary, decision area, and activity timeline.

### Backup / Restore Dry-Run / Confirm Guidance

Confirm testers understand Backup Now, Dry Run Restore, Confirm Restore, and pre-restore safety backup boundaries.

### Archive Dry-Run

Confirm Archive Room communicates dry-run-only retention previews and makes clear that Phase 20 does not delete logs, backup files, source files, or local databases.

### Documentation Usability

Confirm package checklist, tester guide, support runbook, feedback template, and issue report template are usable without additional live support.

## Non-Goals

- Cloud sync.
- Team workspace.
- MCP / ChatGPT App.
- Payment or auth.
- Signed installer.
- Notarized app.
- Auto updater.
- Public release or commercial launch.

## Exit Criteria

- At least 80% of testers can complete setup or provide actionable setup blockers.
- Core routes load for testers who complete setup.
- Safety/data concerns are captured with severity and priority.
- Repeated confusion is identified and assigned to a next decision.
- No evidence appears of token sharing, cloud sync expectation, or public release misunderstanding that cannot be corrected by docs.

## Safety Instructions

Testers must not submit tokens, `~/.codex/auth.json`, `.env`, `.env.local`, passwords, private keys, production data, or confidential source code snippets. Support must ask for redacted summaries and screenshots only when safe.
