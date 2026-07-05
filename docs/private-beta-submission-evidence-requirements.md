# Private Beta Submission Evidence Requirements

## Allowed Evidence

- Tester statement.
- Redacted screenshot.
- Bounded/redacted log note.
- Environment summary.
- Reproduction steps.
- Route/page name.
- Observed error message without secrets.
- Setup step description.
- Local launcher status summary.

## Forbidden Evidence

- Tokens.
- `auth.json`.
- `~/.codex/auth.json`.
- `.env`.
- `.env.local`.
- Private keys.
- Credentials.
- Passwords.
- Unredacted logs with secrets.
- Full proprietary source files.
- Full source archives.
- Local SQLite databases.
- Credential-bearing screenshots.

## Evidence Quality Checklist

- Source is real tester, support observation, or GM manual note.
- Tester ID is anonymized.
- Evidence is bounded.
- Sensitive data is redacted.
- Page/workflow is named.
- Expected and actual result are clear.
- Repro steps are present if reporting a defect.
- Severity is assigned if actionable.

## Boundary

Evidence requirements do not implement upload, cloud intake, GitHub issue creation, external SaaS collection, or automated import.

