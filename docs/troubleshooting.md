# Troubleshooting

This guide covers common local release candidate failures. It intentionally avoids credential inspection, cloud repair, direct database edits, and broad source scanning.

## Fast Triage

Start with the narrowest relevant verifier:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run backup:verify
npm run codex:verify:cli
npm run codex:verify:runtime-reliability
npm run git:verify:scope-check
npm run quality:verify:runner
npm run review:verify:readiness
npm run local:launcher:verify
npm run tauri:verify:prototype
npm run desktop:verify:beta
npm run safety:verify:permissions
```

Use focused commands first. Use the full matrix from `docs/developer-manual.md` before release signoff.

## Codex CLI Not Detected

Symptoms:

- Runtime status says Codex CLI is missing.
- `npm run codex:verify:cli` fails.
- Review Room shows runner unavailable.

Checks:

```bash
npm run codex:verify:cli
npm run codex:verify:runtime-reliability
```

Resolution:

- Confirm `codex` is installed and available on the shell `PATH` used to start the app.
- Restart the dev server after changing shell setup.
- Keep the app in detection/reporting mode. Do not add fallback shell execution or arbitrary command entry.

Do not read `~/.codex/auth.json` to diagnose this.

## Codex Auth Unknown

Symptoms:

- Codex runtime is detected, but auth state is unknown.
- Safety surfaces refuse to display credential details.

Resolution:

- Treat `auth_unknown` as a safe state, not a bug by itself.
- Use normal Codex CLI login flows outside this app if the user chooses.
- Re-run `npm run codex:verify:cli` and `npm run codex:verify:runtime-reliability`.

Do not inspect, print, paste, store, or validate tokens in this project.

## Missing Approved Path

Symptoms:

- Scoped runner surfaces are blocked.
- Project workspace status says approved path is missing.
- Review Room cannot proceed with scoped runner readiness.

Checks:

```bash
npm run settings:verify:project-paths
npm run project:verify:workspace
npm run codex:verify:scoped-runner
```

Resolution:

- Add or approve the project path through Settings if the UI supports the flow.
- Confirm the path is represented in app-owned local records.
- Remember that approval does not grant source crawling, credential reading, or package discovery.

## DB Missing

Symptoms:

- App has no local records.
- SQLite path is missing under `.local/`.
- DB verification fails because the database has not been initialized.

Checks:

```bash
npm run db:init
npm run db:verify
```

Resolution:

- Initialize the local DB with `npm run db:init`.
- Seed only when appropriate for local prototype/demo state with `npm run db:seed`.
- Do not manually create tables in SQLite.

## DB Corrupt Or Unreadable

Symptoms:

- DB verification fails after previously working.
- App routes show server errors involving SQLite.
- Backup/restore panel cannot read records.

Checks:

```bash
npm run db:verify
npm run backup:verify
```

Resolution:

1. Stop making writes through the app.
2. Locate the most recent valid backup record in Settings.
3. Run Dry Run Restore for that backup.
4. Confirm restore only after dry-run passes.
5. Verify with `npm run db:verify`.

Do not directly edit the DB unless a backup exists and a restore path is understood.

## Backup Restore Needed

Symptoms:

- App data needs rollback.
- DB is corrupt or unwanted local changes were made.
- A known-good backup exists.

Resolution:

- Use Settings Backup/Restore.
- Run Dry Run Restore first.
- Confirm Restore only after dry-run passes.
- Confirm Restore creates a `pre_restore_safety` backup before restoring.
- Re-run `npm run backup:verify` and `npm run db:verify`.

See `docs/backup-restore-recovery-guide.md`.

## Dry-Run Failed

Symptoms:

- Dry Run Restore fails.
- Backup checksum mismatch.
- Backup file missing, empty, or outside `.local/backups/`.

Resolution:

- Do not confirm restore.
- Choose another registered backup record.
- Verify that the backup file still exists under `.local/backups/`.
- Re-run `npm run backup:verify`.
- If all backup records fail, preserve the current `.local/` directory for manual investigation.

Do not edit backup record paths to point at arbitrary files.

## Quality Gate Failed

Symptoms:

- Review Room shows failed Quality Gate.
- `npm run quality:verify:runner` fails.
- Build or typecheck gate is red.

Checks:

```bash
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
npm run typecheck
npm run build
```

Resolution:

- Fix the underlying type, build, lint, or test failure in the relevant approved scope.
- Re-run the failing gate.
- Do not bypass the Quality Gate by editing local DB results.
- Do not add arbitrary command support to make a gate pass.

## Scope Guard Blocked

Symptoms:

- Scope Guard panel blocks review readiness.
- `npm run git:verify:scope-check` fails.
- Changed file summaries include forbidden paths or suspicious scope.

Resolution:

- Inspect the changed file summary and phase scope.
- Revert or move only your own out-of-scope edits.
- Ask for GM approval if the requested work genuinely requires forbidden files or implementation classes.
- Re-run `npm run git:verify:scope-check`.

Do not revert other contributors' unrelated edits.

## Launcher Cannot Open Browser

Symptoms:

- `npm run local:launcher:open` does not open a browser.
- Launcher status reports unavailable app URL.

Checks:

```bash
npm run local:launcher:verify
npm run local:shell:verify
```

Resolution:

- Start the app with `npm run dev`.
- Confirm the local URL printed by Next.js.
- Open the URL manually if the OS blocks automatic browser launch.
- Keep browser launch as a convenience only.

## Localhost Not Running

Symptoms:

- Browser shows connection refused.
- Tauri prototype shows no app.
- Launcher cannot find the app.

Resolution:

```bash
npm run dev
```

Then open the printed local URL. If another process owns the port, use the URL and port printed by Next.js.

## Tauri Prototype Cannot Show App

Symptoms:

- Tauri window opens blank.
- Tauri prototype cannot connect to the local Next.js app.

Checks:

```bash
npm run tauri:verify:prototype
npm run desktop:verify:beta
```

Resolution:

- Start the Next.js app first with `npm run dev`.
- Confirm the Tauri dev URL matches the running app URL.
- Use browser launcher fallback if Tauri is blocked.

Do not add production packaging, shell plugins, broad filesystem permissions, signing, notarization, or an auto updater to fix prototype display.

## Hydration Warning

Symptoms:

- Browser console reports React hydration mismatch.
- UI renders different timestamps, random IDs, or environment-specific values between server and client.

Resolution:

- Prefer stable server-rendered values from local records.
- Move client-only volatile display into client components with explicit state.
- Avoid random values, current time formatting, or environment-dependent text during initial render unless intentionally handled.
- Re-run `npm run typecheck` and `npm run build`.

## Route 404

Symptoms:

- `/projects/[id]` or `/review/[taskId]` returns not found.
- Links from Office Home point to unavailable records.

Resolution:

- Confirm the route file exists under `app/`.
- Confirm the project or task ID exists in local data.
- Run `npm run db:verify:selected-reads`.
- For mock/demo state, reseed only if local data reset is acceptable.

## Route 500

Symptoms:

- A route crashes with a server error.
- Next.js logs show SQLite, data shape, or rendering exceptions.

Resolution:

```bash
npm run typecheck
npm run build
npm run db:verify
```

- Fix the typed data mismatch or missing local record.
- If DB corruption is suspected, use the backup recovery flow.
- Do not patch route failures by bypassing safety checks.

## No Archive Data

Symptoms:

- Archive Room is empty.
- Archive summaries show no retained records.

Checks:

```bash
npm run archive:verify
```

Resolution:

- Confirm local records exist.
- Confirm retention policies are dry-run only.
- Treat empty archive data as acceptable for a fresh local DB.
- Do not add destructive cleanup or automatic purge.

## What Not To Do

- Do not read `~/.codex/auth.json`.
- Do not read `.env` or `.env.local`.
- Do not paste tokens into docs, code, issue comments, terminal logs, or local DB records.
- Do not store API keys, SSH keys, OAuth credentials, or cloud credentials.
- Do not enable cloud sync manually.
- Do not add GitHub, Vercel, Supabase, Firebase, auth, payment, team, or MCP integrations to troubleshoot local issues.
- Do not edit the SQLite DB unless it is backed up and the recovery path is understood.
- Do not edit backup records to restore arbitrary files.
- Do not delete backups as a cleanup shortcut.
- Do not add arbitrary shell, terminal, `node-pty`, command text boxes, or automatic execution.
- Do not revert unrelated edits from other contributors.
