# Phase 2 Local Data Model Plan

## Purpose

This document defines the proposed local data model for Phase 2 of Codex Visual Office. It is a planning document only. Phase 2 implementation has not started.

The model keeps Phase 2 local-only and prepares the app to persist the Phase 1 visual office data without adding real Codex execution, Git integration, terminal execution, cloud services, auth, or payment.

## Recommended Persistence Technology

### Recommendation

Use SQLite for local persistence.

### ORM Recommendation

Use Drizzle ORM if an ORM is introduced.

Reasons:

- Strong TypeScript support.
- Explicit schema definitions.
- Lightweight compared with heavier ORMs.
- Good fit for local-first SQLite.
- Clear migration files.
- Easy to keep data-access boundaries visible.

Alternative:

- Use direct SQLite queries for maximum simplicity if Phase 2 scope remains small.

Recommendation:

- Prefer Drizzle ORM only if Phase 2 includes multiple migrations, typed query helpers, and testable repository boundaries.
- Prefer direct SQLite only if the first Phase 2 slice is intentionally minimal.

No dependency should be installed until Phase 2 implementation is explicitly approved.

## Proposed Entities

### `projects`

Represents a local project room.

Fields:

- `id` - text primary key. Stable local identifier.
- `name` - text. Project display name.
- `phase` - text. Current project phase label.
- `status` - text enum. Project status.
- `local_path_placeholder` - text nullable. Display-only local path placeholder unless later approved.
- `summary` - text. Short project summary.
- `accent` - text enum. Visual accent color.
- `created_at` - text datetime.
- `updated_at` - text datetime.

Status enum:

- `active`
- `quiet`
- `attention`
- `reviewing`
- `blocked`

Accent enum:

- `cyan`
- `teal`
- `amber`
- `red`
- `violet`

### `agent_seats`

Represents a local AI employee / work pod.

Fields:

- `id` - text primary key.
- `name` - text. Seat display name.
- `status` - text enum. Current agent seat status.
- `project_id` - text foreign key to `projects.id`.
- `task_id` - text nullable foreign key to `tasks.id`.
- `focus` - text. Human-readable current focus.
- `created_at` - text datetime.
- `updated_at` - text datetime.

Status enum:

- `idle`
- `reading_repo`
- `planning`
- `editing`
- `running_checks`
- `build_failed`
- `fixing`
- `waiting_review`
- `done`
- `blocked`

### `tasks`

Represents a local work item.

Fields:

- `id` - text primary key.
- `project_id` - text foreign key to `projects.id`.
- `title` - text.
- `status` - text enum. Task lifecycle status.
- `priority` - text enum.
- `agent_seat_id` - text nullable foreign key to `agent_seats.id`.
- `acceptance_criteria_json` - text JSON array of strings.
- `forbidden_scope_json` - text JSON array of strings.
- `changed_files_json` - text JSON array of mock file paths.
- `created_at` - text datetime.
- `updated_at` - text datetime.

Status enum:

- `backlog`
- `ready`
- `running`
- `waiting_review`
- `blocked`
- `done`

Priority enum:

- `low`
- `medium`
- `high`
- `critical`

### `task_events`

Represents a local office activity update.

Fields:

- `id` - text primary key.
- `project_id` - text foreign key to `projects.id`.
- `task_id` - text nullable foreign key to `tasks.id`.
- `agent_seat_id` - text nullable foreign key to `agent_seats.id`.
- `time` - text. Display time or ISO timestamp.
- `tone` - text enum.
- `message` - text.
- `created_at` - text datetime.

Tone enum:

- `info`
- `success`
- `warning`
- `danger`

### `build_checks`

Represents local mock quality/build check records.

Important boundary:

Build checks remain records only in Phase 2. They must not run commands.

Fields:

- `id` - text primary key.
- `project_id` - text foreign key to `projects.id`.
- `task_id` - text nullable foreign key to `tasks.id`.
- `label` - text.
- `status` - text enum.
- `detail` - text.
- `created_at` - text datetime.
- `updated_at` - text datetime.

Status enum:

- `pending`
- `running`
- `passed`
- `failed`
- `skipped`

### `review_records`

Represents review-room state and mock diff summaries.

Fields:

- `task_id` - text primary key and foreign key to `tasks.id`.
- `diff_summary_json` - text JSON array of strings.
- `risk_notes_json` - text JSON array of strings.
- `quality_gate_ids_json` - text JSON array of build check IDs.
- `decision` - text enum.
- `created_at` - text datetime.
- `updated_at` - text datetime.

Decision enum:

- `pending`
- `approved`
- `rejected`
- `revision_requested`

### `settings`

Represents local application settings.

Fields:

- `key` - text primary key.
- `value_json` - text JSON value.
- `created_at` - text datetime.
- `updated_at` - text datetime.

Recommended initial settings:

- `schema_version`
- `seed_version`
- `office_view_mode`
- `reduced_motion`

## Relationships

