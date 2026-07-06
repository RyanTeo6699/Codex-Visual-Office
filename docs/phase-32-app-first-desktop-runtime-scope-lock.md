# Phase 32 - App-first Desktop Runtime Integration Scope Lock

## Phase Name

Phase 32 - App-first Desktop Runtime Integration

## Goal

Shift Codex Visual Office from a browser-localhost user flow to an App-first desktop runtime strategy where the desktop app owns runtime readiness and localhost is treated as an internal implementation or contributor fallback detail.

## Product Direction

The intended user path is:

```txt
Open Codex Visual Office App
-> App prepares or connects to the local runtime
-> App window displays Codex Visual Office
-> User does not manually open http://localhost:3000
```

`localhost`, port numbers, and browser launcher flows remain available only as internal implementation details, contributor fallback, or support diagnostics.

## Allowed

- App-first runtime strategy.
- Controlled local runtime helper.
- Tauri runtime strategy.
- Runtime health check strategy.
- Settings and Safety runtime status.
- Browser launcher fallback preservation.
- Runtime diagnostic documentation.
- Static verification.
- Roadmap and release status updates.

## Forbidden

- Production public release.
- Signed or notarized installer.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub API, Vercel, Supabase, OpenAI API, or other external API integration.
- Auth, payment, team workspace, MCP, or ChatGPT App.
- Arbitrary shell runner.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 33 implementation.

## Tauri Boundary

Tauri remains a conservative app shell:

- `core:default` capability only.
- No shell plugin.
- No updater plugin.
- No broad filesystem permission.
- No production bundle activation in this phase.
- No app-managed arbitrary commands.

## Runtime Boundary

Phase 32 introduces status and strategy helpers only. It does not implement a bundled production server, background daemon, process supervisor, installer, auto updater, or runtime recovery service.

## Acceptance Criteria

- App runtime status helper exists.
- Settings shows App-first runtime direction.
- Safety shows App-first runtime boundary.
- Browser launcher fallback remains available.
- Tauri config remains narrow.
- Verification confirms no forbidden runtime expansion.
- Docs state localhost is not the final end-user entry path.

## Failure Criteria

- User-facing flow still presents manual localhost as the intended primary route.
- Tauri capabilities are broadened.
- Shell/updater/fs plugin is added.
- Electron or auto updater is added.
- Any arbitrary command, terminal, token, cloud, auth, payment, team, MCP, or external API surface is added.

## Phase 33 Status

Phase 33 has not started.
