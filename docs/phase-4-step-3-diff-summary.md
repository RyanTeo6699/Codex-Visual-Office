# Phase 4 Step 3 - Diff Summary

## What Was Implemented

- Added `diff_summaries` local SQLite table.
- Added diff summary repository and operation helpers.
- Added a read-only diff summary helper for bounded Git statistics.
- Added diff summary capture after scoped runner completion or failure.
- Added Review Room Diff Summary card.
- Added `scripts/verify-diff-summary.ts`.
- Added `npm run git:verify:diff-summary`.

This step only observes bounded diff statistics.

## Allowed Git Commands

- `git diff --stat`
- `git diff --numstat`

The helper uses `execFile` with `shell: false`, fixed arguments, and no user-provided command strings.

## Forbidden Git Commands

This step does not use:

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

## `diff_summaries` Data Model

Fields:

- `id`
- `task_id`
- `project_id`
- `git_snapshot_id`
- `files_changed`
- `insertions`
- `deletions`
- `numstat_json`
- `stat_summary`
- `stdout_truncated`
- `numstat_truncated`
- `source`
- `created_at`

The table stores bounded statistic metadata only. It does not store patch content, full diff text, or file contents.

## Diff Stat / Numstat Parsing Rules

- `git diff --stat` is stored as a bounded stat summary string.
- `git diff --numstat` is parsed into bounded per-file rows.
- Normal text rows capture file path, additions, and deletions.
- Binary rows are marked as binary and do not store numeric additions/deletions.
- Unknown or unparseable rows are marked safely and do not crash parsing.
- Large numstat output is row-bounded and marked truncated.

## Review Room UI Changes

Review Room now shows a Diff Summary card:

- files changed
- insertions
- deletions
- top changed files summary
- binary / unparseable row indicator
- stat and numstat truncation indicators
- empty state when no diff summary is captured

The card does not show full diff, patch content, file contents, scope guard results, or quality gate execution.

## What Has Not Been Implemented

- Full diff viewer.
- `git diff --patch`.
- `git show`.
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

Phase 4 Step 4 has not started.

## Safety Boundaries

- Read-only `git diff --stat` and `git diff --numstat` only.
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
- `npm run git:verify:diff-summary`

`git:verify:diff-summary` confirmed:

- only `git diff --stat` and `git diff --numstat` are allowlisted
- forbidden Git commands are not allowlisted
- normal rows parse correctly
- binary rows are handled safely
- unknown / unparseable rows are handled safely
- truncation behavior is verified
- diff summary can be persisted and read back
- full diff is not stored
- patch is not stored
- file contents are not stored
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
- `npm run git:verify:diff-summary`
- `git diff --check`
- `git status`

## Next Recommended Step

Phase 4 Step 4 - Forbidden Scope Check.
