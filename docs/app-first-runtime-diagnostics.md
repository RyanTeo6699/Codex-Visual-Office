# App-first Runtime Diagnostics

## Runtime Model

Codex Visual Office is moving to an App-first local desktop runtime model.

The desired user flow is:

```txt
Open the desktop app
-> app owns runtime readiness
-> Codex Visual Office appears in the app window
```

The browser/local launcher path remains available for contributors and support fallback, but it is not the final end-user path.

## Dev Mode

Dev mode may still use:

```txt
npm run dev
http://localhost:3000
```

This is a contributor workflow only. It is useful for development, debugging, and local verification.

## App Mode

App mode is the target direction:

- Tauri provides the desktop window.
- The app owns runtime readiness.
- Localhost is internal detail, not something the user should manually open.
- The current phase records strategy/status and does not yet supervise a bundled runtime process.

## Fallback Mode

Fallback mode keeps the existing browser launcher available for support:

- `local:launcher`
- `local:launcher:open`
- browser-local app URL validation

Fallback mode must remain fixed, controlled, and local-only.

## Runtime Unreachable Diagnostics

If the app runtime is unavailable in a future phase, the app-first failure screen should explain:

- the app runtime is not ready
- the internal local URL is unreachable
- the port may be unavailable
- contributor fallback can use the browser launcher
- no cloud sync, auto updater, or external service is required

## What Is Not Implemented Yet

- No bundled production runtime supervisor.
- No daemon.
- No auto updater.
- No signed installer.
- No notarization.
- No Electron runtime.
- No cloud sync.
- No automatic Codex/Git/Quality Gate execution.
- No arbitrary shell or terminal UI.

## Current Diagnostic Posture

Phase 32 is status and strategy only. Live runtime health probing and a dedicated failure screen are recommended for Phase 33.
