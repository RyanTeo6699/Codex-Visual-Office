# Phase 12 - Safety / Permission Hardening

## What Implemented

Phase 12 consolidates existing local-first safety boundaries into a visible, verifiable, and auditable safety/permission layer without adding dangerous execution capabilities.

Implemented coverage:

- Phase 12 scope lock.
- Local Permission Model.
- Sensitive Path Guard.
- Safety Audit UI.
- Runner safety summary.
- Backup/restore safety summary.
- Archive/retention safety summary.
- Launcher/Tauri safety summary.
- Credential safety summary.
- Forbidden capabilities.
- No-new-permissions policy.
- No-auto-execution policy.
- No-source-read policy.
- No-cloud policy.
- Known limitations.
- Verification commands/results.
- Next phase recommendation.

This implementation adds safety helpers, a Safety Audit Room, verification, and documentation. It does not modify schemas, migrations, dependencies, runner policy, backup/restore behavior, archive cleanup behavior, launcher behavior, or Tauri capabilities.

## Local Permission Model

The local permission model treats Codex Visual Office as a local-first operator surface.

Permission state should be based on:

- App-owned local records.
- Explicitly registered approved path records.
- Static safety policy definitions.
- Existing bounded summaries from prior approved phases.
- User-visible documentation and verification results.

An approved path records where a project lives. It is not a grant to inspect the project source tree.

The model should make these permission categories visible:

| Category | Allowed Meaning | Boundary |
| --- | --- | --- |
| App-owned local data | Records created and managed by Codex Visual Office | Does not imply source, credential, or cloud access |
| Approved paths | User-declared project workspace locations | No directory crawl, source read, or package detection |
| Runner state | Existing local runner policy and recorded status | No automatic Codex, Git, Quality Gate, or shell execution |
| Backups | Existing backup/restore records and safety posture | No backup file deletion or destructive cleanup |
| Archive/retention | Existing archive summaries and dry-run-oriented retention posture | No destructive purge behavior |
| Launcher/Tauri | Local launcher and prototype shell status | No production packaging, Electron, or auto updater |
| Credentials | Policy-only credential safety state | No secret reads, validation, display, or storage |

## Sensitive Path Guard

Sensitive path guard behavior must remain conservative.

Phase 12 safety documentation requires these paths and file classes to remain blocked:

- `~/.codex/auth.json`
- `.env`
- `.env.local`
- Token files.
- SSH keys.
- API keys.
- OAuth credentials.
- CLI credential stores.
- Cloud provider credentials.
- `.git` internals.

Package manifests, lockfiles, configs, source files, and build/test files inside approved project paths are protected by the no-source-read boundary. They are not automatically scanned, read, or inspected by Phase 12.

Sensitive path guard consolidation should make the rule easier to audit. It must not add a file browser, folder picker, source viewer, automatic scanner, or credential checker.

## Safety Audit UI

A `/safety` UI is allowed in Phase 12.

It may show:

- Local permission model status.
- Approved path permission summary.
- Sensitive path guard summary.
- Runner safety summary.
- Backup/restore safety summary.
- Archive/retention safety summary.
- Launcher/Tauri safety summary.
- Credential safety summary.
- Forbidden capability summary.
- Verification status.

It must not show:

- Arbitrary command entry.
- Terminal emulator.
- Source viewer.
- File browser.
- Folder picker.
- Credential contents.
- Token setup.
- Automatic repair controls that execute commands.
- Destructive cleanup controls.
- Backup deletion controls.

## Runner Safety Summary

Runner safety summaries should describe the existing runner safety posture without changing it.

Required runner boundaries:

- No automatic Codex execution.
- No automatic task execution.
- No automatic retry, continue, resume, approve, reject, revise, commit, push, deploy, or test behavior.
- No arbitrary shell.
- No command text box.
- No terminal emulator.
- No `node-pty`.
- No command discovery from project files.
- No package script execution discovered from approved paths.

Runner safety may be summarized from existing local records and static policies only.

## Backup/Restore Safety Summary

Backup/restore safety summaries should explain the current local-first backup posture.

Required backup/restore boundaries:

- No backup file deletion.
- No destructive cleanup.
- No automatic cleanup of historical backup files.
- No cloud backup or cloud restore.
- No external storage provider integration.
- No source-tree scanning as part of backup summary display.

Backup summaries may show app-owned backup records and safety notes. Any future destructive cleanup requires a separate GM-approved scope lock.

## Archive/Retention Safety Summary

Archive/retention safety summaries should explain retention state without adding destructive behavior.

Required archive/retention boundaries:

- No destructive purge.
- No automatic deletion.
- No backup deletion.
- No source deletion.
- No project folder cleanup.
- No Git cleanup.

Archive summaries may describe existing archive records, retention status, and dry-run-oriented safety posture.

## Launcher/Tauri Safety Summary

Launcher/Tauri safety summaries should preserve the local prototype boundary.

Required launcher/Tauri boundaries:

