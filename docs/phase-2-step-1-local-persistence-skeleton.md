# Phase 2 Step 1 Local Persistence Skeleton

## Step Status

Phase 2 Step 1 adds the local persistence foundation only.

The current UI remains mock-data driven. No page, component, route, or review flow has been migrated to the database in this step.

## Dependencies Added

Runtime dependencies:

- `drizzle-orm`
- `better-sqlite3`

Development dependencies:

- `drizzle-kit`
- `@types/better-sqlite3`

`better-sqlite3` is used only by the server-only / Node-only local database layer. It must not be imported into client components.

## Schema Files Created

- `drizzle.config.ts`
- `lib/local-db/paths.ts`
- `lib/local-db/client.ts`
- `lib/local-db/schema.ts`

Schema entities:

- `projects`
- `agent_seats`
- `tasks`
- `task_events`
- `build_checks`
- `review_records`
- `settings`

The schema status values are aligned with the existing Phase 1 TypeScript unions in `lib/types.ts`.

## Repositories Created

- `lib/local-db/repositories/projects.ts`
- `lib/local-db/repositories/agent-seats.ts`
- `lib/local-db/repositories/tasks.ts`
- `lib/local-db/repositories/task-events.ts`
- `lib/local-db/repositories/build-checks.ts`
- `lib/local-db/repositories/review-records.ts`
- `lib/local-db/repositories/settings.ts`

These repositories are skeleton boundaries for future Phase 2 steps. They are not imported by the current UI.

## Seed Skeleton Created

- `lib/local-db/seed/seed-from-mock-data.ts`

The seed helper maps existing Phase 1 mock data into local database insert rows.

It does not automatically run on app startup.

## Local Database Path

The local SQLite database path is configured as:

```txt
.local/codex-visual-office.db
```

`.gitignore` excludes local database files:

- `.local`
- `*.db`
- `*.sqlite`
- `*.sqlite3`

## Intentionally Not Wired Yet

This step does not:

- Connect UI pages to SQLite.
- Replace `lib/mock-data.ts`.
- Run seed data automatically.
- Add CRUD UI.
- Add API routes for business logic.
- Add backend services.
- Add Codex execution.
- Add Git integration.
- Add terminal execution.
- Run real quality gate commands.

The app should continue rendering from Phase 1 mock data.

## How This Prepares Phase 2 Step 2

This step creates the persistence boundary that Phase 2 Step 2 can use to:

- Create migrations.
- Initialize the local database.
- Seed from Phase 1 mock data.
- Add repository tests.
- Wire read-only UI data loading from the local database.

Phase 2 Step 2 should remain local-only and should still avoid Codex CLI, Git watcher, terminal runner, and remote integrations.

## Forbidden Integrations Confirmation

This step does not add:

- Codex CLI.
- OpenAI API.
- Git watcher.
- GitHub integration.
- Vercel integration.
- Supabase.
- Auth.
- Payment.
- Cloud sync.
- Backend services.
- MCP server.
- `child_process`.
- `node-pty`.
- Terminal command execution from the UI.
- Real project file reads.
- Real Git status reads from the UI.

## Phase 2 Step 2 Status

Phase 2 Step 2 has not started.
