# Private Beta Tester Privacy / Safety Notice

## What Testers May Share

Testers may share:

- High-level environment information.
- Route or workflow tested.
- Repro steps.
- Redacted screenshots.
- Bounded redacted log excerpts.
- Safety concerns without including the sensitive value.
- Usability observations.

## What Testers Must Not Share

Do not share:

- Tokens.
- API keys.
- Passwords.
- `auth.json`.
- `~/.codex/auth.json`.
- `.env` or `.env.local`.
- Private keys.
- Proprietary source code.
- Source archives.
- Full unredacted logs.
- Local SQLite database files.
- Customer data.

## How Feedback Is Used

Feedback is used to evaluate the local-first Production 1.0 baseline, identify private beta blockers, and decide whether Phase 28 feedback review can begin.

Feedback does not imply public release approval, commercial launch, signing, notarization, auto updater, cloud sync, auth, payment, team workspace, MCP, or ChatGPT App readiness.

## How To Anonymize

- Replace personal names with tester IDs.
- Redact local usernames from paths if needed.
- Remove tokens, keys, secrets, and credentials.
- Crop screenshots to the relevant UI.
- Share only the smallest useful log excerpt.

## How To Report Safety Concerns

Report:

- What type of data might be exposed.
- Where it appeared.
- Whether it was visible in UI, logs, docs, or a local file.
- Whether you already submitted the data.

Do not include the sensitive value itself.

## How To Request Deletion Of Submitted Feedback

Contact [Support contact placeholder] and identify the submission by tester ID, date, or safe summary. GM should remove the feedback record from private beta review materials when appropriate.

## No Cloud Sync

Codex Visual Office remains local-first for this beta. There is no cloud sync in this packet.

## No Token Collection

The beta must not collect tokens, credentials, `auth.json`, `.env`, `.env.local`, private keys, or credential files.

## No Source Code Collection

The beta must not collect proprietary source code, source archives, or local SQLite database files.

