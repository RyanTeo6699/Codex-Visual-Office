# Phase 13 - Desktop Beta / Distribution Candidate Scope Lock

## Status

Phase 13 is Desktop Beta / Distribution Candidate.

It is Mac-first and local-first. It is not a production release.

The goal is to harden the existing desktop beta candidate shape enough for local verification, Settings/Safety visibility, and documentation, while preserving the current product behavior and local data boundaries.

## Allowed

- Desktop beta candidate status.
- Tauri beta configuration review.
- App metadata hardening.
- Desktop beta verification.
- Cold start readiness documentation.
- Local data preservation boundaries.
- Browser launcher fallback documentation.
- Documentation and verification updates.

## Forbidden

- Production release.
- Code signing.
- Notarization.
- Auto updater.
- Production installer distribution.
- Electron.
- Cloud sync.
- GitHub integration.
- Vercel integration.
- Supabase integration.
- Auth.
- Payment.
- Team workspace or team permissions.
- MCP.
- ChatGPT App.
- OpenAI API integration.
- Arbitrary shell execution.
- Command text box.
- Terminal UI.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Reading tokens.
- Phase 14 implementation.

## Desktop Beta Boundary

Phase 13 may describe and verify the desktop beta candidate posture, but it must not turn the app into a signed, notarized, auto-updating, production-distributed desktop app.

The browser launcher remains the fallback path. The Tauri prototype remains a desktop shell candidate, not a production distribution channel.

## Data Boundary

Local data must be preserved by default. Phase 13 documentation must not instruct users or agents to delete backups, remove local app data, clear databases, erase archives, or run destructive cleanup as part of beta verification.

Any cold start or verification note must distinguish between app startup readiness and data-reset behavior. Reset behavior is out of scope unless explicitly approved in a later phase.

## Verification Boundary

Phase 13 verification may run static desktop beta checks and safe local commands that already exist.

It must not add or trigger automatic Codex, Git, terminal, shell, quality gate, package detection, deployment, cloud, or account behavior.

## Next Phase Gate

Phase 14 is not started by this document.

Recommended next phase: Phase 14 - Release Candidate QA / Documentation Hardening, only after GM approval.
