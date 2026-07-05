# Phase 27 - Continue Collection / Real Tester Outreach Execution Packet Scope Lock

## Goal

Prepare the real tester outreach execution packet for private beta round 1, including invitee templates, outbound messages, follow-up schedule, submission packet, GM collection playbook, first-response support scripts, privacy/safety notice, and Phase 28 readiness gate without fabricating tester feedback or implementing public release capabilities.

## Intended Status

```txt
REAL_TESTER_OUTREACH_PACKET_READY_AWAITING_INVITATIONS_OR_SUBMISSIONS
```

This status means the packet is ready for GM to use with real testers. It does not mean testers have been invited, onboarded, or received unless GM records those facts separately.

## Allowed

- Invitee shortlist template.
- Outbound invitation messages.
- Reminder and follow-up schedule.
- Tester feedback submission packet.
- GM manual collection playbook.
- First-response support script.
- Tester privacy and safety notice.
- Phase 28 feedback review readiness gate.
- Static outreach verifier.
- Roadmap and release status updates.
- Final Phase 27 result document.

## Forbidden

- Fake tester feedback.
- Fake tester count.
- Fake invitation count.
- Fake submission count.
- Fake issue count.
- Fake setup success rate.
- Claiming beta completion without real tester submissions.
- New product features.
- DB schema or migration changes.
- New dependencies or lockfile changes.
- App UI behavior changes.
- Codex runner behavior changes.
- Quality Gate runner policy changes.
- Backup / Restore behavior changes.
- Archive cleanup behavior changes.
- Tauri production packaging.
- Actual public package build.
- Code signing.
- Notarization.
- Auto updater.
- Electron.
- Cloud sync.
- GitHub API.
- Vercel.
- Supabase.
- Auth, payment, team workspace, or MCP.
- ChatGPT App integration.
- OpenAI API.
- Arbitrary shell runner.
- Command text box.
- Terminal emulator.
- `node-pty`.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup file deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 28 implementation.

## Data Boundary

Phase 27 may prepare templates for real outreach, but it must not record personal tester details unless GM explicitly supplies them. Placeholder fields are allowed. Real evidence must be recorded later only after it exists.

## Private Beta Boundary

This is a private beta outreach packet for a local-first baseline. It is not a public release, not a commercial launch, not a signed or notarized installer, and not an auto-updating desktop product.

## Local-first Boundary

The packet must state that testers should run the project locally through source checkout / local launcher. There is no cloud sync and no remote account requirement.

## Safety Boundary

Testers must never be asked to share tokens, `auth.json`, `.env`, `.env.local`, private keys, proprietary source archives, local SQLite databases, or unredacted logs containing secrets.

## Acceptance Criteria

- Required outreach docs exist.
- `beta:verify:outreach` exists and passes.
- Docs state private beta, local-first, no public release, no token sharing, and no fake counts.
- Status remains awaiting invitations or submissions when no real submissions exist.
- Roadmap and release status are consistent.
- No product capability, schema, dependency, runner, backup, archive, Tauri, cloud, auth, payment, team, MCP, OpenAI, or Phase 28 implementation is added.

## Failure Criteria

- Any doc fabricates tester feedback, tester count, invitation count, submission count, issue count, or setup success.
- The project claims beta completion without real submissions.
- Any forbidden integration or runtime capability is added.
- Any schema, migration, dependency, lockfile, UI behavior, runner policy, backup/restore, archive cleanup, or Tauri production packaging change is introduced.
- Phase 28 feedback review is implemented instead of gated.

