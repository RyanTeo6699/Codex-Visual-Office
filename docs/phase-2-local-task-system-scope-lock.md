# Phase 2 Local Task System Scope Lock

## Phase 2 Goal

Phase 2 will convert the Phase 1 mock-only visual prototype into a local-first task system with persistent project, agent seat, task, event, build check, review, and settings data.

The goal is local persistence and local task-state workflows only. Phase 2 must preserve the Phase 1 product shape while replacing static mock arrays with approved local persisted data.

## Allowed In Phase 2

Phase 2 may implement:

- Local data persistence for Phase 1 entities.
- Local seed data based on the existing Phase 1 mock data.
- Local CRUD flows for projects and tasks.
- Local assignment of tasks to agent seats.
- Local task status updates.
- Local review decisions for approve, reject, and ask revision.
- Local task event creation.
- Local settings storage.
- UI states needed to create, edit, and persist local records.
- Data validation for local-only entities and status enums.
- Migration logic from mock seed data into local persisted data.
- Tests for local data access, migrations, and UI persistence behavior.

## Not Allowed In Phase 2

Phase 2 must not implement:

- Codex CLI integration.
- Real Codex task execution.
- OpenAI API calls.
- Git watcher.
- Real Git status.
- Real Git diff.
- Terminal runner.
- Real build command execution.
- GitHub integration.
- Vercel integration.
- Supabase.
- Firebase.
- Cloud database.
- Cloud sync.
- Auth, login, register, permissions, or team management.
- Payment or billing.
- Backend service outside the local app persistence boundary.
- MCP server.
- Real file-system scanning from the UI.
- `child_process`.
- `node-pty`.
- Auto deployment.

## Data Persistence Boundary

Phase 2 persistence is limited to local application data:

- Projects.
- Agent seats.
- Tasks.
- Task events.
- Build checks as local records.
- Review records.
- Settings.

Persisted data may represent build checks and diff summaries as local records, but Phase 2 must not run real build commands or read real diffs.

Phase 2 persistence must not store secrets, credentials, API keys, OAuth tokens, payment data, or remote account identifiers.

## UI Boundary

Phase 2 UI may add local-only controls required for persistence:

- Create project.
- Create task.
- Assign task to agent seat.
- Update task status.
- Add local task event.
- Persist review decision.
- View and update local settings.

Phase 2 UI must not add:

- Login or user identity flows.
- Cloud connection flows.
- GitHub/Vercel/Supabase connection screens.
- Codex CLI execution controls.
- Terminal panes.
- Real command runners.
- Real Git diff or Git status panels.

The Phase 1 visual office direction must remain the primary interaction model.

## Local-First Boundary

Phase 2 must work without network access after dependencies are installed.

All application data must remain on the local machine. The product must not assume:

- A cloud account.
- A remote workspace.
- A hosted database.
- A team permission model.
- A remote job runner.

## Forbidden Integrations

The following remain explicitly forbidden in Phase 2:

- Codex CLI.
- Git watcher.
- Terminal runner.
- OpenAI API.
- GitHub App.
- GitHub OAuth.
- GitHub API.
- Vercel webhook.
- Vercel API.
- Supabase.
- Firebase.
- Cloud sync.
- Auth.
- Payment.
- Billing.
- MCP server.
- Backend services beyond approved local app persistence.
- `child_process`.
- `node-pty`.

## Acceptance Criteria

Phase 2 can be considered complete only when:

- Existing Phase 1 pages still exist:
  - `/`
  - `/projects/[id]`
  - `/review/[taskId]`
- Existing Phase 1 visual office direction is preserved.
- Initial local database/data store is created from approved seed data.
- Projects persist locally.
- Agent seats persist locally.
- Tasks persist locally.
- Task events persist locally.
- Build checks persist locally as mock/local records.
- Review records persist locally.
- Settings persist locally.
- Review actions persist across reload.
- Task status changes persist across reload.
- Creating a local project persists across reload.
- Creating a local task persists across reload.
- Assigning a task to an agent seat persists across reload.
- No forbidden integrations are added.
- `npm run typecheck` passes.
- `npm run build` passes.

## Failure Criteria

Phase 2 fails scope if it:

- Starts Codex CLI integration.
- Calls OpenAI APIs.
- Reads real Git state.
- Watches Git.
- Runs terminal commands from the UI.
- Uses `child_process`.
- Uses `node-pty`.
- Adds GitHub, Vercel, Supabase, Firebase, cloud sync, auth, payment, or billing.
- Stores secrets or remote credentials.
- Replaces the visual office with a generic admin dashboard.
- Implements persistence in a way that requires a remote service.
- Breaks any required Phase 1 page.
- Makes review buttons nonfunctional.

## Explicit Phase 2 Forbidden Statement

Codex CLI, Git watcher, terminal runner, GitHub, Vercel, Supabase, auth, payment, and cloud sync remain forbidden in Phase 2.

Phase 2 is local persistence only. It must not start real agent execution, real Git automation, real build execution, or remote platform integration.
