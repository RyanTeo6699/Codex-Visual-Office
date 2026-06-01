# Phase 3 Step 3B - Scoped CLI Runner

## What Was Implemented

Phase 3 Step 3B adds the first scoped Codex CLI runner.

The runner is not a terminal emulator and not a general shell runner. It only supports a controlled Codex invocation built from an existing task prompt and guarded by explicit confirmations.

## Runner Safety Policy

The scoped runner policy uses:

- `allowlistedExecutable: "codex"`
- `allowArbitraryShell: false`
- `allowPromptExecution: true`
- `allowAutoPush: false`
- `allowAutoDeploy: false`
- `requireApprovedProjectPath: true`
- `requireExplicitUserConfirmation: true`
- `requirePromptPreview: true`
- `requireForbiddenScopeAcknowledgement: true`
- `executionMode: "scoped_codex_runner"`

The runner rejects execution if any required condition is missing.

## Approved Project Path Model

The first approved project path is the current local repository path:

```text
/Users/ryanteo/Desktop/上线版本/CODEX可视化办公室
```

The app does not scan directories for approval. The user must explicitly check the project path approval box before the scoped runner button is enabled.

## Explicit Confirmation Model

The Review Room scoped runner panel requires all confirmations:

- I approve this project path.
- I reviewed the prompt.
- I acknowledge forbidden scope.
- Do not auto commit/push/deploy.

The run button remains disabled until all required confirmations are checked.

## Allowed Command Invocation

The runner uses the detected Codex binary path from the existing safe detector.

Command shape:

```text
codex exec --cd [approved_project_path] --sandbox read-only --json [generated_prompt]
```

Implementation constraints:

- Uses exact argument arrays.
- Uses `execFile`.
- Uses `shell: false`.
- Does not accept arbitrary args from UI.
- Does not accept a user-provided command string.
- Does not expose a terminal input.
- Uses generated prompt only.

The first implementation uses `--sandbox read-only` to reduce mutation risk while introducing the scoped bridge.

## Task Events

The runner records bounded lifecycle events:

- `Scoped Codex runner requested`
- `Scoped Codex runner started`
- `Scoped Codex runner output preview received`
- `Scoped Codex runner completed`
- `Scoped Codex runner failed`

Stable event IDs:

```text
codex-runner-requested-{taskId}
codex-runner-started-{taskId}
codex-runner-output-{taskId}
codex-runner-completed-{taskId}
codex-runner-failed-{taskId}
```

Blocked verification cases only write the requested event and do not execute Codex.

## Output Storage

The runner stores bounded previews only:

- stdout preview: maximum 8,000 characters
- stderr preview: maximum 8,000 characters

It does not store unbounded output, credentials, token files, API keys, or auth file contents.

## What Remains Forbidden

Step 3B does not add:

- arbitrary shell execution
- command input box
- user-provided shell command strings
- `shell:true`
- `node-pty`
- terminal emulator
- reading `~/.codex/auth.json`
- credential store reads
- OpenAI API
- git commit automation
- git push automation
- deploy commands
- GitHub feature integration beyond normal git remote/push
- Vercel
- Supabase
- auth
- payment
- cloud sync
- MCP server
- Git watcher
- file watcher
- live output streaming beyond bounded lifecycle capture
- auto-modifying tasks outside the selected task

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
npm run codex:verify:scoped-runner
git diff --check
git status
```

Expected scoped runner verification:

```text
Scoped Codex runner verification passed
```

The verification script checks:

- arbitrary shell disabled
- auto push disabled
- auto deploy disabled
- generated prompt is used
- missing confirmation is blocked
- missing approved project path is blocked
- non-Codex executable is blocked
- blocked case does not execute Codex

Real execution verification is skipped to avoid file modification risk during automated verification.

## Known Limitations

- The runner panel can start a scoped Codex process only after user confirmations.
- Output is captured as bounded previews, not live-streamed.
- The command uses read-only sandboxing in this first scoped runner step.
- Full output streaming and richer task event logging are deferred to Step 4.

## Next Recommended Step

Phase 3 Step 4 - Output Stream + Task Event Logging.

Step 4 should improve safe output visibility and task event logging without expanding into arbitrary shell execution or automated git/deploy behavior.

Phase 3 Step 4 has not started.
