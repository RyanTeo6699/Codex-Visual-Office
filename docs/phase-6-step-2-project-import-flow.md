# Phase 6 Step 2 - Project Import Flow

## What Was Implemented

Phase 6 Step 2 adds the minimum local Project Import Flow for Codex Visual Office.

Implemented:

- `approved_project_paths` local SQLite table.
- Approved project path repository and operation helpers.
- Manual approved path form in Settings Center.
- Project Room local path approval status.
- Review Room / Scoped Runner approved path status.
- Verification script: `npm run settings:verify:project-paths`.

This step stores user-approved local path strings only. It does not inspect, scan, or execute anything from those paths.

## Data Model

Table: `approved_project_paths`

- `id`
- `project_id`
- `local_path`
- `label`
- `approved`
- `approval_source`
- `approved_at`
- `created_at`
- `updated_at`
- `note`

`approval_source` is currently limited to `manual`.

## Settings Center UI Changes

`/settings` now includes an Approved Project Paths section with:

- current approved path records
- project name
- local path string
- approval state
- label
- approved timestamp
- note
- manual add form

The form supports:

- project select
- absolute local path text input
- label
- note
- approved checkbox

The form writes only to `approved_project_paths`.

## Project Room UI Changes

`/projects/[id]` now shows a Local Project Path status card:

- approved path exists / not configured
- local path
- approval state
- approved timestamp
- note
- link to `/settings`

Project Room does not include a full import form.

## Runner Approved Path Behavior

`/review/[taskId]` now prefers the primary approved path from `approved_project_paths`.

If an approved path exists:

- Scoped Runner shows the approved path.
- Path source is shown as `approved_project_paths`.

If no approved path exists:

- Scoped Runner shows `Missing approved path`.
- Run remains blocked by the existing runner validation.
- No fallback path is silently used.

## Path Input Safety Boundary

Path validation is string-level only:

- path must be non-empty
- path must be absolute and start with `/`
- obvious sensitive path strings are rejected:
  - `~/.codex/auth.json`
  - `.env`
  - `.env.local`
  - private key filenames

This step does not:

- open the path
- read files
- validate repository contents
- inspect `package.json`
- execute Git
- execute Codex
- execute Quality Gates

## What Has Not Been Implemented

Not implemented in this step:

- folder picker
- full disk scan
- automatic project discovery
- reading project file contents
- `package.json` analysis
- automatic Codex execution
- automatic Git execution
- automatic Quality Gate execution
- Backup / Restore
- Log Retention cleanup
- Archive Room
- Tauri
- Electron
- desktop packaging
- cloud sync
- GitHub API
- Vercel
- Supabase
- auth
- payment
- MCP server
- OpenAI API

## Verification

Required verification command:

```bash
npm run settings:verify:project-paths
```

Expected behavior:

- initializes local DB
- seeds mock data
- upserts an approved path for `provider-workspace`
- verifies list / get / primary path reads
- verifies approved true / false updates
- verifies removing a path deletes only the DB record
- verifies sensitive path strings are rejected
- confirms no path content read, no Codex execution, no Git execution, and no Quality Gate execution

Full phase verification also includes the existing typecheck, build, DB, Codex, Git observation, quality, review readiness, and settings verification commands.

## Next Recommended Step

Phase 6 Step 3 - Backup / Restore.

Phase 6 Step 3 has not started.
