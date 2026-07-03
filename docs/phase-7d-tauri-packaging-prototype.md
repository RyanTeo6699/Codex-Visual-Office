# Phase 7D - Tauri Packaging Prototype Implementation

## What Was Implemented

Phase 7D added a prototype-only Tauri desktop shell configuration around the existing local Codex Visual Office app.

Implemented items:

- Minimal `src-tauri` prototype files.
- Tauri CLI dev dependency and prototype scripts.
- Local app URL wrapper targeting `http://localhost:3000`.
- Prototype safety verification script.
- Local launcher compatibility checks so the browser launcher remains available.
- Scope lock documentation for the Tauri packaging prototype boundary.

## Tauri Prototype Scope

The Tauri work is Mac-first and prototype-only.

It validates whether Codex Visual Office can be displayed inside a minimal desktop shell while preserving the local-first browser launcher model.

The prototype does not introduce privileged runtime behavior, arbitrary command execution, background services, cloud services, account systems, or production distribution behavior.

## Not A Production Desktop Release

This is not a production desktop release because it does not include production packaging, signing, notarization, updater behavior, installer validation, platform QA, release channels, crash reporting, or support policy.

The Tauri bundle config is intentionally inactive, and the package scripts do not define production installer, bundle, release, publish, signing, or notarization commands.

## Official Fallback

The browser-only launcher fallback remains the official fallback.

Reasoning:

- It is already compatible with the local-first app model.
- It avoids desktop distribution risk while packaging is still only a prototype.
- It does not require signing, notarization, installer UX, or updater policy.
- It keeps local launch behavior available even if the Tauri prototype is not used.

The Tauri prototype may wrap the local app URL, but it does not replace the browser launcher.

## Current Launch Modes And Scripts

Current scripts:

```bash
npm run dev
npm run local:shell:status
npm run local:shell:verify
npm run local:launcher
npm run local:launcher:open
npm run local:launcher:verify
npm run tauri:verify:prototype
npm run tauri:dev:prototype
```

Launch modes:

- Browser development mode: `npm run dev`.
- Browser launcher fallback: `npm run local:launcher` and `npm run local:launcher:open`.
- Local shell status / verification: `npm run local:shell:status` and `npm run local:shell:verify`.
- Tauri prototype verification: `npm run tauri:verify:prototype`.
- Tauri prototype dev shell: `npm run tauri:dev:prototype`, with the app served separately at `http://localhost:3000`.

## Verification Behavior

`npm run tauri:verify:prototype` checks the prototype boundary and confirms:

- Required Tauri files exist.
- Prototype-only marker is present.
- Tauri dev URL is local.
- Tauri pre-build commands are empty.
- Browser-only launcher scripts remain.
- Electron is absent.
- Auto updater config is absent.
- Production installer scripts are absent.
- Signing and notarization config are absent.
- Broad filesystem capability is absent.
- Shell plugin, arbitrary shell execution, and `node-pty` are absent.
- Daemon, cron, startup service, and background service config are absent.
- Cloud sync, GitHub, Vercel, Supabase, auth, payment, MCP, and OpenAI integration scripts/dependencies are absent.
- `~/.codex/auth.json`, `.env`, and `.env.local` reads are not introduced in the prototype files.

Observed closeout result:

```txt
npm run tauri:verify:prototype
Tauri prototype safety verification passed
tauriDevUrl: http://localhost:3000
capabilityPermissions: ["core:default"]
browser launcher fallback scripts: present
prohibitedExecutionAttempted: false
```

## Known Limitations

- The app must still be served locally for the prototype dev shell.
- The prototype is not a packaged desktop app.
- The prototype has not gone through installer, signing, notarization, update, or distribution validation.
- The prototype is Mac-first and does not validate Windows or Linux packaging behavior.
- The browser-only launcher remains the supported fallback path.
- No production release readiness is claimed.

## Not Implemented

- No production installer.
- No code signing.
- No notarization.
- No auto updater.
- No Electron.
- No cloud sync.
- No auth.
- No payment.
- No team workspace.
- No MCP.

## Verification Commands

Closeout verification commands:

```bash
npm run tauri:verify:prototype
npm run typecheck
git diff --check
git status --short --untracked-files=all
```

Current observed results:

- `npm run tauri:verify:prototype`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed.
- `git status --short --untracked-files=all`: run during closeout.

## Next Recommended Stage

Subject to GM decision, the next recommended stage is one of:

- Phase 7E - Packaging Validation.
- Phase 8 - Codex Runtime Reliability.

Phase 8 implementation has not started.
