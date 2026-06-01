# Phase 3 Step 4 - Output Stream + Task Event Logging

## What Was Implemented

- Improved scoped Codex runner output observability without expanding execution permissions.
- Added bounded stdout and stderr preview capture.
- Added output truncation metadata for stdout and stderr.
- Added duration metadata to runner results and lifecycle event payloads.
- Added safe structured runner metadata to task event payloads.
- Updated Review Room runner status UI to show a reviewable execution report.
- Prioritized Review Activity display so runner lifecycle events remain visible in order.
- Added `scripts/verify-codex-runner-output-events.ts`.
- Added `npm run codex:verify:runner-output`.

## What Output Is Captured

- Bounded stdout preview.
- Bounded stderr preview.
- Whether stdout preview was truncated.
- Whether stderr preview was truncated.
- Runner status, startedAt, endedAt, durationMs, and exitCode when available.

## What Output Is Not Captured

- Unlimited output.
- Raw terminal streams.
- Credential files.
- Token stores.
- `~/.codex/auth.json` contents.
- OpenAI API credentials.

## Bounded Preview Limits

- Maximum stored stdout preview: 8,000 characters.
- Maximum stored stderr preview: 8,000 characters.
- Previews are truncated before being stored in task event payloads.

## Redaction Behavior

Runner output preview redaction removes obvious sensitive markers before storage:

- `OPENAI_API_KEY`
- `API_KEY`
- `TOKEN`
- `SECRET`
- `PASSWORD`
- `~/.codex`
- `auth.json`
- `sk-...` token-like strings

The redaction is intentionally conservative and does not replace a full secret-scanning system.

## Lifecycle Event Model

Task events can now carry safe structured metadata for:

- `runner_requested`
- `runner_started`
- `runner_output_received`
- `runner_completed`
- `runner_failed`

Payload metadata includes:

- `executionMode`
- `taskId`
- `projectId`
- `status`
- `startedAt`
- `endedAt`
- `durationMs`
- `exitCode`
- `stdoutPreview`
- `stderrPreview`
- `stdoutTruncated`
- `stderrTruncated`
- `cliTaskExecutionAttempted`
- `autoPushAttempted: false`
- `autoDeployAttempted: false`
- `arbitraryShellAllowed: false`

## UI Changes

The Review Room scoped runner area now shows:

- Runner Status
- Started At
- Ended At
- Duration
- Exit Code
- Stdout Preview
- Stderr Preview
- Truncation indicators
- Safety reminders for no arbitrary shell, no auto commit, no auto push, and no auto deploy

The UI remains an execution report, not a terminal emulator.

Review Activity now prioritizes runner lifecycle events in readable lifecycle order before showing remaining activity.

## Safety Boundaries

- The runner remains scoped to the detected Codex executable.
- Execution still uses `shell: false`.
- No command input box was added.
- No user-provided shell command strings are accepted.
- Generated prompt only.
- Approved project path remains required.
- Explicit user confirmations remain required.
- Output storage remains bounded.

## What Remains Forbidden

- Arbitrary shell execution.
- Terminal emulator.
- `node-pty`.
- Git watcher.
- File watcher.
- Quality gate runner.
- Auto commit.
- Auto push.
- Auto deploy.
- OpenAI API calls.
- API key storage.
- Credential store reads.
- GitHub, Vercel, Supabase, auth, payment, or cloud sync integrations.
- Phase 4 work.

## Verification Commands And Results

- `npm run typecheck` - passed during implementation.
- `npm run codex:verify:runner-output` - passed during implementation.

Full verification should also include:

- `npm run build`
- `npm run db:verify`
- `npm run db:verify:operations`
- `npm run db:verify:review`
- `npm run db:verify:selected-reads`
- `npm run codex:verify:cli`
- `npm run codex:verify:prompt-handoff`
- `npm run codex:verify:runner-safety`
- `npm run codex:verify:scoped-runner`
- `git diff --check`
- `git status`

## Known Limitations

- This step does not implement full live output streaming.
- This step does not implement a terminal view.
- Redaction is limited to obvious sensitive markers.
- Manual validation is still recommended for the Review Room run flow.

## Next Recommended Step

Phase 3 Step 4 manual validation, then Phase 3 Step 5 closeout if accepted.

Phase 4 has not started.
