# Codex Visual Office Release Status

## Current Release Status

Codex Visual Office 1.0 Local-First Baseline.

Status:

```txt
PRODUCTION_1_LOCAL_BASELINE_READY_WITH_NOTED_LIMITATIONS
```

This is a local-first production baseline / desktop beta candidate. It is not a public commercial launch, not a signed installer, not notarized, and not auto-updating.

## Latest Baseline Commit Before Phase 19

`e3a7fa9 docs: plan public release packaging`

## Final Phase Status

Phase 17 - Production 1.0 Finalization / Release Freeze.

## Current Planning Status

Phase 18 - Public Release Packaging Scope Lock / Distribution Strategy.

Phase 18 documents the next release and distribution choices. It does not implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, or commercial launch.

## Private Beta Validation Status

Phase 19 - Private Local Beta Packaging Validation.

Phase 19 validates source checkout and browser-only local launcher delivery for private technical beta testers. It does not implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, or commercial launch.

Private beta status:

```txt
PRIVATE_LOCAL_BETA_READY_WITH_NOTED_LIMITATIONS
```

## Local-First Policy

- Local SQLite remains the app-owned source of truth.
- No cloud sync.
- No remote account requirement.
- No token storage.
- No reading `~/.codex/auth.json`.
- No reading `.env` or `.env.local`.

## What Is Ready

- Virtual Office UI.
- Local SQLite workflow persistence.
- Project Workspace.
- Codex runtime reliability surfaces.
- Scoped Codex Runner safety surfaces.
- Agent Workflow 2.0.
- Review Room 2.0.
- Git/File/Diff Observation.
- Scope Guard.
- Quality Gates.
- Settings Center.
- Approved Project Paths.
- Backup / Restore.
- Archive Room.
- Safety Audit Room.
- Local Launcher.
- Tauri Desktop Beta Candidate posture.
- Documentation and QA baseline.

## What Is Not Included

- Public commercial launch.
- Production signed installer.
- Code signing.
- Notarization.
- Auto updater.
- Cloud sync.
- Team workspace.
- MCP / ChatGPT App.
- Auth/payment.
- GitHub/Vercel/Supabase integration.
- OpenAI API integration.
- Source indexing.
- Semantic code review.
- Automatic Git/Codex/Quality execution.
- Destructive cleanup.
- Backup file deletion.

## Verification Command Set

```bash
npm run typecheck
npm run build
npm run beta:verify:private
npm run release:verify:strategy
npm run production:verify:freeze
npm run production:verify:scope
npm run rc:verify:stabilization
npm run docs:verify:readiness
npm run rc:verify:readiness
npm run desktop:verify:beta
npm run safety:verify:permissions
npm run agent:verify:workflow
npm run project:verify:workspace
npm run ui:verify:virtual-office
npm run codex:verify:runtime-reliability
npm run local:launcher:verify
npm run local:shell:verify
npm run tauri:verify:prototype
git diff --check
```

## Next Possible Phases

- Phase 19 - Private Local Beta Packaging Validation.
- Phase 19 - Mac Signing / Notarization Scope Lock.
- Future Commercialization Scope Lock.
- Future Cloud/Team/MCP Scope Lock.

These phases have not started.
