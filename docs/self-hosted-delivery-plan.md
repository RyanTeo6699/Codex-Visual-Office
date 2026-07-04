# Self-Hosted Delivery Plan

## Purpose

Define a future self-hosted delivery model for technical users without implementing packaging, signing, cloud sync, payment, or auth.

## Source Checkout Delivery Model

A self-hosted delivery package may include:

- Source checkout or tagged source archive.
- Install guide.
- Supported Node/npm version guidance.
- Local DB init, seed, and verify instructions.
- Browser launcher instructions.
- Backup/restore instructions.
- Safety Audit Room guidance.
- Codex CLI prerequisite guide.
- Known limitations and support checklist.

## Local Setup Docs

Future setup docs should cover:

1. Download or clone source.
2. Install dependencies.
3. Run typecheck/build verification.
4. Initialize local SQLite DB.
5. Seed local baseline data if needed.
6. Start local app.
7. Use browser launcher fallback.
8. Verify Codex CLI outside the app.

## Local DB Init / Seed / Verify

The delivery guide should reference existing local scripts and keep local SQLite as the source of truth. It should not upload, sync, or remotely back up the DB.

## Browser Launcher

The browser-only launcher should remain the fallback delivery path because it avoids unsigned desktop app friction and keeps the local-first model simple.

## Backup / Restore Docs

Self-hosted users need clear backup guidance:

- Backups cover `.local/codex-visual-office.sqlite` only.
- Backups do not include project source code.
- Backups do not include `.env`, `.env.local`, tokens, or `~/.codex/auth.json`.
- Restore should use dry-run and safety backup flow.

## Safety Audit Docs

The delivery package should explain:

- No arbitrary shell.
- No terminal emulator.
- No `node-pty`.
- No auto commit/push/deploy.
- No destructive cleanup.
- No cloud sync.

## Codex CLI Prerequisite

Codex CLI remains a user-managed prerequisite. The app may detect status but must not read credentials or tokens.

## Known Limitations

- Local technical setup required.
- No signed installer.
- No notarization.
- No auto updater.
- No cloud sync.
- No team workspace.
- No payment/auth.

## Support Checklist

- Supported OS and Node/npm versions.
- Codex CLI setup instructions.
- Local DB path explanation.
- Backup/restore recovery instructions.
- Known Gatekeeper warnings for unsigned app paths.
- Troubleshooting for localhost startup.

## Not Included

- Cloud sync.
- Team workspace.
- Payment or auth.
- Signed installer.
- Auto updater.
- Remote backup.
