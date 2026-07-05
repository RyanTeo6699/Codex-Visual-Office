# Phase 20 - Private Beta Test Round 1 / Feedback Intake Scope Lock

## Phase Name

Phase 20 - Private Beta Test Round 1 / Feedback Intake.

## Goal

Establish the first private beta test round, feedback intake workflow, issue triage model, and regression decision process for the local-first Production 1.0 baseline without implementing public release, cloud, auth, payment, team, MCP, signing, notarization, or auto-updater capabilities.

## Allowed

- Private beta round 1 test plan.
- Beta tester cohort plan.
- Feedback intake workflow.
- Issue severity / priority matrix.
- Beta feedback tracker template.
- Regression decision matrix.
- Beta round 1 exit criteria.
- Private beta results report template.
- Documentation and static verification.
- Roadmap and release status consistency updates.

## Forbidden

- Public release implementation.
- Signed or notarized installer.
- Auto updater.
- Production package build.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP / ChatGPT App.
- OpenAI API.
- New app feature.
- DB schema changes or migrations.
- New dependencies or lockfile changes.
- Dangerous shell, command text box, terminal emulator, or node-pty.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup or backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 21 implementation.

## Scope Boundary

Phase 20 is documentation, planning, and static readiness verification only. It organizes how real private beta feedback will be collected and triaged after the local-first baseline is handed to selected testers.

The phase does not change runner, quality gate, backup, archive, Tauri, local launcher, database, or browser UI behavior.

## Acceptance Criteria

- Required Phase 20 docs exist.
- Feedback intake and triage rules are explicit.
- Safety and data escalation rules are explicit.
- Results and tracker templates exist.
- Static verifier confirms readiness docs and forbidden-scope boundaries.
- Existing release, production, RC, desktop, safety, launcher, and Tauri verification commands still pass.

## Failure Criteria

- Any new product capability is added.
- Any dependency, lockfile, schema, or migration is changed.
- Docs claim public release, commercial launch, cloud/team/MCP, signed installer, notarization, auto updater, auth/payment, or OpenAI integration is implemented.
- Support flow asks testers to share tokens, `.env`, `.env.local`, private keys, or `auth.json`.
- Phase 21 implementation begins.

## Explicit Phase Status

Phase 20 begins and ends as private beta feedback intake preparation. Phase 21 has not started.
