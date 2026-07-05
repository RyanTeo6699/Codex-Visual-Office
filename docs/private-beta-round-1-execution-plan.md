# Private Beta Round 1 Execution Plan

## Execution Objective

Run a small real private beta round for the local-first Codex Visual Office baseline, collect structured tester feedback, triage issues, and give GM a decision basis for Phase 24.

## Beta Round Status

```txt
REAL_PRIVATE_BETA_EXECUTION_READY_AWAITING_TESTER_FEEDBACK
```

No real tester feedback has been recorded yet.

## Tester Invitation Process

1. GM approves the tester list.
2. Each tester receives repository/source access or an approved source archive.
3. Each tester receives the tester guide, support runbook, feedback template, issue template, and no-token policy.
4. Tester IDs are assigned before feedback is logged.
5. No external SaaS tracker or GitHub API automation is used.

## Tester Onboarding Steps

1. Confirm tester understands this is a private local beta, not a public release.
2. Confirm local machine environment.
3. Confirm no tokens, `.env`, `.env.local`, private keys, or `~/.codex/auth.json` should be shared.
4. Follow `docs/private-beta-tester-guide.md`.
5. Record setup state in `docs/private-beta-round-1-execution-log.md`.

## Setup Validation

Expected local validation commands:

```bash
npm run db:init
npm run db:seed
npm run db:verify
npm run typecheck
npm run build
npm run local:launcher:verify
```

Local counts may vary if `.local` already exists. Successful verifier exit is the primary pass marker.

## Feedback Collection

Feedback should be recorded in `docs/private-beta-round-1-feedback-ledger.md`.

Allowed feedback sources:

- `real_tester`
- `support_observation`
- `gm_note`
- `simulated_reference`

Simulated references may be used only as historical context. They must not be counted as real tester results.

## Issue Triage

Issues should be recorded in `docs/private-beta-round-1-issue-triage-ledger.md`.

Severity and priority should follow Phase 20-22 conventions:

- P0 / P1: potential blocker or safety/data risk.
- P2: beta-quality fix candidate.
- P3: minor docs, copy, or known limitation.

## Support Escalation

Escalate immediately if testers report:

- Token or credential exposure.
- Data loss.
- Backup / restore failure.
- Unexpected automatic Codex, Git, Quality Gate, cleanup, push, deploy, or upload behavior.
- Cloud, auth, payment, team, MCP, GitHub API, Vercel, Supabase, or OpenAI API behavior.

## Exit Criteria

- Tester roster is filled with real assigned tester IDs.
- Execution log shows invited/onboarded/setup/feedback state.
- Feedback ledger records all received feedback.
- Issue triage ledger classifies actionable issues.
- Go / No-Go worksheet is completed by GM.
- Results report is updated from awaiting feedback to a decision state only after real data exists.

## Decision Options

- `AWAITING_TESTER_FEEDBACK`
- `GO_TO_FIX_BATCH_2`
- `GO_TO_PUBLIC_BETA_SCOPE`
- `BLOCKED`

## Safety Instructions

- Local-first only.
- No public release.
- No signed or notarized installer.
- No auto updater.
- No cloud sync.
- No auth, payment, team workspace, MCP, or ChatGPT App.
- No GitHub API, Vercel, Supabase, or OpenAI API.
- No automatic Codex, Git, Quality Gate, cleanup, backup deletion, push, or deploy behavior.

## No-Token / No-Auth-File Policy

Do not collect or store:

- Tokens.
- Passwords.
- Private keys.
- `.env`.
- `.env.local`.
- `~/.codex/auth.json`.
- Credential-bearing logs.
- Full source archives.
- Full SQLite database files unless a separate privacy review approves it.
