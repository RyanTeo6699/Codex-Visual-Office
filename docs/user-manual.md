# Codex Visual Office User Manual

## Product Model

Codex Visual Office is a local-first visual office for ChatGPT + Codex workflows.

It helps you see projects, Codex seats, agent work, review state, Quality Gates, backups, archive state, and safety boundaries from one local interface.

Local-first means the product is designed around app-owned local data and user-declared project paths. It is not a cloud workspace, team admin console, hosted dashboard, or external account hub.

## What The Product Does Not Do

Codex Visual Office does not:

- Sync data to the cloud.
- Require login, registration, team membership, billing, or payment.
- Connect to GitHub, Vercel, Supabase, MCP, ChatGPT Apps, or OpenAI APIs.
- Read `~/.codex/auth.json`, `.env`, `.env.local`, tokens, SSH keys, or cloud credentials.
- Scan approved project source trees automatically.
- Provide a terminal, arbitrary command box, or `node-pty` shell.
- Automatically run Codex, Git, Quality Gates, deploys, cleanup, archive deletion, or backup deletion.
- Ship as a signed, notarized, auto-updating production desktop app.

## Start The App

Install dependencies and prepare local data:

```bash
npm install
npm run db:init
npm run db:seed
npm run db:verify
```

Start the local web app:

```bash
npm run dev
```

Then open the local URL printed by Next.js, usually `http://localhost:3000`.

## Browser Launcher

The local browser launcher is the fallback path for day-to-day use.

Check launcher readiness:

```bash
npm run local:launcher:verify
```

Open the app through the launcher:

```bash
npm run local:launcher:open
```

The launcher is local-only. It should not add cloud sync, login, external integration, or production distribution behavior.

## Desktop Beta Candidate

The desktop beta candidate is a local desktop shell posture for evaluation.

It is not a production release. It is not signed, notarized, auto-updating, or production-distributed by Phase 14 documentation.

Check the beta posture:

```bash
npm run desktop:verify:beta
npm run tauri:verify:prototype
```

If the desktop shell is unavailable or inappropriate for your machine, use the browser launcher fallback.

## Office Home

Office Home is the top-level command center.

Use it to understand:

- Which projects exist.
- Which Codex seats are active.
- Which tasks are running, blocked, or waiting for review.
- Which checks have failed.
- Which recent events need attention.

Office Home is meant to feel like a visual office, not a generic admin dashboard.

## Project Room

Project Room focuses on one project.

Use it to inspect project-level state, active work, assigned seats, task boards, build/check status, and recent events.

Approved project paths shown in the product are manual records. They do not grant the app permission to crawl source files, read package manifests, inspect `.git`, or infer project type from disk.

## Review Room

Review Room is where task review happens.

Use it to inspect task context, diff summaries, Quality Gate summaries, and review controls. Review actions record local state only unless a later approved phase changes that boundary.

Review actions should be treated as local workflow decisions:

- Approve.
- Reject.
- Ask Revision.

They do not automatically run Git, Codex, deploys, tests, or shell commands.

## Settings

Settings surfaces local configuration and readiness state.

Common settings areas include:

- Approved paths.
- Local app shell status.
- Browser launcher status.
- Desktop beta candidate status.
- Codex runtime visibility.
- Backup directory posture.
- Safety and permission state.

Settings should make existing local state visible. It should not read secrets or scan source trees.

## Archive

Archive collects local historical workflow records and retention posture.

Archive behavior is safety-first. Dry-run archive checks are allowed for visibility. Destructive purge, backup deletion, source deletion, and cleanup automation are not part of this release candidate documentation scope.

Check archive posture:

```bash
npm run archive:verify
```

## Safety

Safety explains the product's permission and data boundaries.

Use Safety to understand:

- Local-only data posture.
- Approved path boundaries.
- Sensitive path restrictions.
- Runner safety.
- Quality Gate allowlist posture.
- Backup/restore safety.
- Archive dry-run posture.
- Launcher and Tauri prototype limits.
- Forbidden capabilities.

Run the safety verifier:

```bash
npm run safety:verify:permissions
```

## Approved Paths

Approved paths are manually registered workspace locations.

They are references for organization and workflow context. They are not permission to scan all files under that folder.

Approved path behavior must preserve these limits:

- No automatic source scanning.
- No automatic package detection.
- No `.git` internals reading.
- No credential file reading.
- No hidden project discovery.

Verify approved path setup:

```bash
npm run settings:verify:project-paths
npm run project:verify:workspace
```

## Codex Runtime

Codex runtime visibility is a local readiness and status concept.

The product may detect or summarize whether the local Codex CLI appears available, but it must not read Codex credentials or automatically start Codex work.

Check Codex runtime detection:

```bash
npm run codex:verify:cli
npm run codex:verify:runtime-reliability
```

Do not place tokens in the app. Do not ask the app to read `~/.codex/auth.json`.

## Agent Workflow

Agent Workflow organizes local task handoff and review state.

It can show work stages, agent seats, task state, handoff summaries, and review needs. It does not automatically run Codex, approve work, retry work, commit changes, push branches, or execute commands.

Verify workflow posture:

```bash
npm run agent:verify:workflow
```

## Quality Gates

Quality Gates show bounded check definitions and local result summaries.

They are not arbitrary command execution. They must stay within the existing allowlist and must not become a command textbox, terminal, or automatic execution engine.

Verify Quality Gate posture:

```bash
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
```

## Backup And Restore

Backup/Restore is local-first.

Use it to understand the backup directory posture and restore readiness. The product must not delete backups, run destructive cleanup, sync backups to cloud storage, or silently erase local state.

Verify backup/restore posture:

```bash
npm run backup:verify
```

## Dry-Run Archive

Archive dry-run behavior is for preview and safety.

A dry run may summarize what retention logic would consider, but it must not delete archives, backups, project files, source files, Git data, or app data.

## Release Candidate QA

For a local release candidate check, run:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run local:launcher:verify
npm run desktop:verify:beta
npm run safety:verify:permissions
```

Only run additional existing verifiers when they are relevant to the area you are checking.
