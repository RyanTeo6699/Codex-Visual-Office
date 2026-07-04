# Phase 7 Roadmap

## Purpose

This roadmap reconciles the post-Phase 6 sequence and defines the local-first path from Phase 7A through Phase 12.

It is a planning document only. It does not claim any Phase 7B, 7C, 7D, Phase 8, Phase 9, Phase 10, Phase 11, or Phase 12 work has been implemented.

## Local-First Principle

Codex Visual Office remains local-first.

Desktop shell, launcher, packaging, and Codex runtime reliability work must preserve the local app model before optional cloud sync is introduced. Cloud sync must remain optional and delayed until a later GM-approved phase. Team workspace, auth, and payment must wait until Phase 10 or later. MCP and ChatGPT App work must wait until Phase 11.

## Corrected Phase Sequence

```txt
Phase 7A - Scope Lock / Roadmap Reconciliation
Phase 7B - Desktop Shell Evaluation
Phase 7C - Local Launcher
Phase 7D - Packaging Prototype
Phase 8 - Codex Runtime Reliability
Phase 9 - Future Sync / Cloud Planning
Phase 10 - Team Workspace
Phase 11 - ChatGPT App / MCP
Phase 12 - Safety / Permission Hardening
Phase 13 - Desktop Beta / Distribution Candidate
Phase 14 - Release Candidate QA / Documentation Hardening
Phase 15 - Release Candidate Stabilization / Bug Bash
Phase 16 - Production 1.0 Scope Lock / Final RC Validation
```

## Dependency Order

The phases must proceed in this order:

