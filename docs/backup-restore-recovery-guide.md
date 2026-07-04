# Backup, Restore, And Recovery Guide

This guide covers local recovery for the Codex Visual Office SQLite database.

## What Is Backed Up

Backup/Restore covers the app-owned SQLite database:

```txt
.local/codex-visual-office.sqlite
```

Backups include app-owned local records stored in SQLite, such as:

- Projects.
- Agent seats.
- Tasks.
- Task events.
- Build checks.
- Review records.
- Settings and local settings.
- Approved project paths.
- Git snapshots.
- Changed file summaries.
- Diff summaries.
- Scope checks.
- Quality Gate configs, runs, and events.
- Backup records.
- Archive and retention records stored in the local DB.

## What Is Not Backed Up

Backups do not include:

- Project source code.
- Repositories or worktrees.
- User home directories.
- `~/.codex/auth.json`.
- `.env` or `.env.local`.
- Tokens, SSH keys, API keys, OAuth credentials, or cloud credentials.
- GitHub, Vercel, Supabase, Firebase, or other cloud data.
- Browser state.
- Tauri or OS settings.
- Generated build output outside the SQLite DB.

The backup system is local database backup only.

## Backup Location

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

The `.local/` directory and SQLite files are ignored by Git.

## Backup Records

Each backup creates a `backup_records` row with:

- `id`
- `backup_path`
- `backup_kind`
- `source_db_path`
- `file_size_bytes`
- `checksum_sha256`
- `status`
- `note`
- `created_at`
- `restored_at`

Backup kinds:

- `manual`
- `pre_restore_safety`

Backup statuses:

- `created`
- `verified`
- `failed`
- `restored`
- `dry_run_passed`

The restore flow only uses registered backup records. It does not accept arbitrary restore paths.

## Create A Backup

Preferred path:

1. Open `/settings`.
2. Use the Backup / Restore panel.
3. Click Backup Now.
4. Confirm the new backup record appears with file size and checksum.

Verification command:

```bash
npm run backup:verify
```

Backup Now initializes the local DB if needed, creates `.local/backups/` if missing, writes a SQLite backup file, computes SHA256, and records metadata.

## Dry-Run Restore

Dry-run restore checks whether a registered backup can be used before any current data is overwritten.

Dry-run verifies:

- The backup record exists.
- The backup path is under `.local/backups/`.
- The backup file exists.
- The backup file is non-empty.
- The checksum matches `backup_records.checksum_sha256`.
- The restore target is the app-owned local DB path.

Dry-run does not restore or overwrite the current database. A successful dry-run marks the selected backup record as `dry_run_passed`.

## Confirm Restore

Only confirm restore after dry-run passes.

Confirm Restore:

1. Requires explicit confirmation.
2. Requires the selected backup record status to be `dry_run_passed`.
3. Creates a `pre_restore_safety` backup of the current DB.
4. Restores app tables from the selected backup.
5. Marks the selected backup record as `restored`.

`backup_records` is retained as audit/control metadata during restore.

## Safety Backup Before Restore

Before every confirmed restore, the service creates a safety backup with:

```txt
backup_kind = pre_restore_safety
```

If restore fails, the safety backup remains available. The service must not delete backup files as part of recovery.

## Recovery Checklist

Use this checklist when local data is missing, corrupt, or needs rollback:

1. Stop using the app to avoid additional writes.
2. Do not edit the SQLite DB directly.
3. Open `/settings` and inspect Backup / Restore records.
4. Pick the most recent trusted backup.
5. Run Dry Run Restore.
6. If dry-run fails, do not confirm restore. Choose another backup.
7. If dry-run passes, Confirm Restore.
8. Confirm a `pre_restore_safety` backup was created.
9. Run `npm run db:verify`.
10. Run `npm run backup:verify`.
11. Open `/`, `/settings`, `/archive`, and a representative Review Room.

If no backup works, preserve the full `.local/` directory for manual investigation.

## Verification Commands

Focused backup verification:

```bash
npm run backup:verify
```

Database verification:

```bash
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
```

Release candidate sanity checks:

```bash
npm run typecheck
npm run build
```

## Limitations

- No cloud backup.
- No cloud restore.
- No account recovery.
- No scheduled backup.
- No source code backup.
- No whole-repository backup.
- No user home directory backup.
- No credential backup.
- No arbitrary restore path.
- No file upload restore.
- No backup deletion or destructive cleanup.
- No guarantee that project source matches restored task records.

Restored app records may reference project paths or tasks whose external files have changed. The backup system only restores the local office database.

## Unsafe Recovery Actions

Do not:

- Read or back up `~/.codex/auth.json`.
- Read or back up `.env` or `.env.local`.
- Copy tokens into backup notes.
- Move backup records to arbitrary files.
- Edit checksums to force restore.
- Delete current data before a safety backup exists.
- Delete old backups to make restore easier.
- Use cloud sync as an unofficial backup system.
- Modify schema or scripts as part of emergency recovery.
