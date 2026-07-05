# Private Beta Tester Data Handling Policy

## Allowed Tester Data

- Anonymous tester ID.
- Environment summary.
- Page or workflow name.
- Reproduction steps.
- Redacted error text.
- Bounded redacted screenshots.
- Severity and priority notes.
- Safety/data impact summary.

## Disallowed Tester Data

- Tokens.
- `~/.codex/auth.json`.
- `.env` or `.env.local`.
- Private keys.
- Passwords.
- Credentials.
- Credential-bearing logs.
- Proprietary source code snippets.
- Full source files.
- Full source archives.
- Local SQLite database files.

## Anonymization Policy

Use tester IDs such as `T01`, `T02`, and `T03` unless GM explicitly approves a different internal mapping. Public docs should not contain personal emails, personal names, phone numbers, addresses, or private customer data.

## Redaction Policy

Before storing feedback:

- Remove tokens and credentials.
- Replace private paths with generalized labels when possible.
- Keep logs bounded.
- Summarize source snippets instead of copying code.
- Mark any uncertain sensitive data as redaction required.

## Storage Policy

Store only summarized, redacted feedback in project docs and ledgers. Do not store raw credential material or full local files.

## Sharing Policy

Share feedback only inside the GM-approved private beta review process. Do not upload tester data to GitHub Issues, Vercel, Supabase, cloud storage, external SaaS, or public channels from this phase.

## Deletion Request Handling

If a tester requests deletion:

- Locate feedback by tester ID.
- Remove or anonymize the relevant record according to GM direction.
- Do not delete unrelated records.
- Do not delete backup files as part of Phase 25.

## Safety Escalation

Escalate immediately if feedback includes:

- Secret exposure.
- Data loss concern.
- Unauthorized file access concern.
- Automatic execution concern.
- Destructive cleanup concern.

## No-Token / No-Auth / No-Env / No-Private-Key Policy

Never request, store, or forward tokens, `auth.json`, `.env`, `.env.local`, private keys, passwords, or credentials.

## No Proprietary Source Collection Policy

Do not collect proprietary source snippets. Ask testers to summarize affected files or workflows instead.

