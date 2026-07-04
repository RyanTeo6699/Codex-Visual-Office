# Phase 15 - Release Candidate Stabilization / Bug Bash

## Release Status

`RC_CANDIDATE_STABILIZED`

This phase stabilizes the local-first desktop beta / RC candidate. It is not a production release.

## What This Phase Implemented

- Phase 15 scope lock.
- RC stabilization static verifier.
- Roadmap status update.
- Verification hardening for the new RC stabilization script.
- Documentation consistency pass for the Release Candidate path.
- Route QA, responsive QA, and forbidden-controls checks.

## Bug Bash Summary

The Phase 15 bug bash focused on:

- Core route availability.
- Browser console and hydration checks.
- Responsive layout checks.
- Forbidden control absence.
- Documentation consistency.
- Static verifier coverage.

No business workflow was added or changed.

## Route QA Summary

Routes checked:

- `/`
- `/settings`
- `/safety`
- `/archive`
- `/projects/provider-workspace`
- `/review/task-provider-review`

Expected RC behavior:

- Each route loads.
- No console error or hydration mismatch is present during smoke checks.
- Settings and Safety expose local-first boundaries.
- Archive remains dry-run only.
- Review Room 2.0 keeps Prompt Handoff, Scoped Runner, Git Evidence, Scope Guard, Quality Gates, and Final Decision surfaces.

## Responsive QA Summary

Responsive checks cover:

- Desktop width.
- Tablet-ish width.
- 390px mobile-ish width.

Expected RC behavior:

- Critical controls remain visible.
- No horizontal overflow appears on core routes.
- Review and Settings surfaces remain readable on narrow screens.

## Copy And Docs Consistency Summary

Documentation and copy should consistently state:

- Local-first operation.
- Desktop beta / RC candidate status.
- No production installer yet.
- No code signing or notarization.
- No auto updater.
- No cloud sync.
- No team workspace.
- No auth or payment.
- No MCP / ChatGPT App.
- No token storage.
- No automatic source scanning.
- Backup/restore covers only the local SQLite database.
- Archive cleanup remains dry-run only.

## Verification Hardening Summary

Phase 15 adds:

```bash
npm run rc:verify:stabilization
```

This verifier checks:

- Required route files.
- Required RC documentation.
- Required package scripts.
- Forbidden dependency categories.
- Forbidden production/cloud/mutation scripts.
- Forbidden UI control markers.
- No schema/migration marker expansion.
- Static read-only verifier posture.

## What Did Not Change

Phase 15 did not change:

- DB schema or migrations.
- Dependencies.
- Core product functionality.
- Codex runner behavior.
- Quality Gate runner policy.
- Backup/restore behavior.
- Archive cleanup behavior.
- Git observation behavior.
- Scope Guard behavior.
- Tauri packaging configuration.
- Local launcher behavior.

## Known Limitations

- The product remains an RC candidate, not a production 1.0 release.
- There is no production installer.
- There is no code signing or notarization.
- There is no auto updater.
- There is no Electron build.
- There is no cloud sync.
- There is no team workspace.
- There is no auth/payment system.
- There is no MCP or ChatGPT App integration.
- Archive cleanup remains dry-run only.
- Approved project paths do not imply source scanning.

## Next Recommended Phase

Recommended next phase:

`Phase 16 - Final RC Validation`

Alternative GM decision:

`Phase 16 - Production 1.0 Scope Lock`

Either path must keep production release, signing, notarization, updater, cloud, team, auth, payment, MCP, ChatGPT App, destructive cleanup, and credential access behind explicit GM approval.

## Phase 16 Statement

Phase 16 has not started.
