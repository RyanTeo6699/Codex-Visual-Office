# Phase 6 Step 3 - Backup / Restore

## What Was Implemented

Phase 6 Step 3 adds minimum local Backup / Restore support for the Codex Visual Office SQLite database.

Implemented:

- `backup_records` local SQLite table.
- Backup record repository and operation helpers.
- Local backup service for `.local/codex-visual-office.sqlite`.
- Backup verification and restore dry-run.
- Confirmed restore with mandatory pre-restore safety backup.
- Settings Center Backup / Restore panel.
- Verification script: `npm run backup:verify`.

This step only backs up the Codex Visual Office local SQLite database. It does not back up source code, user folders, credentials, tokens, env files, or cloud data.

## Data Model

Table: `backup_records`

- `id`
- `backup_path`
- `backup_kind`: `manual` or `pre_restore_safety`
- `source_db_path`
- `file_size_bytes`
- `checksum_sha256`
- `status`: `created`, `verified`, `failed`, `restored`, or `dry_run_passed`
- `note`
- `created_at`
- `restored_at`

## Backup Path

Source database:

```txt
.local/codex-visual-office.sqlite
```

Backup directory:

```txt
.local/backups/
```

Backup filename pattern:

```txt
codex-visual-office-YYYYMMDD-HHMMSSZ-xxxxxx.sqlite
```

`.gitignore` already excludes `.local/`, `*.sqlite`, `*.sqlite-shm`, and `*.sqlite-wal`, so generated backups are not committed.

## Backup Now Behavior

Backup Now:

- initializes the local DB if needed
- creates `.local/backups/` if missing
- creates a local SQLite backup file
- computes SHA256 checksum
- records file size
- writes a `backup_records` row

Backup Now does not:

- back up project source
- back up the whole repository
- back up the user home directory
- read `~/.codex/auth.json`
- read `.env` or `.env.local`
- upload anything remotely
- run Git, Codex, or Quality Gates

## Restore Dry-Run Behavior

Dry Run Restore:

- accepts only a `backupRecordId`
- looks up the registered backup record
- verifies backup path is under `.local/backups/`
- verifies the file exists and is non-empty
- verifies SHA256 checksum matches the record
- checks the target DB path
- marks the backup record `dry_run_passed`

Dry-run does not overwrite or restore the current DB.

## Confirm Restore Behavior

Confirm Restore:

- requires `confirmRestore === true`
- requires the selected backup record to have passed dry-run
- creates a `pre_restore_safety` backup first
- restores application tables from the registered backup
- marks the selected backup record `restored`

Restore does not accept arbitrary user paths. It only restores from `backup_records.backup_path`.

`backup_records` itself is retained as audit/control metadata during restore.

## Pre-Restore Safety Backup

Before restore, the service always creates a safety backup with:

```txt
backup_kind = pre_restore_safety
```

If restore fails, the safety backup remains available and the service does not delete the current DB file.

## Settings Center UI Changes

`/settings` now shows:

- current local DB path
- backup directory
- Backup Now button
- backup records list
- backup creation time
- file size
- checksum short prefix
- status
- note
- Dry Run Restore button
- Confirm Restore button

Confirm Restore is disabled unless the backup record status is `dry_run_passed`.

## What Has Not Been Implemented

Not implemented in this step:

- cloud sync
- remote backup
- scheduled backup
- source code backup
- whole-repository backup
- user home directory backup
- token or env backup
- arbitrary restore path
- file upload
- Log Retention cleanup
- Archive Room
- Tauri
- Electron
- desktop packaging
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
npm run backup:verify
```

Verified:

- manual backup file exists
- backup size is greater than zero
- checksum is recorded
- `backup_records` row exists
- dry-run passes without restoring current DB
- confirm restore creates a pre-restore safety backup
- restored DB remains readable
- no project source backup
- no `~/.codex/auth.json` backup
- no `.env` or `.env.local` backup
- no cloud upload
- no Git, Codex, or Quality Gate execution

Full phase verification also includes typecheck, build, DB, Codex, Git observation, Quality Gate, Review Room, Settings, Project Paths, and whitespace checks.

## Next Recommended Step

Phase 6 Step 4 - Log Retention / Archive Room.

Phase 6 Step 4 has not started.
