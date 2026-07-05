# Private Beta Round 1 Follow-up Schedule

## Purpose

This schedule gives GM a manual outreach cadence. It does not automate messages, integrate Gmail, integrate GitHub, call SaaS APIs, or record invitation counts.

## Schedule

| Day | Action | Follow-up owner | Expected action | Escalate when | Stop follow-up when |
| --- | --- | --- | --- | --- | --- |
| Day 0 | Send invitation | GM | Manually send invitation and record invitation status. | Invitee reports safety concern or setup blocker. | Invitee declines or asks not to continue. |
| Day 2 | Setup check | GM | Ask whether local setup started and whether support is needed. | Setup blocks multiple testers or exposes unclear safety boundary. | Tester confirms setup complete or declines. |
| Day 5 | Feedback reminder | GM | Request feedback using the submission packet. | Tester reports P0/P1 blocker, data exposure concern, or confusing setup instructions. | Tester submits feedback, declines, or asks for extension. |
| Day 7 | Close / extend decision | GM | Decide whether to close the window, extend collection, or prepare Phase 28 if real submissions exist. | No real submissions but GM needs more tester coverage. | GM closes the collection window or moves to Phase 28 with real evidence. |

## Escalation Criteria

Escalate to GM immediately if a tester reports:

- Possible token, credential, or private data exposure.
- Build or launch instructions that consistently fail.
- Misleading public release or installer expectations.
- Any request that would require sharing `auth.json`, `.env`, private keys, source archives, or local SQLite DBs.
- P0/P1 blocker affecting private beta continuation.

## Stop Criteria

Stop following up with an invitee when:

- The invitee declines.
- The invitee asks not to be contacted.
- The contact method fails and GM has no approved alternate route.
- The collection window closes.
- The invitee submits feedback and no clarification is required.

## Counting Rules

- A scheduled follow-up does not count as sent unless GM manually sends it.
- A reply does not count as product feedback unless it contains real tester evidence or a real tester observation.
- Non-response is not negative product evidence.

