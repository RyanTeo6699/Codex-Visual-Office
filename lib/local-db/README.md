# Local DB Skeleton

This directory is the Phase 2 Step 1 local persistence skeleton.

The current UI still reads from `lib/mock-data.ts`. Do not import `lib/local-db/*` into client components or current pages until a later approved Phase 2 step.

## Contents

- `paths.ts` defines the local SQLite database path.
- `client.ts` defines the Node-only Drizzle + SQLite client.
- `schema.ts` defines Phase 2 tables and status enums aligned with `lib/types.ts`.
- `repositories/*` define initial local database access boundaries.
- `seed/seed-from-mock-data.ts` maps Phase 1 mock data into seed rows.

## Boundaries

- Local SQLite only.
- No UI wiring in this step.
- No automatic seed execution in this step.
- No Codex CLI.
- No OpenAI API.
- No Git watcher.
- No terminal runner.
- No cloud services.
