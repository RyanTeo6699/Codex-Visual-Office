# Phase 11 - Codex Agent Workflow 2.0 Scope Lock

## Phase Name

Phase 11 - Codex Agent Workflow 2.0

## Goal

Implement the next-generation local-first Codex agent workflow model for Codex Visual Office without adding new execution, source-reading, cloud, or integration behavior.

Phase 11 is a workflow visualization and UI-modeling phase. It may add local helpers, selected reads, UI summaries, documentation, and verification for how Codex agent seats, task lifecycle states, prompt versions, run history, and review timelines appear in the product. It must not expand runtime authority.

## Core Positioning

Codex Visual Office should make agent work understandable before, during, and after a run.

Phase 11 introduces a clearer mental model for:

- What an Agent Seat represents.
- How a task moves through the office.
- Which prompt version was used.
- What Codex run history is visible.
- What happened on the workflow timeline.
- How Office Home, Project Room, and Review Room should explain that state.

This phase does not grant the app permission to automatically execute work, inspect source code, read secrets, or connect to external services.

## Allowed

- Documentation for Codex Agent Workflow 2.0.
- Agent Seat Model v2 helpers.
- Agent visual state helpers.
- Task Lifecycle v2 helpers.
- Prompt Version Summary helpers.
- Codex Run History helpers.
- Workflow Timeline helpers.
- Office Home workflow visibility.
- Project Room workflow visibility.
- Review Room workflow visibility.
- Local selected reads for workflow summaries.
- Verification scripts.
- Local-first safety boundary documentation.
- No-auto-execution policy documentation.
- No-source-read policy documentation.
- Known limitation documentation.
- Roadmap status updates.
- Verification command/result placeholders.

## Forbidden

- Automatic Codex execution.
- Automatic task execution.
- Automatic retry, continue, resume, approve, reject, revise, commit, push, deploy, or test behavior.
- New Codex CLI runner behavior.
- Codex App integration.
- ChatGPT App integration.
- MCP server or MCP integration.
- OpenAI API.
- GitHub App.
- GitHub OAuth.
- GitHub API.
- Vercel integration.
- Supabase integration.
- Firebase.
- Cloud database.
- Cloud sync.
- Auth.
- Login / register.
- Team workspace.
- Team permissions.
- Payment.
- Billing.
- Backend services.
- Reading source files from approved project paths.
- Reading `package.json`, lockfiles, configs, source manifests, or build files from approved project paths.
- Reading `.git` internals.
- Reading `.env`, `.env.local`, or any env file.
- Reading auth files, tokens, secrets, SSH keys, API keys, OAuth credentials, or CLI credential stores.
- Reading `~/.codex/auth.json`.
- Directory crawling.
- Full disk scan.
- Automatic project discovery.
- Background file indexing.
- File watcher expansion.
- Arbitrary shell execution.
- Command text box.
- Terminal emulator.
- `node-pty`.
- `child_process` expansion.
- New Quality Gate command execution.
- Auto deployment.
- Package dependency changes.
- Schema or migration changes unless separately approved.
- Phase 12 implementation.

## No-Auto-Execution Policy

Phase 11 may describe future workflow states, but it must not cause any workflow to run automatically.

Forbidden automatic execution includes:

- Starting a Codex run when a task is created.
- Continuing or resuming Codex after a prior run.
- Running quality gates after a Codex run.
- Running Git commands after a review decision.
- Committing, pushing, deploying, or opening pull requests.
- Reading command definitions from project files.
- Executing package manager scripts.
- Executing arbitrary user-entered commands.

Every execution-capable future feature must remain behind an explicit user action and a separate GM-approved safety scope.

## No-Source-Read Policy

Phase 11 must preserve the rule that an approved project path is a workspace boundary, not permission to inspect source code.

Phase 11 must not read:

- Source files.
- `package.json`.
- Lockfiles.
- Framework configs.
- Build configs.
- Test configs.
- `.git` internals.
- Env files.
- Auth, token, or credential files.

Workflow state shown in Phase 11 planning must come from app-owned local records, manually entered task metadata, mock examples, or previously approved bounded records.

## Safety Boundary

Codex Agent Workflow 2.0 is a visibility and control model.

It may make local workflow state easier to inspect, but it must not:

- Infer project internals from source reads.
- Infer secrets, credentials, or auth state.
- Mutate project files.
- Mutate Git state.
- Run external services.
- Send code or task data to cloud services.
- Add multi-user permissions.
- Replace user review with automatic approval.

The user remains the operator. The office may show what is queued, running, paused, blocked, reviewing, approved, or rejected, but must not silently move work across safety boundaries.

## Agent Seat Model v2 Scope

