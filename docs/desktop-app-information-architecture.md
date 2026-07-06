# Desktop App Information Architecture

## Purpose

This document defines the future desktop information architecture for Codex Visual Office. It is planning only and does not implement navigation or UI changes.

## IA Principle

The desktop app should feel like a focused local Codex office, not a mixed admin/debug console.

Information should be divided into four surfaces:

```txt
Main App
Settings
Developer Diagnostics
About / Open Source
```

## Main App

Main App is where normal work happens.

Future primary navigation should emphasize:

- Office
- Projects / Rooms
- Tasks
- Review
- optional Archive if history becomes a frequent user workflow

Main App keeps:

- project rooms
- AI employees / Codex agents
- active tasks
- blocked tasks
- build wall
- event ticker
- review readiness
- prompt handoff
- scoped runner user action
- evidence summaries
- changed files summary
- diff summary
- scope guard result
- quality gate summary
- final decision controls

Main App should not carry:

- npm scripts
- verifier scripts
- phase documents
- release operations
- beta operations
- localhost details
- Tauri internals
- full safety audit matrices
- raw DB diagnostics

## Settings

Settings is for user-controlled local configuration.

Settings keeps:

- local-first status
- theme / local mode preference
- approved project paths
- Codex status summary
- local DB path summary
- backup / restore controls for the app-owned SQLite database
- archive / retention entry point
- quality gate defaults summary
- safety summary
- link to Developer Diagnostics

Settings should not become a dumping ground for implementation detail.

## Developer Diagnostics

Developer Diagnostics is for contributors, maintainers, GM review, and support.

It may contain:

- runtime readiness diagnostics
- localhost / port / browser fallback details
- local launcher status
- Tauri prototype status
- Codex CLI detection details
- Quality Gate runner diagnostics
- safety audit details
- verifier matrix
- DB table counts
- bounded log and event summaries
- beta ops and release ops status

Developer Diagnostics should be hidden from the default work path and should not contain command input, terminal emulation, auto fix, auto commit, auto push, auto deploy, or cleanup controls.

## About / Open Source

About / Open Source is the product truth surface.

It should contain:

- product identity
- version
- release status
- local-first explanation
- privacy / local data summary
- what this app is not
- known limitations
- license
- contributing path
- diagnostics/support link

It should not contain configuration controls, operational ledgers, or executable actions.

## What Moves Out Of Main UI

These should move away from the main work flow in future phases:

- beta ops
- release ops
- safety audit details
- verifier matrices
- npm scripts
- localhost details
- Tauri prototype detail
- raw database diagnostics
- phase document status

## What Remains In Main UI

These stay in the main work flow:

- project state
- AI employee / Codex agent state
- task state
- build state
- review state
- final review decision
- concise scope guard and quality gate evidence
- concise runner status

## Future Phase 33B / 33C Notes

Phase 33B should convert this IA into a concrete redesign plan.

Phase 33C should implement the App Shell UI redesign only after Phase 33B is accepted.

Neither Phase 33B nor Phase 33C is implemented by this document.
