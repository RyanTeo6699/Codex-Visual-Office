# Phase 3 Step 3A - Runner Safety Harness

## What Was Implemented

Phase 3 Step 3A adds a scoped Codex runner safety harness.

The implementation defines:

- runner policy model
- approved project path model
- runner safety status model
- Review Room safety preview panel
- safety verification script
- optional local safety preview task event

This step does not execute Codex.

## Why Step 3A Does Not Execute Codex

Step 3A exists to prove the safety model before any real runner is introduced.

It intentionally keeps execution disabled so the project can verify:

- no arbitrary shell path exists
- prompt execution is disabled
- approved project path is required
- explicit user confirmation is required
- auto push/deploy remain disabled
- task events can record a safety preview without invoking Codex

Real scoped CLI execution is reserved for Phase 3 Step 3B.

## Runner Policy Fields

`RunnerPolicy` includes:

- `allowlistedExecutable: "codex"`
- `allowArbitraryShell: false`
- `allowPromptExecution: false`
- `allowAutoPush: false`
- `allowAutoDeploy: false`
- `requireApprovedProjectPath: true`
- `requireExplicitUserConfirmation: true`
- `requirePromptPreview: true`
- `requireForbiddenScopeAcknowledgement: true`
- `executionMode: "safety_harness_only"`

## Approved Project Path Model

`ApprovedProjectPath` includes:

- `projectId`
- `localPath`
- `approved`
- `approvedAt`
- `approvalSource`
- `note`

In Step 3A, project paths are not configured for execution. The model reports `approved: false` and `approvalSource: "not_configured"` unless a later step adds manual approval.

No directories are scanned.

## Explicit Confirmation Model

The safety model requires explicit user confirmation before any later real dispatch.

Step 3A does not collect real dispatch confirmation. It only states that confirmation is required and execution cannot proceed.

## UI Changes

Review Room now shows a `Runner Safety Harness` panel near the Codex Prompt Handoff panel.

The panel displays:

- execution mode: `safety_harness_only`
- can execute: No
- approved project path: Not configured
- explicit confirmation: Required
- prompt preview: Required
- forbidden scope acknowledgement: Required
- auto push/deploy: Disabled
- arbitrary shell: Disabled
- Codex task execution: Disabled in this step

The panel includes only a disabled future-step button labeled `Available in later step`.

There is no enabled Run Codex or Execute Codex button.

## Task Event

Step 3A may write this local task event:

```text
Codex runner safety preview checked
```

Stable event id:

```text
codex-runner-safety-preview-{taskId}
```

Payload includes:

- `executionMode: "safety_harness_only"`
- `canExecute: false`
- `cliTaskExecutionAttempted: false`
- `arbitraryShellAllowed: false`
- `promptExecutionAllowed: false`
- `autoPushAllowed: false`
- `autoDeployAllowed: false`

The task status is not moved to `running`.

## What Remains Forbidden

Step 3A does not add:

- running `codex` with a prompt
- generated prompt execution
- real Dispatch to Codex
- scoped CLI runner execution
- terminal runner
- `node-pty`
- shell command text box
- arbitrary command execution
- `shell:true`
- reading `~/.codex/auth.json`
- reading credential stores
- OpenAI API
- real project file reads
- real git status reads
- Git watcher
- GitHub feature integration beyond normal git remote/push
- Vercel
- Supabase
- auth
- payment
- cloud sync
- MCP server
- auto push
- auto deploy

## Verification

Run:

```bash
npm run typecheck
npm run build
npm run db:verify
npm run db:verify:operations
npm run db:verify:review
npm run db:verify:selected-reads
npm run codex:verify:cli
npm run codex:verify:prompt-handoff
npm run codex:verify:runner-safety
git diff --check
git status
```

Expected runner safety verification:

```text
Codex runner safety verification passed
```

The summary should include:

- `executionMode: "safety_harness_only"`
- `allowlistedExecutable: "codex"`
- `canExecute: false`
- `allowArbitraryShell: false`
- `allowPromptExecution: false`
- `allowAutoPush: false`
- `allowAutoDeploy: false`
- safety preview event id
- `cliTaskExecutionAttempted: false`

## Next Recommended Step

Phase 3 Step 3B - Scoped CLI Runner.

Step 3B should add real scoped Codex CLI execution only after explicit user confirmation, approved project path selection, prompt preview, forbidden scope acknowledgement, and continued verification that no arbitrary shell runner exists.

Phase 3 Step 3B has not started.
