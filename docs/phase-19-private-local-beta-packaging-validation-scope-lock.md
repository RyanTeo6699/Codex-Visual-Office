# Phase 19 - Private Local Beta Packaging Validation

## Goal

Validate that the current local-first Production 1.0 baseline can be delivered to private beta testers through a source-checkout and local-launcher workflow without implementing public release, signing, notarization, auto-updater, cloud, auth, payment, team, or MCP capabilities.

Phase 19 is validation and documentation only. It does not create a public package or change product behavior.

## Baseline

- Latest baseline: `e3a7fa9 docs: plan public release packaging`
- Release status: `PRODUCTION_1_LOCAL_BASELINE_READY_WITH_NOTED_LIMITATIONS`
- Recommended beta path: source checkout + npm scripts + browser-only local launcher
- Product type: local-first Codex visual workflow office / private beta candidate

## Allowed

- Private beta checklist.
- Source checkout delivery plan.
- Local startup validation.
- Private beta tester guide.
- Private beta feedback template.
- Private beta issue report template.
- Private beta support runbook.
- Release artifact manifest.
- Documentation and verification.

## Forbidden

- Public release implementation.
- Signed or notarized installer.
- Auto updater.
- Production package build.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP.
- ChatGPT App.
- OpenAI API.
- New app feature.
- DB schema changes.
- New dependencies.
- Lockfile changes.
- Dangerous shell, terminal emulator, or `node-pty`.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Backup / Restore behavior changes.
- Archive cleanup behavior changes.
- Destructive cleanup.
- Backup file deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 20 implementation.

## Validation Boundary

Phase 19 may document commands that a tester runs manually. It must not add scripts that install dependencies, start daemons, build production packages, sign artifacts, notarize artifacts, deploy, mutate Git, execute Codex automatically, or run Quality Gates automatically.

## Acceptance Criteria

- Required private beta docs exist.
- `beta:verify:private` passes.
- Existing release, production, RC, desktop, safety, runtime, launcher, and Tauri verifiers pass.
- No app behavior, dependency, lockfile, DB schema, migration, runner, quality, backup, archive, or Tauri behavior changes are introduced.
- Phase 20 is recommended but not started.

## Failure Criteria

- Any public release implementation appears.
- Any production package build, signing, notarization, or auto updater implementation appears.
- Any cloud, auth, payment, team, MCP, OpenAI, GitHub, Vercel, or Supabase implementation appears.
- Any schema, migration, dependency, lockfile, or app behavior change is introduced.
- Any dangerous shell, terminal, `node-pty`, destructive cleanup, backup deletion, or credential read path is added.
- Phase 20 implementation starts.

## Explicit Phase Status

Phase 19 is private local beta packaging validation only. Phase 20 has not started.
