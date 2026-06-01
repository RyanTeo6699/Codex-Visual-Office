# Phase 2 Step 5 - Selected UI Reads from Local Repository

## What Was Implemented

Phase 2 Step 5 adds selected local SQLite read paths for Project Room and Review Room.

The implementation proves that server-rendered UI routes can safely read seeded local repository data while preserving explicit mock fallback behavior.

## Pages Changed

- `/projects/[id]`
- `/review/[taskId]`

Office Home was not migrated.

## Local DB Data Read When Available

### Project Room

`/projects/[id]` can now read:

- project
- project tasks
- assigned agent seats
- build checks
- recent task events

If the local project row exists, those selected local records are passed into the existing Project Room UI components.

### Review Room

`/review/[taskId]` can now read:

- persisted task status
- persisted review decision
- task-scoped review events

The Step 4 Approve / Reject / Ask Revision buttons continue to persist local review decisions.

## Mock Fallback Behavior

If a selected local read returns no record for the route id, the route falls back to the existing Phase 1 mock data.

If the local read throws, the page logs the local read failure on the server and falls back to mock data.

## What Remains Mock-Driven

- Office Home remains mock-data driven.
- Office map remains mock-data driven.
- Main project list remains mock-data driven.
- Review Room still uses mock project, agent, and build check display data.
- No create, edit, or delete UI was added.
- No full app database migration was performed.

## Why Office Home Was Not Fully Migrated

Office Home is the broadest visual surface and includes the main office floor. Step 5 is intentionally limited to selected server-side read paths, so Office Home remains unchanged to avoid widening the phase beyond the accepted scope.

## Verification

Run:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
git diff --check
git status
```

Expected selected read verification:

```text
Selected local reads verification passed
```

The summary should include:

- `provider-workspace`
- related tasks
- related build checks
- related agent seats
- related task events
- `task-provider-review`
- persisted review decision and task status
- missing local reads returning `undefined` so UI fallback can use mock data

## Browser Checks

Check:

- `/`
- `/projects/provider-workspace`
- `/review/task-provider-review`

Confirm:

- Office Home still loads.
- Project Room loads with selected local read data or mock fallback.
- Review Room loads persisted review decision and status.
- Review buttons still persist.
- No browser console errors are present.

## Forbidden Integrations Confirmation

Step 5 does not add:

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
- project/task CRUD UI
- broad backend services

## Next Recommended Step

Phase 2 Step 6 may plan the next narrow local persistence surface after selected local reads are accepted.

Phase 2 Step 6 has not started.