```txt
7A -> 7B -> 7C -> 7D -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16
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

- Phase 7C Browser-only Local Launcher implemented as a bounded local-only launcher.

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

### Status

- Phase 7D Tauri Packaging Prototype is configured as prototype-only; browser-only launcher fallback remains official, and Phase 8 implementation has not started.

## Phase 8 - Codex Runtime Reliability

### Goal

Validate Codex runtime reliability status, failure classification, and safety boundaries without running a real Codex coding task.

### Allowed

- Safe CLI found/version status.
- Mocked or static runtime classification checks.
- Last run summary validation.
- Runner policy and safety status verification.
- Settings / local shell status verification.
- Runtime reliability documentation.

### Boundaries

Phase 8 is verification and documentation only unless GM explicitly approves additional implementation.

It must not read `~/.codex/auth.json`, read `.env` / `.env.local`, store tokens, call OpenAI APIs, add arbitrary shell, add a command text box, add `node-pty`, add a terminal emulator, run a real Codex coding task, mutate Git, run Quality Gates, launch Tauri, open a browser, install dependencies, deploy, implement GitHub, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, UI redesign, cloud sync, or Phase 9.

### Output

- Runtime reliability scope lock.
- Runtime reliability implementation summary.
- Side-effect-safe verification command.
- Explicit failure classification coverage.

## Phase 9 - Future Sync / Cloud Planning

### Goal

Plan future sync or cloud behavior only after Phase 8 runtime reliability is complete and GM explicitly approves the next phase.

### Status

Phase 9 Virtual Office UI Redesign Integration is being tracked as a UI/presentation-only design-system pass and does not start future sync or cloud planning.

### Allowed

- Future sync planning.
- Local-first preservation rules.
- Data ownership model.
- Conflict and offline behavior planning.
- Provider evaluation if GM-approved.

### Boundaries

Phase 9 must not begin during Phase 8.

Cloud sync must remain optional if later approved. The local app must continue to work without cloud accounts or network access. Team workspace, role permissions, payment, MCP, and ChatGPT App remain out of scope.

### Output

- Future sync plan only after approval.
- Local-offline requirements.
- Explicit implementation decision gates.

## Phase 10 - Team Workspace

### 2026-07-03 Status Note

Current GM direction tracks Phase 10 as "Real Project Workspace Hardening" instead of Team Workspace. Team workspace, auth, payment, permissions, and account behavior remain out of scope unless GM explicitly re-approves them in a later phase.

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

### 2026-07-03 Status Note

Current GM direction tracks Phase 11 as "Codex Agent Workflow 2.0" instead of ChatGPT App / MCP implementation. MCP, ChatGPT App, external APIs, automatic execution, and source-read expansion remain out of scope unless GM explicitly re-approves them in a later phase.

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

## Phase 12 - Safety / Permission Hardening

### 2026-07-03 Status Note

Current GM direction tracks Phase 12 as "Safety / Permission Hardening". Phase 12 consolidates existing local-first safety boundaries into a visible, verifiable, and auditable safety/permission layer without adding dangerous execution capabilities.

### Goal

Make local permission state, sensitive path protections, approved path boundaries, runner safety, backup/restore safety, archive/retention safety, launcher/Tauri safety, and credential safety easier to inspect and verify.

### Allowed

- Local permission model.
- Sensitive path guard consolidation.
- Approved path permission summary.
- Runner safety summary.
- Backup/restore safety summary.
- Archive/retention safety summary.
- Launcher/Tauri safety summary.
- `/safety` UI.
- Documentation and verification.

### Boundaries

Phase 12 must not add automatic Codex/Git/Quality execution, arbitrary shell, command text box, terminal emulator, `node-pty`, source reads, package auto-detection, folder picker, file browser, source viewer, credential reads, token storage, cloud sync, external integrations, auth, payment, team permissions, MCP, ChatGPT App, production packaging, Electron, auto updater, destructive cleanup, backup deletion, or Phase 13 implementation.

## Phase 13 - Desktop Beta / Distribution Candidate

### 2026-07-03 Status Note

Current GM direction tracks Phase 13 as "Desktop Beta / Distribution Candidate". Phase 13 is Mac-first, local-first, and not a production release.

### Goal

Document and verify the desktop beta candidate posture without changing app behavior or advancing to production release.

### Allowed

- Desktop beta candidate documentation.
- Tauri beta configuration review.
- App metadata hardening review.
- Desktop beta verification notes.
- Cold start readiness documentation.
- Local data preservation boundaries.
- Browser launcher fallback documentation.
- Documentation and verification.

### Boundaries

Phase 13 must not add production release, signing, notarization, auto updater, production installer distribution, Electron, cloud sync, GitHub, Vercel, Supabase, auth, payment, team permissions, MCP, OpenAI API, arbitrary shell, command text box, terminal, `node-pty`, automatic Codex/Git/Quality execution, destructive cleanup, backup deletion, credential reads, token reads, or Phase 14 implementation.

## Phase 14 - Release Candidate QA / Documentation Hardening

### 2026-07-03 Status Note

Current GM direction tracks Phase 14 as "Release Candidate QA / Documentation Hardening". Phase 14 prepares the desktop beta candidate for Release Candidate review by hardening documentation, QA checklists, and static readiness verification without adding product capability.

### Goal

Make the current local-first product easier to verify, operate, recover, and hand off to GM for Release Candidate evaluation.

### Allowed

- User manual.
- Developer manual.
- Local setup guide.
- Troubleshooting guide.
- Safety and data boundary guide.
- Backup/restore recovery guide.
- Desktop beta QA checklist.
- Release Candidate checklist.
- Documentation verification.
- Release Candidate static readiness verification.
- Minor copy/help text improvements if needed.

### Boundaries

Phase 14 must not add new business features, DB schema changes, runner behavior changes, Quality Gate policy changes, backup/restore behavior changes, archive cleanup behavior changes, production release, code signing, notarization, auto updater, Electron, cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, OpenAI API, arbitrary shell, command text box, terminal emulator, `node-pty`, automatic Codex/Git/Quality execution, destructive cleanup, backup deletion, credential reads, token storage, or Phase 15 implementation.

### Output

- Phase 14 scope lock.
- Release Candidate user and developer documentation set.
- Release Candidate QA checklist.
- Documentation readiness verifier.
- Release Candidate readiness verifier.
- Phase 14 implementation summary.

## Phase 15 - Release Candidate Stabilization / Bug Bash

### 2026-07-04 Status Note

Current GM direction tracks Phase 15 as "Release Candidate Stabilization / Bug Bash". Phase 15 stabilizes the current local-first desktop beta / RC candidate with route QA, responsive checks, copy/docs consistency, and static verification hardening.

### Goal

Stabilize the current RC candidate without adding product capability, dependencies, schema changes, production packaging, cloud behavior, account systems, or expanded execution permissions.

### Allowed

- Route QA fixes.
- Browser console and hydration cleanup.
- Responsive layout fixes.
- Empty/error state fixes.
- Copy consistency fixes.
- Documentation consistency fixes.
- Accessibility basics.
- Static verification hardening.
- RC stabilization documentation.

### Boundaries

Phase 15 must not add new features, DB schema changes, migrations, dependencies, production release, code signing, notarization, auto updater, Electron, cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, OpenAI API, arbitrary shell, command text box, terminal emulator, `node-pty`, automatic Codex/Git/Quality execution, destructive cleanup, backup deletion, credential reads, token storage, or Phase 16 implementation.

### Output

- Phase 15 scope lock.
- RC stabilization verifier.
- Route/responsive/manual QA record.
- Phase 15 stabilization summary.

## Phase 16 - Production 1.0 Scope Lock / Final RC Validation

### 2026-07-04 Status Note

Current GM direction tracks Phase 16 as "Production 1.0 Scope Lock / Final RC Validation". Phase 16 freezes the Production 1.0 candidate boundary and validates the current local-first desktop beta / RC candidate without adding product capability.

### Goal

Freeze the Production 1.0 candidate scope, release boundary, known limitations, risk register, Go / No-Go checklist, and final RC validation matrix.

### Allowed

- Production 1.0 candidate scope lock.
- Final RC validation matrix.
- Product capability inventory.
- Release boundary freeze.
- Known limitations freeze.
- Risk register.
- Go / No-Go checklist.
- Documentation consistency fixes.
- Static verification hardening.

### Boundaries

Phase 16 must not add new features, DB schema changes, migrations, dependencies, production release, code signing, notarization, auto updater, Electron, cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, OpenAI API, arbitrary shell, command text box, terminal emulator, `node-pty`, automatic Codex/Git/Quality execution, destructive cleanup, backup deletion, credential reads, token storage, or Phase 17 implementation.

### Output

- Phase 16 scope lock.
- Production 1.0 boundary document.
- Product capability inventory.
- Risk register.
- Go / No-Go checklist.
- Final RC validation matrix.
- Production scope verifier.
- Phase 16 result summary.
