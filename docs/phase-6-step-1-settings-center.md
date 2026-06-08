# Phase 6 Step 1 - Settings Center

## What Was Implemented

Phase 6 Step 1 adds the foundation for a local-only Settings Center.

Implemented:

- `local_settings` SQLite table.
- local settings repository.
- local settings operations.
- default local settings seed.
- `/settings` page.
- Settings navigation entry.
- Settings Center read-only status cards.
- `settings:verify` verification script.

This step does not implement Project Import, Backup / Restore, Log Retention cleanup, Archive Room, Tauri, Electron, desktop packaging, or cloud sync.

## local_settings Data Model

Table:

```txt
local_settings
- key
- value_json
- category
- description
- updated_at
```

Purpose:

- Store local product settings.
- Store display-only local status flags.
- Store low-risk local preferences.

Sensitive values are rejected by local settings operations.

Forbidden values include obvious token, auth, env, and credential markers:

- `OPENAI_API_KEY`
- `API_KEY`
- `TOKEN`
- `SECRET`
- `PASSWORD`
- `~/.codex`
- `auth.json`
- `.env`
- `.env.local`

## Settings Center Page

Route:

```txt
/settings
```

The page shows:

- Settings Center title.
- Local-first status.
- Codex CLI status.
- Local DB status.
- GitHub remote status.
- Quality Gate Defaults.
- Approved Project Paths planned state.
- Backup / Restore planned state.
- Desktop Packaging future evaluation.
- Safety boundary.

The page is read-only in this step.

## Default Settings

Default `local_settings` records:

```txt
app.localMode
app.themePreference
codex.runtimeStatusDisplay
localDb.pathDisplay
quality.defaultEnabledGateKeys
projectPaths.statusDisplay
backup.statusDisplay
desktopPackaging.statusDisplay
```

Default quality gate keys:

```txt
npm_typecheck
npm_build
git_diff_check
```

## Codex CLI Status Boundary

The Settings Center uses the existing safe Codex CLI detection helper.

Displayed:

- installed
- version
- path
- coarse auth status
- detection mode

Not performed:

- no token read
- no `~/.codex/auth.json` read
- no Codex task execution
- no arbitrary command execution

## Local DB Status Boundary

The Settings Center displays the local SQLite path:

```txt
.local/codex-visual-office.sqlite
```

The page does not:

- backup the database.
- restore the database.
- upload the database.
- sync the database remotely.

## What Has Not Been Implemented

Not implemented in Step 1:

- Project Import Flow.
- Select Folder / folder picker.
- Approved project path editing.
- Backup / Restore.
- Backup Now / Restore buttons.
- Log Retention cleanup.
- Archive Room.
- Tauri.
- Electron.
- Desktop packaging.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth.
- Payment.
- MCP server.
- OpenAI API.
- New command execution capability.
- Arbitrary shell.
- Command text box.
- Terminal emulator.
- `node-pty`.

## Explicit Phase Boundaries

Project Import has not started.

Backup / Restore has not started.

Tauri / Electron have not started.

Cloud sync has not started.

Phase 6 Step 2 has not started.

## Verification Commands and Results

Targeted verification:

```bash
npm run typecheck
npm run settings:verify
```

Result: passed.

`settings:verify` summary:

- default settings seeded: 8
- app category count: 2
- upsert verified
- read verified
- list verified
- update verified
- sensitive settings rejected
- command execution attempted: false
- backup / restore attempted: false
- project import attempted: false
- cloud sync attempted: false
- token stored: false

Full verification for this step:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
npm run codex:verify:cli
npm run codex:verify:prompt-handoff
npm run codex:verify:runner-safety
npm run codex:verify:scoped-runner
npm run codex:verify:runner-output
npm run git:verify:snapshots
npm run git:verify:changed-files
npm run git:verify:diff-summary
npm run git:verify:scope-check
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
npm run review:verify:readiness
npm run settings:verify
git diff --check
```

Final result: passed.

## Next Recommended Step

Phase 6 Step 2 - Project Import Flow.
