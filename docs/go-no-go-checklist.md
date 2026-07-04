# Go / No-Go Checklist

Required approver: GM / project owner.

## Preflight

- [ ] Working tree is clean before validation starts.
- [ ] Latest baseline includes `a8ef8e5 fix: stabilize release candidate` or later GM-approved commit.
- [ ] Branch is `main`.
- [ ] `main` tracks `origin/main`.
- [ ] No Phase 17 implementation has started.

## Verification Scripts

- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run production:verify:scope`
- [ ] `npm run rc:verify:stabilization`
- [ ] `npm run docs:verify:readiness`
- [ ] `npm run rc:verify:readiness`
- [ ] `npm run desktop:verify:beta`
- [ ] `npm run safety:verify:permissions`
- [ ] `npm run agent:verify:workflow`
- [ ] `npm run project:verify:workspace`
- [ ] `npm run ui:verify:virtual-office`
- [ ] `npm run codex:verify:runtime-reliability`
- [ ] `npm run local:launcher:verify`
- [ ] `npm run local:shell:verify`
- [ ] `npm run tauri:verify:prototype`
- [ ] `git diff --check`

## Browser / Manual Checks

- [ ] `/` loads.
- [ ] `/settings` loads.
- [ ] `/safety` loads.
- [ ] `/archive` loads.
- [ ] `/projects/provider-workspace` loads.
- [ ] `/review/task-provider-review` loads.
- [ ] Review Room 2.0 / Agent Workflow remains visible.
- [ ] Desktop width has no horizontal overflow.
- [ ] 390px mobile-ish width has no horizontal overflow.

## Data Safety Checks

- [ ] No token storage.
- [ ] No reading `~/.codex/auth.json`.
- [ ] No reading `.env` or `.env.local`.
- [ ] No cloud upload.
- [ ] No source backup.
- [ ] Backup / Restore only targets local SQLite DB.
- [ ] Archive cleanup remains dry-run only.
- [ ] No backup file deletion.

## Forbidden Controls Checks

- [ ] No production install control.
- [ ] No cloud sync control.
- [ ] No token input control.
- [ ] No command text box.
- [ ] No terminal emulator.
- [ ] No destructive cleanup button.
- [ ] No auto commit / push / deploy control.
- [ ] No auto updater control.

## Documentation Readiness

- [ ] Product capability inventory is complete.
- [ ] Production 1.0 boundary is explicit.
- [ ] Risk register is complete.
- [ ] Final RC validation matrix is complete.
- [ ] Known limitations are documented.
- [ ] Docs do not claim unsupported production capabilities.

## Known Limitations Review

- [ ] Codex CLI auth unknown.
- [ ] Tauri not signed/notarized.
- [ ] No production installer.
- [ ] No cloud sync.
- [ ] No team workspace.
- [ ] No full source indexing.
- [ ] No semantic code review.
- [ ] Archive dry-run only.
- [ ] UI remains beta-grade in some areas.

## Final Git Status

- [ ] `git status` is clean.
- [ ] Latest commit is pushed to `origin/main`.

## Decision Options

- `GO_FOR_PRODUCTION_1_FINALIZATION`
- `GO_WITH_CAUTION`
- `NO_GO_BLOCKED`

## Current Recommended Decision

`GO_WITH_CAUTION` for Production 1.0 Finalization planning, pending GM review of unsigned desktop distribution, installer strategy, and remaining beta UI limitations.
