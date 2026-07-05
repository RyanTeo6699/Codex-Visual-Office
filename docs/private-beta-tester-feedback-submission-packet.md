# Private Beta Tester Feedback Submission Packet

## Feedback Form Instructions

Send feedback manually to [Support contact placeholder]. Use bounded, redacted text. Do not upload secrets, source archives, full logs, or local database files.

Recommended format:

```txt
Tester ID:
Date:
Environment:
Route or workflow tested:
Result:
Issue summary:
Severity:
Repro steps:
Expected behavior:
Actual behavior:
Redacted screenshot/log note:
Safety or data concern:
```

## Issue Report Instructions

For each issue, include:

- Short title.
- Page or workflow.
- Environment.
- Repro steps.
- Expected behavior.
- Actual behavior.
- Severity self-rating.
- Redacted screenshot or bounded log excerpt, if useful.

## Environment Info Required

- OS and version, if known.
- Browser and version, if known.
- Node version, if known.
- Whether Codex CLI is installed, if known.
- Whether the app was run by source checkout / local launcher.

Do not send machine secrets or full environment dumps.

## Repro Steps Required

Use concrete steps:

1. Open route or page.
2. Click or run the documented local command.
3. Observe behavior.
4. Record exact redacted error text, if any.

## Screenshot / Log Redaction Rules

Before submitting screenshots or logs, remove:

- Tokens.
- API keys.
- Passwords.
- `auth.json`.
- `~/.codex/auth.json`.
- `.env` and `.env.local`.
- Private keys.
- Proprietary code.
- Customer data.
- Full local paths if sensitive.
- Local SQLite DB content.

Keep logs bounded. Prefer the smallest excerpt that proves the issue.

## Safety / Data Concern Section

If you suspect private data exposure, write:

```txt
Safety concern:
What data might be exposed:
Where it appeared:
Whether it was submitted:
What was redacted:
```

Do not include the sensitive data itself.

## Severity Self-rating Guide

- P0: Potential credential/data exposure or app cannot be evaluated at all.
- P1: Major setup, launch, or core workflow blocker.
- P2: Important workflow problem with workaround.
- P3: Confusing copy, visual issue, or minor usability friction.

## What Not To Include

- Tokens or credentials.
- `auth.json`.
- `~/.codex/auth.json`.
- `.env` or `.env.local`.
- Private keys.
- Proprietary source code.
- Source archives.
- Local SQLite database files.
- Unredacted full terminal logs.
- Customer data.

## Example Safe Submission

```txt
Tester ID: T-001
Date: 2026-07-05
Environment: macOS, Chrome, Node installed
Route or workflow tested: /settings
Result: Page loaded, but Backup / Restore wording was unclear.
Issue summary: I did not understand whether restore overwrites the DB immediately.
Severity: P3
Repro steps:
1. Start local app.
2. Open /settings.
3. Read Backup / Restore section.
Expected behavior: Copy clearly states dry-run first.
Actual behavior: I was unsure whether restore was destructive.
Redacted screenshot/log note: Screenshot attached with no private data.
Safety or data concern: None.
```

## Example Unsafe Submission

```txt
Do not submit:
- Full .env file.
- ~/.codex/auth.json contents.
- Full proprietary source archive.
- Unredacted terminal log containing API keys.
- Local SQLite database file.
```

