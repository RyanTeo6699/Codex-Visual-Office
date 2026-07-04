# Codex Visual Office Developer Manual

## Release Candidate Posture

Codex Visual Office is a local-first visual office for ChatGPT and Codex workflows. The current release candidate includes local SQLite persistence, bounded Codex runner surfaces, Git observation summaries, Quality Gates, Review Room workflows, Settings, Backup/Restore, Archive, Safety Audit, browser launcher support, and a Tauri desktop beta prototype.

This manual is for maintaining the existing local-first product safely. It does not approve cloud sync, account systems, external integrations, or automatic agent behavior.

## Project Structure

- `app/` contains Next.js App Router routes and server actions.
- `components/` contains grouped UI components for the office, tasks, review surfaces, settings, archive, safety, layout, and shared UI primitives.
- `lib/` contains typed local domain modules, mock data, SQLite access, Codex runner policy, Git observation helpers, Quality Gate helpers, backup/restore services, archive summaries, launcher status, desktop beta status, safety summaries, and workflow summaries.
- `scripts/` contains bounded verification scripts and local operational scripts.
- `docs/` contains phase records, scope locks, operational manuals, and release candidate documentation.
- `.local/` is the ignored local data directory for SQLite data and backups.
- `src-tauri/` contains the Tauri prototype shell configuration.

Do not treat approved project paths as permission to crawl source trees. Approved paths identify user-approved workspace locations for local records and scoped operations only.

## Routes

- `/` is Office Home. It shows projects, agent seats, workflow status, build state, event signals, runtime status, and virtual office context.
- `/projects/[id]` is Project Room. It focuses on a selected project, task flow, build checks, workflow summaries, and project workspace state.
- `/review/[taskId]` is Review Room. It shows review readiness, diff summaries, changed files, Git snapshots, runner safety, Quality Gates, scope guard state, and review decision controls.
- `/settings` is Settings. It shows local settings, approved paths, backup/restore, archive retention, Codex runtime reliability, and local app shell status.
- `/archive` is Archive Room. It shows retained local history summaries and dry-run retention posture.
- `/safety` is Safety Audit Room. It summarizes permission boundaries, sensitive path guards, runner safety, backup safety, archive safety, launcher/Tauri safety, and forbidden capabilities.

## Component Groups

- `components/layout/` defines `AppShell`, `Sidebar`, and `TopBar`.
- `components/office/` defines office map, project room cards, agent seats, build wall, event ticker, runtime status, approved path status, Quality Gate config status, and workflow summaries.
- `components/tasks/` defines task board, task cards, and task status badges.
- `components/review/` defines review panels, diff summaries, changed files, Git snapshots, Codex prompt handoff, runner safety, scoped runner status, scope guard, Quality Gate results, readiness summaries, and review decisions.
- `components/settings/` defines Settings panels for approved paths, backup/restore, archive retention, runtime reliability, and local app shell.
- `components/archive/` defines archive summary, recent records, dry-run cleanup preview, and retention policy cards.
- `components/safety/` defines the Safety Audit panel.
- `components/ui/` contains reusable visual primitives.

Keep component additions within these groups unless a new product area has explicit approval.

## Library Modules

- `lib/types.ts` is the shared type contract.
- `lib/status.ts` contains status helpers.
- `lib/mock-data.ts` remains useful for visual defaults and seeded demo data.
- `lib/local-db/` owns local SQLite paths, schema, initialization, selected reads, and database access.
- `lib/local-backup/` owns local database backup, verification, dry-run restore, confirmed restore, backup path checks, and backup safety.
- `lib/codex-cli/` owns Codex CLI detection, prompt handoff, runner policy, runner safety, scoped runner types, runtime status, and failure classification.
- `lib/git-observation/` owns bounded Git snapshot, changed file, diff summary, and scope check records.
- `lib/quality-gates/` owns Quality Gate config, runner types, bounded runner behavior, and summary helpers.
- `lib/review/` owns Review Room readiness logic.
- `lib/workflow/` owns lifecycle, prompt version, run history, timeline, and next-action summaries.
- `lib/archive/` owns archive and retention summaries.
- `lib/safety/` owns local permission, sensitive path, runner, backup, launcher, and overall safety summaries.
- `lib/local-launcher/`, `lib/local-shell/`, and `lib/desktop/` own local launcher, local shell status, and desktop beta status surfaces.

