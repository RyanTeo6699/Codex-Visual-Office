# Phase 6 - Local Productization Plan

## Proposed Architecture

Phase 6 should add a local productization layer on top of the existing local-first app.

The architecture should remain:

- Next.js UI.
- Local SQLite persistence.
- Explicit user-approved project paths.
- Existing controlled Codex and Quality Gate boundaries.
- No cloud service dependency.

New Phase 6 surfaces should be local product surfaces:

- Settings Center.
- Project Import Flow.
- Backup / Restore.
- Log Retention.
- Archive Room.
- Local App Shell planning.

## Settings Data Model Plan

Planned table:

```txt
local_settings
- key
- value_json
- updated_at
```

Purpose:

- Store local UI and product settings.
- Store local-only preferences.
- Store display configuration for quality gate defaults.
- Store non-secret app metadata.

Rules:

- Do not store tokens.
- Do not store credentials.
- Do not read or store `~/.codex/auth.json`.
- Do not sync settings remotely.

## Project Import Data Model Plan

Project import should build on existing `projects` records and approved path records.

Project import should collect:

- project name.
- optional label.
- explicit local path.
- local path approval state.

It must not:

- scan the full disk.
- recursively read arbitrary files.
- auto run Git.
- auto run Codex.

## Approved Project Path Model

Planned table:

```txt
approved_project_paths
- id
- project_id
- local_path
- approved
- approved_at
- label
- created_at
- updated_at
```

Purpose:

- Persist explicit user approval for a local project path.
- Show approved path state in Settings Center and Project Room.
- Provide a local trust boundary for scoped actions.

Rules:

- Approval is path-level only.
- Approval does not authorize full disk scans.
- Approval does not authorize reading arbitrary file contents.
- Approval does not bypass per-run safety confirmations.

## Backup / Restore Plan

Planned table:

```txt
backup_records
- id
- backup_path
- backup_kind
- created_at
- note
```

Backup plan:

- Export local SQLite database to a user-visible local path.
- Record backup metadata.
- Show backup status in Settings Center.
- Require explicit user action.

Restore plan:

- Import from an explicit local backup file path.
- Require confirmation before replacing or merging data.
- Validate backup shape before restore.
- Keep destructive restore behavior guarded.

Rules:

- Do not upload backups to cloud.
- Do not auto sync backups.
- Do not read token files.
- Do not include `.env`, `.env.local`, `~/.codex`, or `auth.json` content.

## Log Retention Plan

Planned table:

```txt
retention_policies
- id
- target
- retention_days
- enabled
- created_at
- updated_at
```

Targets may include:

- `task_events`
- scoped runner output previews
- quality gate output previews
- archived review activity

Rules:

- Retention is disabled or non-destructive by default.
- Deletion requires explicit user confirmation.
- Preview cleanup should not delete core task records.
- Retention actions must be auditable.

## Archive Room Plan

Archive Room should visualize historical local work.

Planned views:

- historical tasks.
- review records.
- runner status history.
- quality gate result history.
- backup records.
- retention policy state.

Archive Room must remain local-only.

It should not become:

- cloud analytics.
- team audit log.
- hosted reporting.
- remote backup dashboard.

## Local Launcher Plan

Phase 6 should plan a local launcher experience before adding packaging.

Options to evaluate:

- npm script wrapper.
- shell launcher script.
- local status page.
- local health check display.

The launcher should:

- start the local app.
- show the app URL.
- keep setup local.
- avoid background cloud services.

The launcher must not:

- auto update.
- auto deploy.
- phone home.
- require cloud auth.

## Tauri / Desktop Packaging Future Evaluation

Tauri and Electron can be evaluated in Phase 6 planning.

Evaluation criteria:

- local filesystem permission model.
- app startup experience.
- SQLite file location.
- update strategy.
- notarization / signing requirements.
- bundle size.
- security boundaries.

Phase 6 must not directly implement:

- Tauri.
- Electron.
- native bundle.
- auto updater.
- desktop installer.

## UI Changes Plan

### Settings Center

Planned sections:

- Codex CLI status.
- Local DB status.
- Approved project paths.
- Quality gate defaults.
- Backup / Restore.
- Log retention.
- Local app info.

### Project Room

Planned additions:

- import / approved path state.
- local path status.
- project health summary.
- local-only warnings when path is missing or unapproved.

### Office Home

Planned additions:

- local-only status.
- project import CTA.
- backup warning / storage health badge.
- local product health summary.

### Archive Room

Planned additions:

- historical tasks.
- review records.
- backup records.
- log retention state.

## Verification Strategy

