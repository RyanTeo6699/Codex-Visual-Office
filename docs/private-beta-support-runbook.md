# Private Beta Support Runbook

## First Response Checklist

- Confirm tester is using the private beta commit from the artifact manifest.
- Confirm this is local-first and source-checkout based.
- Confirm OS, Node version, npm version, Codex CLI version, and browser.
- Ask which route/page failed.
- Ask for non-sensitive logs or screenshots.
- Remind the tester not to share tokens, private keys, passwords, `.env`, `.env.local`, `~/.codex/auth.json`, full SQLite databases, or full source archives unless a separate privacy review approves it.

## Setup Troubleshooting

- Confirm repository was checked out correctly.
- Confirm dependencies were installed with the project-approved npm workflow.
- Run `npm run typecheck`.
- Run `npm run build`.
- Run `npm run db:verify`.
- If local counts differ from examples, check whether the tester already had an existing `.local` database with verification records before treating the run as failed.

## Codex CLI Troubleshooting

- Ask tester to confirm Codex CLI is installed.
- Ask for `codex --version` output only.
- Do not ask for Codex auth files or tokens.
- Treat auth status as user-managed and possibly unknown.
- Explain that `Auth unknown` means the app did not verify login state; it does not mean the app read `~/.codex/auth.json` or that setup automatically failed.

## Approved Path Troubleshooting

- Confirm `/settings` has an approved project path.
- Confirm path was manually entered.
- Confirm path is not `.env`, `.env.local`, token file, private key, or `~/.codex/auth.json`.
- Do not ask user to upload project source.
- If Review Room reports a missing approved path, direct the tester to Settings -> Approved Project Paths. Saving a path stores the typed string only; it does not scan folders, inspect files, run Git, start Codex, or run Quality Gates.

## Local DB Troubleshooting

- Confirm `.local/codex-visual-office.sqlite` exists.
- Run `npm run db:verify`.
- If broken, use backup/restore docs.
- Do not ask for the database if it may contain private local workflow data.

## Backup / Restore Troubleshooting

- Confirm dry-run restore was performed before confirm restore.
- Confirm Dry Run Restore validated the backup record without overwriting the current DB.
- Confirm Confirm Restore creates a pre-restore safety backup before replacing the app SQLite DB.
- Do not delete backup files.
- Do not ask user to share backup files unless a separate privacy review approves it.

## Launcher Troubleshooting

- Run `npm run local:launcher:verify`.
- Run `npm run local:launcher -- --json`.
- Confirm local app is available at `http://localhost:3000`.
- Explain that `localhost:3000` is served from the tester's machine and is not a hosted cloud preview.
- Do not start background daemons or remote services.

## Tauri Beta Limitations

- Tauri remains prototype / beta candidate only.
- No signed installer.
- No notarization.
- No auto updater.
- Browser launcher remains fallback.

## Safety Escalation

Escalate if tester reports:

- Token exposure.
- Data loss.
- Backup restore failure.
- Command execution outside allowlisted flows.
- Git mutation without explicit user action.
- Cloud upload or external service behavior.

## Support Must Not Ask For

- `auth.json`.
- `.env`.
- `.env.local`.
- Tokens.
- Private keys.
- Passwords.
- Full source archive.
- Full local SQLite backup without explicit privacy review.

## Escalation Criteria

- Blocking setup failure across two clean attempts.
- Possible data loss.
- Possible credential exposure.
- Reproducible crash on required routes.
- Safety boundary violation.
