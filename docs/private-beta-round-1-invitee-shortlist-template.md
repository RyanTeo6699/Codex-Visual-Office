# Private Beta Round 1 Invitee Shortlist Template

## Purpose

This template lets GM prepare a real invitee shortlist without fabricating tester records. Leave rows blank until GM has real invitees.

## Current State

```txt
No real invitees have been recorded in this template yet.
No external tester invitations have been sent by this repository.
```

Do not treat this template as tester evidence, invitation evidence, onboarding evidence, or feedback evidence.

## Shortlist Template

| Invitee ID | Tester type | Contact method placeholder | OS/environment expectation | Codex CLI expected? | Risk notes | Invitation status | Follow-up status | Submission status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD | not_sent | not_started | no_submission | Fill only when GM has a real invitee. |

## Suggested Tester Types

- Local developer familiar with Node.js / Next.js projects.
- Codex CLI user.
- Product reviewer focused on workflow clarity.
- Safety reviewer focused on local data and token boundaries.
- Non-technical observer for first-run clarity, if GM wants usability feedback.

## Status Values

Invitation status:
- `not_sent`
- `sent`
- `declined`
- `bounced`
- `paused`

Follow-up status:
- `not_started`
- `setup_check_sent`
- `feedback_reminder_sent`
- `closed`
- `extended`

Submission status:
- `no_submission`
- `received_pending_review`
- `received_needs_redaction`
- `accepted_for_phase_28_review`

## Safety Rules

Invitees must not submit:

- Tokens.
- `auth.json`.
- `~/.codex/auth.json`.
- `.env` or `.env.local`.
- Private keys.
- Proprietary source code.
- Source archives.
- Local SQLite database files.
- Unredacted logs containing credentials.

## Counting Rules

- Placeholder rows do not count as invitees.
- Draft contact lists do not count as invitations sent.
- Non-response does not count as feedback.
- Setup questions do not count as product feedback unless GM records them as a real issue with evidence.

