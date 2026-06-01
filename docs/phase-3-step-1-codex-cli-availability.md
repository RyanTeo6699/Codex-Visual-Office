# Phase 3 Step 1 - Codex CLI Availability

## What Was Implemented

Phase 3 Step 1 adds a narrow Codex CLI availability detector and a small Office Home status panel.

The detector reports:

- whether the `codex` command is installed
- resolved CLI path
- `codex --version` output
- coarse auth status
- detection mode
- check timestamp

This step is safe detection only. It does not dispatch prompts or execute Codex tasks.

## Allowlisted Detection Commands

Only these exact detection commands are used:

```text
which codex
{resolved-codex-path} --version
```

Implementation notes:

- Commands are invoked with exact argument arrays.
- No user input is passed into command execution.
- No shell string is constructed.
- No arbitrary command execution API exists.
- No terminal runner exists.

## UI Display

Office Home now includes a small `Local Codex Runtime` status card in the secondary right-side status area.

The card displays:

- Installed / Not found
- Version
- Path
- Auth status
- Detection mode: Safe detection only
- A warning that task execution, prompt dispatch, terminal runner, and token inspection are not enabled

The office floor and core visual layout were not redesigned.

## Auth Status Meaning

Auth status is intentionally coarse.

Possible labels:

- `cli_unavailable`: Codex CLI was not found.
- `cli_available_auth_not_verified`: Codex CLI is available, but auth was not verified.
- `unknown`: Auth status is unknown.
- `not_checked`: Auth status was not checked.

Step 1 does not inspect token files, credential stores, environment secrets, or `~/.codex/auth.json`.

## Intentionally Not Implemented

This step does not add:

- Codex task execution.
- Dispatch to Codex.
- Prompt execution.
- Scoped CLI runner.
- Terminal runner.
- `node-pty`.
- Arbitrary command execution.
- OpenAI API integration.
- Git watcher.
- GitHub feature integration beyond normal git remote/push.
- Vercel integration.
- Supabase integration.
- Auth.
- Payment.
- Cloud sync.
- MCP server.
- Real project file reads from UI.
- Real git status reads from UI.
- Automatic push or deploy.

Phase 3 Step 2 has not started.

## Security Boundaries

- Detection is limited to allowlisted commands.
- Detection does not accept user-provided commands.
- Detection does not execute prompts.
- Detection does not inspect auth token files.
- Detection does not persist credentials.
- Detection does not print secrets.
- The app exposes no generic shell or terminal execution surface.

## Verification

Run:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
npm run codex:verify:cli
git diff --check
git status
```

Expected CLI verification:

```text
Codex CLI safe detection verification passed
```

The output should include:

- `installed`
- `path`
- `version`
- `authStatus`
- `detectionMode`
- `taskExecutionAttempted: false`

If `codex` is not found on PATH, the script reports `installed: false` without treating that as a crash.

## Forbidden Integrations Confirmation

Step 1 does not add forbidden integrations. It adds only exact allowlisted CLI detection.

Search hits for forbidden terms in this document or scope-lock documents are scope confirmations, not implementation.

## Next Recommended Step

Phase 3 Step 2 - Task Prompt Handoff / Dry-Run.

Step 2 should generate and preview Codex prompts from task data without executing Codex.