Agent Seat Model v2 may define:

- Seat identity and label.
- Seat role or focus area.
- Current assignment.
- Current lifecycle state.
- Last run summary.
- Attention state such as idle, running, blocked, review needed, or paused.
- Safety boundary label.
- Manual next action.

Agent Seat Model v2 must not define:

- Autonomous background agents.
- Automatic task pickup.
- Automatic source inspection.
- Automatic execution based on queue state.
- Credential-aware agents.
- Cloud-hosted agent seats.
- Team permission behavior.

## Task Lifecycle v2 Scope

Task Lifecycle v2 implements a clearer sequence:

```txt
planned
ready
prompt_ready
running
run_completed
reviewing
revision_requested
approved
rejected
blocked
done
unknown
```

For compatibility with earlier v2 review terminology, the helper also supports these alias states through the `phase` field:

```txt
draft
ready
queued
assigned
prompt_prepared
running
paused
blocked
waiting_for_review
changes_requested
approved
rejected
archived
```

The lifecycle may include user-facing explanations and transition rules.

Task Lifecycle v2 must not introduce automatic transitions that execute Codex, Git, Quality Gates, deployment, or source inspection without explicit user action and a future approved implementation phase.

## Prompt Version Summary Scope

Prompt Version Summary may implement:

- Prompt version id.
- Task id.
- Author or source label.
- Created time.
- Intent summary.
- Constraint summary.
- Safety notes.
- Whether the prompt was used in a run record.

It must not store secrets, auth material, environment values, hidden credentials, or project source contents.

## Codex Run History Scope

Codex Run History may implement:

- Run id.
- Task id.
- Agent seat id.
- Prompt version id.
- Start and finish timestamps.
- Recorded status.
- Bounded output summary.
- Review outcome.
- Linked timeline events.
- Known failure classification.

It must not require automatic execution, live process management, shell expansion, token reads, source reads, or cloud uploads.

## Workflow Timeline Scope

Workflow Timeline may implement:

- User actions.
- Agent assignment changes.
- Prompt version changes.
- Run state changes.
- Review decisions.
- Quality result summaries from previously approved flows.
- Blockers and safety notes.

It must not become a command bus, automation engine, deployment log, Git watcher, or source index.

## Office / Project / Review Scope

Office Home may show:

- Agent seat state.
- Project workflow pressure.
- Tasks waiting for review.
- Blocked tasks.
- Recent workflow activity.
- Manual next actions.

Project Room may show:

- Project-level task lifecycle distribution.
- Agent assignments.
- Recent prompt versions.
- Run history summaries.
- Workflow timeline.
- Safety boundary reminders.

Review Room may show:

- Prompt version summary.
- Codex run history summary.
- Workflow timeline.
- Diff and quality summaries already supported by prior approved flows.
- Manual review actions.

None of these surfaces may add automatic execution, source reads, cloud sync, account systems, or forbidden integrations.

## What Did Not Change

- Codex Visual Office remains local-first.
- Approved paths remain bounded workspace records.
- Source files are not read automatically.
- Secrets and auth files are not read.
- Codex work is not auto-started.
- Git work is not auto-run.
- Quality Gates are not auto-run.
- Review decisions remain user-controlled.
- Cloud, team, MCP, ChatGPT App, and external API features remain out of scope unless separately approved.

## Acceptance Criteria

Phase 11 passes only if:

- Agent Seat Model v2 is documented and visible.
- Task Lifecycle v2 is documented and visible.
- Prompt Version Summary is documented and visible.
- Codex Run History is documented and visible.
- Workflow Timeline is documented and visible.
- Office Home, Project Room, and Review Room changes are implemented and documented.
- No-auto-execution and no-source-read policies are explicit.
- Safety boundaries are explicit.
- Known limitations are documented.
- Verification commands pass.
- Next recommended Phase 12 Safety / Permission Hardening is identified.
- No schema, dependency, automatic execution, source-read, cloud, auth, payment, team, MCP, OpenAI API, terminal, or arbitrary shell behavior is added.

## Failure Criteria

Phase 11 fails if it:

- Adds implementation outside the local workflow visualization/helper scope.
- Adds automatic execution.
- Reads project source files.
- Reads secrets, env, auth, token, or credential files.
- Adds source scanning or project discovery.
- Adds cloud, GitHub, Vercel, Supabase, Firebase, auth, team, payment, MCP, ChatGPT App, or OpenAI API integration.
- Expands runner, shell, terminal, `child_process`, or `node-pty` behavior.
- Adds package dependency changes.

## Phase 12 Status

Phase 12 has not started.

Recommended next phase: Phase 12 - Safety / Permission Hardening.
