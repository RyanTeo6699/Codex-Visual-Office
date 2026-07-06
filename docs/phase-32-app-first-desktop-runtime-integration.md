# Phase 32 - App-first Desktop Runtime Integration

## What This Phase Implemented

Phase 32 turns the desktop direction from browser-localhost-first into App-first local runtime strategy.

Implemented:

- App runtime status helpers in `lib/app-runtime`.
- App-first runtime status card in Settings.
- App-first runtime safety row in Safety.
- Top bar status wording aligned to App-first local runtime.
- Static verifier: `app:verify:runtime`.
- App-first runtime diagnostics doc.
- Phase 32 scope lock.
- Roadmap and release status updates.

## App-first Direction Summary

The target user flow is now:

```txt
Open Codex Visual Office App
-> app owns runtime readiness
-> app window displays Codex Visual Office
```

Manual `localhost:3000` opening is no longer the intended end-user path. It remains a contributor/support fallback.

## Runtime Helper Summary

New helper files:

- `lib/app-runtime/app-runtime-types.ts`
- `lib/app-runtime/app-runtime-config.ts`
- `lib/app-runtime/app-runtime-status.ts`
- `lib/app-runtime/app-runtime-health.ts`

The helper reports:

- `appFirstMode: true`
- `manualLocalhostRequiredForEndUser: false`
- browser fallback available
- production packaging not implemented
- signing not implemented
- notarization not implemented
- auto updater not implemented
- Electron not implemented
- cloud sync not implemented

## Tauri Strategy Summary

The Tauri prototype remains intentionally narrow:

- local internal dev URL only
- empty `beforeDevCommand`
- empty `beforeBuildCommand`
- bundle inactive
- `core:default` capability only
- no shell plugin
- no updater plugin
- no broad filesystem permission
- no Electron migration

## UI / Status Summary

Settings now shows:

- App-first desktop runtime direction.
- Manual localhost is not required for end users.
- Browser launcher fallback is available.
- Production signing, notarization, updater, Electron, and cloud sync are not implemented.

Safety now shows:

- App-first runtime safety.
- Runtime strategy.
- Health check mode.
- Browser fallback status.
- No production packaging / auto updater.

## Browser Fallback Summary

The existing browser launcher remains available as fallback/contributor mode. It is not the final user path.

## What Did Not Change

- No production release.
- No signed installer.
- No notarization.
- No auto updater.
- No Electron.
- No cloud sync.
- No external APIs.
- No auth/payment/team/MCP.
- No arbitrary shell.
- No command text box.
- No terminal emulator.
- No `node-pty`.
- No automatic Codex/Git/Quality Gate execution.

## Current Limitations

- App runtime process supervision is not implemented.
- App runtime failure screen is not implemented.
- Bundled production server is not implemented.
- The Tauri prototype remains conservative and not production packaged.

## Verification

Required Phase 32 verifier:

```bash
npm run app:verify:runtime
```

The verifier checks helper files, docs, Tauri config, capabilities, dependencies, package scripts, and active UI/runtime surfaces.

## Recommended Phase 33

Recommended next phase:

```txt
Phase 33 - App Runtime Health / Failure Screen
```

Alternative:

```txt
Phase 33 - Controlled Runtime Process Prototype
```

Phase 33 has not started.
