# Phase 13 - Desktop Beta / Distribution Candidate

## Summary

Phase 13 documents the Desktop Beta / Distribution Candidate posture for Codex Visual Office.

This phase is Mac-first, local-first, and not a production release. It hardens the current Tauri prototype relationship into a desktop beta candidate posture, keeps browser launcher fallback available, adds static beta verification, and preserves local data boundaries.

## What Implemented

- Added Phase 13 scope lock documentation.
- Added Phase 13 desktop beta implementation documentation.
- Added a static desktop beta status helper.
- Added `desktop:verify:beta` and `desktop:check:beta`.
- Hardened Tauri metadata to label the app as a beta candidate while keeping bundle output inactive.
- Added Desktop Beta Candidate status to Settings.
- Added Desktop Beta / Tauri safety status to Safety Audit Room.
- Recorded that Phase 13 is a Desktop Beta / Distribution Candidate, not a production release.
- Preserved browser launcher fallback.
- Preserved local data boundaries.
- Documented why production release, signing, notarization, auto updater, Electron, and cloud sync remain out of scope.

## Desktop Beta Scope

Phase 13 is limited to desktop beta candidate readiness, static verification, and status visibility.

Allowed work is limited to reviewing and documenting the existing beta posture plus static status/verifier surfaces:

- Desktop beta candidate readiness.
- Tauri beta configuration review.
- App metadata hardening review.
- Desktop beta verification.
- Cold start readiness.
- Local data preservation.
- Browser launcher fallback.
- Settings/Safety status display.
- Documentation and verification notes.

This phase does not add new runtime execution behavior.

## Mac-First Limitation

The desktop beta candidate is Mac-first.

Phase 13 does not claim Windows or Linux production readiness. Cross-platform distribution requirements, installer behavior, platform-specific signing, and production support remain outside this phase.

## Tauri Prototype Relationship

The existing Tauri work remains a prototype/candidate desktop shell.

Phase 13 may document whether the Tauri configuration and metadata appear ready for local beta verification, but it does not promote the Tauri prototype into a production distribution channel.

The Tauri config remains local and non-production:

- Local dev URL only.
- Empty `beforeDevCommand`.
- Empty `beforeBuildCommand`.
- Bundle inactive.
- Capability permissions remain `core:default`.
- No shell plugin.
- No updater plugin.
- No broad filesystem permission.
- No signing or notarization config.

## Browser Launcher Fallback

The browser launcher remains the fallback path for local use.

If the desktop shell is unavailable, blocked by platform policy, or unsuitable for a user's machine, the local browser launcher remains the supported fallback during this beta candidate phase.

## Desktop Beta Status Helper

The desktop beta status helper is implemented in `lib/desktop/desktop-beta-status.ts` and should be treated as a status and readiness surface only.

It may summarize beta posture such as local desktop readiness, fallback availability, and verification status. It must not run arbitrary shell commands, expose a command text box, launch terminals, execute Codex, execute Git, execute quality gates automatically, read credentials, or mutate local data.

## `desktop:verify:beta` Behavior

`desktop:verify:beta` is a bounded desktop beta verification command.

Its role is to check local beta readiness and report status. It must not sign, notarize, publish, distribute, auto-update, delete backups, clear local data, read auth files, read environment files, read tokens, run arbitrary shell input, execute Codex, execute Git, or perform automatic quality gate runs.

It performs static checks over package metadata, Tauri config, capability config, desktop beta helper files, and desktop beta scripts. It does not launch Tauri, open a browser, install dependencies, run production builds, execute Codex, mutate Git, run Quality Gates, restore backups, delete data, or deploy.

## Manual-Only Build Notes

Phase 13 does not introduce production build automation.

Any desktop build or packaging action remains manual-only. Phase 13 adds `desktop:verify:beta` and `desktop:check:beta`; it does not add a default `desktop:build:beta` production build path.

This documentation does not approve signing, notarization, auto updater setup, production installer distribution, or release publishing.

## Local Data Preservation Boundaries

Local data must be preserved by default.

Phase 13 verification must not require destructive cleanup, backup deletion, database deletion, archive deletion, or resetting user state. Cold start readiness means the app can start cleanly from the current local state; it does not mean erasing local data to simulate a new install.

## What Did Not Change

- No DB schema changed.
- No Codex runner policy changed.
- No quality gate allowlist changed.
- No backup/restore behavior changed.
- No archive cleanup behavior changed.
- No approved path behavior changed.
- No app behavior changed.
- No production release workflow was added.
- No signing or notarization was added.
- No auto updater was added.
- No Electron path was added.
- No cloud sync was added.
- No GitHub, Vercel, Supabase, auth, payment, team, MCP, or OpenAI integration was added.
- No ChatGPT App integration was added.
- No arbitrary shell, command text box, terminal, or `node-pty` capability was added.
- No automatic Codex, Git, or Quality Gate execution was added.

## Known Limitations

- Desktop beta is Mac-first only.
- The Tauri shell remains prototype/candidate status.
- Browser launcher fallback remains necessary.
- Production installer distribution is not available in this phase.
- Signing and notarization are not available in this phase.
- Auto updater is not available in this phase.
- No cloud sync or account recovery exists.
- Verification is limited to local beta readiness and documentation.

## Why Not Production Release

Phase 13 is a Desktop Beta / Distribution Candidate, not a production release.

A production release requires a separate release candidate QA pass, signing/notarization decisions, installer distribution policy, support expectations, rollback guidance, and release documentation. Those are Phase 14 or later concerns and require explicit GM approval.

## Why No Signing / Notarization

Signing and notarization create production distribution obligations and platform-specific release responsibilities.

Phase 13 only documents beta candidate readiness. It does not establish certificate management, notarization workflow, release identity, or production distribution trust.

## Why No Auto Updater

An auto updater would introduce persistent release infrastructure and remote update behavior.

That is outside the local-first desktop beta candidate boundary and must wait for a later approved production release phase.

## Why No Electron

The existing desktop prototype path is Tauri plus browser launcher fallback.

Adding Electron would create a second desktop runtime, dependency set, packaging path, and verification surface. Phase 13 is for hardening the existing beta candidate posture, not changing desktop strategy.

## Why No Cloud Sync

Codex Visual Office remains local-first.

Cloud sync would introduce account, storage, privacy, conflict, and network reliability concerns. It is not required for Desktop Beta / Distribution Candidate readiness and remains out of scope.

## Verification Commands / Results

Phase 13 verification:

```bash
npm run typecheck
npm run build
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

Results:

- `npm run desktop:verify:beta`: passed during implementation verification.
- Other verification commands are recorded in the final Phase 13 report.

## Next Recommendation

Recommended next phase: Phase 14 - Release Candidate QA / Documentation Hardening.

Phase 14 should remain gated by explicit GM approval and should focus on release candidate QA, final documentation hardening, and production-readiness decisions without backfilling forbidden Phase 13 behavior.
