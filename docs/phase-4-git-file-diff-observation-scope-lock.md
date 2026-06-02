# Phase 4 - Git / File / Diff Observation Scope Lock

## Phase 4 Goal

Phase 4 will add local Git / file / diff observation to Codex Visual Office so a user can review what changed around a scoped Codex task without giving the app permission to modify repository state automatically.

## Core Positioning

Phase 4 is Git / File / Diff Observation only.

It observes local repository state and summarizes bounded change metadata. It must not automatically modify files, stage changes, commit, push, deploy, run quality gates, or execute arbitrary commands.

## Allowed In Phase 4

- Read allowlisted Git status metadata.
- Capture task start and completion Git snapshots.
- Read changed file names and Git status codes.
- Read bounded diff stat / numstat summaries.
- Store bounded observation records in local SQLite.
- Link Git snapshots, file changes, diff summaries, and scope checks to tasks and task events.
- Show observation panels in Review Room and Project Room.
- Perform path-level forbidden scope checks against task `forbiddenScope` values.

## Forbidden In Phase 4

- Git watcher.
- File watcher.
- Terminal runner.
- Terminal emulator.
- `node-pty`.
- Arbitrary shell runner.
- `shell: true`.
- User-provided command strings.
- Command input box.
- Quality gate runner.
- Full diff viewer.
- Unlimited diff or file content storage.
- Auto commit.
- Auto push.
- Auto deploy.
- GitHub API.
- Vercel integration.
- Supabase integration.
- Auth.
- Payment.
- Cloud sync.
- MCP server.
- OpenAI API calls for diff or scope analysis.

## Git Observation Boundary

Git observation may only use explicitly allowlisted read-only Git commands in later implementation steps.

Git observation must:

- Use `execFile` or `spawn` with `shell: false`.
- Use fixed command arguments.
- Reject user-provided command strings.
- Read repository state only.
- Avoid destructive or mutating commands.
- Avoid network commands.
- Avoid remote operations.

Git observation must not:

- Stage files.
- Commit files.
- Push or pull.
- Reset, clean, checkout, switch, merge, rebase, stash, or tag.
- Modify remotes.
- Execute deploy commands.

## File Observation Boundary

File observation is limited to file path metadata derived from Git status / name-status output.

File observation must not:

- Watch the filesystem.
- Read large real file contents.
- Read credential/token files.
- Read `~/.codex/auth.json`.
- Store file contents without explicit future approval.

## Diff Observation Boundary

Diff observation is limited to bounded summary data:

- changed file paths
- Git change status
- diff stat
- additions
- deletions
- truncation metadata

Phase 4 must not add a full diff viewer. Large diff outputs must be truncated or summarized. Diff summaries must not be AI-generated and must not call OpenAI API.

## Forbidden Scope Check Boundary

Forbidden scope checks are path-level and pattern-level only.

They may compare:

- task `forbiddenScope` strings
- changed file paths
- changed file status
- simple configured path patterns

They must not:

- Make legal judgments.
- Make business policy judgments.
- Claim semantic code safety.
- Read full source content for semantic analysis.
- Call OpenAI API.

The output should be advisory:

- `PASS`
- `WARNING`
- `BLOCKED`

## Safety Boundary

- No arbitrary shell.
- No `node-pty`.
- No terminal emulator.
- No credential reads.
- No token reads.
- No OpenAI API key use.
- No GitHub API.
- No Vercel / Supabase integration.
- No backend service expansion beyond local app persistence.
- No auto commit / push / deploy.

## No Auto Commit / Push / Deploy Rule

Phase 4 must never automatically run:

- `git add`
- `git commit`
- `git push`
- deploy commands

The UI may show observed state, but it must not perform repository mutation or deployment.

## No GitHub API / Vercel / Supabase Rule

Phase 4 remains local-only.

It must not integrate:

- GitHub API
- GitHub App
- Vercel
- Supabase
- remote databases
- remote sync

## No Arbitrary Shell Runner Rule

Phase 4 must not introduce command text boxes, arbitrary shell command execution, user-provided command strings, or `shell: true`.

## No Terminal Emulator / Node-Pty Rule

Phase 4 must not add a terminal emulator and must not use `node-pty`.

## No Quality Gate Runner Rule

Phase 4 may observe Git / file / diff metadata only. It must not run tests, builds, lint commands, package scripts, or quality gate commands.

## Phase 4 Step Plan

### Step 1 - Git Snapshot Before / After Only

- Read allowlisted Git status only.
- Record Git snapshot before task start and after task completion.
- Do not read full diff.
- Do not read file contents.
- Do not auto commit / push / deploy.

### Step 2 - Changed Files Panel

- Read changed file names and status.
- Display modified / added / deleted / renamed.
- Do not display full file contents.
- Do not add watcher behavior.
- Do not auto commit.

### Step 3 - Diff Summary

- Read bounded diff stat / additions / deletions.
- Show summary only.
- Do not build a full diff viewer.
- Truncate large diff outputs.
- Do not perform AI summary.
- Do not call OpenAI API.

### Step 4 - Forbidden Scope Check

- Check task `forbiddenScope` against changed file paths.
- Perform path / pattern-level checks only.
- Do not perform legal, business, semantic, or true code safety judgment.
- Output suggested state: `PASS`, `WARNING`, or `BLOCKED`.

### Step 5 - Phase 4 Closeout

- Record final boundaries.
- Verify no auto commit / push / deploy.
- Verify no GitHub / Vercel / Supabase.
- Verify no terminal emulator.
- Close out Phase 4.

## Acceptance Criteria

- Git snapshots are local-only and read-only.
- Changed file panels show paths and status without full file content.
- Diff summaries are bounded and truncate large output.
- Scope checks are path-level only.
- No Git watcher or file watcher exists.
- No arbitrary shell runner exists.
- No terminal emulator or `node-pty` exists.
- No auto commit / push / deploy exists.
- No GitHub API, Vercel, Supabase, auth, payment, cloud sync, or MCP server is added.
- Verification confirms app build and existing database / Codex runner checks still pass.

## Failure Criteria

Phase 4 fails if it:

- Executes mutating Git commands.
- Adds watcher behavior.
- Adds arbitrary shell or terminal execution.
- Uses `node-pty`.
- Stores unbounded diff or file content.
- Reads credentials or token files.
- Calls OpenAI API.
- Integrates GitHub API, Vercel, Supabase, auth, payment, cloud sync, or MCP.
- Starts Phase 5 work before closeout.

## Implementation Status

Phase 4 implementation has not started.
