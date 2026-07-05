# Private Beta Release Artifact Manifest

## Repository Commit

Phase 19 starts from:

```txt
e3a7fa9 docs: plan public release packaging
```

The final Phase 19 commit should be recorded in the final report after push.

## VERSION

```txt
1.0.0-local-baseline
```

## RELEASE_STATUS

```txt
PRODUCTION_1_LOCAL_BASELINE_READY_WITH_NOTED_LIMITATIONS
```

Private beta status is source-checkout / local-launcher candidate only.

## Required Docs

- `docs/phase-19-private-local-beta-packaging-validation-scope-lock.md`
- `docs/private-beta-package-checklist.md`
- `docs/private-beta-tester-guide.md`
- `docs/private-beta-feedback-template.md`
- `docs/private-beta-issue-report-template.md`
- `docs/private-beta-support-runbook.md`
- `docs/private-beta-release-artifact-manifest.md`
- `docs/phase-19-private-local-beta-packaging-validation.md`

## Required npm Scripts

- `typecheck`
- `build`
- `beta:verify:private`
- `local:launcher:verify`
- `local:shell:verify`
- `safety:verify:permissions`
- `desktop:verify:beta`
- `production:verify:freeze`

## Required Verification Commands

```bash
npm run typecheck
npm run build
npm run beta:verify:private
npm run release:verify:strategy
npm run production:verify:freeze
npm run rc:verify:readiness
npm run desktop:verify:beta
npm run safety:verify:permissions
npm run local:launcher:verify
npm run local:shell:verify
npm run tauri:verify:prototype
git diff --check
```

## Local Files Excluded From Git

- `.local/`
- `.local/backups/`
- `*.sqlite`
- `*.sqlite-shm`
- `*.sqlite-wal`

## What Is Not Included

- Signed installer.
- Notarized app.
- Auto updater.
- Cloud backend.
- Auth/payment/team/MCP.
- Public commercial release.
- Production package build.
- Token storage.
- `.env` or `.env.local` handling.
- `~/.codex/auth.json` handling.
