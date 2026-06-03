# Phase 5 Quality Gates + Review Room 2.0 Scope Lock

## Phase 5 Goal

Phase 5 will plan and later introduce local, bounded quality gate visibility for Codex Visual Office, then organize Review Room into a clearer Review Room 2.0 workflow.

This document is planning only. Phase 5 implementation has not started.

## Core Positioning

Phase 5 is Quality Gates + Review Room 2.0.

The phase should make review safer and more legible by showing allowlisted quality gate status beside existing task, runner, Git snapshot, changed files, diff summary, scope guard, and final review decision context.

## Allowed In Phase 5

- Define project-level quality gate configuration.
- Store allowlisted quality gate config and future run results locally.
- Execute only allowlisted quality gate commands in the later runner step.
- Show bounded quality gate results in Review Room.
- Improve Review Room organization around existing local signals.
- Keep all behavior local-first.
- Record task events for quality gate lifecycle.

## Forbidden In Phase 5

- No arbitrary shell runner.
- No command text box.
- No terminal emulator.
- No `node-pty`.
- No automatic repair.
- No auto commit.
- No auto push.
- No auto deploy.
- No GitHub API.
- No Vercel integration.
- No Supabase integration.
- No auth.
- No payment.
- No cloud sync.
- No MCP server.
- No OpenAI API.
- No image generation.
- No `gpt-image`.
- No Phase 5 implementation in this planning step.

## Quality Gate Execution Boundary

Quality gate execution may only be introduced after the config model is defined and accepted.

Future execution must:

- run only configured allowlisted commands
- use `execFile` or `spawn`
- use `shell: false`
- pass arguments as arrays
- reject unknown command keys
- reject user-provided command strings
- record status and bounded output only
- never modify files as a repair action
- never commit, push, deploy, or change branches

## Command Allowlist Boundary

Default candidate command keys:

- `npm run typecheck`
- `npm run build`
- `npm run lint`
- `npm test`
- `npm run test`
- `git diff --check`

These are candidates only. Future implementation must detect project configuration and command availability before enabling them. Not every project has lint or test scripts.

## Output Truncation Boundary

Quality gate stdout and stderr must be bounded.

Future rules:

- store preview fields, not complete logs
- track `stdout_truncated` and `stderr_truncated`
- redact sensitive markers before storage and display
- never expose full terminal output
- never expose token or credential values

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

## Local Execution Safety Boundary

Local execution is restricted to quality gate commands only.

Phase 5 must not add:

- arbitrary shell execution
- `shell: true`
- command text boxes
- terminal UI
- interactive process control
- `node-pty`
- file watcher
- Git watcher
- background daemon
- credential reads
- `~/.codex/auth.json` reads

## Review Room 2.0 Boundary

Review Room 2.0 may reorganize existing review surfaces and add planned quality gate panels.

It must not add:

- cloud sync
- team permissions
- AI summary
- semantic code review
- GitHub PR integration
- Vercel deployment integration
- Supabase integration
- auto fix actions

## Human Acceptance Boundary

Quality gates support human review. They do not replace it.

The human reviewer remains responsible for:

- final approval
- rejection
- revision request
- interpreting failed checks
- deciding whether a task should continue

## No Automatic Repair Rule

Failed quality gates may only record and display status.

They must not:

- edit files
- run fix commands
- install dependencies
- rewrite code
- change settings
- retry with different commands automatically

## No Auto Commit / Push / Deploy Rule

Phase 5 must never automatically:

- `git add`
- `git commit`
- `git push`
- deploy to any target
- call Vercel deployment APIs
- call GitHub APIs
- change remote state

## No Arbitrary Shell Runner Rule

Commands must be selected from an internal allowlist by stable command key.

Phase 5 must not add:

- raw shell command input
- command textarea
- user-entered command strings
- shell pipelines
- `curl | sh`
- interactive prompts

## No Terminal Emulator / node-pty Rule

Phase 5 must not provide a terminal interface.

It must not use:

- `node-pty`
- pseudo-terminal sessions
- terminal emulator components
- interactive shells

## No GitHub API / Vercel / Supabase Rule

Phase 5 remains local-first.

It must not integrate:

- GitHub API
- GitHub App
- GitHub OAuth
- Vercel API
- Vercel deploy
- Supabase database
- Supabase auth
- Supabase storage

## Phase 5 Step-by-Step Plan

### Step 1 Quality Gate Config

- Define project-level quality gate configuration model.
- Allow only configured allowlisted command keys.
- Default candidate commands:
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint`
  - `npm test` or `npm run test`, if project exists
  - `git diff --check`
- Do not execute commands.
- Do not add runner.
- Plan config model and UI only.

### Step 2 Quality Gate Runner

- Execute only allowlisted quality gate commands.
- Use `execFile` or `spawn` with `shell: false`.
- Do not accept arbitrary user command input.
- Do not add arbitrary shell.
- Do not add `node-pty`.
- Do not add terminal emulator.
- Do not auto fix.
- Do not auto commit / push / deploy.

### Step 3 Quality Gate UI

- Review Room displays quality gate results.
- Display status: `pending`, `running`, `passed`, `failed`, `skipped`, `blocked`.
- Display `exitCode`, duration, and bounded output preview.
- Truncate stdout and stderr.
- Do not display a complete terminal.

### Step 4 Review Room 2.0

Integrate:

- task summary
- Codex prompt handoff
- runner status
- Git snapshot
- changed files
- diff summary
- scope guard
- quality gates
- final review decision

Do not add cloud sync, team permissions, or AI summary.

### Step 5 Phase 5 Closeout

- Record final boundaries.
- Verify no arbitrary shell.
- Verify no auto commit / push / deploy.
- Verify no GitHub / Vercel / Supabase.
- Close out Phase 5.

## Acceptance Criteria

- Quality gate config is local and project-scoped.
- Future runner only executes allowlisted commands.
- No arbitrary command input exists.
- stdout and stderr are bounded and redacted.
- Review Room shows clear quality gate status.
- Review Room 2.0 keeps human review as the final decision point.
- No forbidden integrations are added.
- Phase 5 closeout records final limitations.

## Failure Criteria

Phase 5 fails if it:

- accepts arbitrary user command input
- uses `shell: true`
- uses `node-pty`
- adds a terminal emulator
- reads credentials or `~/.codex/auth.json`
- stores unbounded stdout or stderr
- displays complete terminal output
- runs auto fix commands
- auto commits, pushes, or deploys
- integrates GitHub API, Vercel, Supabase, auth, payment, cloud sync, MCP, OpenAI API, image generation, or `gpt-image`

## Implementation Status

Phase 5 implementation has not started.
