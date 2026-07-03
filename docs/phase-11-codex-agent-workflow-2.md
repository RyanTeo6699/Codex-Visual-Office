# Phase 11 - Codex Agent Workflow 2.0

## Summary

Phase 11 implements Codex Agent Workflow 2.0 for Codex Visual Office.

This phase adds a local-first workflow visualization layer for Agent Seats, task lifecycle states, prompt versions, Codex run history, workflow timelines, and review surfaces. It does not add automatic execution, source reads, cloud services, external integrations, schema changes, or dependency changes.

## Product Intent

Codex Visual Office should feel like an operator room for local Codex work.

The user should be able to understand:

- Which Agent Seat is responsible for a task.
- What lifecycle state a task is in.
- Which prompt version shaped the run.
- What happened during prior Codex runs.
- Why a task is blocked, paused, waiting for review, approved, rejected, or ready for revision.
- What the next manual action is.

The office should clarify work. It should not quietly perform work.

## Allowed Scope

Phase 11 may implement:

- Agent Seat Model v2.
- Agent visual state helpers.
- Task Lifecycle v2.
- Prompt Version Summary.
- Codex Run History.
- Workflow Timeline.
- Office Home workflow visibility.
- Project Room workflow visibility.
- Review Room workflow visibility.
- Local selected reads for workflow summaries.
- Verification scripts.
- Local-first safety boundaries.
- No-auto-execution rules.
- No-source-read rules.
- Known limitations and future handoff.

## Forbidden Scope

Phase 11 must not add:

- Automatic Codex execution.
- Automatic task execution.
- Automatic retries, continuation, review, Git, Quality Gate, deployment, or test behavior.
- New Codex CLI runner behavior.
- Codex App integration.
- ChatGPT App integration.
- MCP server or MCP integration.
- OpenAI API.
- GitHub App, OAuth, or API.
- Vercel, Supabase, Firebase, cloud database, or cloud sync.
- Auth, login, register, team workspace, team permissions, payment, or billing.
- Backend services.
- Source reads from approved project paths.
- Lockfile, config, manifest, `.git`, env, token, auth, or credential reads.
- Directory crawling, full disk scan, automatic project discovery, background indexing, or watcher expansion.
- Arbitrary shell execution, command text box, terminal emulator, `node-pty`, or `child_process` expansion.
- New Quality Gate command execution.
- Auto deployment.
- Package dependency changes.
- Schema or migration changes.

## Agent Seat Model v2

Agent Seat Model v2 describes how Codex work appears in the office.

Implemented visual summary fields:

| Field | Purpose |
| --- | --- |
| `seatId` | Stable local seat identity. |
| `name` | Human-readable seat name. |
| `focus` | Seat focus such as implementation, review prep, debugging, or docs. |
| `state` / `visualState` | Current visual agent state. |
| `taskId` | Current task assignment if any. |
| `currentRunId` | Latest local runner event pointer if available. |
| `lastPromptVersionId` | Most recent prompt version associated with the seat if available. |
| `lastActivityAt` | Last recorded workflow event time. |
| `manualNextAction` | The next user-controlled action. |
| `safetyBoundary` | Short explanation of what the seat may not do automatically. |

Implemented visual states:

```txt
idle
ready
running
reviewing
revision_requested
blocked
failed
done
auth_unknown
missing_approved_path
unknown
```

Boundary:

- A seat is a visible local workflow actor, not an autonomous background worker.
- Seat state must not trigger automatic execution.
- Seat state must not grant source-read or credential-read permission.

## Task Lifecycle v2

Task Lifecycle v2 should make the path from idea to review explicit.

Implemented lifecycle:

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

The local helper also accepts and exposes compatible v2 alias states through `phase` for review tooling that expects:

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

State meanings:

