# Private Beta Feedback Evidence Policy

## Purpose

Define what may be counted as real private beta evidence during Phase 24.

## Evidence Source Types

### `real_tester_feedback`

Feedback submitted by an invited real private beta tester through the approved feedback ledger, issue report template, support channel, or GM-approved intake path.

Requirements:

- Tester may be anonymized as `T01`, `T02`, and so on.
- The source must represent an actual tester interaction.
- Evidence may be summarized; secrets must be redacted.

### `support_observation`

An observation recorded by the project owner or support coordinator while helping a real tester complete setup, launch, review, or feedback submission.

Requirements:

- Must be tied to a real private beta support interaction.
- Must not include secrets, tokens, private keys, or full local files.

### `gm_note`

A GM decision note or beta coordination note.

Requirements:

- Can guide decision-making.
- Must not be counted as tester feedback unless it records a specific real tester submission.

### `simulated_reference`

Historical sample or dry-run material from Phase 21 or other simulated exercises.

Rules:

- Cannot be counted as real beta feedback.
- Cannot be counted as real setup success, launch success, issue count, blocker count, or safety/data incident count.
- May be used only as historical comparison context.

### `placeholder`

Blank, pending, template, or example row used to show the structure of a ledger.

Rules:

- Cannot be counted as feedback.
- Cannot be counted as issue evidence.
- Cannot be counted as completion evidence.

## Safety and Data Rules

- Never record tokens.
- Never record `.env` or `.env.local` contents.
- Never ask testers for `~/.codex/auth.json`.
- Never record private keys, passwords, or credential-bearing logs.
- Preserve safety/data impact notes as summaries.
- Redact screenshots or logs before storing any sensitive detail.
- Do not request full source archives or local SQLite databases unless GM approves a separate privacy review.

## Current Phase 24 Evidence Status

```txt
AWAITING_TESTER_FEEDBACK
```

No real tester feedback has been recorded yet.

