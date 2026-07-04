# Release Candidate QA Checklist

## Purpose

This checklist prepares Codex Visual Office for Release Candidate review.

It verifies the current local-first desktop beta candidate. It does not approve production release, signing, notarization, auto updater, cloud sync, team workspace, MCP, ChatGPT App, or external service integration.

## Release Decision

Use one of these outcomes:

- `PASS`: required automated verification and manual route checks pass with no release-candidate blockers.
- `PASS_WITH_CAUTION`: required checks pass, but known limitations should be called out to GM before wider beta use.
- `BLOCKED`: required verification fails, a forbidden capability appears, or a core local route is unusable.

## Preflight

- Confirm working tree is clean before QA begins.
- Confirm current branch is `main`.
- Confirm `main` tracks `origin/main`.
- Confirm latest baseline includes `45b06ab feat: prepare desktop beta candidate`.
- Confirm no Phase 15 work has started.

Suggested commands:

```bash
git status
git log --oneline -20
git remote -v
git branch -vv
```

## Build And Typecheck

Required:

```bash
npm run typecheck
npm run build
```

Expected result:

- TypeScript passes.
- Next.js production build passes.

## DB Verification

Required for full QA:

```bash
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
```

Expected result:

- Local SQLite exists.
- Seed/read operations work.
- Review persistence works.
- Selected local reads still support Office Home, Project Room, and Review Room.

## Codex Verification

Required:

```bash
npm run codex:verify:runtime-reliability
```

Recommended full Codex verification:

```bash
npm run codex:verify:cli
npm run codex:verify:prompt-handoff
npm run codex:verify:runner-safety
npm run codex:verify:scoped-runner
npm run codex:verify:runner-output
```

Expected result:

- CLI availability can be detected safely.
- Auth may remain `cli_available_auth_not_verified` or equivalent unknown state.
- No `~/.codex/auth.json`, `.env`, token, or credential file is read.
- No automatic Codex task is executed.

## Git Observation Verification

Required for full QA:

```bash
npm run git:verify:snapshots
npm run git:verify:changed-files
npm run git:verify:diff-summary
npm run git:verify:scope-check
```

Expected result:

- Git observation remains bounded.
- No Git mutation is attempted.
- No full diff viewer or source file reader is introduced.
- Scope Guard remains path-level only.

## Quality Gates Verification

Required for full QA:

```bash
npm run quality:verify:config
npm run quality:verify:runner
npm run quality:verify:summary
```

Expected result:

- Quality Gate commands remain allowlisted.
- No command text box exists.
- No arbitrary shell, terminal emulator, or `node-pty` exists.
- Output previews stay bounded and redacted.

## Review Readiness Verification

Required:

```bash
npm run review:verify:readiness
```

Expected result:

- Review readiness states resolve correctly.
- Review decisions remain human-controlled.
- No automatic approve/reject behavior appears.

## Settings And Project Paths Verification

Required:

```bash
npm run settings:verify
npm run settings:verify:project-paths
```

Expected result:

- Local settings seed/read/write behavior works.
- Approved project paths are manual-only.
- No folder picker, full-disk scan, source scan, or sensitive path read is introduced.

## Backup Verification

Required:

```bash
npm run backup:verify
```

Expected result:

- Backup covers only `.local/codex-visual-office.sqlite`.
- Backup records are created.
- Restore dry-run does not overwrite current DB.
- Confirm restore creates a pre-restore safety backup.
- No source, token, env, or credential backup occurs.

## Archive Verification

Required:

```bash
npm run archive:verify
```

Expected result:

- Archive summary is generated.
- Retention preview remains dry-run only.
- No task events, quality events, backup records, backup files, or SQLite files are deleted.

## Safety Verification

Required:

```bash
npm run safety:verify:permissions
```

Expected result:

- Sensitive path guard rejects expected credential/token/env strings.
- Runner, backup, archive, launcher, Tauri, cloud, and credential boundaries remain safe.
- Forbidden attempts remain false.

## Agent Workflow Verification

Required:

```bash
npm run agent:verify:workflow
```

Expected result:

- Agent visual state, lifecycle summary, prompt version summary, run history, and workflow timeline remain readable.
- No automatic Codex, Git, Quality, browser, Tauri, install, deploy, shell, terminal, or cloud behavior is attempted.

## Project Workspace Verification

Required:

```bash
npm run project:verify:workspace
```

Expected result:

- Project workspace summary remains local and bounded.
- Approved path status is visible.
- No source scan, package auto-detect, Codex execution, Git mutation, Quality Gate runner execution, browser launch, Tauri launch, install, deploy, cloud, or dangerous shell is attempted.

## Desktop Beta Verification

Required:

```bash
npm run desktop:verify:beta
npm run local:launcher:verify
npm run local:shell:verify
npm run tauri:verify:prototype
```

Expected result:

- Desktop beta candidate status is safe.
- Browser launcher fallback is available.
- Tauri remains prototype-only.
- No production installer, code signing, notarization, auto updater, Electron, broad filesystem permissions, shell plugin, daemon, startup service, or cloud sync exists.

## Documentation Verification

Required:

```bash
npm run docs:verify:readiness
npm run rc:verify:readiness
```

Expected result:

- Required user/developer/setup/troubleshooting/safety/recovery/QA/Phase 14 docs exist.
- Docs mention local-first boundaries, no cloud sync, no token storage, no production installer yet, no auto updater, backup/restore dry-run, safety audit, and Codex auth unknown limitation.
- Docs do not claim unsupported production capability.
- Required route files and package scripts still exist.

## UI Verification

Required:

```bash
npm run ui:verify:virtual-office
```

Expected result:

- Office UI files remain present.
- No risky production/cloud/auth/payment/MCP UI surfaces are added.
- Settings, Archive, and Safety remain local-first.

## Browser Route Checks

Start the app:

```bash
npm run dev
```

Check these routes:

- `/`
- `/settings`
- `/safety`
- `/archive`
- `/projects/provider-workspace`
- `/review/task-provider-review`

Expected result:

- Each route loads.
- Browser console has no unexpected errors.
- Review Room 2.0 and Agent Workflow remain usable.
- Settings shows local shell, desktop beta, approved path, backup, archive, and safety posture.
- Safety Audit Room shows permission boundaries.
- Archive Room shows dry-run-only retention language.

## Responsive Checks

Check at:

- Desktop width.
- 390px mobile-ish width.

Expected result:

- Critical controls are visible.
- No horizontal overflow on `/settings`, `/safety`, or `/review/task-provider-review`.
- Text does not overlap critical controls.

## Forbidden Controls Check

Confirm the UI does not contain active controls for:

- Production install.
- Build DMG / EXE.
- Enable auto update.
- Cloud sync.
- Token input.
- Command textbox.
- Open terminal.
- Delete logs.
- Delete backups.
- Cleanup now.

Boundary text that says these capabilities are not implemented is acceptable.

## Final Git Status

Before release-candidate handoff:

```bash
git diff --check
git status
```

Expected result:

- Whitespace check passes.
- Working tree is clean after commit and push.
