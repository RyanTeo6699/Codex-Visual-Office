# Phase 6 - Local Productization Scope Lock

## Phase 6 Goal

Phase 6 turns Codex Visual Office from a local workflow prototype into a more usable local product shell.

The phase focuses on local settings, local project onboarding, approved local paths, local SQLite backup / restore planning, retention policy planning, and future local packaging evaluation.

## Core Positioning

Phase 6 core positioning:

Local Productization / 本地产品化封装

Phase 6 is still local-first. It is not a cloud productization phase, not a team workspace phase, not a ChatGPT App phase, and not a desktop packaging implementation phase.

## Allowed in Phase 6

Phase 6 may implement:

- Settings Center for local settings.
- Local Codex CLI status display.
- Local DB path display.
- Approved project paths management.
- Quality gate defaults display and later local configuration.
- Project Import Flow for explicitly approved local projects.
- Local SQLite backup / restore flow.
- Log retention policy planning and later guarded implementation.
- Archive Room planning and later UI.
- Local launcher planning.
- Tauri / Electron evaluation notes.
- Local-only product status indicators.

## Forbidden in Phase 6

Phase 6 must not implement:

- cloud sync
- team workspace
- ChatGPT App
- MCP server
- payment
- auth
- GitHub API
- Vercel integration
- Supabase integration
- OpenAI API
- Tauri implementation
- Electron implementation
- desktop packaging implementation
- auto updater
- arbitrary shell runner
- command text box
- terminal emulator
- `node-pty`
- auto fix
- auto git add
- auto git commit
- auto git push
- auto deploy
- full disk scan
- automatic project file content indexing
- token / credential storage

## Settings Center Boundary

Settings Center may show and manage local-only settings:

- Codex CLI path / status.
- Local DB path.
- Approved project paths.
- Quality gate defaults.
- Local app status.
- Backup / Restore entry points.
- Log retention policy entry points.

Settings Center must not:

- upload settings to cloud.
- sync settings remotely.
- read `~/.codex/auth.json`.
- store OpenAI tokens.
- expose arbitrary command inputs.
- run commands outside existing allowlisted flows.
- implement desktop packaging.

## Project Import Flow Boundary

Project Import Flow may:

- let the user explicitly provide or choose a local project path.
- create or update a project record.
- persist an approved local path.
- show local path status.

Project Import Flow must not:

- scan the whole disk.
- recursively inspect arbitrary files by default.
- read file contents automatically.
- execute Codex automatically.
- execute Git automatically.
- add cloud repository integrations.
- add GitHub API integration.

## Approved Project Paths Boundary

Approved project paths are local trust records.

They may store:

- project id.
- local path.
- approval state.
- approval timestamp.
- label.

They must not:

- imply permission to scan the whole machine.
- imply permission to read arbitrary file content.
- bypass explicit user confirmation for runner actions.
- store credentials.
- store tokens.

## Local DB Path / Backup / Restore Boundary

Local DB handling may:

- show the active SQLite path.
- plan and later implement local backups.
- export backup files to explicit local paths.
- import backup files with explicit user confirmation.
- record backup metadata.

Local DB handling must not:

- upload backups to cloud.
- auto sync backups remotely.
- read secrets or token files.
- delete data without explicit confirmation.
- perform destructive reset by default.

## Log Retention Boundary

Log retention may cover:

- `task_events`.
- runner output previews.
- quality gate output previews.
- archived review records.

Retention must:

- be local-only.
- default to non-destructive behavior.
- require explicit user confirmation before deletion.
- preserve clear audit information.

Retention must not:

- silently delete user data.
- perform automatic cleanup by default.
- delete backup records without confirmation.

## Local App Shell Boundary

Local app shell planning may cover:

- local startup experience.
- npm launcher scripts.
- simple local health indicators.
- local-only product status.
- future packaging requirements.

Local app shell planning must not:

- implement a packaged desktop app in this phase without explicit approval.
- add auto update infrastructure.
- add cloud deployment.
- add background services beyond the local app.

## Tauri / Desktop Packaging Boundary

Phase 6 may evaluate Tauri and Electron.

Phase 6 must not:

- install Tauri.
- install Electron.
- add desktop packaging dependencies.
- create native app bundles.
- add auto updates.
- ship a desktop installer.

Desktop packaging remains a future decision unless explicitly approved.

## Explicit Non-Goals

Phase 6 does not do cloud sync.

Phase 6 does not do team workspace.

Phase 6 does not do ChatGPT App or MCP.

Phase 6 does not do payment.

Phase 6 does not do auth.

## Phase 6 Step-by-Step Plan

### Step 1: Settings Center

- Manage local settings.
- Display Codex CLI path / status.
- Display local DB path.
- Display approved project paths.
- Display quality gate defaults.
- Do not do cloud sync.
- Do not do desktop packaging.
- Do not perform real backup / restore execution.

### Step 2: Project Import Flow

- Allow the user to add a local project.
- Require explicit user input or selection for project path.
- Save only approved project paths.
- Do not scan the full disk.
- Do not read arbitrary file contents.
- Do not auto execute Codex.
- Do not auto execute Git.

### Step 3: Backup / Restore

- Add local SQLite backup planning and guarded implementation.
- Support local export / import.
- Make backup file paths explicit.
- Do not upload to cloud.
- Do not auto sync.
- Do not read tokens or secrets.

### Step 4: Log Retention / Archive Room

- Manage retention for `task_events`, runner output previews, and quality gate output previews.
- Do not delete unconfirmed user data.
- Do not add destructive cleanup as default behavior.
- Plan Archive Room visualization.

### Step 5: Local App Shell Planning

- Plan local startup experience.
- Plan npm script / launcher.
- Evaluate Tauri.
- Do not implement Tauri.
- Do not implement Electron.
- Do not add auto updater.

### Step 6: Phase 6 Closeout

- Close Phase 6.
- Verify local productization boundaries.
- Confirm cloud / team / ChatGPT App have not started.

## Acceptance Criteria

Phase 6 is acceptable only if:

- Settings Center is local-only.
- Project import requires explicit path approval.
- Approved project paths are persisted locally.
- Backup / restore is local-only and confirmation-gated.
- Log retention is non-destructive by default.
- Archive Room remains local-only.
- No cloud sync is added.
- No team workspace is added.
- No ChatGPT App / MCP is added.
- No payment or auth is added.
- No desktop packaging implementation is added without explicit approval.
- Existing verification commands continue to pass.

## Failure Criteria

Phase 6 fails if it adds:

- cloud sync.
- team workspace.
- ChatGPT App or MCP server.
- auth or payment.
- GitHub / Vercel / Supabase integration.
- OpenAI API.
- arbitrary shell runner.
- command text box.
- terminal emulator.
- `node-pty`.
- automatic project file scanning.
- token or credential storage.
- destructive backup / restore / cleanup by default.
- Tauri / Electron implementation without approval.

## Implementation Status

Phase 6 implementation has not started.
