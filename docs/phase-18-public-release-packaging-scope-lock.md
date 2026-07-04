# Phase 18 - Public Release Packaging Scope Lock / Distribution Strategy

## Goal

Decide and document the safest next release and distribution path after the local-first Production 1.0 baseline, without implementing public release, signing, notarization, auto-updater, cloud, auth, payment, team, or MCP capabilities.

Phase 18 is a planning and scope-lock phase. It does not ship a public package and does not change product behavior.

## Current Baseline

- Latest baseline: `a92cb91 docs: freeze production 1 baseline`
- Product status: `PRODUCTION_1_LOCAL_BASELINE_READY_WITH_NOTED_LIMITATIONS`
- Release metadata: `1.0.0-local-baseline`
- Current product type: local-first Codex visual workflow office
- Current distribution posture: source checkout, browser launcher fallback, and Tauri packaging prototype only

## Allowed

- Release packaging strategy.
- Distribution option matrix.
- Public beta readiness assessment.
- Packaging risk register.
- Code signing / notarization planning.
- Self-hosted delivery planning.
- Commercialization pre-scope notes.
- Phase 19 recommendation.
- Documentation and verification only.

## Forbidden

- Actual public release implementation.
- Production package build.
- Code signing implementation.
- Notarization implementation.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP.
- ChatGPT App.
- OpenAI API.
- New app features.
- DB schema or migration changes.
- New dependencies.
- Lockfile changes.
- Dangerous shell, terminal emulator, or `node-pty`.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup file deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 19 implementation.

## Packaging Boundary

Phase 18 may describe future packages, but must not create, sign, notarize, upload, distribute, or auto-update them. Any future production package requires a separate GM-approved phase.

## Distribution Boundary

The existing browser-only launcher remains the safest fallback path. The Tauri app remains a prototype / beta candidate, not a signed public installer.

## Commercial Boundary

Commercialization remains planning-only. There is no license enforcement, payment flow, auth system, SaaS backend, support portal, or team workspace.

## Acceptance Criteria

- Required Phase 18 release strategy documents exist.
- `release:verify:strategy` passes.
- Existing production freeze and RC verification scripts still pass.
- No dependency, schema, migration, or app behavior changes are introduced.
- Docs clearly state no signed/notarized package, no auto updater, no cloud sync, and no auth/payment/team/MCP.
- Phase 19 recommendation is documented, but Phase 19 implementation has not started.

## Failure Criteria

- Any new production packaging implementation appears.
- Any signing, notarization, auto updater, cloud, auth, payment, team, MCP, OpenAI, GitHub, Vercel, or Supabase implementation appears.
- Any DB schema or migration change is introduced.
- Any new dependency or lockfile change is introduced.
- Docs claim public commercial release readiness.
- Phase 19 implementation starts.

## Explicit Phase Status

Phase 18 is a release packaging strategy lock. Phase 19 has not started.
