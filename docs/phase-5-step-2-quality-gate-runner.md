# Phase 5 Step 2 - Quality Gate Runner

## What Was Implemented

Phase 5 Step 2 adds a controlled local Quality Gate Runner for Codex Visual Office.

The runner executes only configured, enabled, allowlisted quality gate commands. It does not accept user-provided commands and does not provide a terminal or shell interface.

Implemented surfaces:

- `quality_gate_runs` local SQLite table.
- `quality_gate_events` local SQLite table.
- Quality gate run/event repositories and operations.
- Controlled runner helper under `lib/quality-gates/`.
- Review Room server action for running configured quality gates.
- Review Room Quality Gates panel with result previews.
- `quality:verify:runner` verification script.

## quality_gate_runs Data Model

The `quality_gate_runs` table records one bounded result for a single configured quality gate run.

Fields:

- `id`
- `task_id`
- `project_id`
- `config_id`
- `command_key`
- `command`
- `status`: `pending`, `running`, `passed`, `failed`, `skipped`, or `blocked`
- `exit_code`
- `duration_ms`
- `stdout_preview`
- `stderr_preview`
- `stdout_truncated`
- `stderr_truncated`
- `skipped_reason`
- `failed_reason`
- `started_at`
- `ended_at`
- `created_at`

The table stores bounded stdout/stderr previews only. It does not store full terminal output, tokens, credentials, or file contents.

## quality_gate_events Data Model

The `quality_gate_events` table records lifecycle events for quality gate runs.

Fields:

- `id`
- `run_id`
- `task_id`
- `project_id`
- `event_type`
- `payload_json`
- `created_at`

Supported event types:

- `quality_gate_queued`
- `quality_gate_started`
- `quality_gate_passed`
- `quality_gate_failed`
- `quality_gate_skipped`
- `quality_gate_blocked`

## Allowlisted Commands

Only these fixed mappings are executable:

- `npm_typecheck` -> `npm run typecheck`
- `npm_build` -> `npm run build`
- `npm_lint` -> `npm run lint`
- `npm_test` -> `npm test`
- `npm_run_test` -> `npm run test`
- `git_diff_check` -> `git diff --check`

Each command is split into an executable and fixed args before execution:

- `npm`, `["run", "typecheck"]`
- `npm`, `["run", "build"]`
- `npm`, `["run", "lint"]`
- `npm`, `["test"]`
- `npm`, `["run", "test"]`
- `git`, `["diff", "--check"]`

The runner uses `execFile` with `shell:false`.

## Forbidden Commands

The runner rejects:

- Unknown `command_key`.
- Command text that does not exactly match the fixed allowlist.
- `allowlisted=false` configs.
- Arbitrary shell commands.
- User-entered command strings.
- Custom args.

The UI does not expose a command text box.

## Runner Safety Boundary

The runner does not implement:

- Arbitrary shell execution.
- `shell:true`.
- `node-pty`.
- Terminal emulator.
- Command text box.
- Auto fix.
- Auto git add.
- Auto git commit.
- Auto git push.
- Auto deploy.
- GitHub API.
- Vercel integration.
- Supabase integration.
- OpenAI API.
- Auth, payment, cloud sync, or MCP server.

Disabled configs are recorded as `skipped` with `config_disabled`.

For npm-based quality gates, missing package scripts are recorded as `skipped` with `script_not_available`. The runner reads only project `package.json` for this check.

## stdout/stderr Bounded Preview

stdout and stderr previews are bounded to 8,000 characters each.

The runner records:

- `stdout_truncated`
- `stderr_truncated`

Large output is truncated before it is persisted or displayed.

## Redaction Behavior

Output previews redact obvious sensitive markers:

- `OPENAI_API_KEY`
- `API_KEY`
- `TOKEN`
- `SECRET`
- `PASSWORD`
- `AUTH`
- `.env`
- `.env.local`
- `~/.codex`
- `auth.json`

The runner does not read `~/.codex/auth.json` and does not persist tokens or credentials.

## Review Room UI Changes

Review Room now shows a Quality Gates panel.

The panel shows:

- Configured gates.
- Enabled/disabled state.
- Allowlisted state.
- `Run Enabled Quality Gates` button.
- Status for each gate.
- Exit code.
- Duration.
- Skipped/failed reason.
- Bounded stdout preview.
- Bounded stderr preview.
- Truncated indicators.

The button safety note states:

> Only allowlisted commands are executed. No auto fix, commit, push, or deploy.

The UI does not include a command text box, arbitrary command input, auto fix, auto commit, auto push, or auto deploy control.

## What Has Not Been Implemented

This step does not implement:

- Phase 5 Step 3 UI polish.
- Review Room 2.0 full consolidation.
- Arbitrary quality gate selection.
- Custom command editing.
- Terminal streaming.
- Full terminal output.
- Auto repair.
- Auto commit/push/deploy.
- Cloud integrations.

## Verification Commands and Results

Initial RED verification:

```bash
npm run quality:verify:runner
```

Result: failed because runner modules did not exist yet.

Final Step 2 verification:

```bash
npm run quality:verify:runner
```

Result: passed.

Summary:

- `executedCommandKey`: `git_diff_check`
- `executedCommand`: `git diff --check`
- `executedStatus`: `passed`
- `skippedDisabledStatus`: `skipped`
- `shellFalse`: `true`
- `unknownCommandRejected`: `true`
- `mismatchedCommandRejected`: `true`
- `nonAllowlistedRejected`: `true`
- `arbitraryShellRejected`: `true`
- `stdoutBounded`: `true`
- `stderrBounded`: `true`
- `redactionVerified`: `true`
- `runPersisted`: `true`
- `eventsPersisted`: `true`
- `commandTextBoxImplemented`: `false`
- `nodePtyImplemented`: `false`
- `terminalEmulatorImplemented`: `false`
- `autoFixAttempted`: `false`
- `autoCommitAttempted`: `false`
- `autoPushAttempted`: `false`
- `autoDeployAttempted`: `false`

Additional verification run during implementation:

```bash
npm run typecheck
```

Result: passed.

## Next Recommended Step

Phase 5 Step 3: Quality Gate UI polish / results consolidation.

Do not proceed directly to full Review Room 2.0 reconstruction before stabilizing quality gate result presentation.
