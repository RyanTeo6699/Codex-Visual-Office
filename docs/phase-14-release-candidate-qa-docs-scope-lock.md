# Phase 14 - Release Candidate QA / Documentation Hardening Scope Lock

## Status

Phase 14 is Release Candidate QA / Documentation Hardening.

It is local-first, docs-first, and QA-only. It is not a production release phase.

## Goal

Harden the release candidate documentation and QA posture for Codex Visual Office without adding product capabilities, changing app behavior, changing schemas, adding execution capability, or expanding runtime authority.

Phase 14 should make the current product boundaries understandable for a local user:

- How to start and use the app locally.
- What the browser launcher and desktop beta candidate mean.
- Where Office Home, Project Room, Review Room, Settings, Archive, and Safety fit.
- How approved paths, Codex runtime visibility, Agent Workflow, Quality Gates, Backup/Restore, and archive dry-run behavior are bounded.
- What the product intentionally does not do.

## Allowed

- Documentation.
- QA notes.
- Release candidate user manual.
- Local setup guide.
- Safety and data boundary documentation.
- Cross-linking existing local verification commands.
- Clarifying existing local-first behavior.
- Clarifying existing forbidden capability boundaries.
- Static documentation readiness verifier.
- Static Release Candidate readiness verifier.
- Package script entries for those two static verifiers.

## Forbidden

- Production release.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub integration.
- Vercel integration.
- Supabase integration.
- Auth.
- Login or registration.
- Payment.
- Billing.
- Team workspace or team permissions.
- MCP.
- ChatGPT App integration.
- OpenAI API integration.
- Arbitrary shell execution.
- Command text box.
- Terminal UI.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git execution.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup deletion.
- Production installer distribution.
- Schema changes.
- Package dependency changes.
- Product behavior scripts.
- Execution, mutation, installer, updater, deploy, cloud, or destructive scripts.
- App code changes.
- Phase 15 implementation.

## Documentation Boundary

Phase 14 may create documentation and the two required static QA verifiers only:

- `scripts/verify-docs-readiness.ts`
- `scripts/verify-release-candidate-readiness.ts`
- `docs:verify:readiness`
- `rc:verify:readiness`

It must not edit app code, package dependencies, database schema, migrations, Tauri configuration, launcher behavior, runner behavior, Git behavior, Quality Gate behavior, backup/restore behavior, archive behavior, or safety policy helpers.

## QA Boundary

Phase 14 QA may document existing verification commands and expected local checks. It may add the two required static, read-only verifiers and their package scripts. It must not introduce a runner, command textbox, terminal surface, source scanner, credential reader, cloud check, production packager, updater, deployer, mutating Git command, Quality Gate execution path, Codex execution path, or destructive cleanup command.

Any manual QA note must preserve local data by default.

## Local-First Boundary

Codex Visual Office remains a local-first visual office.

Local-first means:

- App data stays on the user's machine.
- Approved paths are user-declared workspace references.
- Approved paths do not grant automatic source scanning.
- Sensitive files remain blocked.
- External account integrations are absent unless a later GM-approved phase explicitly adds them.

## Desktop Boundary

The desktop beta candidate remains a candidate shell posture, not a production desktop release.

Phase 14 documentation may explain the desktop beta candidate and browser launcher fallback. It must not approve or implement production distribution, code signing, notarization, installer release, auto updater, Electron migration, or platform support promises.

## Credential Boundary

Phase 14 must not instruct users or agents to read, inspect, paste, copy, validate, store, or transmit secrets.

Forbidden credential handling includes:

- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Reading token files.
- Reading SSH keys.
- Reading API keys.
- Reading OAuth credentials.
- Reading cloud credentials.
- Storing tokens.

## Next Phase Gate

Do not start Phase 15 from this work.

Any future production release, packaging, signing, notarization, updater, cloud, integration, account, execution, source-read, credential-read, destructive cleanup, or backup deletion work requires a separate GM-approved scope lock.
