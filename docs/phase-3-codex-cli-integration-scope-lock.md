# Phase 3 - Codex CLI Integration Scope Lock

## Phase 3 Goal

Phase 3 will connect Codex Visual Office to the locally installed Codex CLI through a CLI-first route.

The goal is to let the visual office hand selected local tasks to Codex CLI in a controlled, user-confirmed, local-only workflow while preserving existing Phase 2 local task persistence.

## Final Route Decision

Phase 3 follows the CLI-first route.

The app must integrate with the user's local `codex` command over time, not with the OpenAI API, not with ChatGPT app internals, and not with a cloud agent platform.

## Allowed in Phase 3

Phase 3 may implement:

- Safe Codex CLI availability display.
- Safe Codex CLI version display.
- Safe authentication status display without reading token contents.
- Local settings for CLI path and project execution paths.
- Prompt preview and dry-run task handoff records.
- Explicit user-confirmed Codex task dispatch.
- Scoped Codex CLI execution only after approval.
- Output stream display and local task event logging.
- SQLite persistence for CLI status, dispatch records, and task events.
- Visual work-pod state changes tied to task and Codex runtime status.

## Must Not Implement

Phase 3 must not implement:

- OpenAI API calls.
- Reading `~/.codex/auth.json`.
- Storing OpenAI credentials.
- Generic shell or terminal runner.
- Arbitrary command execution.
- `child_process` usage outside the approved scoped Codex CLI runner step.
- `node-pty`.
- Git watcher.
- File watcher.
- Automatic git push.
- Automatic deploy.
- GitHub API or GitHub App integration.
- Vercel integration.
- Supabase integration.
- Auth, payment, billing, or cloud sync.
- MCP server.
- Broad backend services.

## Security Boundaries

- CLI execution must be explicit and user-confirmed.
- CLI execution must be limited to the `codex` command.
- CLI execution must run only in a user-approved project path.
- The app must not expose a free-form shell input.
- The app must not execute package scripts, git commands, or deployment commands through the Phase 3 runner.
- Captured output must be treated as untrusted text.
- Secret-looking output should be redacted before UI display or persistence.

## Credential Boundaries

- The app must not read `~/.codex/auth.json`.
- The app must not read or persist OpenAI API keys.
- The app must not store Codex auth tokens.
- The app may represent auth status only through safe checks such as "available", "not available", or "unknown".
- Auth status display must avoid printing token values, file contents, or credential paths beyond general status labels.

## Local Execution Boundaries

- Step 1 may only detect command availability and safe version/status metadata.
- Step 2 may only generate and preview prompts or dry-run dispatch records.
- Step 3 may add a scoped runner, but only for the `codex` command and only with explicit confirmation.
- Step 4 may display output streams and persist task events, with redaction.
- No step may create a generic command executor.

## User-Confirmation Requirements

Before any real Codex CLI task execution:

- The user must see the target project path.
- The user must see the generated prompt or task handoff.
- The user must explicitly confirm dispatch.
- The app must show that no auto-push or auto-deploy will happen.

## No Arbitrary Shell Runner Rule

Phase 3 must never expose a generic shell runner.

The app must not accept arbitrary commands from UI input. Any runner introduced later must be limited to a controlled `codex` invocation shape.

## No Token Reading Rule

Phase 3 must not read token files or credential contents.

Specifically, it must not read `~/.codex/auth.json`, environment variables containing credentials, OpenAI API keys, OAuth tokens, or CLI auth secrets.

## No Automatic Push/Deploy Rule

Codex CLI integration must not automatically:

- Push to git remotes.
- Open pull requests.
- Deploy to Vercel or another host.
- Modify remote services.

Git and deployment actions remain outside Phase 3 unless explicitly scoped in a later approved phase.

## Step-by-Step Phase 3 Scope

### Step 1 - CLI Availability / Version / Auth Status Display Only

- Detect whether the `codex` command exists.
- Read Codex CLI version if safe.
- Display installed/not found state.
- Display auth status as available/not available/unknown without reading token contents.
- Do not run Codex tasks.
- Do not add a runner.
- Do not execute arbitrary commands.

### Step 2 - Task Prompt Handoff / Dry-Run

- Generate a Codex prompt from local task data.
- Preview the prompt in the UI.
- Mark a task as ready for Codex.
- Persist a dry-run dispatch record.
- Support copy/paste handoff.
- Do not execute Codex.

### Step 3 - Scoped CLI Runner

- Add explicit user-confirmed dispatch.
- Allow only controlled `codex` command execution.
- Run only in a user-approved project path.
- Save dispatch state and task event logs.
- Do not allow arbitrary shell command execution.
- Do not auto-push.
- Do not auto-deploy.

### Step 4 - Output Stream + Task Event Logging

- Capture Codex CLI output safely.
- Display current Codex work status in task/work-pod UI.
- Persist useful output milestones as task events.
- Redact secret-looking output.
- Do not expose secrets.

### Step 5 - Phase 3 Closeout

- Verify implementation boundaries.
- Verify no cloud integrations were added.
- Document known limitations.
- Confirm Phase 4 has not started.

## Acceptance Criteria

Phase 3 is acceptable when:

- CLI availability is visible without credential leakage.
- Prompt handoff exists before execution.
- Real execution, if implemented, is scoped to `codex` only.
- Every real execution requires explicit user confirmation.
- Task events persist locally.
- Work-pod status reflects Codex runtime state.
- No generic shell runner exists.
- No token files or token contents are read.
- No automatic git push or deployment exists.
- Verification confirms forbidden integrations remain absent.

## Failure Criteria

Phase 3 fails if it:

- Reads token contents or `~/.codex/auth.json`.
- Stores OpenAI credentials.
- Adds OpenAI API integration.
- Adds a generic terminal runner.
- Allows arbitrary command execution.
- Uses `node-pty`.
- Adds a Git watcher or file watcher.
- Auto-pushes or auto-deploys.
- Adds GitHub, Vercel, Supabase, auth, payment, or cloud sync.
- Starts execution before prompt preview and user confirmation exist.

## Implementation Status

Phase 3 implementation has not started.
