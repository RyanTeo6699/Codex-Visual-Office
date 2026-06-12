# Phase 6 Step 5 - Local App Shell Planning

## What Was Implemented

Phase 6 Step 5 adds minimum Local App Shell planning and local-only runtime status visibility.

Implemented:

- Local App Shell status helper.
- Local App Shell planning constants.
- `npm run local:shell:status`.
- `npm run local:shell:verify`.
- Settings Center Local App Shell status card.
- Verification script: `scripts/verify-local-app-shell.ts`.

This step does not implement desktop packaging.

## Local App Shell Definition

Local App Shell means the current local-first runtime envelope for Codex Visual Office:

- local Next.js app
- local SQLite database
- Settings Center
- approved local project paths
- local Backup / Restore
- Archive Room
- Quality Gate configuration / runner status
- Codex CLI coarse detection via existing safe helper
- manual launch through npm scripts

It is not a packaged desktop app.

## Current Local Runtime

Current manual runtime:

```bash
npm run dev
```

Local status scripts:

```bash
npm run local:shell:status
npm run local:shell:verify
```

These scripts do not start a server, install dependencies, run Codex, run Git mutation, run Quality Gates, deploy, or sync cloud data.

## local:shell:status Behavior

`local:shell:status` prints a local productization summary:

- shell readiness
- local mode status
- local DB path
- Settings Center readiness
- approved project paths readiness
- Backup / Restore readiness
- Archive Room readiness
- Quality Gate readiness
- Codex CLI coarse status
- available local launch scripts
- desktop packaging status
- forbidden capability flags
- execution attempted flags

It only reads local metadata and local database summaries.

## local:shell:verify Behavior

`local:shell:verify` verifies:

- local mode enabled
- local DB path is reported
- Settings Center can be summarized
- approved project paths can be summarized
- backup records can be summarized
- archive / retention can be summarized
- desktop packaging remains `future_evaluation`
- no Tauri dependency
- no Electron dependency
- no auto updater dependency
- no daemon / cron / startup service
- no cloud sync
- no GitHub / Vercel / Supabase integration
- no auth / payment / MCP
- no Codex, Git, or Quality Gate execution

## Settings Center UI Changes

`/settings` now shows a Local App Shell card with:

- local runtime readiness
- local-first mode
- local DB status
- Settings Center readiness
- Approved Project Paths readiness
- Backup / Restore readiness
- Archive Room readiness
- Quality Gates readiness
- Codex CLI coarse status
- launch methods
- desktop packaging as future evaluation only
- explicit no auto update / no daemon / no cloud sync boundaries

## Tauri / Electron Future Evaluation

Future phases may evaluate:

- Tauri feasibility
- desktop package feasibility
- local launcher script
- app icon / dock behavior
- offline mode hardening

Not implemented in Phase 6 Step 5:

- Tauri dependency
- Electron dependency
- desktop packaging command
- installer
- auto updater
- system tray
- startup service

## Why Desktop Packaging Is Not Implemented

Desktop packaging changes install surface area, update strategy, filesystem permissions, notarization/signing, and operational support. This step only documents and displays the current local runtime readiness.

## Why Auto Updater Is Not Implemented

Auto update introduces remote distribution, trust boundaries, update signing, rollback behavior, and network behavior. This phase remains local-only.

## Why Daemon / Cron / Startup Service Is Not Implemented

Background services introduce persistent execution outside explicit user actions. Phase 6 Step 5 does not add daemons, cron jobs, or startup services.

## What Has Not Been Implemented

Not implemented:

- desktop packaging
- Tauri
- Electron
- auto updater
- system tray
- background daemon
- cron
- startup service
- installer
- dmg / pkg / exe build
- cloud sync
- GitHub API integration
- Vercel integration
- Supabase integration
- auth
- payment
- MCP server
- OpenAI API
- dangerous command runner

## Verification

Required commands:

```bash
npm run local:shell:status
npm run local:shell:verify
```

Full phase verification also includes typecheck, build, DB, Codex, Git observation, Quality Gate, Review Room, Settings, Project Paths, Backup, Archive, and whitespace checks.

## Next Recommended Step

Phase 6 Step 6 - Closeout.

Phase 6 Step 6 has not started.
