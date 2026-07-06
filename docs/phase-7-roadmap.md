# Phase 7 Roadmap

## Purpose

This roadmap reconciles the post-Phase 6 sequence and defines the local-first path from Phase 7A through Phase 31.

It is a planning and historical status document. Later phase implementation status is recorded only where explicitly marked.

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
Phase 17 - Production 1.0 Finalization / Release Freeze
Phase 18 - Public Release Packaging Scope Lock / Distribution Strategy
Phase 19 - Private Local Beta Packaging Validation
Phase 20 - Private Beta Test Round 1 / Feedback Intake
Phase 21 - Private Beta Round 1 Execution Dry Run / Feedback Simulation
Phase 22 - Private Beta Fix Batch 1
Phase 23 - Real Private Beta Round 1 Execution
Phase 24 - Real Private Beta Feedback Review / Decision Gate
Phase 25 - Continue Real Private Beta Round 1 / Collect Tester Feedback
Phase 26 - Continue Real Private Beta Round 1 / Submission Collection Window
Phase 27 - Continue Collection / Real Tester Outreach Execution Packet
Phase 28 - Real Private Beta Feedback Review / Fix Batch Decision
Phase 29 - Continue Real Private Beta Collection / External Tester Intake
Phase 30 - Private Beta Ops Automation / Internal Execution Pack
Phase 31 - Local Beta Feedback Intake / Ledger UI
```

## Dependency Order

The phases must proceed in this order:

```txt
7A -> 7B -> 7C -> 7D -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 26 -> 27 -> 28 -> 29 -> 30 -> 31
```

No later phase should start without explicit GM approval.

## Phase 31 - Local Beta Feedback Intake / Ledger UI

### Goal

Add a local-only manual feedback intake desk to the Beta Ops Room so real external tester records, redacted feedback, and redacted issue triage can be entered into SQLite without external integrations or fake evidence.

### Allowed

- `beta_tester_records`, `beta_feedback_records`, and `beta_issue_records`.
- Manual `/beta` tester, feedback, and issue forms.
- Local intake summary and ledgers.
- String-level sensitive input guard.
- Local bounded report export helper.
- `beta:verify:intake-ui`.

### Boundaries

Phase 31 must not send invitations, connect to email or messaging providers, upload feedback, call external APIs, seed fake tester submissions, store contact details, store tokens or credentials, read `~/.codex/auth.json`, read `.env` or `.env.local`, add command execution, perform automatic Codex/Git/Quality Gate execution, claim beta completion, or start Phase 32.

### Output

- Phase 31 scope lock.
- Local beta intake data model.
- Beta Ops Room intake UI.
- Local intake export helper.
- Phase 31 implementation summary.

### Status

- Phase 31 provides local intake infrastructure.
- Current status: `LOCAL_BETA_FEEDBACK_INTAKE_READY_AWAITING_REAL_EXTERNAL_RECORDS`.
- Recommended next action: manually record real, redacted external tester feedback before any Phase 32 decision.

## Phase 21 - Private Beta Round 1 Execution Dry Run / Feedback Simulation

### Goal

Validate the private beta execution process, feedback intake workflow, triage model, regression decisions, and support runbook through simulated tester scenarios before inviting real private beta testers.

### Allowed

- Simulated tester scenarios.
- Dry-run execution checklist.
- Sample feedback entries.
- Sample issue reports.
- Sample triage and regression output.
- Dry-run results report.
- Static beta dry-run readiness verifier.

### Boundaries

Phase 21 does not implement public release, signed installer, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, real beta execution, or Phase 22 work.

### Output

- Phase 21 private beta dry-run docs.
- `beta:verify:dry-run`.
- Roadmap and release status updates.

### Status

- Phase 21 completed as documentation and verification only.
- Readiness conclusion: `READY_WITH_CAUTION`.
- Recommended Phase 22 choices: Private Beta Fix Batch 1 or Real Private Beta Round 1 Execution.

## Phase 22 - Private Beta Fix Batch 1

### Goal

Resolve low-risk documentation, copy, UI clarity, responsive, and verification issues discovered during the Phase 21 private beta dry-run before inviting real private beta testers.

### Allowed

- Docs clarity fixes.
- Setup and tester guide fixes.
- Support runbook fixes.
- Beta feedback and issue template fixes.
- Small UI copy/help text fixes.
- Small responsive/layout fixes.
- Static verifier hardening.
- Beta readiness update.

### Boundaries

Phase 22 does not implement public release, signed installer, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, real beta execution, DB schema changes, dependency changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 23 work.

### Output

- Phase 22 scope lock.
- Private Beta Fix Batch 1 issue list.
- Phase 22 result doc.
- `beta:verify:fix-batch`.
- Roadmap and release status updates.

### Status

- Phase 22 completed as a low-risk fix batch.
- Readiness conclusion: `PRIVATE_BETA_FIX_BATCH_1_READY_FOR_REAL_PRIVATE_BETA`.
- Recommended next phase: Phase 23 - Real Private Beta Round 1 Execution by GM decision.

## Phase 23 - Real Private Beta Round 1 Execution

### Goal

Establish the real private beta round 1 execution framework, tester roster, feedback ledger, issue triage ledger, and results report shell without fabricating tester feedback or implementing public release capabilities.

### Allowed

- Real private beta execution plan.
- Tester roster template.
- Execution log.
- Feedback intake ledger.
- Issue triage ledger.
- Tester environment matrix.
- Results report shell.
- Go / No-Go decision worksheet.
- Static real private beta execution verifier.
- Roadmap and release status updates.

### Boundaries

Phase 23 does not fake tester feedback, mark real beta complete without tester data, implement public release, signed installer, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 24 work.

### Output

- Phase 23 scope lock.
- Real beta execution plan.
- Tester roster and environment matrix.
- Execution log.
- Feedback and issue triage ledgers.
- Go / No-Go worksheet.
- Results report shell.
- `beta:verify:real-execution`.
- Roadmap and release status updates.

### Status

- Phase 23 execution framework is ready.
- Readiness conclusion: `REAL_PRIVATE_BETA_EXECUTION_READY_AWAITING_TESTER_FEEDBACK`.
- Phase 24 has now reviewed the empty real-feedback state and preserved `AWAITING_TESTER_FEEDBACK`.

## Phase 24 - Real Private Beta Feedback Review / Decision Gate

### Goal

Review actual private beta feedback evidence and produce a GM decision gate for Fix Batch 2, continued private beta, public technical beta scope, or blocked status without fabricating tester feedback.

### Allowed

- Feedback evidence policy.
- Feedback ledger review.
- Issue triage review.
- Fix Batch 2 candidate list.
- Known limitations candidate list.
- Public beta blocker list.
- GM decision worksheet.
- Beta readiness decision report.
- Static feedback review verifier.
- Roadmap and release status updates.

### Boundaries

Phase 24 does not fabricate tester feedback, fake tester counts, fake issue counts, mark beta complete without tester data, implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, app UI behavior changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 25 work.

### Output

- Phase 24 feedback review scope lock.
- Feedback evidence policy.
- Feedback ledger review.
- Issue triage review.
- Fix Batch 2 candidate list.
- Known limitations candidate list.
- Public beta blocker list.
- GM decision worksheet.
- Readiness decision report.
- `beta:verify:feedback-review`.
- Roadmap and release status updates.

### Status

- Phase 24 feedback review decision gate is complete.
- Decision conclusion: `AWAITING_TESTER_FEEDBACK`.
- Recommended next phase: Phase 25 - Continue Real Private Beta Round 1 / Collect Tester Feedback.

## Phase 25 - Continue Real Private Beta Round 1 / Collect Tester Feedback

### Goal

Prepare the real private beta feedback collection package, tester invitation materials, submission instructions, data handling policy, GM collection workflow, collection status report, and Phase 26 decision worksheet without fabricating tester feedback.

### Allowed

- Private beta feedback collection scope lock.
- Tester invitation packet.
- Tester onboarding message.
- Feedback submission instructions.
- Real feedback intake checklist.
- Tester data handling policy.
- GM feedback collection checklist.
- Feedback import/review procedure.
- Beta collection status report.
- Phase 26 decision worksheet.
- Static feedback collection verifier.
- Roadmap and release status updates.

### Boundaries

Phase 25 does not fabricate tester feedback, fake tester counts, fake issue counts, fake setup success rates, mark beta complete without tester data, implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, app UI behavior changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 26 work.

### Output

- Phase 25 collection scope lock.
- Tester invitation packet and onboarding message.
- Feedback submission instructions and intake checklist.
- Tester data handling policy.
- GM collection checklist.
- Feedback import/review procedure.
- Collection status report.
- Phase 26 decision worksheet.
- `beta:verify:feedback-collection`.
- Roadmap and release status updates.

### Status

- Phase 25 feedback collection package is ready.
- Collection conclusion: `REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS`.
- Phase 26 now manages the real private beta submission collection window.

## Phase 26 - Continue Real Private Beta Round 1 / Submission Collection Window

### Goal

Establish the real private beta submission collection window management layer, including invitation status, onboarding status, submission status, non-response tracking, evidence requirements, and decision criteria without fabricating tester feedback.

### Allowed

- Collection window scope lock.
- Invitation status tracker.
- Onboarding status tracker.
- Submission status tracker.
- Non-response tracker.
- Follow-up checklist.
- Submission evidence requirements.
- Collection window decision report.
- Phase 27 review readiness worksheet.
- Static collection window verifier.
- Roadmap and release status updates.

### Boundaries

Phase 26 does not fabricate tester feedback, fake tester counts, fake submission counts, fake issue counts, fake setup success rates, mark beta complete without tester submissions, implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, app UI behavior changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 27 work.

### Output

- Phase 26 collection window scope lock.
- Invitation, onboarding, submission, and non-response trackers.
- Follow-up checklist.
- Submission evidence requirements.
- Collection window decision report.
- Phase 27 review readiness worksheet.
- `beta:verify:collection-window`.
- Roadmap and release status updates.

### Status

- Phase 26 submission collection window management layer is ready.
- Collection-window conclusion: `REAL_PRIVATE_BETA_COLLECTION_WINDOW_READY_AWAITING_SUBMISSIONS`.
- Current decision: `CONTINUE_COLLECTION`.
- Recommended next step: continue Real Private Beta Round 1 collection until real submissions exist.

## Phase 27 - Continue Collection / Real Tester Outreach Execution Packet

### Goal

Prepare the real tester outreach execution packet for private beta round 1, including invitee templates, outbound messages, follow-up schedule, submission packet, GM collection playbook, first-response support script, tester privacy/safety notice, and Phase 28 readiness gate without fabricating tester feedback.

### Allowed

- Outreach scope lock.
- Invitee shortlist template.
- Outbound invitation messages.
- Follow-up schedule.
- Tester feedback submission packet.
- GM manual collection playbook.
- First-response support script.
- Tester privacy and safety notice.
- Phase 28 feedback review readiness gate.
- Static outreach verifier.
- Roadmap and release status updates.

### Boundaries

Phase 27 does not fabricate tester feedback, fake tester counts, fake invitation counts, fake submission counts, fake issue counts, fake setup success rates, mark beta complete without tester submissions, implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, app UI behavior changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 28 work.

### Output

- Phase 27 outreach scope lock.
- Invitee shortlist template.
- Outbound invitation message set.
- Follow-up schedule.
- Tester feedback submission packet.
- GM manual collection playbook.
- First-response support script.
- Tester privacy and safety notice.
- Phase 28 readiness gate.
- `beta:verify:outreach`.
- Roadmap and release status updates.

### Status

- Phase 27 real tester outreach execution packet is ready.
- Outreach conclusion: `REAL_TESTER_OUTREACH_PACKET_READY_AWAITING_INVITATIONS_OR_SUBMISSIONS`.
- Current decision: `CONTINUE_COLLECTION`.
- Recommended next step: GM may manually send real tester invitations using the outreach packet and continue collection until real submissions exist.

## Phase 28 - Real Private Beta Feedback Review / Fix Batch Decision

### Goal

Review the available real private beta evidence, record the GM / local validation sample, assess confirmed issues, decide whether Fix Batch 2 is required from this sample, and recommend the next private beta step without fabricating tester feedback.

### Allowed

- Phase 28 scope lock.
- Local validation feedback record.
- Feedback ledger review update.
- Issue triage review update.
- Fix Batch 2 decision report.
- Phase 29 recommendation.
- Static feedback decision verifier.
- Roadmap and release status updates.

### Boundaries

Phase 28 does not fabricate tester feedback, fake tester counts, fake issue counts, fake setup success rates, mark beta complete, mark public beta ready, implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, app UI behavior changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, or Phase 29 work.

### Output

- Phase 28 feedback decision scope lock.
- GM local validation feedback record.
- Feedback ledger review update.
- Issue triage review update.
- Fix Batch 2 decision report.
- Phase 29 recommendation.
- `beta:verify:feedback-decision`.
- Roadmap and release status updates.

### Status

- Local validation conclusion: `LOCAL_VALIDATION_SAMPLE_PASS`.
- Fix Batch 2 decision: `NO_FIX_BATCH_2_REQUIRED_FROM_THIS_SAMPLE`.
- Current decision: `CONTINUE_PRIVATE_BETA_COLLECTION`.
- Recommended next step: `Phase 29 - Continue Real Private Beta Collection / External Tester Intake`.

## Phase 29 - Continue Real Private Beta Collection / External Tester Intake

### Goal

Prepare the external tester intake layer for private beta round 1 without fabricating tester feedback, tester counts, submission counts, or issue counts.

### Allowed

- Phase 29 scope lock.
- External tester intake plan.
- Consent / safety acknowledgment template.
- External tester onboarding tracker.
- External feedback intake ledger.
- External issue intake ledger.
- External tester evidence checklist.
- Phase 30 decision gate.
- Static external intake verifier.
- Roadmap and release status updates.

### Boundaries

Phase 29 does not fabricate external tester feedback, fake tester counts, fake submission counts, fake issue counts, mark beta complete, mark public beta ready, implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, DB schema changes, dependency changes, app UI behavior changes, runner behavior changes, Quality Gate policy changes, backup/archive behavior changes, Tauri production packaging, or Phase 30 implementation.

### Output

- Phase 29 external tester intake scope lock.
- External tester intake plan.
- External tester consent / safety acknowledgment.
- External tester onboarding tracker.
- External feedback intake ledger.
- External issue intake ledger.
- External tester evidence checklist.
- Phase 30 decision gate.
- `beta:verify:external-intake`.
- Roadmap and release status updates.

### Status

- External tester intake status: `EXTERNAL_TESTER_INTAKE_READY_AWAITING_EXTERNAL_SUBMISSIONS`.
- External tester feedback recorded: `0`.
- External tester issue recorded: `0`.
- GM local validation samples recorded separately: `1`.
- Current decision: `CONTINUE_EXTERNAL_TESTER_INTAKE`.
- Phase 30 implementation has not started.

## Phase 30 - Private Beta Ops Automation / Internal Execution Pack

### Goal

Convert the manual private beta outreach and feedback collection process into a local Beta Ops Room, tracker templates, exportable message packets, and verification workflow without sending external messages or fabricating tester feedback.

### Allowed

- `/beta` Beta Ops Room.
- Beta ops summary helper.
- Local tracker templates.
- Invitation/export packet.
- Feedback and issue templates.
- GM next action checklist.
- Static beta ops verifier.
- Roadmap and release status updates.

### Boundaries

Phase 30 does not auto-send messages, connect Gmail, GitHub, Slack, Discord, WeChat, Vercel, Supabase, cloud sync, auth, payment, team workspace, MCP, or OpenAI API; fabricate tester feedback, tester counts, submission counts, issue counts, or setup success rates; mark beta complete; mark public beta or public release ready; implement public release, signing, notarization, auto updater, production package build, Electron, DB schema changes, dependency changes, dangerous shell, command text box, terminal emulator, node-pty, automatic Codex/Git/Quality execution, destructive cleanup, backup deletion, or Phase 31.

### Output

- Phase 30 scope lock.
- Beta Ops Room.
- Beta ops summary helper.
- Local export templates.
- Beta ops export generator.
- `beta:verify:ops`.
- Phase 30 result document.
- Roadmap and release status updates.

### Status

- Beta ops status: `BETA_OPS_READY_AWAITING_EXTERNAL_TESTER_SUBMISSIONS`.
- No external tester feedback has been recorded yet.
- No external tester issue has been recorded yet.
- GM local validation remains separate from external tester feedback.
- Current decision: `CONTINUE_EXTERNAL_TESTER_INTAKE`.
- Phase 31 implementation has not started.

## Phase 20 - Private Beta Test Round 1 / Feedback Intake

### Goal

Prepare the first private beta test round, feedback intake workflow, issue triage model, regression decision process, tracker templates, and results reporting.

### Allowed

- Private beta test plan.
- Tester cohort plan.
- Feedback intake workflow.
- Severity / priority matrix.
- Regression decision matrix.
- Feedback tracker template.
- Results report template.
- Static beta intake readiness verifier.

### Boundaries

Phase 20 does not implement public release, signed installer, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, or Phase 21 work.

### Output

- Phase 20 private beta intake docs.
- `beta:verify:intake`.
- Roadmap and release status updates.

### Status

- Phase 20 completed as documentation and verification only.
- Recommended Phase 21 choices: Private Beta Fix Batch 1 or Public Beta Scope Lock based on real beta results.

## Phase 19 - Private Local Beta Packaging Validation

### Goal

Validate that the local-first Production 1.0 baseline can be handed to private beta testers through source checkout and browser-only local launcher workflow.

### Allowed

- Private beta scope lock.
- Private beta package checklist.
- Tester guide.
- Feedback and issue templates.
- Support runbook.
- Release artifact manifest.
- Static private beta readiness verification.

### Boundaries

Phase 19 does not implement public release, signed installer, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, or Phase 20 work.

### Output

- Phase 19 private beta docs.
- `beta:verify:private`.
- Roadmap and release status updates.

### Status

- Phase 19 completed as documentation and validation only.
- Recommended Phase 20 choices: Private Beta Test Round 1 / Feedback Intake or Mac Signing / Notarization Scope Lock.

## Phase 18 - Public Release Packaging Scope Lock / Distribution Strategy

### Goal

Lock the release packaging and distribution strategy after the Production 1.0 local-first baseline.

### Allowed

- Distribution option matrix.
- Public beta readiness assessment.
- Packaging risk register.
- Code signing / notarization planning.
- Self-hosted delivery planning.
- Commercialization pre-scope notes.
- Phase 19 recommendation.

### Boundaries

Phase 18 does not implement public release, signing, notarization, auto updater, cloud sync, team workspace, MCP, auth, payment, production package build, or Phase 19 work.

### Output

- Phase 18 scope lock.
- Release packaging strategy.
- Release strategy verifier.

### Status

- Phase 18 completed as planning / scope lock only.
- Recommended Phase 19 choices: Private Local Beta Packaging Validation or Mac Signing / Notarization Scope Lock.

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

## Phase 17 - Production 1.0 Finalization / Release Freeze

### 2026-07-04 Status Note

Current GM direction tracks Phase 17 as "Production 1.0 Finalization / Release Freeze". Phase 17 freezes the local-first Production 1.0 baseline through release notes, final acceptance, final verification manifest, known limitations, and release status metadata.

### Goal

Freeze the local-first Production 1.0 baseline without adding product capability, production packaging, cloud behavior, account systems, or expanded execution permissions.

### Allowed

- Release freeze docs.
- Release notes.
- Final acceptance report.
- Final verification manifest.
- Known limitations register.
- Release status metadata.
- Documentation consistency updates.
- Static verification hardening.
- Final browser/manual QA.

### Boundaries

Phase 17 must not add new features, DB schema changes, migrations, dependencies, lockfile changes, production signed installer, code signing, notarization, auto updater, Electron, cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, OpenAI API, arbitrary shell, command text box, terminal emulator, `node-pty`, automatic Codex/Git/Quality execution, destructive cleanup, backup deletion, credential reads, token storage, or Phase 18 implementation.

### Output

- Phase 17 scope lock.
- Release notes 1.0.
- Final acceptance report 1.0.
- Final verification manifest 1.0.
- Known limitations 1.0.
- Release status file.
- Production freeze verifier.
- Phase 17 implementation summary.
