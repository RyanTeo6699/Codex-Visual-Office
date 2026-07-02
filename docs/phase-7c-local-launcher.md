# Phase 7C - Browser-only Local Launcher

## Implemented Behavior

Phase 7C adds a browser-only local launcher for Codex Visual Office.

The launcher reports local readiness using the existing Phase 6 `getLocalShellStatus()` helper and does not start or supervise the app.

Default app URL:

```txt
http://localhost:3000
```

The URL may be overridden with `CVO_LOCAL_APP_URL` only when it is one of:

```txt
http://localhost...
http://127.0.0.1...
http://[::1]...
```

Remote URLs and non-HTTP URLs are rejected.

## Scripts

```bash
npm run local:launcher
npm run local:launcher:open
npm run local:launcher:verify
```

`local:launcher` is status-only by default.

`local:launcher:open` opens only the validated local app URL through a fixed platform browser-open action with `shell:false`.

The launcher CLI accepts only:

```txt
--open
--check-url
--json
```

Unknown arguments are rejected.

## Reported Status

The launcher report includes:

- App URL.
- Local Shell readiness.
- Local DB path.
- Approved Project Path readiness and count.
- Codex CLI detected flag and status label.
- Quality Gate config readiness and count.
- Browser-open support.
- Optional app reachability when `--check-url` is passed.
- Launch mode: `status_only` or `open_browser`.
- Execution-attempted flags for Codex, Git, quality gates, dev server, package install, desktop runtime, and cloud sync.

## Safety Boundaries

Phase 7C does not add:

- Tauri.
- Electron.
- Desktop packaging scripts.
- Auto updater.
- System tray.
- Daemon, startup service, cron, or background service.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, or team workspace.
- MCP or ChatGPT App integration.
- OpenAI API.
- Arbitrary shell runner.
- Terminal emulator.
- `node-pty`.
- Command text box or custom command input.
- User-provided command execution.

The launcher never starts:

- Dev server.
- npm install.
- Codex.
- Git.
- Quality gates.
- Deployment.
- Desktop runtime.
- Background process.

## UI

The Settings Center Local App Shell card now shows the default Local Launcher URL and the local launcher scripts.

It does not add buttons that run commands from the UI.

## Verification Results

Placeholder for final run output:

```txt
npm run typecheck
npm run build
npm run local:launcher:verify
git diff --check
git status --short --untracked-files=all
```

## Not Implemented

Phase 7C is not a desktop shell and is not a packaging prototype.

It does not bundle the app, install the app, start services, or manage updates.

## Next Recommended Stage

Phase 7D - Packaging Prototype.

Phase 7D has not started.
