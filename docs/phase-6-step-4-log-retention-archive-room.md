# Phase 6 Step 4 - Log Retention / Archive Room

## What Was Implemented

Phase 6 Step 4 adds a minimum local-only Archive Room and dry-run retention policy system.

Implemented:

- `retention_policies` local SQLite table.
- Retention policy repository and operation helpers.
- Default dry-run-only retention policies.
- Archive Summary helper.
- Cleanup Dry Run Preview helper.
- `/archive` Archive Room page.
- Settings Center Archive / Retention entry.
- Sidebar and TopBar Archive navigation links.
- Verification script: `npm run archive:verify`.

## Data Model

Table: `retention_policies`

- `id`
- `target`
- `retention_days`
- `enabled`
- `mode`
- `description`
- `created_at`
- `updated_at`

Targets:

- `task_events`
- `runner_outputs`
- `quality_gate_events`
- `quality_gate_runs`
- `git_snapshots`
- `file_changes`
- `diff_summaries`
- `scope_checks`
- `review_records`
- `backup_records`

Mode:

- `dry_run_only`

Phase 6 Step 4 does not support destructive cleanup modes.

## Archive Room Page

Route:

```txt
/archive
```

The Archive Room shows:

- local-only archive notice
- Archive Summary
- Retention Policies
- Cleanup Dry Run Preview
- Task Activity History
- Review Decisions
- Quality Gate Runs / Events
- Runner Output Preview Records
- Git Snapshot History
- Changed Files History
- Diff Summary History
- Scope Check History
- Backup Records

Recent records are intentionally capped for visibility and page weight.

## Archive Summary

Archive Summary counts:

- task events
- review records
- runner output preview records
- quality gate runs
- quality gate events
- git snapshots
- changed files
- diff summaries
- scope checks
- backup records

It also reports:

- latest activity time
- latest backup time
- active retention policies

## Cleanup Dry Run Preview

Cleanup Dry Run Preview:

- reads `retention_policies`
- computes candidate records older than each enabled policy's `retention_days`
- returns `wouldDeleteCount`
- returns a small `candidatesPreview`
- always returns `mode: dry_run_only`

It does not:

- delete data
- delete backup files
- modify task events
- modify runner outputs
- modify quality gate records
- modify review records
- modify backup records
- remove `.local/backups/`
- remove `.local/codex-visual-office.sqlite`

## Settings Center Changes

`/settings` now includes an Archive / Retention card with:

- Archive Room link
- enabled / configured retention policy count
- dry-run-only status
- explicit no-deletion explanation

No cleanup controls are added.

## What Has Not Been Implemented

Not implemented in this step:

- real deletion
- destructive cleanup
- auto cleanup
- scheduled cleanup
- background daemon
- cron
- backup file deletion
- archive export
- archive upload
- cloud archive
- cloud sync
- GitHub API
- Vercel
- Supabase
- auth
- payment
- MCP server
- OpenAI API
- Tauri
- Electron
- desktop packaging

## Verification

Required verification command:

```bash
npm run archive:verify
```

Verified:

- `retention_policies` table exists
- default policies exist
- list / get / upsert / enable / disable work
- Archive Summary is generated
- Cleanup Dry Run Preview is generated
- dry-run does not delete task events
- dry-run does not delete quality gate runs or events
- dry-run does not delete backup records
- dry-run does not delete backup files
- no Git, Codex, or Quality Gate execution is triggered
- no `~/.codex/auth.json`, `.env`, or `.env.local` read is attempted
- no cloud upload is attempted

Full phase verification also includes typecheck, build, DB, Codex, Git observation, Quality Gate, Review Room, Settings, Project Paths, Backup, and whitespace checks.

## Next Recommended Step

Phase 6 Step 5 - Local App Shell Planning.

Phase 6 Step 5 has not started.