## SQLite DB

The app-owned SQLite database lives at:

```txt
.local/codex-visual-office.sqlite
```

The DB is local-only and ignored by Git. It stores app records such as projects, tasks, seats, events, review records, approved paths, Git observation records, Quality Gate records, backup records, archive/retention records, and workflow status.

Use the existing DB modules and verification scripts instead of editing the database manually. Never edit the DB directly unless a current backup exists and the recovery path is understood.

Core commands:

```bash
npm run db:init
npm run db:seed
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
```

## Codex Runner Safety

The Codex runner surfaces are scoped and safety-gated. They must preserve these boundaries:

- No arbitrary shell command box.
- No terminal emulator.
- No `node-pty`.
- No automatic Codex execution.
- No automatic retries, continuation, approvals, commits, pushes, deployments, or tests.
- No source discovery from approved project paths.
- No credential reads.
- No `~/.codex/auth.json` reads.
- Explicit user confirmation is required for scoped runner behavior.
- Approved project path is required before scoped runner behavior.
- Prompt preview and forbidden scope acknowledgement are required.

Codex CLI status can be detected without reading private auth files. Auth readiness must remain unknown unless represented by safe local records or user-visible CLI behavior that does not expose credentials.

## Git Observation

Git observation records summarize bounded state for review and scope guard surfaces. They are not a GitHub integration and are not a background watcher.

Allowed concepts:

- Git snapshot records.
- Changed file summaries.
- Diff summary records.
- Scope check results.
- Review evidence display.

Forbidden expansions:

- GitHub API, OAuth, App integration, or cloud sync.
- Background Git watcher.
- Automatic commits, pushes, rebases, merges, or deploys.
- Reading `.git` internals beyond approved bounded helpers.
- Treating Git observation as permission to inspect arbitrary source.

Verification commands:

```bash
npm run git:verify:snapshots
npm run git:verify:changed-files
npm run git:verify:diff-summary
npm run git:verify:scope-check
```

## Quality Gates

Quality Gates are local, bounded, and allowlisted. They summarize whether configured checks passed, failed, were skipped, or were blocked. They must not become arbitrary command execution.

Allowed command keys include the existing allowlist in `lib/local-db/schema.ts` and Quality Gate modules, such as `npm_typecheck`, `npm_build`, `npm_lint`, `npm_test`, `npm_run_test`, and `git_diff_check`.

Verification commands:

```bash
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
npm run review:verify:readiness
```

## Review Room

Review Room is the human inspection and decision surface for a task.

It may show:

- Review readiness.
- Review evidence.
- Diff summaries.
- Changed file summaries.
- Git snapshot summaries.
- Scope guard state.
- Codex runner safety state.
- Scoped runner status.
- Quality Gate results.
- Review decisions.

Review decisions may update local records. They must not automatically run Codex, Git, Quality Gates, package scripts, deployment, or external integrations.

## Settings, Backup, Archive, And Safety

Settings is the local control surface for approved paths, backup/restore, archive retention, runtime reliability, and local launcher status.

Backup/Restore only covers the app-owned SQLite database. It does not back up source code, project folders, credentials, tokens, `.env` files, cloud state, or user home directories.

Archive surfaces summarize retained local records and dry-run retention posture. They must not perform destructive purge behavior unless a future GM-approved phase explicitly adds and verifies it.

Safety Audit surfaces summarize permission boundaries. They must not add a file browser, source viewer, folder picker, credential checker, terminal, arbitrary repair command, destructive cleanup, or cloud sync.

Verification commands:

```bash
npm run settings:verify
npm run settings:verify:project-paths
npm run backup:verify
npm run archive:verify
npm run safety:verify:permissions
```

## Local Launcher

The local launcher is a browser-first local app helper. It may open the local app URL when the app is running and report launcher readiness.

