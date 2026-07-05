# Private Beta Feedback Submission Instructions

## What Feedback To Submit

Submit feedback about:

- Setup clarity.
- Local launcher / browser workflow.
- Page loading and navigation.
- Review Room 2.0 clarity.
- Quality Gates clarity.
- Scope Guard clarity.
- Git observation clarity.
- Settings Center clarity.
- Backup / Restore clarity.
- Archive Room clarity.
- Safety Room clarity.
- Confusing labels or missing guidance.
- Blockers that prevent local use.

## Required Environment Info

Include:

- Tester ID.
- macOS version.
- Hardware type if relevant.
- Node version.
- npm version.
- Browser name/version.
- Codex CLI state if known: `present`, `absent`, `not_checked`, or `auth_unknown`.
- Source checkout type.

Do not include tokens, credentials, full local paths that expose private data, or secrets.

## Required Repro Info

For each issue:

- Page or workflow.
- What you expected.
- What happened.
- Steps to reproduce.
- Whether it repeats.
- Redacted error text if available.

## Screenshot / Log Note Rules

Screenshots and logs are optional. If provided:

- Redact secrets.
- Keep snippets bounded.
- Do not include full terminal history.
- Do not include full source files.
- Do not include local SQLite databases.

## Sensitive Data Redaction Rules

Never include:

- Token.
- `~/.codex/auth.json`.
- `.env`.
- `.env.local`.
- Private key.
- Password.
- Credential-bearing log.
- Full proprietary file content.
- Full source archive.

## Severity Self-Rating

Use:

- `P0`: Safety/data loss/security concern.
- `P1`: Blocks setup or core review.
- `P2`: Major confusion or broken workflow with workaround.
- `P3`: Minor copy, docs, polish, or clarity issue.

## Safety/Data Concern Section

If you see a safety or data concern, mark it clearly:

```txt
Safety/Data Concern: yes
Description: [redacted summary]
```

Do not include secrets as evidence.

## How To Report A Blocker

Send:

- Tester ID.
- Exact blocked step.
- Environment summary.
- Redacted error.
- Whether retry changed the result.
- Whether sensitive data was involved.

## What Not To Include

- Token.
- `auth.json`.
- `.env`.
- `.env.local`.
- Private key.
- Full proprietary file content.
- Credential logs.
- Full source archive.
- Local SQLite database.

