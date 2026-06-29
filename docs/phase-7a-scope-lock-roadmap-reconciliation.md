# Phase 7A - Scope Lock / Roadmap Reconciliation

## Phase Name

Phase 7A - Scope Lock / Roadmap Reconciliation

## Final Status

PLANNED_SCOPE_LOCK

## Current Baseline

Current baseline before this step:

- Branch: `main`
- Latest commit before this step: `4589d3c feat: sharpen codex visual office ui`
- Phase 6 status: closed in `docs/phase-6-local-productization-closeout.md`

## Problem

The post-Phase 6 roadmap had a phase-ordering inconsistency.

`docs/phase-6-local-productization-closeout.md` recommends the next phase as:

```txt
Phase 7 - Desktop Shell Evaluation / Packaging Strategy
```

But `docs/ROADMAP.md` and `docs/PRD.md` still described Phase 7 as cloud sync / GitHub / Vercel / Supabase.

This created ambiguity about whether the project should move next into local desktop app shell work or cloud service integration.

## Decision

Phase 7 is split into 7A / 7B / 7C / 7D and remains focused on the local desktop / app shell path before any cloud sync work.

Cloud sync is delayed until Phase 8 planning and Phase 9 implementation. Team workspace, auth, payment, ChatGPT App, and MCP remain later-stage work.

## Corrected Future Sequence

```txt
1. Phase 7A Scope Lock / Roadmap Reconciliation
2. Phase 7B Desktop Shell Evaluation
3. Phase 7C Local Launcher
4. Phase 7D Packaging Prototype
5. Phase 8 Cloud Sync Planning
6. Phase 9 Cloud Sync Implementation
7. Phase 10 Team Workspace
8. Phase 11 ChatGPT App / MCP
```

## Scope Of This Step

This step is planning / docs only.

It reconciles roadmap language and locks the corrected phase order. It does not start Phase 7B implementation.

## Forbidden In This Step

This step must not add or modify:

- app code changes
- UI changes
- dependencies
- package files
- schema / migration changes
- Tauri implementation
- Electron implementation
- desktop packaging implementation
- cloud sync
- GitHub API
- Vercel
- Supabase
- auth
- payment
- MCP
- OpenAI API

## Acceptance Criteria

This step is accepted only if:

1. `docs/phase-7a-scope-lock-roadmap-reconciliation.md` exists.
2. `docs/phase-7-roadmap.md` exists.
3. The corrected future sequence is explicitly documented.
4. Phase 7 is documented as 7A / 7B / 7C / 7D before cloud sync.
5. Cloud sync is explicitly delayed until Phase 8 / Phase 9.
6. Team workspace, auth, and payment are delayed until Phase 10 or later.
7. ChatGPT App / MCP is delayed until Phase 11.
8. Existing roadmap / PRD phase numbering conflicts are resolved with surgical documentation edits only.
9. No app code, package, dependency, schema, migration, or UI files are modified.
10. `git diff --check` passes.

## Failure Criteria

This step fails if it:

1. Starts Phase 7B implementation.
2. Adds Tauri, Electron, or desktop packaging code.
3. Adds or changes app code.
4. Adds or changes dependencies or package files.
5. Adds or changes database schema or migrations.
6. Adds cloud sync, GitHub API, Vercel, Supabase, auth, payment, MCP, or OpenAI API.
7. Claims cloud, team, desktop packaging, ChatGPT App, or MCP work has been implemented.
8. Leaves Phase 7 numbering ambiguous between desktop shell work and cloud sync.

## Next Recommended Stage

Phase 7B Desktop Shell Evaluation.

## Phase 7B Status

Phase 7B implementation has not started.
