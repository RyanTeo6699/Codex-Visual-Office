# Phase 7 Roadmap

## Purpose

This roadmap reconciles the post-Phase 6 sequence and defines the local-first path from Phase 7A through Phase 11.

It is a planning document only. It does not claim any Phase 7B, 7C, 7D, Phase 8, Phase 9, Phase 10, or Phase 11 work has been implemented.

## Local-First Principle

Codex Visual Office remains local-first.

Desktop shell, launcher, and packaging work must preserve the local app model before optional cloud sync is introduced. Cloud sync must remain optional and delayed until Phase 8 / Phase 9. Team workspace, auth, and payment must wait until Phase 10 or later. MCP and ChatGPT App work must wait until Phase 11.

## Corrected Phase Sequence

```txt
Phase 7A - Scope Lock / Roadmap Reconciliation
Phase 7B - Desktop Shell Evaluation
Phase 7C - Local Launcher
Phase 7D - Packaging Prototype
Phase 8 - Cloud Sync Planning
Phase 9 - Cloud Sync Implementation
Phase 10 - Team Workspace
Phase 11 - ChatGPT App / MCP
```

## Dependency Order

The phases must proceed in this order:

```txt
7A -> 7B -> 7C -> 7D -> 8 -> 9 -> 10 -> 11
```

No later phase should start without explicit GM approval.

## Phase 7A - Scope Lock / Roadmap Reconciliation

### Goal

Resolve the roadmap inconsistency created after Phase 6 and lock the corrected post-Phase 6 sequence.

### Allowed

- Documentation updates.
- Roadmap reconciliation.
- Scope lock language.
- Phase boundary clarification.

### Forbidden

- App code changes.
- UI changes.
- Dependency changes.
- Package file changes.
- Schema or migration changes.
- Tauri / Electron implementation.
- Desktop packaging implementation.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth.
- Payment.
- MCP.
- OpenAI API.

### Output

- Phase 7A scope lock document.
- Phase 7 roadmap document.
- Minimal ROADMAP / PRD updates if needed.

## Phase 7B - Desktop Shell Evaluation

### Goal

Evaluate the best local desktop shell strategy before implementation.

### Allowed

- Compare Tauri, Electron, and browser-only local launcher options.
- Document platform tradeoffs.
- Identify packaging risks.
- Define local runtime boundaries.
- Recommend one path for Phase 7C / 7D.

### Boundaries

Phase 7B is evaluation only unless GM explicitly expands scope.

It should not add a desktop runtime, installer, packaging scripts, auto updater, system tray, daemon, startup service, cloud sync, or external service integration.

### Output

- Desktop shell evaluation document.
- Recommended shell / launcher direction.
- Explicit no-go risks.

### Status

- Evaluation document exists and recommends Phase 7C Browser-only Local Launcher first.

## Phase 7C - Local Launcher

### Goal

Create a local launcher experience for starting and opening Codex Visual Office locally.

### Allowed

- Local launcher design based on Phase 7B decision.
- Local app startup flow.
- Local status messaging.
- Browser-safe launch affordances.
- Local-only configuration needed for startup.

### Boundaries

Phase 7C must remain local-only.

It must not introduce cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, auto updater, or production packaging.

### Output

- Local launcher implementation plan or implementation only after GM approval.
- Clear local runtime boundary.

### Status

- Phase 7C Browser-only Local Launcher implemented as a bounded local-only launcher; Phase 7D packaging has not started.

## Phase 7D - Packaging Prototype

### Goal

Prototype packaging for local desktop use after launcher direction is settled.

### Allowed

- Packaging prototype.
- Local desktop app shell proof.
- Manual packaging notes.
- Platform limitations.
- Local-only verification checklist.

### Boundaries

Phase 7D is not cloud sync and not a production distribution release.

It must not add account systems, remote sync, payment, team permissions, GitHub App, Vercel integration, Supabase cloud, MCP, or ChatGPT App integration.

### Output

- Packaging prototype.
- Packaging verification notes.
- Known limitations and release blockers.

## Phase 8 - Cloud Sync Planning

### Goal

Plan optional cloud sync without breaking the local-first product.

### Allowed

- Cloud sync architecture planning.
- Data ownership model.
- Conflict and offline behavior planning.
- Privacy and security boundaries.
- Optional sync UX design.
- Provider evaluation.

### Boundaries

Phase 8 is planning only unless GM explicitly approves implementation.

It must not implement GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, or live cloud sync.

### Output

- Cloud sync plan.
- Local-first preservation rules.
- Optional sync decision gates.

## Phase 9 - Cloud Sync Implementation

### Goal

Implement optional cloud sync only after Phase 8 planning is approved.

### Allowed

- Optional cloud sync.
- Remote project / task sync if approved.
- Provider-specific integration only after explicit approval.
- Sync status visibility.
- Conflict handling based on Phase 8 plan.

### Boundaries

Cloud sync must remain optional.

The local app must continue to work without cloud accounts or network access. Team workspace, role permissions, payment, MCP, and ChatGPT App remain out of scope.

### Output

- Optional sync implementation.
- Sync verification.
- Local-offline verification.

## Phase 10 - Team Workspace

### Goal

Introduce team workspace concepts after optional cloud sync exists.

### Allowed

- Workspace model.
- Members.
- Roles.
- Permissions.
- Audit logs.
- Team review flows.
- Auth only as needed for team workspace.
- Payment only if explicitly approved for this phase or later.

### Boundaries

Team workspace must not be introduced before Phase 10.

Phase 10 must not start MCP or ChatGPT App integration unless GM explicitly advances that later phase.

### Output

- Team workspace implementation plan and/or implementation after approval.
- Role and permission boundaries.
- Team audit model.

## Phase 11 - ChatGPT App / MCP

### Goal

Allow ChatGPT App / MCP integration after the local, packaging, optional sync, and team foundations are settled.

### Allowed

- MCP planning and implementation after approval.
- ChatGPT App surface planning and implementation after approval.
- Project status queries.
- Task creation / review queries.
- Office status widgets.

### Boundaries

MCP and ChatGPT App work must not start before Phase 11.

This phase must preserve local-first boundaries and only expose capabilities that are explicitly approved.

### Output

- MCP / ChatGPT App plan and/or implementation after approval.
- Security boundary document.
- Integration verification.
