# Private Beta Package Checklist

## Repository Access

- Confirm tester has access to the GitHub repository or approved source archive.
- Confirm tester knows this is a source-checkout private beta, not a public installer.
- Confirm tester is using the intended commit listed in the release artifact manifest.

## Supported Platform

- Mac-first local beta.
- Browser-based local launcher remains the recommended fallback.
- Tauri remains prototype / beta candidate only.

## Prerequisites

- Node.js installed.
- npm installed.
- Local browser installed.
- Codex CLI optional but expected for Codex workflow evaluation.
- Codex CLI setup and authentication remain user-managed outside this app.

## Setup

Manual tester setup should follow project docs:

1. Install dependencies with the project-approved npm workflow.
2. Initialize local DB with `npm run db:init`.
3. Seed local data with `npm run db:seed` if needed.
4. Verify local DB with `npm run db:verify`.
5. Run `npm run typecheck`.
6. Run `npm run build`.
7. Start local app with `npm run dev`.
8. Verify launcher with `npm run local:launcher:verify`.
9. Use `npm run local:launcher -- --json` for status-only launcher output.

## Required Checks Before Tester Handoff

- `npm run beta:verify:private`
- `npm run release:verify:strategy`
- `npm run production:verify:freeze`
- `npm run rc:verify:readiness`
- `npm run desktop:verify:beta`
- `npm run safety:verify:permissions`
- `npm run local:launcher:verify`
- `npm run local:shell:verify`
- `npm run tauri:verify:prototype`

## Data Safety Checklist

- Confirm `.local/` is not committed.
- Confirm SQLite files are not committed.
- Confirm beta tester understands app data is local-only.
- Confirm no project source backup is included.
- Confirm no token, `.env`, `.env.local`, or `~/.codex/auth.json` should be shared.

## Backup Checklist

- Create a local DB backup before serious beta testing.
- Use restore dry-run before confirm restore.
- Confirm restore creates a pre-restore safety backup.
- Do not delete backup files during beta validation.

## Safety Audit Checklist

- Visit `/safety`.
- Confirm local-first status.
- Confirm no cloud sync.
- Confirm no token storage.
- Confirm no terminal / command text box.
- Confirm no auto commit, push, deploy, or destructive cleanup.

## Known Limitations Acknowledgement

Tester should acknowledge:

- No public installer.
- No signed or notarized app.
- No auto updater.
- No cloud recovery.
- No team workspace.
- No payment/auth.
- Codex CLI auth state can be unknown to the app.
- Quality Gates and Scope Guard are advisory.

## Warnings

- No cloud.
- No token sharing.
- No public installer.
- No production package.
- No commercial launch.
