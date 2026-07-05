# Private Beta First-response Support Script

## Support Boundary

Support must never ask for:

- `auth.json`.
- `~/.codex/auth.json`.
- Tokens.
- API keys.
- `.env` or `.env.local`.
- Private keys.
- Proprietary source archives.
- Local SQLite DB files.
- Unredacted full logs.

Ask for redacted, bounded information only.

## Setup Failure Response

Thanks for testing. Please send only:

- OS.
- Node version, if available.
- The documented command that failed.
- A short redacted error excerpt.
- Whether this was source checkout / local launcher.

Do not send tokens, `.env`, `auth.json`, private keys, source archives, or local DB files.

## Localhost / Launcher Failure Response

Please confirm:

- The local URL you tried.
- Whether the dev server appeared to start.
- Browser used.
- Redacted error text from the browser page.

Do not send full logs if they contain secrets. A bounded redacted excerpt is enough.

## Codex CLI Not Detected Response

The app should show Codex CLI status without reading Codex auth files. Please share:

- Whether `codex` is installed, if you know.
- The status label shown in the app.
- OS and terminal type, if relevant.

Do not share `~/.codex/auth.json` or any token.

## Codex Auth Unknown Response

`auth unknown` can be acceptable in this beta because the app must not read `~/.codex/auth.json`. Please share the visible status text only. Do not share auth file contents.

## Approved Path Setup Response

Please share:

- Whether you manually entered an approved project path.
- Whether the app shows it as approved.
- The path only if it does not expose sensitive information.

Do not send project source files. Do not send `.env` or secrets from that path.

## Backup / Restore Confusion Response

Backup / Restore is local SQLite only. Please report:

- Which button or copy was confusing.
- Whether dry-run wording was clear.
- Whether you expected cloud backup.

Do not send backup SQLite files unless GM explicitly defines a safe internal process later.

## Archive Dry-run Confusion Response

Archive cleanup in the local baseline is dry-run oriented. Please report:

- Which Archive Room section was confusing.
- Whether you expected data deletion.
- Whether the no-delete warning was visible.

Do not delete backup files for testing.

## Safety Concern Response

If you saw a possible sensitive data exposure:

1. Do not paste the secret.
2. Describe where it appeared.
3. Redact all sensitive values.
4. Send a bounded summary and optional redacted screenshot.

## Data Exposure Concern Response

Thank you for flagging this. Please do not send the exposed value. Send:

- Page or workflow.
- Type of data exposed, without the value.
- Whether it appeared in UI, logs, or docs.
- Redacted evidence if safe.

GM should review before asking for any additional evidence.