- Browser-only launcher remains acceptable local fallback.
- Tauri remains prototype-only unless a future phase approves production packaging.
- No production Tauri packaging.
- No Electron implementation.
- No auto updater.
- No installer, code signing, or distribution release behavior.
- No cloud account requirement.
- No external integration requirement.

Launcher and shell summaries must not start packaging, install dependencies, launch production builds, or add desktop distribution behavior.

## Credential Safety Summary

Credential safety is policy-only in Phase 12.

The app must not:

- Read `~/.codex/auth.json`.
- Read `.env` or `.env.local`.
- Read token files, SSH keys, API keys, OAuth credentials, cloud credentials, or CLI credential stores.
- Store tokens.
- Validate OpenAI, GitHub, Vercel, Supabase, or other external account credentials.
- Display secrets.
- Sync credentials.

Credential readiness should not be inferred from private files. If credential-related status appears in the UI, it must be phrased as a safety policy or an existing non-secret local record.

## Forbidden Capabilities

Phase 12 must not add:

- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Arbitrary shell execution.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Project source reads.
- `package.json` auto-detection from approved paths.
- Folder picker.
- File browser.
- Source viewer.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- OpenAI API.
- Cloud sync.
- GitHub integration.
- Vercel integration.
- Supabase integration.
- Auth.
- Payment.
- Team workspace or team permissions.
- MCP.
- ChatGPT App.
- Production Tauri packaging.
- Electron.
- Auto updater.
- Destructive cleanup.
- Backup file deletion.
- Phase 13 implementation.

## What Did Not Change

This implementation does not change:

- Local database schema.
- Package dependencies.
- Codex runner behavior.
- Git observation behavior.
- Quality Gate behavior.
- Backup/restore behavior.
- Archive/retention behavior.
- Launcher behavior.
- Tauri prototype behavior.
- Approved path behavior.
- Credential handling behavior.

## No-New-Permissions Policy

Phase 12 may make safety state more visible and auditable. It must not create new permissions.

No Phase 12 work should require broader access to:

- Project files.
- Source directories.
- Credentials.
- Environment files.
- Shell execution.
- Git mutation.
- Quality Gate execution.
- Cloud services.
- External accounts.
- Destructive filesystem operations.

## No-Auto-Execution Policy

Phase 12 must not automatically run work.

The app must not automatically:

- Start Codex.
- Resume Codex.
- Run Git.
- Run Quality Gates.
- Run package manager scripts.
- Run tests.
- Run builds.
- Run deploys.
- Run cleanup.
- Delete backups.
- Execute user-entered commands.
- Execute commands discovered from project files.

Future execution-capable features require a separate GM-approved phase.

## No-Source-Read Policy

An approved project path is not permission to inspect source.

Phase 12 must not read:

- Source files.
- `package.json`.
- Lockfiles.
- Framework configs.
- Build configs.
- Test configs.
- `.git` internals.
- Env files.
- Auth files.
- Token files.
- Credential files.

Safety summaries should use app-owned local records, static policies, and previously approved bounded summaries.

## No-Cloud Policy

Phase 12 remains local-first.

It must not add:

- OpenAI API.
- GitHub API.
- Vercel integration.
- Supabase integration.
- Firebase.
- Cloud database.
- Cloud sync.
- Remote telemetry.
- Auth.
- Login/register.
- Payment.
- Billing.
- Team workspace.
- MCP.
- ChatGPT App.

Cloud, integration, and account behavior require a future GM-approved phase.

## Known Limitations

- The app cannot prove project source health without a future approved source-read phase.
- The app cannot infer package manager, framework, scripts, or build commands from approved paths.
- The app cannot verify Codex, OpenAI, GitHub, Vercel, Supabase, or cloud credentials by reading private files.
- The app cannot safely claim destructive retention behavior because backup deletion and destructive cleanup remain forbidden.
- The app cannot provide a terminal-like repair workflow in Phase 12.
- The app cannot provide folder browsing or source viewing in Phase 12.
- Production desktop distribution remains out of scope.

## Verification Commands / Results

Phase 12 implementation verification:

```bash
npm run typecheck
npm run build
npm run safety:verify:permissions
npm run ui:verify:virtual-office
git diff --check
```

Results:

- `npm run typecheck`: passed during implementation verification.
- `npm run build`: passed during implementation verification.
- `npm run safety:verify:permissions`: passed during implementation verification.
- `npm run ui:verify:virtual-office`: passed during implementation verification.
- `git diff --check`: passed during implementation verification.

## Next Phase Recommendation

Recommended next step:

- Phase 13 - Desktop Beta / Distribution Candidate, or Phase 13 Scope Lock, depending on GM decision.

Do not start Phase 13 unless GM explicitly approves it.

Any future phase that adds execution, source reads, project file browsing, credential handling, cloud sync, external integrations, production packaging, destructive cleanup, backup deletion, MCP, ChatGPT App, auth, payment, or team permissions requires a separate scope lock and verification plan.
