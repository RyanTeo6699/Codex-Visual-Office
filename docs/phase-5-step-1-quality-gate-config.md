# Phase 5 Step 1 - Quality Gate Config

## What Was Implemented

Phase 5 Step 1 added local quality gate configuration only.

Implemented:

- `quality_gate_configs` local SQLite table.
- Fixed allowlisted command catalog.
- Repository and operation helpers for quality gate config records.
- Default quality gate config seeding for projects.
- Project Room Quality Gate Config status area.
- Review Room Quality Gates config preview.
- `npm run quality:verify:config` verification script.

This step does not execute quality gate commands.

## quality_gate_configs Data Model

Table: `quality_gate_configs`

- `id`
- `project_id`
- `name`
- `command_key`
- `command`
- `enabled`
- `allowlisted`
- `description`
- `created_at`
- `updated_at`

Rules:

- `command_key` must come from the fixed allowlist.
- `command` must match the fixed text for the selected `command_key`.
- Config records must be `allowlisted=true`.
- No arbitrary command input is accepted.
- No command text box exists.
- No command execution exists in this step.

## Allowlisted Command Candidates

- `npm_typecheck` -> `npm run typecheck`
- `npm_build` -> `npm run build`
- `npm_lint` -> `npm run lint`
- `npm_test` -> `npm test`
- `npm_run_test` -> `npm run test`
- `git_diff_check` -> `git diff --check`

Default enabled configs:

- `npm_typecheck`
- `npm_build`
- `git_diff_check`

Default disabled configs:

- `npm_lint`
- `npm_test`
- `npm_run_test`

These are configured candidates only. Phase 5 Step 1 does not detect package scripts and does not run commands.

## Forbidden Commands

Forbidden:

- arbitrary user command input
- `rm -rf`
- `sudo`
- `chmod`
- `chown`
- `curl | sh`
- `brew install`
- `npm install`, unless a later dependency phase is separately approved
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
- deploy commands
- `vercel deploy`
- `docker deploy`
- `docker compose up`
- `pm2 restart`
- production `scp` / `rsync`
- any command containing credentials or tokens

## Why This Step Does Not Execute Commands

Step 1 is configuration only.

Quality gate execution needs a separate safety boundary in Phase 5 Step 2:

- allowlisted executable and args
- `execFile` or `spawn`
- `shell:false`
- bounded stdout/stderr
- sensitive marker redaction
- no auto repair
- no auto commit / push / deploy

Keeping Step 1 config-only prevents command execution from being introduced before those runner controls are implemented and verified.

## Project Room UI Changes

Project Room now shows a Quality Gate Config area.

It displays:

- gate name
- fixed command text
- enabled / disabled
- allowlisted marker
- status: `Config only / Not run`

It does not show any run, execute, retry, repair, commit, push, or deploy controls.

## Review Room UI Changes

Review Room now shows a Quality Gates Config Preview section.

It displays:

- configured gates for the task's project
- enabled / disabled
- allowlisted marker
- `Not run`
- clear label: `Config only -- execution starts in Phase 5 Step 2`

It does not execute commands and does not include Run Checks, Execute, or Retry controls.

## What Has Not Been Implemented

- No quality gate runner.
- No command execution.
- No Run Checks button.
- No Run Build button.
- No Execute button.
- No Retry Check button.
- No command text box.
- No arbitrary shell.
- No `shell:true`.
- No `node-pty`.
- No terminal emulator.
- No auto repair.
- No auto git add / commit / push.
- No auto deploy.
- No GitHub API.
- No Vercel.
- No Supabase.
- No auth, payment, cloud sync, or MCP server.
- No OpenAI API.
- No credential reads.
- No `~/.codex/auth.json` reads.
- No Phase 5 Step 2 implementation.

## Safety Boundary

This step stores configuration only.

The verification script checks that:

- default configs are created
- command keys come from the allowlist
- command text matches the allowlist
- arbitrary command keys are rejected
- mismatched command text is rejected
- non-allowlisted configs are rejected
- enable / disable updates work
- no quality gate command was executed
- no runner was implemented

## Verification Commands And Results

- `npm run typecheck`
- `npm run build`
- `npm run db:verify`
- `npm run db:verify:operations`
- `npm run db:verify:review`
- `npm run db:verify:selected-reads`
- `npm run codex:verify:cli`
- `npm run codex:verify:prompt-handoff`
- `npm run codex:verify:runner-safety`
- `npm run codex:verify:scoped-runner`
- `npm run codex:verify:runner-output`
- `npm run git:verify:snapshots`
- `npm run git:verify:changed-files`
- `npm run git:verify:diff-summary`
- `npm run git:verify:scope-check`
- `npm run quality:verify:config`
- `git diff --check`

Final result: all commands passed.

`npm run quality:verify:config` confirmed:

- configured count for `provider-workspace`: 6
- allowlisted keys: `npm_typecheck`, `npm_build`, `npm_lint`, `npm_test`, `npm_run_test`, `git_diff_check`
- default enabled: `npm_typecheck`, `npm_build`, `git_diff_check`
- default disabled: `npm_lint`, `npm_test`, `npm_run_test`
- arbitrary command rejected: true
- mismatched command rejected: true
- non-allowlisted config rejected: true
- enable / disable verified: true
- quality gate command executed: false
- runner implemented: false
- arbitrary shell implemented: false
- `node-pty` implemented: false
- terminal emulator implemented: false
- auto commit / push / deploy attempted: false

## Next Recommended Step

Phase 5 Step 2 - Quality Gate Runner

Phase 5 Step 2 has not started.
