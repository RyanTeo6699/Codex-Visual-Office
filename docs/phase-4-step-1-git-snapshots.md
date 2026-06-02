# Phase 4 Step 1 - Git Snapshot Before / After

## What Was Implemented

- Added local Git snapshot persistence in SQLite.
- Added a read-only Git snapshot helper.
- Added repository and operation helpers for Git snapshots.
- Integrated before / after snapshot capture into the scoped Codex runner lifecycle.
- Added a Review Room Git Snapshot panel.
- Added `scripts/verify-git-snapshots.ts`.
- Added `npm run git:verify:snapshots`.

This step only implements Git snapshot before / after observation.

## Allowed Git Commands

The Git snapshot helper only allows:

- `git status --porcelain=v1`
- `git branch --show-current`
- `git rev-parse --show-toplevel`
- `git rev-parse HEAD`

Commands are executed with `execFile` and `shell: false`.

## Forbidden Git Commands

This step does not use:

- `git diff --name-status`
- `git diff --stat`
- `git diff --numstat`
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

## Data Model

Added table:

```txt
git_snapshots
```

Fields:

- `id`
- `task_id`
- `project_id`
- `snapshot_kind`
- `branch`
- `head_sha`
- `repo_root`
- `porcelain_status`
- `is_dirty`
- `status_summary_json`
- `created_at`

Snapshot kinds:

- `before_runner`
- `after_runner`
- `manual`

The table stores bounded Git status metadata only. It does not store full diff content or file contents.

## Before / After Snapshot Behavior

For an allowed scoped Codex runner execution:

- A `before_runner` snapshot is captured before the scoped runner starts.
- An `after_runner` snapshot is captured after the scoped runner completes or fails.
- Snapshots are linked to `task_id` and `project_id`.
- Snapshot capture failure records a warning task event and does not crash the runner.
- Snapshot capture never runs mutating Git commands.

## Review Room UI Changes

Review Room now includes a Git Snapshot panel showing:

- Before snapshot branch, HEAD short SHA, clean / dirty state, and createdAt.
- After snapshot branch, HEAD short SHA, clean / dirty state, and createdAt.
- Snapshot comparison:
  - same branch / branch changed
  - same head / head changed
  - before dirty / after dirty

The panel does not show changed files, full diff, additions, deletions, or forbidden scope results.

## What Has Not Been Implemented

- Changed Files panel.
- Diff Summary.
- `git diff --name-status`.
- `git diff --stat`.
- `git diff --numstat`.
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

Phase 4 Step 2 has not started.

## Safety Boundaries

- Read-only Git snapshot commands only.
- No command input box.
- No user-provided command strings.
- No `shell: true`.
- No `node-pty`.
- No terminal emulator.
- No token or credential reads.
- No `~/.codex/auth.json` reads.
- No OpenAI token storage.
- No automatic repository mutation.
- No deployment action.

## Verification Commands And Results

Passed during implementation:

- `npm run typecheck`
- `npm run git:verify:snapshots`

`git:verify:snapshots` confirmed:

- approved project path was used
- branch was captured
- HEAD SHA was captured
- repository root was captured
- porcelain status was captured
- dirty state was captured
- before and after snapshots were persisted and read back
- forbidden Git commands were not allowlisted
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
- `git diff --check`
- `git status`

## Next Recommended Step

Phase 4 Step 2 - Changed Files Panel.
