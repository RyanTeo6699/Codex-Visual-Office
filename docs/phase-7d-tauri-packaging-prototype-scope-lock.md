# Phase 7D - Tauri Packaging Prototype

## Goal

Validate whether Codex Visual Office can be safely wrapped by a Mac-first Tauri desktop shell while preserving the existing local-first browser launcher fallback.

## Current Baseline

Latest expected commit:

```txt
754a3c5 feat: add phase 7 local launcher
```

Phase 7D starts from the Phase 7C local launcher baseline. The browser-only launcher remains the official fallback throughout this phase.

## Scope Lock

Phase 7D is a prototype-only packaging investigation. It must remain Mac-first and must not be treated as a production desktop release.

The current UI must remain functional. No redesign is part of this phase.

## Allowed

- Mac-first Tauri prototype.
- Minimal Tauri config.
- Local app URL wrapper.
- Local launcher compatibility checks.
- Safety verification.
- Prototype docs.

## Forbidden

- Production installer.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth.
- Payment.
- Team workspace.
- MCP / ChatGPT App.
- Arbitrary shell.
- Terminal emulator.
- `node-pty`.
- Command text box.
- Daemon / cron / startup service.
- Auto deploy.
- Auto git mutation.
- Reading `~/.codex/auth.json`.
- Reading `.env` / `.env.local`.
- Saving token.

## Browser Fallback Requirement

The browser-only local launcher fallback must remain the official fallback.

The Tauri prototype may wrap a validated local app URL, but it must not replace the browser launcher, remove launcher scripts, or make desktop packaging the only supported local entry point.

## Tauri Prototype Boundary

Phase 7D may validate whether a minimal Tauri shell can safely display the local Codex Visual Office app on macOS.

The prototype must not:

- Claim production release readiness.
- Add production distribution requirements.
- Add privileged runtime behavior.
- Execute arbitrary commands.
- Read secrets or token files.
- Start background services.
- Mutate git state automatically.
- Deploy anything.

## Acceptance Criteria

- A Phase 7D Tauri packaging prototype can be evaluated without removing or weakening the browser-only launcher fallback.
- Any Tauri configuration remains minimal and Mac-first.
- The local app URL wrapper only targets approved local URLs.
- Existing local launcher behavior remains compatible.
- Current UI remains functional with no redesign.
- Safety verification confirms forbidden integrations and secret reads were not introduced.
- Prototype documentation clearly states the boundary between prototype packaging and production desktop release.
- Phase 8 implementation has not started.

## Failure Criteria

Phase 7D fails scope if it introduces or requires any of the following:

- Production installer flow.
- Code signing or notarization.
- Auto update behavior.
- Electron.
- Cloud, auth, payment, team, GitHub, Vercel, Supabase, MCP, or ChatGPT App integration.
- Arbitrary shell execution, terminal emulator behavior, `node-pty`, or command input.
- Daemon, cron, startup service, or background service.
- Auto deploy or auto git mutation.
- Reading `~/.codex/auth.json`, `.env`, or `.env.local`.
- Saving tokens.
- Replacing the browser-only launcher as the official fallback.
- Redesigning the current UI.
- Starting Phase 8 implementation without GM approval.

## Next Recommended Stage Options

Subject to GM decision, the next stage may be one of:

- Phase 7E - Packaging Validation.
- Phase 8 - Codex Runtime Reliability.

Phase 8 implementation has not started.