- One project has many tasks.
- One project has many agent seats.
- One project has many task events.
- One project has many build checks.
- One task belongs to one project.
- One task may be assigned to one agent seat.
- One task may have many task events.
- One task may have many build checks.
- One task has zero or one review record.
- One agent seat belongs to one project.
- One agent seat may point to one active task.

Relationship constraints:

- `tasks.project_id` must reference an existing project.
- `agent_seats.project_id` must reference an existing project.
- `agent_seats.task_id` may be null but, when set, must reference an existing task.
- `task_events.project_id` must reference an existing project.
- `task_events.task_id` may be null but, when set, must reference an existing task.
- `task_events.agent_seat_id` may be null but, when set, must reference an existing agent seat.
- `build_checks.project_id` must reference an existing project.
- `build_checks.task_id` may be null but, when set, must reference an existing task.
- `review_records.task_id` must reference an existing task.

## Migration From Mock Data To Local Persisted Data

Phase 2 should seed the local database from the existing Phase 1 mock data in `lib/mock-data.ts`.

Seed data should include:

- All 5 `projects`.
- All 3 `agentSeats`.
- All 8 `tasks`.
- All 12 `taskEvents`.
- All 8 `buildChecks`.
- All 3 `reviewRecords`.

Recommended seed behavior:

1. On first local database creation, insert seed records.
2. Store a `seed_version` in `settings`.
3. Do not reseed over user-edited local data.
4. If seed format changes during development, create an explicit migration rather than silently resetting data.

## UI Actions That Should Become Persistent

Phase 2 should persist these local-only actions:

- Create project.
- Create task.
- Assign task to agent seat.
- Update task status.
- Approve changes.
- Reject changes.
- Ask revision.
- Add task event.

Expected persistence behavior:

- Changes survive page reload.
- Changes survive app restart.
- Review decisions update `review_records.decision`.
- Task status changes update `tasks.status`.
- Assignment changes update `tasks.agent_seat_id` and/or `agent_seats.task_id`.
- Local events append rows to `task_events`.

## UI Actions That Should Remain Mock Or Disabled

The following must remain mock-only, disabled, or absent in Phase 2:

- Run Codex.
- Execute terminal command.
- Run quality gate command.
- Read real Git status.
- Read real Git diff.
- Watch repository files.
- Connect GitHub.
- Connect Vercel.
- Connect Supabase.
- Sync to cloud.
- Invite team members.
- Login or register.
- Configure billing or payment.
- Deploy application.

## File Structure Recommendation

Recommended implementation structure for Phase 2:

```txt
lib/db/
  schema.ts
  client.ts
  migrations/
  seed.ts

lib/repositories/
  projects.ts
  agent-seats.ts
  tasks.ts
  task-events.ts
  build-checks.ts
  review-records.ts
  settings.ts

lib/actions/
  project-actions.ts
  task-actions.ts
  review-actions.ts
  event-actions.ts

lib/validation/
  statuses.ts
  task-inputs.ts

tests/
  db/
  repositories/
  actions/
```

Boundary recommendations:

- UI components should not call SQLite directly.
- Repository modules should own database reads and writes.
- Action modules should enforce mutation rules.
- Status enums should stay aligned with `lib/types.ts` and `lib/status.ts`.
- Seed data should come from existing mock data and be transformed through explicit seed helpers.

## Risks And Mitigations

### Risk: Phase 2 accidentally becomes real agent execution

Mitigation:

- Keep Codex CLI, terminal runner, Git watcher, and build command execution explicitly out of scope.
- Treat build checks as local records only.
- Keep changed files as mock metadata only.

### Risk: Data model diverges from Phase 1 types

Mitigation:

- Reuse existing status unions where possible.
- Add tests that compare allowed persisted status values against TypeScript unions.
- Keep transformation helpers between database rows and UI types.

### Risk: SQLite implementation leaks into UI components

Mitigation:

- Use repository and action modules.
- Keep UI components consuming typed domain objects.
- Avoid direct database calls from React components.

### Risk: Seed data overwrites user edits

Mitigation:

- Seed only on first database creation.
- Track `seed_version`.
- Never reseed without explicit migration logic.

### Risk: Future cloud or auth assumptions enter the model too early

Mitigation:

- Do not add user, team, workspace, remote account, OAuth, or billing tables in Phase 2.
- Keep IDs local and stable.
- Add remote-sync metadata only in a future approved phase.

### Risk: Review decisions persist but task state becomes inconsistent

Mitigation:

- Define review actions as atomic local mutations.
- For `approved`, set review decision to `approved` and optionally set task status to `done` only if approved in the Phase 2 implementation plan.
- For `rejected`, set review decision to `rejected` and keep task status review-visible.
- For `revision_requested`, set review decision to `revision_requested` and move task status to `blocked` or `ready` only if explicitly approved in the implementation plan.

## Phase 2 Planning Status

This is a planning document only. Phase 2 implementation has not started.
