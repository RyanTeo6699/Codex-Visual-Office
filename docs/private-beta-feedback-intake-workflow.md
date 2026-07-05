# Private Beta Feedback Intake Workflow

## Feedback Intake Sources

- Private beta feedback template.
- Private beta issue report template.
- Direct support notes summarized by maintainer.
- Tester screenshots or short screen recordings when they do not expose secrets.

No SaaS tracker API, GitHub API, cloud sync, remote issue ingestion, or external automation is added in Phase 20.

## Feedback Format

Each feedback item should include:

- Tester.
- Date.
- Environment.
- Area.
- Summary.
- Reproduction steps if applicable.
- Expected result.
- Actual result.
- Safety/data impact.
- Severity.
- Priority.
- Suggested decision.

## Required Metadata

- OS and hardware.
- Node/npm versions.
- Browser.
- Codex CLI present / absent.
- Fresh clone / existing clone.
- Route or workflow area.
- Whether the issue is repeatable.
- Whether sensitive data is involved.

## Deduplication Process

1. Group items by route/workflow area.
2. Compare summary, reproduction steps, expected/actual result, and environment.
3. Keep the clearest report as the primary record.
4. Link duplicates to the primary ID in the tracker.
5. Preserve environment differences when duplicates occur on different setups.

## Confirmation Process

- Confirm blockers within one business day during active beta.
- Ask for minimal additional detail only when needed.
- Do not request secrets, tokens, full source code, full database files, `.env`, `.env.local`, private keys, or `auth.json`.
- Prefer redacted logs, screenshots, and exact command outputs.

## Assignment Process

- Assign each item an owner.
- Assign severity and priority.
- Assign category.
- Assign a recommended decision: fix batch, known limitation, caution, documentation update, or no action.
- Link to the proposed fix phase only after triage.

## Closing Criteria

An item can close when:

- It is fixed and verified in a later phase.
- It is accepted as a known limitation.
- It is a duplicate and linked to the primary issue.
- It is not reproducible and lacks sufficient data after safe follow-up.
- It is outside the product scope and documented as such.

## Safety / Data Concerns

Escalate immediately if feedback mentions:

- Data loss.
- Destructive cleanup.
- Backup deletion.
- Token exposure.
- `.env`, `.env.local`, private key, password, or `auth.json` exposure.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Unexpected command execution.

## What Support Must Not Request

Support must not request:

- `auth.json`.
- `.env`.
- `.env.local`.
- Tokens.
- Private keys.
- Passwords.
- Full credential-bearing logs.
- Full source archives unless separately approved and scrubbed.

## Explicit Integration Boundary

Phase 20 does not connect to GitHub API, SaaS issue trackers, cloud storage, Vercel, Supabase, auth providers, payment providers, MCP, or OpenAI API.
