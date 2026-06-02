# Phase 4 - Git / File / Diff Observation Plan

## Phase 4 Proposed Architecture

Phase 4 should add a local-only observation layer around tasks:

- Git command allowlist adapter.
- Git snapshot service.
- Changed file read model.
- Bounded diff summary service.
- Path-level scope guard service.
- Local SQLite persistence for observations.
- Review Room and Project Room display components.

The implementation should remain observational. It should not mutate Git state, watch files, execute arbitrary commands, or run quality gates.

## Safe Git Status Reading

Git status reading should use a small adapter that accepts only known operations, maps them to fixed Git command arguments, and executes them with `execFile` or `spawn` using `shell: false`.

The adapter should:

- Resolve the repository root with an allowlisted command.
- Use fixed argument arrays.
- Reject any user-provided command text.
- Bound stdout / stderr capture.
- Redact obvious credential markers if any appear.
- Return typed structured results.
- Record errors as observation events, not as terminal output.

## Allowed Git Command Allowlist

Later implementation may use only these read-only commands:

- `git status --porcelain=v1`
- `git branch --show-current`
- `git rev-parse --show-toplevel`
- `git rev-parse HEAD`
- `git diff --name-status`
- `git diff --stat`
- `git diff --numstat`

These commands must be represented internally as fixed operation IDs, not user-entered command strings.

## Forbidden Git Commands

Phase 4 must not run:

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
- any deploy command

Network and mutating Git behavior remains out of scope.

## Avoiding Arbitrary Shell

The Git observation adapter must:

- Use `execFile` or `spawn`.
- Set `shell: false`.
- Pass arguments as arrays.
- Avoid command string concatenation.
- Avoid shell metacharacter parsing.
- Avoid arbitrary environment expansion.

## Avoiding User Input Commands

The UI must not include:

- command text box
- terminal prompt
- arbitrary command input
- command history
- editable Git argument field

Users may trigger named observation actions only, such as "Refresh Git Snapshot" in a later implementation step.

## Git Snapshot Storage

Git snapshots should store safe metadata only:

- snapshot id
- project id
- task id
- snapshot kind: `before` / `after` / `manual`
- branch name
- repository root placeholder or approved local path reference
- commit HEAD
- dirty state
- changed file count
- createdAt
- error state if observation failed

Snapshots should not store full file contents or full diffs.

## Linking Git Snapshots To Tasks / Task Events

Each snapshot should be linked to:

- `projects.id`
- `tasks.id`
- a task event id for auditability

Task events may record:

- snapshot captured
- changed files observed
- diff summary captured
- scope check produced
- observation failed

Payloads must remain bounded.

## Changed File Representation

Changed file records should represent:

- file path
- previous path for rename if available
- Git status: modified / added / deleted / renamed / untracked / copied / type_changed / unknown
- snapshot id
- task id
- project id
- createdAt

Changed file records must not store file content.

## Diff Summary Representation

Diff summary records should represent:

- summary id
- snapshot id
- task id
- project id
- files changed
- insertions
- deletions
- bounded stat preview
- bounded numstat preview
- truncation flags
- createdAt

Large output should be truncated before persistence.

## Forbidden Scope Check Representation

Scope check records should represent:

- check id
- task id
- project id
- snapshot id
- result: `PASS` / `WARNING` / `BLOCKED`
- matched forbidden scope entries
- matched paths
- explanation
- createdAt

The explanation must describe path / pattern matching only. It must not claim semantic code safety.

## SQLite Data Model Extension Plan

Proposed tables only; do not implement in pre-planning:

### `git_snapshots`

- `id`
- `project_id`
- `task_id`
- `kind`
- `branch_name`
- `repository_root`
- `head_sha`
- `is_dirty`
- `changed_file_count`
- `error_message`
- `created_at`

### `file_changes`

- `id`
- `snapshot_id`
- `project_id`
- `task_id`
- `path`
- `previous_path`
- `status`
- `created_at`

### `diff_summaries`

- `id`
- `snapshot_id`
- `project_id`
- `task_id`
- `files_changed`
- `insertions`
- `deletions`
- `stat_preview`
- `numstat_preview`
- `stat_truncated`
- `numstat_truncated`
- `created_at`