Phase 6 implementation should continue running:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
npm run codex:verify:cli
npm run codex:verify:prompt-handoff
npm run codex:verify:runner-safety
npm run codex:verify:scoped-runner
npm run codex:verify:runner-output
npm run git:verify:snapshots
npm run git:verify:changed-files
npm run git:verify:diff-summary
npm run git:verify:scope-check
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
npm run review:verify:readiness
git diff --check
```

Future Phase 6-specific verification should include:

- settings model verification.
- approved path verification.
- import flow verification.
- backup metadata verification.
- restore guard verification.
- retention policy verification.
- no cloud / no token / no auto cleanup verification.

## Risk Mitigations

### Risk: Accidental Full Disk Scan

Mitigation:

- require explicit path input or selection.
- never recursively enumerate unrelated paths by default.
- verify import only stores the selected path.

### Risk: Secret Exposure

Mitigation:

- never read `~/.codex/auth.json`.
- never store OpenAI tokens.
- redact sensitive markers from previews.
- exclude `.env` and `.env.local` from backup content planning.

### Risk: Destructive Restore or Cleanup

Mitigation:

- no destructive default behavior.
- require explicit confirmation.
- record backup / retention events.
- separate preview from execution.

### Risk: Scope Creep into Cloud Product

Mitigation:

- no cloud sync.
- no team workspace.
- no auth.
- no payment.
- no GitHub / Vercel / Supabase integration.

### Risk: Desktop Packaging Complexity

Mitigation:

- evaluate Tauri / Electron first.
- do not install dependencies in planning.
- do not add native packaging until explicitly approved.

## Recommended File Structure for Later Implementation

Potential files for later steps:

```txt
app/settings/page.tsx
app/archive/page.tsx
components/settings/SettingsCenter.tsx
components/settings/CodexCliSettingsCard.tsx
components/settings/LocalDbSettingsCard.tsx
components/settings/ApprovedProjectPathsPanel.tsx
components/settings/BackupRestorePanel.tsx
components/settings/RetentionPolicyPanel.tsx
components/projects/ProjectImportFlow.tsx
components/archive/ArchiveRoom.tsx
lib/local-db/repositories/local-settings.ts
lib/local-db/repositories/approved-project-paths.ts
lib/local-db/repositories/backup-records.ts
lib/local-db/repositories/retention-policies.ts
lib/local-db/operations/local-settings.ts
lib/local-db/operations/approved-project-paths.ts
lib/local-db/operations/backups.ts
lib/local-db/operations/retention-policies.ts
lib/productization/project-import.ts
lib/productization/backup-restore.ts
lib/productization/retention.ts
scripts/verify-local-product-settings.ts
scripts/verify-project-import.ts
scripts/verify-backup-restore.ts
scripts/verify-retention-policy.ts
```

These files are recommendations only. This planning step does not create them.

## Phase 6 Step-by-Step Implementation Plan

### Step 1: Settings Center

Goal:

- Build a local Settings Center.

Implementation plan:

- Add local settings repository and operations.
- Add settings selected read.
- Add Settings Center route.
- Display Codex CLI path / status.
- Display local DB path.
- Display approved project paths.
- Display quality gate defaults.
- Do not perform backup / restore execution.
- Do not add cloud sync or desktop packaging.

Verification:

- typecheck
- build
- settings-specific verification
- existing full verification chain

### Step 2: Project Import Flow

Goal:

- Add explicit local project import.

Implementation plan:

- Add approved project path model.
- Add project import operation.
- Add project import UI.
- Require explicit path input or selection.
- Store only approved project path.
- Do not scan full disk.
- Do not read file contents.
- Do not auto execute Codex or Git.

Verification:

- project import verification.
- no full disk scan verification.
- no auto Git / Codex verification.

### Step 3: Backup / Restore

Goal:

- Add guarded local SQLite backup and restore.

Implementation plan:

- Add backup records model.
- Add backup export operation.
- Add restore validation operation.
- Add confirmation-gated restore.
- Add Settings Center UI entry.
- Keep all paths local.

Verification:

- backup metadata verification.
- restore guard verification.
- no cloud upload verification.
- no token read verification.

### Step 4: Log Retention / Archive Room

Goal:

- Plan and implement safe local retention / archive views.

Implementation plan:

- Add retention policy model.
- Add non-destructive retention preview.
- Add explicit confirmation for cleanup.
- Add Archive Room route.
- Show historical tasks, review records, backup records, and retention status.

Verification:

- retention preview verification.
- no destructive cleanup by default verification.
- archive selected read verification.

### Step 5: Local App Shell Planning

Goal:

- Improve local startup and product shell planning.

Implementation plan:

- Add local app info display.
- Add launcher script plan if approved.
- Evaluate Tauri / Electron in docs.
- Do not install Tauri or Electron.
- Do not add auto updater.

Verification:

- no dependency change verification.
- no desktop packaging verification.

### Step 6: Phase 6 Closeout

Goal:

- Close Phase 6.

Implementation plan:

- Write Phase 6 closeout document.
- Run complete verification.
- Confirm no cloud / team / ChatGPT App / MCP / payment / auth started.
- Commit and push closeout.

## Implementation Status

Phase 6 implementation has not started.
