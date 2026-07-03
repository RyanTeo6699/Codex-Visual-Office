# Phase 8 - Codex Runtime Reliability Scope Lock

## Goal

Phase 8 validates Codex runtime reliability boundaries without running a real Codex coding task.

The phase is a verification and documentation layer for existing local runtime status, runner policy, and failure classification behavior.

## Allowed

- Safe Codex CLI availability and version status.
- Mocked or static runtime classification checks.
- Last run summary shape validation.
- Runner policy and safety status validation.
- Settings / local shell status validation.
- Documentation for the runtime reliability boundary.
- Package script for the Phase 8 verifier.

## Forbidden

- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Storing tokens, credentials, OpenAI keys, OAuth secrets, or CLI auth secrets.
- Calling the OpenAI API.
- Running a real Codex coding task.
- Adding arbitrary shell execution.
- Adding a command text box.
- Adding `node-pty`.
- Adding a terminal emulator.
- Launching Tauri.
- Opening a browser.
- Installing dependencies.
- Deploying anything.
- Mutating Git state.
- Running Quality Gate commands.
- Adding cloud sync.
- Adding GitHub, Vercel, or Supabase integration.
- Adding auth, login, payment, billing, team permissions, or team workspace behavior.
- Adding MCP or ChatGPT App integration.
- Redesigning the UI.
- Starting Phase 9.

## Reliability Rules

Runtime status may say the Codex CLI is available and may show a version discovered by safe detection.

Runtime status must not claim auth is verified. Auth remains unknown or not verified unless a future explicitly approved phase defines a safe auth check that does not read secret files or tokens.

Failure classification must cover:

- Missing CLI.
- Missing approved project path.
- Policy blocked.
- Nonzero Codex exit.
- Timeout.

Last run summaries must be bounded status records. They may include status, timestamps, duration, exit code, bounded stdout/stderr previews, and a failure category.

Last run summaries must not include full terminal streams, tokens, auth files, env file contents, patches, full diffs, automatic Git mutation, push, deploy, or Quality Gate execution.

## Verification Command

```bash
npm run codex:verify:runtime-reliability
```

This command must remain side-effect-safe:

- No real Codex coding task.
- No file modifications by the verifier.
- No dependency installation.
- No deploy.
- No browser launch.
- No Tauri launch.
- No arbitrary shell.
- No Git mutation.
- No Quality Gate runner.

## Acceptance Criteria

- `package.json` exposes `codex:verify:runtime-reliability`.
- The verifier generates safe CLI found/version status or validates a mock equivalent.
- Auth unknown is not marked verified.
- Missing CLI, missing approved path, policy blocked, nonzero exit, and timeout classifications are validated.
- Last run summary and failure category generation are validated.
- Settings / runner status helper behavior is verified not to execute Codex.
- Forbidden secret, cloud, shell, terminal, Git mutation, Quality Gate, and Phase 9 surfaces remain absent.
