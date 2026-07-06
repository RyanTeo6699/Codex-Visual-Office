# Desktop App Settings Boundary

## Purpose

Settings must stay calm, user-owned, and configuration-focused. It should not become the internal diagnostic console.

## Settings Keeps

Settings should keep:

- local mode.
- approved project paths.
- Codex status summary.
- local DB path display.
- quality gate default summary.
- backup / restore controls for the app-owned SQLite database.
- archive / retention entry point.
- safety summary.
- app runtime basic status.
- link to Developer Diagnostics.

## Settings Should Not Carry

Settings should not carry:

- verifier matrices.
- phase documents.
- npm scripts.
- localhost details.
- port debugging.
- Tauri internals.
- beta operations.
- release operations.
- DB table counts.
- full safety audit details.
- raw logs.
- command execution controls.

## Advanced Settings Versus Developer Diagnostics

Advanced Settings are still user preferences or local configuration.

Developer Diagnostics are implementation evidence, runtime internals, verifier state, or support-only details.

If a user can safely change it as a product preference, it may belong in Settings. If it explains how the app is wired or why a local runtime is failing, it belongs in Developer Diagnostics.

## Safety Summary Versus Full Safety Audit

Settings may show:

- local-only mode active.
- no cloud sync active.
- no token storage.
- backup safety status.
- approved paths configured.

Developer Diagnostics should show:

- full forbidden capability matrix.
- detailed launcher safety.
- runner safety evidence.
- backup/archive safety evidence.
- file and credential boundary checks.

## Runtime Summary Versus Runtime Internals

Settings may show:

- app-first desktop runtime direction.
- runtime readiness summary.
- browser fallback exists for support.

Developer Diagnostics should show:

- localhost / port details.
- launcher fallback details.
- Tauri prototype details.
- runtime health check mode.
- process supervision limitations.

## Backup Summary Versus Restore Internals

Settings may show:

- Backup Now.
- Restore Dry Run.
- Confirm Restore after dry-run.
- backup records list.

Developer Diagnostics may show:

- backup verification details.
- checksum details.
- restore safety evidence.
- local DB status details.

## Codex Status Summary Versus Diagnostics

Settings may show:

- Codex CLI detected or not detected.
- coarse runtime status.
- no token read/storage note.

Developer Diagnostics should show:

- detection evidence.
- prompt handoff verifier state.
- runner safety details.
- bounded output behavior.

## Phase 33A Boundary

This document is planning only. It does not change the Settings UI.
