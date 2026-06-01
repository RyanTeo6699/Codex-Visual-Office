# Phase 3 Step 2 - Codex Prompt Handoff / Dry-Run Dispatch

## What Was Implemented

Phase 3 Step 2 adds a safe Codex prompt handoff flow.

The app can now:

- Generate a Codex-ready prompt from an existing local task.
- Show the prompt in Review Room.
- Copy the prompt from the browser.
- Mark a task as ready for Codex.
- Record a dry-run dispatch event.
- Persist safe handoff events in local SQLite.

This step does not execute Codex CLI.

## Prompt Handoff Meaning

Prompt handoff means the app prepares a task prompt that a user can inspect and copy.

The generated prompt includes:

- project name
- project phase/status
- task title
- task summary when available
- current task status
- acceptance criteria
- forbidden scope
- mock changed files / expected work surface
- instructions to report files changed
- instructions to report verification commands and results
- instruction not to exceed task scope

The prompt does not include secrets, token paths, auth files, hidden environment data, real git diffs, or real project file contents.

## Dry-Run Dispatch Meaning

Dry-run dispatch means a local event records that the task was prepared for future Codex dispatch.

It does not:

- run `codex`
- pass the prompt to Codex CLI
- execute a task
- open a terminal
- run shell commands
- push or deploy

## Persisted Records

Step 2 persists local `task_events` only.

Stable event IDs:

```text
codex-prompt-handoff-{taskId}-mark_ready
codex-prompt-handoff-{taskId}-dry_run_dispatch
```

Payload fields include:

- `phase: "phase-3-step-2"`
- `mode`
- `promptHandoffOnly: true`
- `cliTaskExecutionAttempted: false`

The task status may be set to `ready` for handoff consistency. It is never set to `running` in this step.

No new table was added because local `task_events` is sufficient for this narrow dry-run record.

## UI Changes

Review Room now includes a `Codex Prompt Handoff` panel.

The panel shows:

- generated prompt preview
- Copy Prompt button
- Mark Ready for Codex button
- Dry-run Dispatch button
- `Dry-run only` label
- `Prompt handoff only. No CLI execution in this step.` label

Clipboard copy uses the browser clipboard API. If clipboard access is unavailable, the prompt remains visible in a read-only text area for manual copying.

## What Remains Forbidden

Step 2 does not add:

- Codex CLI task execution.
- Running `codex` with a prompt.
- Scoped CLI runner.
- Terminal runner.
- `node-pty`.
- Arbitrary child process command execution.
- OpenAI API.
- Reading `~/.codex/auth.json`.
- Credential storage.
- Real project file reads.
- Real git status reads.
- Git watcher.
- GitHub feature integration beyond normal git remote/push.
- Vercel.
- Supabase.
- Auth.
- Payment.
- Cloud sync.
- MCP server.
- Automatic push.
- Automatic deploy.

## Why Codex Execution Is Still Disabled

Phase 3 Step 2 exists to validate prompt construction, user inspection, copy handoff, and safe local dry-run event persistence before any real CLI runner is introduced.

Real execution must wait for Phase 3 Step 3, where scoped command constraints and explicit dispatch confirmation can be implemented and verified separately.

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
npm run codex:verify:prompt-handoff
git diff --check
git status
```

Expected prompt handoff verification:

```text
Codex prompt handoff verification passed
```

The summary should include:

- `provider-workspace`
- `task-provider-review`
- prompt length
- `prompt_handoff_only`
- ready event id
- dry-run event id
- `cliTaskExecutionAttempted: false`

## Next Recommended Step

Phase 3 Step 3 - Scoped CLI Runner.

Step 3 should add explicit user-confirmed dispatch and allow only controlled `codex` command execution in user-approved project paths.

Phase 3 Step 3 has not started.