### `scope_checks`

- `id`
- `snapshot_id`
- `project_id`
- `task_id`
- `result`
- `matched_scope_json`
- `matched_paths_json`
- `explanation`
- `created_at`

## UI Visual Change Plan

The UI should remain consistent with the existing visual office style. Changes should be practical review surfaces, not a redesign.

Recommended additions:

- compact Git Snapshot panel
- Changed Files panel
- Diff Summary card
- Scope Guard panel
- small status badges for clean / dirty / warning / blocked

## Review Room Plan

Review Room should add:

- Git Snapshot panel showing before / after snapshot metadata.
- Changed Files panel showing path and status only.
- Diff Summary card showing bounded file count, insertions, deletions, and truncation status.
- Scope Guard panel showing PASS / WARNING / BLOCKED based on path-level checks.

Review Room must not add:

- full diff viewer
- terminal emulator
- arbitrary command input
- auto commit / push / deploy buttons

## Project Room Plan

Project Room may add:

- branch name
- dirty state
- latest change summary
- changed file count
- latest scope guard state

This should be a small operational status surface, not a broad redesign.

## Office Home Plan

Office Home should remain mostly unchanged.

Possible future addition:

- project dirty badge

No broad Office Home redesign is recommended for Phase 4.

## Verification Strategy

Verification should include:

- existing typecheck and build
- existing DB verification scripts
- existing Codex runner verification scripts
- new Git observation verification scripts in later implementation
- command allowlist tests
- forbidden command rejection tests
- output bound tests
- no watcher checks
- no auto commit / push / deploy checks
- browser checks for Review Room and Project Room panels

## Risk Mitigations

- Use command operation IDs instead of command strings.
- Use `execFile` / `spawn` with `shell: false`.
- Keep output bounded.
- Store paths and summaries only.
- Truncate large diff stat output.
- Keep scope checks path-level.
- Avoid watcher APIs.
- Avoid Git network commands.
- Avoid mutating Git commands.
- Verify forbidden integrations with source search.

## Recommended File Structure For Later Implementation

Suggested implementation structure only:

```txt
lib/git-observation/
  allowlist.ts
  git-command-runner.ts
  git-status-parser.ts
  git-snapshot-service.ts
  changed-files-service.ts
  diff-summary-service.ts
  scope-guard-service.ts
  types.ts

lib/local-db/operations/git-observation.ts
lib/local-db/repositories/git-snapshots.ts
lib/local-db/repositories/file-changes.ts
lib/local-db/repositories/diff-summaries.ts
lib/local-db/repositories/scope-checks.ts

components/review/GitSnapshotPanel.tsx
components/review/ChangedFilesPanel.tsx
components/review/DiffSummaryCard.tsx
components/review/ScopeGuardPanel.tsx

scripts/verify-git-observation-safety.ts
scripts/verify-git-snapshot-read.ts
```

## Phase 4 Step-By-Step Implementation Plan

### Step 1 - Git Snapshot Before / After Only

- Add allowlisted Git snapshot reader.
- Read branch, HEAD, root, dirty state, changed file count.
- Store before / after snapshots linked to task events.
- Do not read full diff or file contents.

### Step 2 - Changed Files Panel

- Parse `git status --porcelain=v1` and `git diff --name-status`.
- Store file path and status.
- Add Review Room Changed Files panel.
- Avoid watcher behavior.

### Step 3 - Diff Summary

- Parse bounded `git diff --stat` and `git diff --numstat`.
- Store summary records.
- Add Diff Summary card.
- Truncate large output.
- Do not build full diff viewer.

### Step 4 - Forbidden Scope Check

- Compare changed file paths against task `forbiddenScope`.
- Produce PASS / WARNING / BLOCKED.
- Add Scope Guard panel.
- Keep the check path-level only.

### Step 5 - Phase 4 Closeout

- Create closeout documentation.
- Run full verification.
- Confirm no forbidden integrations.
- Confirm no auto commit / push / deploy.
- Push closeout commit.

## Implementation Status

This is a planning document only. Phase 4 implementation has not started.
