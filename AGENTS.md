# AGENTS.md

## Project

Codex Visual Office is a local-first visual office for ChatGPT + Codex workflows.

It visualizes projects, Codex seats, tasks, build states, event streams, and review flows.

The product is not OpenClaw, not Star Office, not GitHub Project, not Notion, and not a generic admin dashboard.

---

## Current Phase

Phase 17: Production 1.0 Finalization / Release Freeze.

Current goal:

> Freeze the local-first Production 1.0 baseline for Codex Visual Office by finalizing release status, release notes, acceptance report, verification manifest, and known limitations without adding new capabilities or expanding permissions.

This phase is documentation and verification only. It is not a public commercial launch, not signing, not notarization, not auto updater, not cloud sync, not auth/payment/team/MCP/ChatGPT App, and not Phase 18.

---

## Hard Scope Lock

You must follow this scope strictly.

### Allowed in Phase 17

You may build:

- release freeze documentation
- release notes
- final acceptance report
- final verification manifest
- known limitations register
- release status metadata
- docs consistency fixes
- verification hardening
- final report

### Forbidden in Phase 17

You must not build or integrate:

- new product features
- DB schema or migration changes
- new dependencies
- production release
- code signing
- notarization
- auto updater
- Electron
- cloud sync
- GitHub API
- Vercel
- Supabase
- auth
- payment
- team workspace
- MCP server
- ChatGPT App
- OpenAI API
- arbitrary shell runner
- command text box
- terminal emulator
- node-pty
- automatic Codex execution
- automatic Git mutation
- automatic Quality Gate execution
- destructive cleanup
- backup deletion
- token storage
- reading `~/.codex/auth.json`
- reading `.env` or `.env.local`
- Phase 18 implementation

## Historical Phase 1 Baseline

The original Phase 1 instructions below are retained as historical prototype baseline, not the current implementation scope.

### Allowed in Phase 1

You may build:

- Next.js app
- TypeScript types
- Tailwind UI
- React components
- Mock data
- Office Home
- Project Room
- Review Room
- OfficeMap
- ProjectRoomCard
- AgentSeat
- TaskBoard
- TaskCard
- BuildWall
- EventTicker
- ReviewPanel
- QualityGatePanel
- MockDiffSummary
- Status badges
- Basic mock state changes for review buttons

### Forbidden in Phase 1

You must not build or integrate:

- OpenAI API
- Codex CLI
- Codex App integration
- GitHub App
- GitHub OAuth
- GitHub API
- Vercel Webhook
- Supabase
- Firebase
- Any cloud database
- SQLite
- Auth
- Login / register
- Team permissions
- Payment
- Billing
- Cloud sync
- Backend services
- MCP server
- ChatGPT App
- Real file system access
- Real terminal execution
- child_process
- node-pty
- Git watcher
- Real git status
- Real git diff
- Real quality gate commands
- Auto deployment

If you think any forbidden item is necessary, stop and ask for GM approval.

---

## Required Pages

The app must include:

```txt
/
  Office Home

/projects/[id]
  Project Room

/review/[taskId]
  Review Room
```

---

## Required Components

Create clean component structure for:

```txt
components/office/OfficeMap.tsx
components/office/ProjectRoomCard.tsx
components/office/AgentSeat.tsx
components/office/BuildWall.tsx
components/office/EventTicker.tsx

components/tasks/TaskBoard.tsx
components/tasks/TaskCard.tsx
components/tasks/TaskStatusBadge.tsx

components/review/ReviewPanel.tsx
components/review/MockDiffSummary.tsx
components/review/QualityGatePanel.tsx

components/layout/AppShell.tsx
components/layout/Sidebar.tsx
components/layout/TopBar.tsx
```

Exact filenames may vary slightly, but the architecture must stay clear.

---

## Required Data Files

Create:

```txt
lib/types.ts
lib/mock-data.ts
lib/status.ts
```

`lib/mock-data.ts` must include at least:

- 5 projects
- 3 agent seats
- 8 tasks
- 12 task events
- 8 build checks
- 3 mock diff summaries

---

## Required TypeScript Types

Define strong types for:

```txt
Project
AgentSeat
Task
BuildCheck
TaskEvent
ReviewRecord
```

Use strict status unions.

---

## UI Direction

The UI must feel like:

```txt
Dark engineering command center
+ 2D / isometric AI office
+ Codex seats
+ project rooms
+ build wall
+ review room
```

The product must not look like:

```txt
generic admin dashboard
plain kanban board
Notion clone
childish game
ordinary SaaS template
```

---

## UX Requirements

A user must immediately understand:

1. Which projects exist.
2. Which Codex seats are active.
3. Which task is running.
4. Which task is blocked.
5. Which task is waiting for review.
6. Which check failed.
7. Where to review a task.

---

## Mock Interaction Requirements

Phase 1 must support:

1. Click project room → open Project Room.
2. Click task → open Review Room.
3. In Review Room:
   - Approve changes mock task state.
   - Reject changes mock task state.
   - Ask Revision changes mock task state.
4. No real backend operations.

---

## Quality Gate

Before final response, run:

```bash
npm run build
```

If a typecheck script exists, also run:

```bash
npm run typecheck
```

If either fails, fix the issue before reporting completion.

---

## Completion Criteria

Phase 1 is complete only if:

1. App starts locally.
2. Build passes.
3. Office Home exists.
4. Project Room exists.
5. Review Room exists.
6. UI clearly looks like a Codex visual office.
7. Mock data is complete.
8. Components are cleanly separated.
9. No forbidden integrations were added.

---

## Do Not Advance Phase

Do not start Phase 2 unless GM explicitly approves it.

Phase 2 will introduce local task persistence and SQLite.  
Phase 3 will introduce Codex CLI.  
Those are not allowed in Phase 1.
