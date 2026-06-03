# Phase 4 Step 4 - Forbidden Scope Check

## What Was Implemented

Phase 4 Step 4 adds a local, path-level forbidden scope guard for Review Room tasks.

The guard compares:

- `task.forbiddenScope`
- persisted `file_changes.file_path`

It produces a stored `scope_checks` result with `PASS`, `WARNING`, or `BLOCKED` status.

This step does not read full diffs, file contents, credentials, tokens, or external model output.

## scope_checks Data Model

Table: `scope_checks`

- `id`
- `task_id`
- `project_id`
- `status`: `pass`, `warning`, or `blocked`
- `forbidden_scope_json`
- `matched_files_json`
- `unmatched_files_json`
- `rule_results_json`
- `reason`
- `check_source`: `path_level_forbidden_scope`
- `created_at`

The table stores only path-level matching results. It does not store patches, complete diff text, file contents, AI summaries, tokens, or credentials.

## forbiddenScope Parsing Rules

Natural-language forbidden scope entries are mapped conservatively to simple path patterns.

- Supabase: `supabase/`, `schema`, `migration`, `migrations`, `sql`
- Auth: `auth`, `login`, `session`, `middleware`, `proxy`, `permissions`
- Payment: `payment`, `billing`, `stripe`, `checkout`, `subscription`
- Deploy: `vercel`, `deploy`, `docker`, `nginx`, `pm2`, `env`
- Unknown rules fall back to generic path keywords when possible.
- Unparseable rules return `WARNING`, not `PASS`.

## PASS / WARNING / BLOCKED Rules

- `PASS`: changed file paths do not match parsed forbidden scope rules.
- `WARNING`: a weak keyword path match is found, or a rule cannot be parsed into path-level patterns.
- `BLOCKED`: a high-risk path pattern clearly matches a changed file path.

These statuses are explainable path checks only. They are not semantic code review and not a security audit.

## Review Room UI Changes

Review Room now includes a Scope Guard panel.

The panel shows:

- status: `PASS`, `WARNING`, `BLOCKED`, or `NOT RUN`
- forbidden scope rules
- matched changed file paths
- plain reason
- check source: path-level only
- warning text: `This is a path-level guard, not semantic code review.`

The panel does not show full diff, file contents, AI-generated review, quality gate execution, auto-fix controls, rollback controls, commit, push, or deploy controls.

## Runner Integration

After the scoped runner finishes and after changed files / diff summary are captured, the runner attempts a scope check.

If the scope check fails internally, the runner records a warning event and does not crash.

If the scope check returns `blocked`, a task event is written. No rollback, commit, push, or deploy is attempted.

## What Has Not Been Implemented

- No full diff viewer
- No `git diff --patch`
- No `git show`
- No file content reading
- No AI semantic judgment
- No quality gate runner
- No Git watcher
- No file watcher
- No terminal emulator
- No arbitrary shell runner
- No auto commit
- No auto push
- No auto deploy
- No GitHub, Vercel, Supabase, auth, payment, cloud sync, or MCP integration

## Safety Boundary

This implementation is local-only and path-level only.

It uses existing local SQLite persistence and existing `file_changes` records. It does not inspect file contents, complete diffs, external repositories, cloud services, or model APIs.

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
- `git diff --check`

Result: all commands passed.

`npm run git:verify:scope-check` confirmed:

- no match: `pass`
- Supabase migration path match: `blocked`
- auth path match: `blocked`
- weak keyword match: `warning`
- unparseable rule: `warning`
- persisted `task-provider-review` scope check read back successfully
- file contents read: false
- full diff read: false
- OpenAI API called: false
- auto commit / push / deploy attempted: false

HTTP text checks confirmed:

- `/` returned 200.
- `/projects/provider-workspace` returned expected Project Room text.
- `/review/task-provider-review` returned Prompt Handoff, Scoped Runner, Git Snapshot, Changed Files, Diff Summary, and Scope Guard text.
- `/review/task-provider-review` did not return `Full Diff Viewer` or `Quality Gate runner` text.

## Next Recommended Step

Phase 4 Step 5 closeout.

Phase 4 Step 5 has not started.
