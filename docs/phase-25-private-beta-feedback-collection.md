# Phase 25 - Continue Real Private Beta Round 1 / Collect Tester Feedback

## Final Status

```txt
REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS
```

## What This Stage Implemented

Phase 25 prepared the real private beta feedback collection package and GM workflow. It did not collect, fabricate, or import tester feedback.

## Invitation Packet Summary

The invitation packet explains the local-first private beta purpose, product scope, current limitations, prerequisites, setup expectations, safety notice, expected time commitment, and feedback submission path.

## Onboarding Message Summary

The onboarding message gives GM a copyable tester message with setup references, route list, support placeholder, no-cloud/no-signed-installer notice, and no-token/no-auth/no-env warning.

## Feedback Submission Summary

The submission instructions define what testers should submit, required environment and repro details, screenshot/log boundaries, redaction rules, severity self-rating, and blocker reporting.

## Data Handling Policy Summary

The data handling policy allows minimal tester metadata and redacted summaries only. It prohibits tokens, `~/.codex/auth.json`, `.env`, `.env.local`, private keys, credentials, proprietary source snippets, full source archives, and local SQLite database files.

## GM Collection Checklist Summary

The GM checklist covers before-invite preparation, during-window tracking, post-feedback intake, feedback classification, ledger updates, P0/P1 escalation, Phase 26 preparation, and anti-fabrication rules.

## Import / Review Procedure Summary

The import procedure explains how to manually enter real feedback into existing ledgers, classify sources, link feedback to issues, assign severity/priority, preserve safety/data notes, keep placeholders separate, and avoid automated import.

## Collection Status Summary

No real private beta tester submissions have been recorded yet.

| Metric | Value |
| --- | ---: |
| Real tester feedback | 0 |
| Confirmed issue reports | 0 |
| Support observations | 0 |
| GM evidence notes | 0 |
| Safety incidents | 0 |
| Data incidents | 0 |

## Phase 26 Decision Worksheet Summary

The Phase 26 worksheet recommends:

```txt
CONTINUE_REAL_PRIVATE_BETA_ROUND_1_COLLECTION
```

because no real tester feedback has been recorded yet.

## What Did Not Change

- No fake tester feedback was added.
- No fake tester count, issue count, setup success rate, or launch success rate was added.
- Private beta is not marked complete.
- No DB schema or migration changed.
- No dependency or lockfile changed.
- No app UI behavior changed.
- No Codex runner behavior changed.
- No Quality Gate runner policy changed.
- No Backup / Restore behavior changed.
- No Archive cleanup behavior changed.
- No public release, production package build, signing, notarization, auto updater, Electron, cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, or OpenAI API was added.
- No arbitrary shell, command text box, terminal emulator, node-pty, automatic Codex execution, automatic Git mutation, automatic Quality Gate execution, destructive cleanup, or backup deletion was added.
- Phase 26 has not started.

## Recommended Phase 26

```txt
Phase 26 - Real Private Beta Feedback Collection Review / Decision Gate
```

If no submissions exist at Phase 26, GM should continue collection instead of approving a fix batch or public technical beta scope.

