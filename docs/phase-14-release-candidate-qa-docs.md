# Phase 14 - Release Candidate QA / Documentation Hardening

## Status

`PASS_WITH_NOTED_LIMITATIONS`

Phase 14 hardens the current desktop beta candidate for Release Candidate review by adding documentation, QA checklists, and static readiness verification.

This phase does not implement new product capabilities and does not change the app safety boundary.

## What This Phase Implemented

- Phase 14 scope lock.
- User manual.
- Developer manual.
- Local setup guide.
- Troubleshooting guide.
- Safety and data boundary guide.
- Backup/restore recovery guide.
- Release Candidate QA checklist.
- Documentation readiness verifier.
- Release Candidate readiness verifier.
- Roadmap status update.

## Document List

- `docs/phase-14-release-candidate-qa-docs-scope-lock.md`
- `docs/user-manual.md`
- `docs/developer-manual.md`
- `docs/local-setup-guide.md`
- `docs/troubleshooting.md`
- `docs/safety-data-boundaries.md`
- `docs/backup-restore-recovery-guide.md`
- `docs/release-candidate-qa-checklist.md`
- `docs/phase-14-release-candidate-qa-docs.md`

## QA Checklist Summary

The Release Candidate QA checklist covers:

- Preflight branch and clean working tree checks.
- Build and TypeScript checks.
- Local DB verification.
- Codex runtime and runner safety verification.
- Git observation verification.
- Quality Gate verification.
- Review readiness verification.
- Settings and approved project path verification.
- Backup/restore verification.
- Archive dry-run verification.
- Safety and permission verification.
- Agent Workflow verification.
- Project workspace verification.
- Desktop beta verification.
- UI verification.
- Browser route checks.
- Responsive checks.
- Forbidden controls checks.
- Final git status.
- Release decision states: `PASS`, `PASS_WITH_CAUTION`, and `BLOCKED`.

## Verification Scripts

Phase 14 adds:

- `npm run docs:verify:readiness`
- `npm run rc:verify:readiness`

These scripts are static/read-only readiness checks. They do not execute Codex, mutate Git, run Quality Gates, open browsers, launch Tauri, install dependencies, deploy, delete data, restore backups, or read credentials.

## Browser And Manual Checks

Manual QA should check:

- `/`
- `/settings`
- `/safety`
- `/archive`
- `/projects/provider-workspace`
- `/review/task-provider-review`

Manual responsive QA should check desktop width and 390px mobile-ish width.

Manual forbidden controls QA should verify that no production install, build DMG/EXE, auto updater, cloud sync, token input, command textbox, open terminal, delete logs, delete backups, or cleanup now controls are present.

## What Did Not Change

Phase 14 does not change:

- DB schema or migrations.
- Codex runner behavior.
- Quality Gate runner policy.
- Backup/restore behavior.
- Archive cleanup behavior.
- Tauri production packaging behavior.
- Security permissions.
- Approved project path semantics.
- Review decision semantics.
- Desktop beta safety posture.

## Known Limitations

- The product remains a desktop beta candidate, not a production 1.0 release.
- There is no signed or notarized production desktop installer.
- There is no auto updater.
- There is no Electron build.
- There is no cloud sync.
- There is no team workspace.
- There is no auth, payment, or account system.
- There is no MCP or ChatGPT App integration.
- Archive cleanup remains dry-run only.
- Approved project paths remain manual and do not imply source scanning.
- Codex auth status can remain unknown because the app must not read `~/.codex/auth.json`.

## Next Recommended Phase

Recommended next phase:

`Phase 15 - Release Candidate Stabilization / Bug Bash`

Alternative GM decision:

`Phase 15 - Production 1.0 Scope Lock`

Production 1.0 scope lock must be explicit before any production installer, signing, notarization, auto updater, cloud sync, team workspace, MCP, ChatGPT App, external API, credential, destructive cleanup, or deployment work begins.

## Phase 15 Statement

Phase 15 has not started.