| State | Meaning |
| --- | --- |
| `planned` | Task is being shaped and is not ready for agent work. |
| `draft` | v2 alias for early planned work. |
| `ready` | Task is defined and can be manually queued. |
| `prompt_ready` | A prompt version is ready for a future manual run. |
| `prompt_prepared` | v2 alias for prompt-ready work. |
| `running` | A recorded run is in progress from an approved user action. |
| `run_completed` | Runner activity has completed and evidence is available for inspection. |
| `reviewing` | Changes or output are ready for human review. |
| `waiting_for_review` | v2 alias for reviewing work. |
| `revision_requested` | Reviewer asked for revision. |
| `changes_requested` | v2 alias for revision requested work. |
| `approved` | Reviewer accepted the task outcome. |
| `rejected` | Reviewer rejected the task outcome. |
| `blocked` | Work needs human input or safety clarification. |
| `done` | Task is complete in local records. |
| `archived` | v2 alias for completed retained history. |
| `unknown` | Existing records cannot safely determine the lifecycle stage. |

Transition rule:

- Transitions may be displayed and recorded.
- Transitions must not automatically execute Codex, Git, Quality Gates, package scripts, deployments, or source reads.

## Prompt Version Summary

Prompt Version Summary gives the user confidence about what was asked before a run.

Suggested summary fields:

| Field | Purpose |
| --- | --- |
| `promptVersionId` | Stable prompt version identity. |
| `taskId` | Related task. |
| `versionNumber` | Human-readable version sequence. |
| `createdAt` | Local creation time. |
| `createdBy` | User or local system label. |
| `intentSummary` | Short summary of the requested outcome. |
| `constraintSummary` | Scope, forbidden areas, and safety constraints. |
| `expectedReviewFocus` | What the reviewer should inspect after the run. |
| `usedInRunIds` | Run records that used this prompt version. |

Prompt summaries must not include secrets, hidden credentials, env values, auth state, or copied source contents unless a future approved phase explicitly changes that boundary.

## Codex Run History

Codex Run History makes prior work inspectable without implying new execution.

Suggested run fields:

| Field | Purpose |
| --- | --- |
| `runId` | Stable local run identity. |
| `taskId` | Related task. |
| `seatId` | Agent Seat involved. |
| `promptVersionId` | Prompt version used. |
| `startedAt` | Recorded start time. |
| `finishedAt` | Recorded finish time if complete. |
| `status` | Recorded run state. |
| `failureClass` | Optional bounded failure category. |
| `outputSummary` | Bounded local summary of output. |
| `reviewRecordId` | Linked review outcome if any. |

Suggested run statuses:

```txt
prepared
running
succeeded
failed
blocked
cancelled
timed_out
review_ready
```

Boundary:

- Run history is a record of approved local workflow state.
- It must not create new process control behavior in this workflow visualization phase.
- It must not read project source, credentials, or external account state.

## Workflow Timeline

Workflow Timeline should show what happened in order.

Suggested timeline event types:

```txt
task_created
task_updated
task_queued
seat_assigned
prompt_version_created
run_prepared
run_started
run_output_summarized
run_finished
run_failed
run_blocked
review_opened
review_approved
review_rejected
revision_requested
quality_summary_recorded
task_archived
safety_note_added
```

Each event should include:

- Event id.
- Task id.
- Project id.
- Optional seat id.
- Optional run id.
- Event type.
- Timestamp.
- Human-readable summary.
- Manual next action if relevant.

The timeline is a visibility surface, not an automation engine.

## Office Home Changes

Office Home should emphasize operational clarity:

- Active Agent Seats.
- Current assignment per seat.
- Tasks waiting for review.
- Blocked tasks.
- Recent run history summaries.
- Project workflow pressure.
- Manual next actions.
- Safety boundary reminders for any action that could later execute work.

Office Home must not add automatic queue execution, project scanning, cloud status, account status, or external integration entry points in Phase 11.

## Project Room Changes

Project Room should become the best place to understand one project's workflow:

- Task Lifecycle v2 distribution.
- Assigned Agent Seats.
- Prompt Version Summary list.
- Codex Run History list.
- Workflow Timeline.
- Blocker and review queues.
- Local safety boundary notes.

