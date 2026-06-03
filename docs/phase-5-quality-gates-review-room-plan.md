# Phase 5 Quality Gates + Review Room 2.0 Plan

## Phase 5 Proposed Architecture

Phase 5 should extend the existing local-first architecture with quality gate configuration, bounded quality gate run records, and a more organized Review Room 2.0.

The architecture should remain:

- local SQLite persistence
- local repository / operation helpers
- Review Room selected reads
- task event lifecycle records
- allowlisted command execution only in the later runner step
- bounded output previews
- no cloud services
- no OpenAI API
- no image generation

This is a planning document only. Phase 5 implementation has not started.

## Quality Gate Config Model

Quality gate config should be project-scoped.

Planned fields:

- `id`
- `project_id`
- `name`
- `command_key`
- `command`
- `enabled`
- `allowlisted`
- `created_at`
- `updated_at`

The `command_key` should be a stable internal identifier. The `command` should be derived from an allowlisted command catalog, not from arbitrary user text.

## Allowed Command Model

Allowed command candidates:

- `npm run typecheck`
- `npm run build`
- `npm run lint`
- `npm test`
- `npm run test`
- `git diff --check`

Future implementation must:

- check project config before enabling lint/test commands
- represent commands as executable plus args
- use `execFile` or `spawn`
- use `shell: false`
- reject any command not in the allowlist
- avoid user-editable command strings

Example command-key model:

- `npm_typecheck` -> `npm`, args `["run", "typecheck"]`
- `npm_build` -> `npm`, args `["run", "build"]`
- `npm_lint` -> `npm`, args `["run", "lint"]`
- `npm_test` -> `npm`, args `["test"]`
- `npm_run_test` -> `npm`, args `["run", "test"]`
- `git_diff_check` -> `git`, args `["diff", "--check"]`

## Forbidden Command Model

Forbidden commands:

- arbitrary user input shell command
- `rm -rf`
- `sudo`
- `chmod`
- `chown`
- `curl | sh`
- `brew install`
- `npm install`, unless a dependency phase is separately approved later
- `git add`
- `git commit`
- `git push`
- `git pull`
- `git reset`
- `git clean`
- `git checkout`
- `git switch`
- `git merge`
- `git rebase`
- `git stash`
- `git tag`
- deploy command
- `vercel deploy`
- `docker deploy`
- `docker compose up`
- `pm2 restart`
- `scp` or `rsync` to production
- any command containing credentials or tokens

Forbidden execution surfaces:

- `shell: true`
- command text box
- arbitrary shell runner
- terminal emulator
- `node-pty`
- interactive shell sessions

## Quality Gate Run Lifecycle

Planned lifecycle:

1. `pending`: configured but not run for current task.
2. `running`: allowlisted command started.
3. `passed`: command exits `0`.
4. `failed`: command exits non-zero.
5. `skipped`: config disabled or command unavailable.
6. `blocked`: command rejected by allowlist, safety policy, missing project path, or forbidden marker.

Lifecycle events should be written to `task_events` and a dedicated quality gate event table.

Suggested event types:

- `quality_gate_requested`
- `quality_gate_started`
- `quality_gate_output_received`
- `quality_gate_passed`
- `quality_gate_failed`
- `quality_gate_skipped`
- `quality_gate_blocked`

## Quality Gate Result Storage Model

Planned table: `quality_gate_configs`

- `id`
- `project_id`
- `name`
- `command_key`
- `command`
- `enabled`
- `allowlisted`
- `created_at`
- `updated_at`

Planned table: `quality_gate_runs`

- `id`
- `task_id`
- `project_id`
- `config_id`
- `status`
- `exit_code`
- `duration_ms`
- `stdout_preview`
- `stderr_preview`
- `stdout_truncated`
- `stderr_truncated`
- `started_at`
- `ended_at`
- `created_at`

Planned table: `quality_gate_events`

- `id`
- `run_id`
- `task_id`
- `project_id`
- `event_type`
- `payload_json`
- `created_at`

## Review Room 2.0 UI Plan

Review Room should become a structured review surface rather than a loose sequence of panels.

Planned Review Room additions:

- Quality Gates panel
- Run Checks button, only for allowlisted commands
- results table
- failed output preview
- retry selected check action

Review Room should integrate:

- task summary
- Codex prompt handoff
- runner status
- Git snapshot
- changed files
- diff summary
- scope guard
- quality gates
- final review decision

UI boundaries:

- no complete terminal
- no command text box
- no arbitrary command input
- no auto fix button
- no auto commit / push / deploy button
- no AI summary
- no cloud sync
- no team permissions

## Project Room UI Plan

Project Room may show:

- latest quality gate status summary
- project quality gate config status
- count of enabled checks
- recent failed check indicator

This should be summary-only. It should not run commands from Project Room unless separately approved in a later scoped step.

## Office Home UI Plan

Office Home should not be broadly redesigned in Phase 5.

Future optional addition:

- project health badge based on recent quality gate state

## Existing Data Relationships

Quality gates should connect to existing data as follows:

