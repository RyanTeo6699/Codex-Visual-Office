# Phase 8 - Codex Runtime Reliability

## Implementation Summary

Phase 8 adds verification and documentation for Codex runtime reliability.

Implemented items:

- `npm run codex:verify:runtime-reliability`.
- Side-effect-safe verifier at `scripts/verify-codex-runtime-reliability.ts`.
- Scope lock document for the Phase 8 boundary.
- Roadmap reconciliation so Phase 8 is Codex Runtime Reliability, not cloud sync.

## What The Verifier Checks

The verifier checks safe Codex CLI status generation through the existing detector. It may locate `codex` and read `codex --version`, but it does not run `codex exec` or any coding task.

It validates that auth is not treated as verified. Current safe detection may report CLI availability, but auth remains not verified.

It validates failure classification for:

- Missing CLI.
- Missing approved project path.
- Policy blocked.
- Nonzero exit.
- Timeout.

It validates last run summary generation with bounded fields:

- Status.
- Started / ended timestamps.
- Duration.
- Exit code.
- Bounded output previews.
- Failure category.
- No auto push.
- No auto deploy.
- No claimed real task execution.

It validates existing runner policy and safety helpers:

- Only `codex` is allowlisted.
- Arbitrary shell is disabled.
- Approved project path is required.
- Explicit confirmation is required.
- Auto push and auto deploy are disabled.
- Safety status helper does not execute Codex.
- Settings / local shell status reports no Codex or Quality Gate execution.

## Safety Boundary

Phase 8 explicitly forbids:

- Reading `~/.codex/auth.json`.
- Reading `.env`.
- Reading `.env.local`.
- Token storage.
- OpenAI API calls.
- Arbitrary shell.
- Command text box.
- `node-pty`.
- Terminal emulator.
- Cloud sync.
- GitHub integration.
- Vercel integration.
- Supabase integration.
- Auth, login, payment, billing, team permissions, or team workspace.
- MCP or ChatGPT App integration.
- Git mutation.
- Quality Gate runner execution.
- Browser launch.
- Tauri launch.
- UI redesign.
- Phase 9 work.

## Verification Result Shape

Expected success output includes:

```txt
Codex runtime reliability verification passed
```

The JSON summary reports:

- CLI status generated.
- CLI installed flag and version if safely detected.
- Auth verified as `false`.
- Classification coverage.
- Last run summary verification.
- Settings status Codex execution as `false`.
- Forbidden surfaces verified as absent.
- Real Codex coding task executed as `false`.

## Integration Notes

The verifier uses existing exported APIs where they exist:

- `detectCodexCliStatus`.
- `createScopedCodexRunnerPolicy`.
- `getRunnerSafetyStatus`.
- `validateScopedCodexRunnerInput`.

Runtime failure classification and last-run summary generation are currently verified inside the Phase 8 script as expected behavior checks. If those become shared product APIs in a later approved phase, the verifier should move to those exports without changing the safety boundary.
