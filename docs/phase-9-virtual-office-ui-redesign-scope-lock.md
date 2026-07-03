# Phase 9 - Virtual Office UI Redesign Integration Scope Lock

## Phase Name

Phase 9 - Virtual Office UI Redesign Integration

## Goal

Upgrade the visual presentation of Codex Visual Office into a more coherent virtual office interface while preserving all existing local-first workflow logic and safety boundaries.

## Core Positioning

Phase 9 is a visual integration phase.

It improves UI hierarchy, styling, presentation consistency, and virtual-office product feel. It is not a workflow-expansion phase and not a runtime-capability phase.

## Allowed

- Design token cleanup.
- UI component styling.
- Layout hierarchy improvements.
- Office Home visual redesign.
- Project Room visual redesign.
- Review Room visual redesign.
- Settings / Archive visual polish.
- Runtime status visual indicators.
- Agent seat visual state improvements.
- Route-level visual consistency.
- Lightweight UI primitives.
- Static UI verification.
- Documentation and roadmap status updates.

## Forbidden

- DB schema changes.
- New migrations.
- Codex runner behavior changes.
- Codex runner policy changes.
- Arbitrary shell.
- Command text box.
- Terminal emulator.
- `node-pty`.
- New Quality Gate commands.
- Quality Gate runner policy changes.
- Backup / Restore behavior changes.
- Archive destructive cleanup.
- Tauri production packaging.
- Electron.
- Auto updater.
- Cloud sync.
- GitHub API.
- Vercel integration.
- Supabase integration.
- Auth.
- Login / register.
- Payment.
- Billing.
- Team workspace.
- Team permissions.
- MCP / ChatGPT App.
- OpenAI API.
- Token storage.
- Reading `~/.codex/auth.json`.
- Reading `.env` / `.env.local`.
- Phase 10 implementation.

## UI Boundary

Phase 9 may change:

- React component presentation.
- Tailwind class composition.
- Page section order and grouping.
- Status visualization.
- Headings, labels, and non-functional explanatory copy.
- Static verification and docs.

Phase 9 must not change:

- Server actions.
- Repository operations.
- Database schema.
- Runner safety checks.
- Quality Gate execution model.
- Backup / Restore service behavior.
- Archive dry-run behavior.
- Tauri capability config.
- Local launcher safety behavior.

## Design System Boundary

Virtual Office Design System v1 may include:

- Background layers.
- Office surfaces.
- Room cards.
- Agent seat states.
- Status pills.
- Evidence cards.
- Warning / blocked / passed / running states.
- Section headers.
- Action panels.
- Timeline rows.
- Local-only notices.

It must not include:

- A new large UI framework.
- A new animation-heavy dependency.
- A charting library.
- Runtime side effects.
- Network calls.
- File reads.
- Shell execution.
- Token handling.

## Safety Boundary Confirmation

All existing local-first safety boundaries remain intact:

- Codex execution remains scoped.
- Git observation remains bounded and read-only except existing allowed verification behavior.
- Quality Gate commands remain allowlisted.
- Backup / Restore remains local SQLite only.
- Archive cleanup remains dry-run preview only.
- Tauri remains prototype-only.
- Local launcher remains browser-only.
- Runtime reliability remains safe-detection only and does not verify auth by reading credentials.

## Acceptance Criteria

Phase 9 passes only if:

- Office Home visually reads as a virtual office entry.
- Project Room visually reads as a project compartment.
- Review Room visually reads as an acceptance desk / review room.
- Settings Center visually reads as a local product control center.
- Archive Room visually reads as a read-only records room.
- Statuses are text-visible and not color-only.
- Critical controls remain visible on desktop and mobile-ish widths.
- No forbidden UI controls are added.
- No schema or migration files are changed.
- No runner / quality / backup / archive safety behavior is changed.
- Required verification passes.

## Failure Criteria

Phase 9 fails if it:

- Adds DB schema or migrations.
- Adds any new command execution capability.
- Adds arbitrary shell, command text box, terminal emulator, or `node-pty`.
- Adds cloud sync, external service connect flows, auth, payment, team workspace, MCP, or OpenAI API.
- Adds destructive archive cleanup.
- Adds backup file deletion.
- Adds Tauri production packaging, Electron, installer, signing, or auto updater.
- Breaks route loading.
- Introduces hydration errors or visible critical responsive overflow.
- Starts Phase 10.

## Phase 10 Status

Phase 10 has not started.
