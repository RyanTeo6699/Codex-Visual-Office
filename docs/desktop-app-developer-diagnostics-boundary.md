# Desktop App Developer Diagnostics Boundary

## Purpose

Developer Diagnostics is the future support and contributor surface for details that should not appear in the normal desktop app workflow.

## Target Audience

Developer Diagnostics is for:

- contributors.
- maintainers.
- GM review.
- support/debug sessions.
- advanced local troubleshooting.

It is not the primary surface for normal users doing project and review work.

## Default Hidden Principle

Developer Diagnostics should be discoverable but not primary.

Normal users should not have to read verifier outputs, npm script lists, localhost details, phase documents, or release operations to use Codex Visual Office.

## Developer Diagnostics May Contain

- verifier matrix.
- app runtime health status.
- local shell status.
- launcher fallback status.
- localhost / port diagnostics.
- Tauri prototype status.
- Codex CLI detection details.
- Quality Gate runner diagnostics.
- safety audit details.
- DB status and table counts.
- bounded logs and event summaries.
- archive / retention diagnostics.
- backup verification evidence.
- beta ops and release ops status where still needed.

## Developer Diagnostics Must Not Contain

- arbitrary command input.
- command text box.
- terminal emulator.
- `node-pty`.
- auto fix.
- auto git add / commit / push.
- auto deploy.
- destructive cleanup.
- backup deletion.
- credential or token readers.
- `~/.codex/auth.json` readers.
- `.env` or `.env.local` readers.

## Relationship To Main App

Main App should remain focused on:

- projects.
- AI employees / Codex agents.
- tasks.
- review.
- evidence summaries.
- final human decisions.

Developer Diagnostics can explain implementation health, but it must not become the ordinary review workflow.

## Relationship To Settings

Settings should link to Developer Diagnostics for advanced detail.

Settings should not duplicate full diagnostic cards when a concise status and link is enough.

## Phase 33A Boundary

This document defines a future boundary only. It does not implement a Developer Diagnostics page.
