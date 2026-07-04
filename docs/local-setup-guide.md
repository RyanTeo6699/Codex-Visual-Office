# Local Setup Guide

## Prerequisites

Use a local development machine with:

- Node.js installed.
- npm installed.
- A terminal for running existing project scripts manually.
- Access to this repository on disk.

Codex Visual Office is local-first. Setup does not require GitHub, Vercel, Supabase, OpenAI API keys, cloud sync, auth, payment, or team accounts.

## Install Dependencies

From the project root:

```bash
npm install
```

Do not change dependencies as part of local setup unless a future approved phase explicitly requires it.

## Initialize, Seed, And Verify Local DB

Create local app data:

```bash
npm run db:init
```

Seed local data:

```bash
npm run db:seed
```

Verify local DB readiness:

```bash
npm run db:verify
```

Optional local operations checks:

```bash
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
```

These scripts verify app-owned local data behavior. They should not read secrets, scan arbitrary source trees, or connect to cloud services.

## Start The Dev Server

Run:

```bash
npm run dev
```

Open the local URL shown by Next.js, usually:

```txt
http://localhost:3000
```

## Browser Launcher Status And Open

Verify launcher readiness:

```bash
npm run local:launcher:verify
```

Show local shell status:

```bash
npm run local:shell:status
```

Open the app through the launcher:

```bash
npm run local:launcher:open
```

The browser launcher is a local fallback. It does not add cloud sync, account login, external integrations, or production desktop release behavior.

## Desktop Beta Candidate Check

For desktop beta candidate posture:

```bash
npm run desktop:verify:beta
npm run tauri:verify:prototype
```

The Tauri prototype remains a candidate shell. Phase 14 documentation does not approve signing, notarization, auto updater, Electron, installer release, or production desktop distribution.

## Codex CLI Detection Note

Codex CLI detection is status-only.

Run:

```bash
npm run codex:verify:cli
npm run codex:verify:runtime-reliability
```

Detection must not read `~/.codex/auth.json`, inspect tokens, validate credentials, or automatically start Codex work.

## Approved Path Setup

Approved paths are manually registered workspace references.

Verify approved path posture:

```bash
npm run settings:verify:project-paths
npm run project:verify:workspace
```

Approved paths must not be treated as permission to:

- Crawl source directories.
- Read package manifests.
- Read lockfiles.
- Read `.git` internals.
- Read `.env`, `.env.local`, or credential files.
- Infer project type automatically from disk.

## Backup Directory

Backup/restore is local-first and safety-first.

Verify backup posture:

```bash
npm run backup:verify
```

The backup directory must not be deleted during setup or QA. Do not run destructive cleanup, backup deletion, archive purge, or local data reset unless a future GM-approved phase explicitly allows it.

## Safety Audit

Run:

```bash
npm run safety:verify:permissions
```

Use the Safety area in the app to review local permission posture, approved path boundaries, runner safety, Quality Gate boundaries, backup/restore safety, archive dry-run posture, launcher status, desktop prototype limits, and forbidden capabilities.

## Optional Area Verifiers

Use existing verifiers when checking a specific area:

```bash
npm run settings:verify
npm run agent:verify:workflow
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
npm run archive:verify
npm run review:verify:readiness
npm run ui:verify:virtual-office
```

## Troubleshooting Links

- Product overview: `docs/PRD.md`
- Roadmap: `docs/ROADMAP.md`
- Current scope lock: `docs/phase-14-release-candidate-qa-docs-scope-lock.md`
- User manual: `docs/user-manual.md`
- Safety and data boundaries: `docs/safety-data-boundaries.md`
- Desktop beta candidate notes: `docs/phase-13-desktop-beta-distribution-candidate.md`
- Desktop beta scope lock: `docs/phase-13-desktop-beta-distribution-candidate-scope-lock.md`
- Safety hardening notes: `docs/phase-12-safety-permission-hardening.md`
- Safety scope lock: `docs/phase-12-safety-permission-hardening-scope-lock.md`

## Common Issues

If `npm install` fails, confirm Node.js and npm are installed and retry from the project root.

If `npm run dev` cannot bind to the default port, use the alternate local URL printed by Next.js.

If DB verification fails, rerun `npm run db:init`, `npm run db:seed`, and `npm run db:verify`.

If launcher verification fails, use `npm run dev` and open the localhost URL manually.

If Codex CLI detection fails, treat it as a status issue. Do not paste tokens into the app or ask the app to read credential files.

If desktop beta checks fail, use the browser launcher fallback. Do not attempt signing, notarization, auto updater setup, Electron migration, or production packaging as a troubleshooting step in Phase 14.