Commands:

```bash
npm run local:launcher
npm run local:launcher:open
npm run local:launcher:verify
npm run local:shell:status
npm run local:shell:verify
```

The launcher must not install dependencies, start production packaging, execute Codex, run Git, run Quality Gates automatically, read credentials, or sync data.

## Tauri Prototype And Desktop Beta

The Tauri shell is a Mac-first prototype/desktop beta candidate, not a production distribution path.

Current boundaries:

- Browser launcher fallback remains supported.
- Bundle output is inactive.
- No signing or notarization.
- No production installer.
- No auto updater.
- No Electron path.
- No cloud account requirement.
- No broad filesystem permission.
- No shell plugin.

Commands:

```bash
npm run tauri:verify:prototype
npm run desktop:verify:beta
npm run desktop:check:beta
npm run tauri:dev:prototype
```

Only use `tauri:dev:prototype` for local prototype testing after the Next.js app is available at the expected local URL.

## Verification Matrix

Minimum release candidate documentation hardening verification:

```bash
npm run typecheck
npm run build
git diff --check
```

Broader local-first verification:

```bash
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
npm run codex:verify:cli
npm run codex:verify:prompt-handoff
npm run codex:verify:runner-safety
npm run codex:verify:scoped-runner
npm run codex:verify:runner-output
npm run codex:verify:runtime-reliability
npm run git:verify:snapshots
npm run git:verify:changed-files
npm run git:verify:diff-summary
npm run git:verify:scope-check
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
npm run review:verify:readiness
npm run settings:verify
npm run settings:verify:project-paths
npm run project:verify:workspace
npm run backup:verify
npm run archive:verify
npm run local:launcher:verify
npm run local:shell:verify
npm run tauri:verify:prototype
npm run desktop:verify:beta
npm run agent:verify:workflow
npm run safety:verify:permissions
npm run ui:verify:virtual-office
```

Run the focused subset for the area touched. For release candidate signoff, use the full matrix when time permits.

## Subagent-Driven Workflow

When multiple contributors or subagents are active:

- Assume the worktree may contain unrelated edits.
- Inspect current files before changing them.
- Keep changes scoped to the assigned phase and file list.
- Do not revert edits you did not make.
- Prefer documentation, tests, and verification over broad refactors.
- Use bounded tasks with clear outputs.
- Record safety boundaries in docs when introducing a future implementation plan.
- Re-run the relevant verification commands after changes.

For docs-only work, do not edit app code, package scripts, schemas, or operational scripts.

## Adding Future Phases Safely

Future phases must start with an explicit scope lock and GM approval when they touch dangerous capability classes.

Before implementing a future phase:

1. State the product goal.
2. List allowed files and forbidden files.
3. List allowed behavior and forbidden behavior.
4. Identify data boundaries.
5. Identify verification commands.
6. Confirm whether schema changes are allowed.
7. Confirm whether runner, Git, Quality Gate, launcher, Tauri, backup, or archive behavior changes are allowed.
8. Document rollback and recovery expectations.

If a requested change needs a forbidden capability, stop and ask for GM approval.

## Forbidden Implementation Classes

Do not add these without explicit future GM approval:

- OpenAI API integration.
- Codex App integration.
- ChatGPT App integration.
- MCP server or MCP integration.
- GitHub App, OAuth, API, webhook, or cloud sync.
- Vercel, Supabase, Firebase, or any cloud database.
- Auth, login, registration, team permissions, billing, or payment.
- Backend service expansion beyond the local Next.js app.
- Arbitrary shell execution.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Automatic deployment.
- Background Git watcher or full disk scanner.
- Project source crawling or package script discovery from approved paths.
- Reading `~/.codex/auth.json`.
- Reading `.env`, `.env.local`, token files, SSH keys, API keys, OAuth credentials, or cloud credentials.
- Token storage or credential validation.
- Cloud backup, cloud restore, cloud sync, or account recovery.
- Production Tauri packaging, signing, notarization, installer distribution, or auto updater.
- Electron implementation.
- Destructive archive purge or backup deletion.
