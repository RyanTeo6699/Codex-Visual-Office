# Phase 2 Step 2 Local DB Init And Seed

## What Was Implemented

Phase 2 Step 2 proves the local persistence skeleton can create a SQLite database, create tables, seed Phase 1 mock data, and read seeded data through repository functions.

The UI remains unchanged and continues to read from `lib/mock-data.ts`.

## DB Path

Local SQLite database path:

```txt
.local/codex-visual-office.sqlite
```

The resolved path during verification was:

```txt
/Users/ryanteo/Desktop/上线版本/CODEX可视化办公室/.local/codex-visual-office.sqlite
```

`.gitignore` excludes:

- `.local`
- `*.db`
- `*.sqlite`
- `*.sqlite-shm`
- `*.sqlite-wal`
- `*.sqlite3`

## Scripts Added

Package scripts:

```json
{
  "db:init": "tsx scripts/db-init.ts",
  "db:seed": "tsx scripts/db-seed.ts",
  "db:verify": "tsx scripts/verify-local-db.ts"
}
```

Script files:

- `scripts/db-init.ts`
- `scripts/db-seed.ts`
- `scripts/verify-local-db.ts`

## Init Behavior

`npm run db:init` creates tables if missing.

The init flow is non-destructive by default:

- It uses `CREATE TABLE IF NOT EXISTS`.
- It does not drop tables.
- It does not delete records.
- No reset script was added in this step.

## Seed Behavior

`npm run db:seed` initializes the database and seeds from existing Phase 1 mock data.

Seeded entities:

- projects
- agent seats
- tasks
- task events
- build checks
- review records
- settings defaults

The seed is idempotent:

- Records use stable IDs from mock data.
- Inserts use conflict updates.
- Running the seed more than once updates existing rows instead of duplicating them.

## Verification Result

`npm run db:verify` initializes the DB, runs seed twice, reads through repository functions, and verifies minimum expected counts.

Expected verified counts:

```json
{
  "projects": 5,
  "agent_seats": 3,
  "tasks": 8,
  "task_events": 12,
  "build_checks": 8,
  "review_records": 3,
  "settings": 2
}
```

## UI Remains Mock-Driven

No current app page or component imports `lib/local-db`.

Current UI still uses `lib/mock-data.ts`. Database-backed reads are reserved for a later approved Phase 2 step.

## Forbidden Integrations Confirmation

This step did not add:

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

## Next Recommended Step

Phase 2 Step 3 should be a separate approved step.

Recommended next step:

- Add tests around init/seed/repository behavior, or
- Wire read-only local DB loading behind a narrow server-only boundary while preserving mock fallback.

Phase 2 Step 3 has not started.
