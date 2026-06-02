# Phase 4 Step 2 - Changed Files Panel

## What Was Implemented

- Added `file_changes` local SQLite table.
- Added changed files repository and operation helpers.
- Added a read-only `git diff --name-status` helper.
- Added changed files capture after scoped runner completion or failure.
- Added Review Room Changed Files panel.
- Added `scripts/verify-changed-files.ts`.
- Added `npm run git:verify:changed-files`.

This step only observes changed file paths and status.

## Allowed Git Command

- `git diff --name-status`

The helper uses `execFile` with `shell: false`, fixed arguments, and no user-provided command strings.

## Forbidden Git Commands

This step does not use:

- `git diff --stat`
- `git diff --numstat`
- `git diff --patch`
- `git show`
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
- `git remote add`
- `git remote remove`

No deploy command is used.

## `file_changes` Data Model

Fields:

- `id`
- `task_id`
- `project_id`
- `git_snapshot_id`
- `change_status`
- `raw_status`
- `file_path`
- `previous_file_path`
- `source`
- `created_at`

The table stores only path and status metadata. It does not store file contents, full diff text, line additions, or line deletions.

## Changed Files Parsing Rules

- `M` -> `modified`
- `A` -> `added`
- `D` -> `deleted`
- `Rxxx` -> `renamed`
- `Cxxx` -> `copied`
- `U` -> `unmerged`
- other status -> `unknown`

Rename and copy records preserve `previous_file_path` when provided by Git name-status output.

## Review Room UI Changes

Review Room now shows a Changed Files panel:

- total count
- Modified group
- Added group
- Deleted group
- Renamed group
- Copied / Unmerged / Unknown groups when present
- file path
- previous path for renamed / copied records

The panel does not show full diff, file contents, additions, deletions, scope guard results, or quality gate execution.

## What Has Not Been Implemented

- Diff Summary.
- `git diff --stat`.
- `git diff --numstat`.
- Full diff viewer.
- File content reading.
- Forbidden scope check.
- Quality gate runner.
- Git watcher.
- File watcher.
- Terminal emulator.
- `node-pty`.
- Arbitrary shell runner.
- Auto commit.
- Auto push.
- Auto deploy.
- GitHub API.
- Vercel.
- Supabase.
- Auth.
- Payment.
- Cloud sync.
- MCP server.

Phase 4 Step 3 has not started.

## Safety Boundaries

- Read-only `git diff --name-status` only.
- No command input box.
- No user-provided command strings.
- No `shell: true`.
- No `node-pty`.
- No terminal emulator.
- No credential reads.
- No `~/.codex/auth.json` reads.
- No OpenAI token storage.
- No automatic repository mutation.
- No deployment action.

## Verification Commands And Results

Passed during implementation:

- `npm run typecheck`
- `npm run git:verify:changed-files`

`git:verify:changed-files` confirmed:

- only `git diff --name-status` is allowlisted
- forbidden Git commands are not allowlisted
- M / A / D / R / C / U / unknown parsing works
- current repo changed file status can be read
- file changes can be persisted and read back
- full diff is not stored
- file contents are not stored
- additions / deletions are not stored
- no mutating Git command was attempted
- no auto commit / push / deploy was attempted

Full verification should include:

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
- `git diff --check`
- `git status`

## Next Recommended Step

Phase 4 Step 3 - Diff Summary.