- `tasks`: each run belongs to one task.
- `task_events`: lifecycle events are visible in Review Activity.
- runner events: quality gates run after or beside scoped runner results, not as a replacement.
- `git_snapshots`: quality gate runs may reference the same task context but should not mutate snapshots.
- `file_changes`: quality gate results can be reviewed beside changed paths.
- `diff_summaries`: quality gate failures can be compared with changed-file scale.
- `scope_checks`: scope guard remains separate; quality gates do not override scope status.

## SQLite Data Model Extension Recommendation

Add these tables in a future implementation step:

- `quality_gate_configs`
- `quality_gate_runs`
- `quality_gate_events`

Suggested relationships:

- `quality_gate_configs.project_id` -> `projects.id`
- `quality_gate_runs.task_id` -> `tasks.id`
- `quality_gate_runs.project_id` -> `projects.id`
- `quality_gate_runs.config_id` -> `quality_gate_configs.id`
- `quality_gate_events.run_id` -> `quality_gate_runs.id`
- `quality_gate_events.task_id` -> `tasks.id`
- `quality_gate_events.project_id` -> `projects.id`

Suggested status enum:

- `pending`
- `running`
- `passed`
- `failed`
- `skipped`
- `blocked`

## Output Truncation And Sensitive Information Strategy

Quality gate output must be bounded before storage.

Recommended strategy:

- keep maximum stdout/stderr preview length small and explicit
- redact before truncation when possible
- record truncation booleans
- store preview only
- never store complete logs
- never render complete terminal output

Sensitive markers to redact:

- `OPENAI_API_KEY`
- `API_KEY`
- `TOKEN`
- `SECRET`
- `PASSWORD`
- `AUTH`
- `~/.codex`
- `auth.json`
- `.env`
- `.env.local`

The runner must not read credential files or `~/.codex/auth.json`.

## Verification Strategy

Future implementation should add verification scripts for:

- allowlist accepts known quality gate keys
- forbidden commands are rejected
- shell execution remains `shell: false`
- no command text box exists
- stdout/stderr are bounded
- sensitive markers are redacted
- failed gate records status only
- no auto fix occurs
- no auto commit / push / deploy occurs
- no GitHub / Vercel / Supabase integration exists
- selected Review Room reads include quality gate results

Existing verification should continue to pass:

- `npm run typecheck`
- `npm run build`
- local DB verification
- Codex runner safety verification
- Git snapshot / changed files / diff summary / scope check verification

## Risk Mitigations

Risk: arbitrary command execution.

Mitigation: use command keys and allowlisted executable/args only.

Risk: accidental shell interpretation.

Mitigation: use `execFile` or `spawn` with `shell: false`.

Risk: leaking credentials in output.

Mitigation: redact sensitive markers and store bounded previews only.

Risk: quality gates becoming automatic repair.

Mitigation: failed gates only record status; no fix command surface exists.

Risk: Review Room becoming too dense.

Mitigation: group signals into Review Room 2.0 sections with compact summaries and expandable bounded previews.

Risk: lint/test commands missing.

Mitigation: detect project scripts and mark missing checks as skipped or disabled.

## Recommended File Structure For Later Implementation

Suggested files:

- `lib/quality-gates/command-catalog.ts`
- `lib/quality-gates/runner-policy.ts`
- `lib/quality-gates/output-preview.ts`
- `lib/quality-gates/runner.ts`
- `lib/local-db/repositories/quality-gate-configs.ts`
- `lib/local-db/repositories/quality-gate-runs.ts`
- `lib/local-db/repositories/quality-gate-events.ts`
- `lib/local-db/operations/quality-gates.ts`
- `components/review/QualityGatesPanel.tsx`
- `scripts/verify-quality-gate-config.ts`
- `scripts/verify-quality-gate-runner-safety.ts`
- `docs/phase-5-step-1-quality-gate-config.md`

## Phase 5 Step-by-Step Implementation Plan

### Step 1 Quality Gate Config

- Add planned config model.
- Add seed/default config planning.
- Add config read helpers.
- Do not execute commands.
- Do not add runner.
- Do not add arbitrary command input.

### Step 2 Quality Gate Runner

- Add allowlisted runner.
- Use `execFile` or `spawn` with `shell: false`.
- Add output bounding and redaction.
- Store run results and events.
- Do not auto fix.
- Do not auto commit / push / deploy.

### Step 3 Quality Gate UI

- Add Review Room Quality Gates panel.
- Show status, exit code, duration, bounded output preview.
- Add Run Checks / retry selected check surfaces using allowlisted configs only.
- Do not show terminal UI.

### Step 4 Review Room 2.0

- Reorganize Review Room into structured review sections.
- Integrate existing task, prompt, runner, Git, changed files, diff summary, scope guard, quality gate, and decision surfaces.
- Do not add AI summary.

### Step 5 Phase 5 Closeout

- Record final implementation and boundaries.
- Verify no forbidden integrations.
- Confirm Phase 6 has not started.

## Implementation Status

Phase 5 implementation has not started.
