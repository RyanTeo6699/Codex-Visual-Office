# Phase 2 Step 4 - Review Buttons Persistence

## What Was Implemented

Phase 2 Step 4 adds narrow local persistence for Review Room decisions only.

The Review Room buttons now write to the local SQLite database when a user chooses:

- Approve
- Reject
- Ask Revision

The implementation keeps local DB access server-side and scoped to the Review Room.

## Page Changed

- `/review/[taskId]`

The Review Room reads a persisted review decision and task status when available. If a local database record is missing for the requested task, the page falls back to the existing mock Review Room display.

## Actions That Persist

### Approve

- Writes `review_records.decision = "approved"`.
- Updates the task status to `"done"`.
- Upserts a task event with id `review-decision-{taskId}-approved`.

### Reject

- Writes `review_records.decision = "rejected"`.
- Updates the task status to `"blocked"`.
- Upserts a task event with id `review-decision-{taskId}-rejected`.

### Ask Revision

- Writes `review_records.decision = "revision_requested"`.
- Updates the task status to `"ready"`.
- Upserts a task event with id `review-decision-{taskId}-revision_requested`.

## Records Written

- `review_records`
- `tasks`
- `task_events`

The event IDs are stable and scoped by task id and decision. Repeated clicks update the same scoped event instead of creating unbounded duplicate verification records.

## What Remains Mock-Driven

- Office Home remains mock-data driven.
- Project Room remains mock-data driven.
- Office map, task boards, build wall, and activity feed remain mock-data driven.
- Review Room still uses mock project, agent, build check, diff, and fallback review display data.
- No full app data migration was performed.

## Verification

Run:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
git diff --check
git status
```

Expected `db:verify:review` summary:

```text
Review persistence verification passed
```

The summary should show:

- `task-provider-review`
- final decision `revision_requested`
- final task status `ready`
- stable review decision event IDs for approved, rejected, and revision requested

## Forbidden Integrations Confirmation

Step 4 does not add:

- Codex CLI
- OpenAI API
- Git watcher
- GitHub
- Vercel
- Supabase
- Auth
- Payment
- Cloud sync
- MCP server
- `child_process`
- `node-pty`
- terminal execution from the UI
- real project file reads from the UI
- real git status reads from the UI

## Next Recommended Step

Phase 2 Step 5 may plan the next narrow persistence surface after review decision persistence is accepted.

Phase 2 Step 5 has not started.
