# Phase 20 - Private Beta Test Round 1 / Feedback Intake

## What This Phase Implemented

Phase 20 prepared the first private beta feedback intake process for the local-first Production 1.0 baseline.

It added documentation, templates, triage rules, regression decision rules, and static readiness verification. It did not add product features, DB schema changes, dependencies, public release implementation, signing, notarization, auto updater, cloud sync, auth/payment/team/MCP, OpenAI API, or Phase 21 implementation.

## Beta Round 1 Readiness Summary

Current status:

```txt
PRIVATE_BETA_ROUND_1_FEEDBACK_INTAKE_READY_WITH_NOTED_LIMITATIONS
```

Phase 20 is ready for GM-approved private beta feedback intake using source checkout and local launcher workflows.

## Test Plan Summary

The test plan defines tester goals, prerequisites, test duration, setup path, core routes, local launcher validation, Settings, Safety Audit, Approved Project Path, Office Home, Project Room, Review Room, Backup / Restore guidance, Archive dry-run, and documentation usability.

## Cohort Summary

The cohort plan recommends a small technical group covering local developers, Codex CLI users, GM/project workflow users, UI/UX reviewers, and safety-conscious testers across macOS, Node/npm versions, Codex CLI present/absent, fresh clone, and existing clone scenarios.

## Feedback Intake Summary

The feedback workflow defines intake sources, required metadata, deduplication, confirmation, assignment, closing criteria, and safety/data escalation. It explicitly forbids support from requesting `auth.json`, `.env`, `.env.local`, tokens, private keys, or passwords.

## Triage Matrix Summary

The triage matrix defines severity levels `blocker`, `high`, `medium`, `low`, and `cosmetic`, plus priority levels `P0`, `P1`, `P2`, and `P3`.

It covers setup, launcher, Codex runtime, approved path, runner safety, review workflow, quality gates, backup/restore, archive, safety, UI/responsive, and documentation categories.

## Regression Decision Summary

The regression matrix defines which findings must enter Phase 21 fix work, which can become known limitations, and which block private beta expansion, public beta, or commercial release.

Data loss, safety boundary breaches, automatic execution bugs, and unsafe backup/restore behavior are never accepted as known limitations.

## Results Template Summary

The results report template captures tester count, environment spread, setup success, launch success, route success, Codex runtime observations, safety concerns, data concerns, top issues, repeated confusion, suggested fixes, and go/no-go recommendation.

Allowed recommendations:

```txt
GO_TO_FIX_BATCH
GO_TO_PUBLIC_BETA_SCOPE
NO_GO_BLOCKED
```

## What Did Not Change

- No app behavior changed.
- No UI behavior changed.
- No DB schema or migration changed.
- No dependencies changed.
- No lockfiles changed.
- No Codex runner behavior changed.
- No Quality Gate policy changed.
- No Backup / Restore behavior changed.
- No Archive cleanup behavior changed.
- No Tauri production packaging was added.
- No public release package was built.
- No signing, notarization, or auto updater was added.
- No cloud, auth, payment, team, MCP, OpenAI API, GitHub API, Vercel, or Supabase integration was added.

## Recommended Phase 21

GM should choose one of:

```txt
Phase 21 - Private Beta Fix Batch 1
Phase 21 - Public Beta Scope Lock
```

Recommended default: `Phase 21 - Private Beta Fix Batch 1` if real beta feedback produces P0/P1/P2 items. If feedback is clean and setup success is high, GM may choose `Phase 21 - Public Beta Scope Lock`.

## Explicit Phase Status

Phase 20 is complete as private beta feedback intake preparation. Phase 21 has not started.
