# Phase 30 - Private Beta Ops Automation / Internal Execution Pack Scope Lock

## Phase Name

Phase 30 - Private Beta Ops Automation / Internal Execution Pack.

## Goal

Convert the manual private beta outreach and feedback collection process into a local beta ops room, tracker templates, exportable message packets, and verification workflow without sending external messages or fabricating tester feedback.

Current status:

```txt
BETA_OPS_READY_AWAITING_EXTERNAL_TESTER_SUBMISSIONS
```

## Allowed

- `/beta` Beta Ops Room.
- Beta ops summary helper.
- Local tracker templates.
- Invitation/export packet.
- Feedback and issue templates.
- GM next action checklist.
- Documentation and verification.
- Roadmap and release status consistency updates.

## Forbidden

- Auto-send messages.
- Gmail, GitHub, Slack, Discord, WeChat, or external communication API.
- Fake tester feedback.
- Fake tester count.
- Fake submission count.
- Fake issue count.
- Fake setup success rate.
- Beta completion claim.
- Public beta or public release readiness claim.
- Public release implementation.
- Signed or notarized installer.
- Auto updater.
- Production package build.
- Electron.
- Cloud sync.
- Vercel.
- Supabase.
- Auth, payment, team workspace, MCP, or ChatGPT App.
- OpenAI API.
- New dangerous command execution.
- Arbitrary shell.
- Command text box.
- Terminal emulator.
- Node-pty.
- Automatic Codex execution.
- Automatic Git mutation.
- Automatic Quality Gate execution.
- Destructive cleanup.
- Backup deletion.
- Reading `~/.codex/auth.json`.
- Reading `.env` or `.env.local`.
- Token storage.
- Phase 31 implementation.

## Acceptance Criteria

- Beta Ops Room exists and is local/read-only presentation.
- Export templates exist and are clearly template-only.
- No external tester submissions are recorded unless GM provides real evidence.
- GM local validation remains separate from external tester feedback.
- Verifier confirms no external send capability and no forbidden integrations.
- No DB schema, migration, dependency, lockfile, runner policy, Quality Gate policy, backup/restore behavior, archive cleanup behavior, or Tauri production packaging changes are introduced.

## Failure Criteria

- Any tester, feedback, issue, count, invitation result, or setup result is fabricated.
- The UI contains external sending, service connection, upload, token, command, terminal, auto-invite, or auto-submit controls.
- The phase claims private beta completion, public beta readiness, public release readiness, or Phase 31 implementation.
