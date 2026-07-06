# Open Source Desktop App Surface

## Purpose

This document defines the future open-source-facing desktop surface for Codex Visual Office.

## Product Identity

Codex Visual Office is a local-first visual office for ChatGPT + Codex workflows.

It is not:

- GitHub Projects.
- Notion.
- a generic admin dashboard.
- a cloud task tracker.
- a terminal emulator.
- a SaaS control panel.

## About Surface

The desktop app should eventually include an About surface with:

- product name.
- version.
- local-first status.
- release status.
- known limitations.
- license.
- contributing link.
- diagnostics/support link.

## Privacy / Local Data Surface

The desktop app should clearly state:

- data is local-first.
- local SQLite is the app-owned data store.
- approved project paths are explicitly user-approved.
- backups are local.
- no cloud sync is active.
- no auth/payment/team workspace is active.
- no OpenAI token is stored by the app.
- `~/.codex/auth.json`, `.env`, and `.env.local` are not read by the app.

## Contributing Surface

Contributor information should include:

- setup docs.
- verification commands.
- issue filing guidance.
- local beta/testing guidance where appropriate.
- diagnostic page location.

Contributor information should not be mixed into the default user workflow.

## License And GitHub Surface

The future desktop About surface may link to:

- repository URL.
- license file.
- release notes.
- known limitations.
- contributing guide.

It should not add GitHub API integration.

## Diagnostics Surface

The app may expose a Developer Diagnostics area for support and contributor debugging.

This is separate from the open-source About surface. About explains the product; Diagnostics explains the local system state.

## Terminal Scripts Boundary

Terminal and npm scripts are contributor mode only.

They should appear in documentation and Developer Diagnostics, not in the normal desktop app workflow.

## Phase 33A Boundary

This document does not implement About, Contributing, License, or Diagnostics UI.
