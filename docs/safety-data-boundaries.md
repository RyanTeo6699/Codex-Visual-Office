# Safety And Data Boundaries

## Local-Only Data

Codex Visual Office is local-first.

App data is intended to remain on the user's machine. The product does not require cloud sync, account login, remote database services, hosted dashboards, or external team workspaces.

Local records may include projects, tasks, review state, events, Quality Gate summaries, approved path records, backup metadata, archive records, launcher status, desktop beta candidate status, and safety status.

## No Token Storage

The app must not store tokens or secrets.

Forbidden secret handling includes:

- Storing API keys.
- Storing refresh tokens.
- Storing OAuth tokens.
- Storing cloud credentials.
- Storing SSH keys.
- Displaying secret contents.
- Copying secrets into app data.
- Syncing secrets elsewhere.

## No `auth.json` Or `.env` Reads

The app must not read:

- `~/.codex/auth.json`
- `.env`
- `.env.local`
- Token files.
- SSH keys.
- API key files.
- OAuth credential files.
- Cloud credential files.
- CLI credential stores.

Credential status must not be inferred by inspecting private files.

## Manual Approved Paths

Approved paths are manual records created by the user.

An approved path means "this is a workspace I want represented in the visual office." It does not mean "the app may scan everything under this path."

Approved paths must not authorize automatic source inspection, dependency detection, package script discovery, `.git` inspection, credential reads, or hidden project discovery.

## No Source Scanning

Codex Visual Office must not automatically scan project source trees.

Forbidden source-read behavior includes:

- Crawling approved directories.
- Reading source files.
- Reading package manifests.
- Reading lockfiles.
- Reading framework configs.
- Reading build configs.
- Reading test configs.
- Reading `.git` internals.
- Detecting project type from files on disk.
- Showing a file browser or source viewer without a future approved scope lock.

## Runner Safety

Runner-related UI and status must stay bounded.

Forbidden runner behavior includes:

- Arbitrary shell execution.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Automatic retries, resumes, approvals, commits, pushes, deploys, tests, or cleanup.
- Command discovery from project files.

Any future execution-capable behavior requires a separate GM-approved scope lock.

## Quality Gate Allowlist

Quality Gates must remain bounded by the existing allowlist posture.

They are not a general command runner. They must not become a terminal, script launcher, package script autodetector, arbitrary command box, or automatic CI replacement.

Quality Gate summaries should show configured status and recorded results without expanding execution authority.

## Backup And Restore Safety

Backup/restore behavior is local and conservative.

Safety requirements:

- No backup deletion.
- No destructive cleanup.
- No automatic backup pruning.
- No cloud backup provider.
- No cloud restore provider.
- No source tree scanning as part of backup status.
- No silent overwrite of local state.

Restore behavior should remain explicit and user-visible.

## Archive Dry-Run Safety

Archive dry-run behavior is for previewing retention posture.

A dry run must not delete:

- Archive records.
- Backup files.
- Project files.
- Source files.
- Git data.
- Local database files.
- App-owned state.

Destructive archive purge requires a future GM-approved scope lock.

## Localhost Launcher

The launcher is local-only.

It may help open the local app in a browser and report local launcher status. It must not add account login, cloud sync, external integrations, remote control, arbitrary shell input, terminal behavior, or production distribution behavior.

## Tauri Prototype Limits

The Tauri shell remains a prototype or beta candidate posture.

Current limits:

- Not a production desktop release.
- No signing.
- No notarization.
- No auto updater.
- No Electron replacement.
- No production installer distribution.
- No cloud account requirement.
- No broad filesystem permission.
- No shell plugin requirement.

Use the browser launcher fallback if the prototype shell is unavailable.

## Forbidden Capabilities

The following remain forbidden unless a future GM-approved phase explicitly changes them:

- Production release.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub integration.
- Vercel integration.
- Supabase integration.
- Auth.
- Login or registration.
- Payment.
- Billing.
- Team workspace or team permissions.
- MCP.
- ChatGPT App integration.
- OpenAI API integration.
- Arbitrary shell execution.
- Command text box.
- Terminal UI.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Real deployment automation.
- Source tree scanning.
- Credential file reading.
- Token storage.
- Destructive cleanup.
- Backup deletion.
- Archive purge.

## Verification

Use existing local verifiers to check safety posture:

```bash
npm run safety:verify:permissions
npm run codex:verify:runner-safety
npm run quality:verify:config
npm run backup:verify
npm run archive:verify
npm run local:launcher:verify
npm run tauri:verify:prototype
```

These checks should preserve local data and must not read credentials, scan source trees, connect to cloud services, or add new execution capabilities.
