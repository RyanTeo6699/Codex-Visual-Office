# Phase 15 - Release Candidate Stabilization / Bug Bash Scope Lock

## Goal

Stabilize the current local-first desktop beta / RC candidate by fixing route, responsive, copy, documentation, and verification issues without adding new product capabilities or expanding safety permissions.

Phase 15 is a stabilization and bug bash phase. It is not a production release phase.

## Allowed

- Route QA fixes.
- Browser console cleanup.
- Hydration mismatch cleanup.
- Responsive fixes.
- Empty/error state fixes.
- Copy consistency fixes.
- Documentation consistency fixes.
- Accessibility basics.
- Verification hardening.
- RC stabilization documentation.
- Final verification, commit, and push.

## Forbidden

- New feature implementation.
- DB schema changes.
- Migration changes.
- New dependencies.
- Production release.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP.
- ChatGPT App.
- OpenAI API.
- Arbitrary shell.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 16 implementation.

## Stabilization Boundary

Phase 15 may adjust copy, empty states, static documentation, static QA verification, and layout/accessibility issues discovered during RC checks.

It must not change the semantics of:

- Codex runner policy.
- Quality Gate allowlist or runner behavior.
- Backup/restore behavior.
- Archive retention behavior.
- Git observation boundaries.
- Scope Guard behavior.
- Approved project path behavior.
- Tauri prototype packaging boundary.
- Local launcher execution boundary.

## Verification Boundary

Phase 15 may add `rc:verify:stabilization` as a static, read-only verifier.

The verifier must not:

- Execute Codex.
- Mutate Git.
- Run Quality Gates.
- Open a browser.
- Launch Tauri.
- Install dependencies.
- Deploy.
- Delete data.
- Restore backups.
- Read secrets.

## Release Boundary

The output of Phase 15 is an RC candidate stabilized for GM review.

It is still:

- Not a production 1.0 release.
- Not signed or notarized.
- Not auto-updating.
- Not cloud-synced.
- Not a team workspace.
- Not a ChatGPT App or MCP integration.

## Phase 16 Gate

Phase 16 has not started.

Production 1.0 scope lock, final RC validation, production packaging, signing, notarization, updater, cloud, team, auth, payment, MCP, ChatGPT App, or external API work requires separate GM approval.