Project Room must not infer framework, package manager, dependencies, scripts, Git state, or source health by reading project files.

## Review Room Changes

Review Room should connect review decisions to workflow context:

- Current task lifecycle state.
- Prompt Version Summary used for the reviewed run.
- Codex Run History summary.
- Workflow Timeline filtered to the task.
- Existing bounded diff summary surfaces from prior approved phases.
- Existing bounded quality summary surfaces from prior approved phases.
- Manual approve, reject, and ask-revision decisions.

Review actions remain user-controlled. Phase 11 must not auto-run revision prompts, auto-commit approved changes, auto-push, or auto-deploy.

## No-Auto-Execution Policy

Phase 11 does not authorize automatic execution.

The following remain forbidden:

- Auto-starting Codex.
- Auto-continuing Codex.
- Auto-running quality gates.
- Auto-running Git.
- Auto-running builds or tests.
- Auto-running package scripts.
- Auto-deploying.
- Auto-approving review work.

Any future execution feature must be explicitly approved, visible to the user, locally bounded, and covered by a separate safety hardening scope.

## No-Source-Read Policy

Phase 11 does not authorize reading source files from approved workspaces.

The app must not read:

- Source files.
- `package.json`.
- Lockfiles.
- Framework configs.
- Build or test configs.
- `.git` internals.
- Env files.
- Auth, token, or credential files.

Approved paths remain boundaries for user-approved work, not blanket file inspection permission.

## Safety Boundary

The safety boundary for Codex Agent Workflow 2.0:

- The app may show locally recorded workflow state.
- The app may show manual next actions.
- The app may explain safety constraints.
- The app may preserve review history.
- The app must not silently execute work.
- The app must not silently inspect source.
- The app must not read secrets.
- The app must not connect to cloud services or external APIs.
- The app must not create team, auth, or permission systems.

## What Did Not Change

- Codex Visual Office remains local-first.
- Prior approved local data concepts remain the foundation.
- Review decisions remain manual.
- Quality and diff summaries remain bounded by earlier approved flows.
- Approved paths do not imply source-read permission.
- No cloud sync or external API boundary changed.
- No ChatGPT App, MCP, GitHub, Vercel, Supabase, Firebase, auth, payment, or team behavior was added.
- No schema, dependency, cloud, auth, payment, team, MCP, OpenAI API, terminal, arbitrary shell, source-read, or automatic execution behavior was added.

## Known Limitations

- Agent Seat Model v2 is derived from existing local records and does not add a new schema table.
- Task Lifecycle v2 is a summary/helper layer and does not automatically transition tasks.
- Prompt Version Summary depends on existing task event payloads; sparse historical records may not have complete prompt metadata.
- Codex Run History depends on existing runner lifecycle events; it does not execute or replay runs.
- Workflow Timeline is bounded and local; it is not a full audit log or source index.
- The app cannot infer project internals without a future approved source-read phase.
- The app cannot safely automate execution without a future approved permission hardening phase.
- The app does not provide multi-user workflow ownership or permissions in Phase 11.
- The app does not expose MCP or ChatGPT App capabilities in Phase 11.

## Verification Commands / Results

Verification commands for this implementation pass:

```bash
npm run typecheck
npm run build
git diff --check
```

Results:

```txt
npm run typecheck: passed during implementation verification
npm run build: passed during implementation verification
npm run agent:verify:workflow: passed during implementation verification
npm run ui:verify:virtual-office: passed during implementation verification
git diff --check: passed during implementation verification
```

Implementation verification for this pass confirms:

- Agent workflow summaries are generated from local records.
- No automatic Codex, Git, or Quality Gate execution was added.
- No source, env, token, auth, cloud, team, payment, MCP, terminal, command text box, or arbitrary shell behavior was added.
- Phase 12 was not started.

## Next Recommended Phase

Next recommended phase:

- Phase 12 - Safety / Permission Hardening.

Phase 12 should focus on explicit permission boundaries before any future expansion of execution, source visibility, MCP, ChatGPT App, or external integration behavior.
