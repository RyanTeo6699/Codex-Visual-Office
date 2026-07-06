# Phase 33A - Desktop Product UX Scope Lock

## Phase Goal

Define the desktop product UX scope for Codex Visual Office before any App Shell redesign, diagnostics separation, or desktop polish implementation begins.

Phase 33A is a documentation and information architecture boundary phase. It does not redesign the app, does not change app behavior, and does not start Phase 33B or Phase 33C.

## Product Position

Codex Visual Office should become a mature local-first open-source desktop app, not a browser-like development console.

The product surface should prioritize:

- Office work: projects, AI employees / Codex agents, tasks, build state, review state.
- Human review: task brief, evidence, scope guard, quality gates, final decision.
- Local-first trust: clear local storage, local runtime, local project approval, backup boundaries.

The product surface should not expose routine users to:

- verifier matrices
- phase documents
- npm scripts
- localhost internals
- Tauri prototype internals
- release operations
- beta operations
- raw diagnostics
- development process artifacts

## Allowed In Phase 33A

- Product UX scope definition.
- Desktop information architecture planning.
- Main App versus Settings versus Developer Diagnostics boundary planning.
- Open-source desktop surface planning.
- Static verifier for this scope.
- Documentation updates to `docs/ROADMAP.md`, `docs/phase-7-roadmap.md`, and `RELEASE_STATUS.md`.
- `package.json` update only for Phase 33A verifier scripts.

## Forbidden In Phase 33A

- No UI redesign.
- No AppShell rewrite.
- No navigation implementation.
- No app behavior changes.
- No DB schema changes.
- No migrations.
- No dependency changes.
- No new runtime runner.
- No Quality Gate runner changes.
- No backup, archive, beta, safety, settings, review, or office implementation changes.
- No Tauri permission changes.
- No Electron.
- No auto updater.
- No cloud sync.
- No GitHub API, Vercel, Supabase, OpenAI API, auth, payment, team workspace, MCP, or ChatGPT App.
- No arbitrary shell runner.
- No command text box.
- No terminal emulator.
- No `node-pty`.
- No automatic Codex, Git, or Quality Gate execution.
- No reading `~/.codex/auth.json`, `.env`, or `.env.local`.
- No Phase 33B or Phase 33C implementation.

## Main App Boundary

The Main App is the normal user work surface.

It should keep:

- Office Home.
- Project Rooms.
- Review Room.
- AI employees / Codex seats.
- Tasks.
- Build state.
- Review evidence.
- Scope Guard status.
- Quality Gate summary.
- Final review decision.

It should not carry:

- verifier script output.
- npm command lists.
- phase status matrices.
- localhost implementation details.
- Tauri prototype internals.
- full safety audit matrices.
- beta operations.
- release operations.
- raw DB diagnostics.

## Settings Boundary

Settings is the normal user control surface.

It should keep:

- local-first status.
- approved project paths.
- Codex status summary.
- local DB path summary.
- backup / restore controls for the app-owned SQLite database.
- archive / retention entry point.
- quality gate defaults summary.
- simple safety summary.
- link to Developer Diagnostics.

It should not become:

- a verifier dashboard.
- a release ops room.
- a beta ops room.
- a raw runtime diagnostic console.
- a database table-count report.
- a Tauri internals page.

## Developer Diagnostics Boundary

Developer Diagnostics is the contributor/operator support surface.

It may contain:

- verifier matrix.
- app runtime health details.
- localhost and launcher fallback details.
- Tauri prototype status.
- Codex CLI detection details.
- Quality Gate runner diagnostics.
- safety audit details.
- DB table counts.
- bounded logs and event summaries.
- beta ops and release ops status, if still needed.

It must not contain:

- arbitrary command execution controls.
- command text boxes.
- terminal emulators.
- automatic fix, commit, push, deploy, or cleanup actions.

## About / Open Source Boundary

The open-source product surface should explain:

- what Codex Visual Office is.
- what it is not.
- version and release status.
- local-first data model.
- privacy and local data boundaries.
- license.
- contributing path.
- diagnostics and support path.

It should not expose operational ledgers or internal phase documents as primary user flows.

## Future Phase Sequence

Phase 33A only locks the scope. Later implementation must proceed in this order unless GM changes it:

```txt
Phase 33B - Desktop IA Redesign Plan
Phase 33C - App Shell UI Redesign
Phase 33D - Dev Diagnostics Separation
Phase 33E - Open Source Polish
Phase 33F - Runtime Failure UX
Phase 33G - Packaging UX Prep
Phase 33 Closeout
```

## Acceptance Criteria

- Phase 33A remains docs and static verification only.
- Main App, Settings, Developer Diagnostics, and About boundaries are documented.
- Required desktop IA documents exist.
- Static verifier confirms required boundary docs and terms.
- No app UI, behavior, database, dependency, or runtime implementation changes are made.
- Phase 33B and Phase 33C have not started.

## Failure Criteria

Phase 33A fails if it:

- changes AppShell, Sidebar, TopBar, page components, or user flows.
- changes database schema or migrations.
- adds dependencies.
- adds any command execution surface.
- moves beyond planning into Phase 33B or Phase 33C implementation.

## Explicit Non-Start Statement

Phase 33B Desktop IA Redesign Plan has not started.

Phase 33C App Shell UI Redesign has not started.
