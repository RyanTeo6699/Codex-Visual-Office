# Private Beta Real Feedback Intake Checklist

Use this checklist before entering any private beta feedback into the real ledgers.

| Check | Required State | Status |
| --- | --- | --- |
| Confirm feedback source | `real_tester`, `support_observation`, or `gm_note` | pending |
| Confirm tester ID | Anonymous ID assigned or known by GM | pending |
| Confirm environment | macOS, Node, npm, browser, Codex CLI state if known | pending |
| Confirm reproduction steps | Clear enough to triage or marked needs more info | pending |
| Confirm severity | P0 / P1 / P2 / P3 | pending |
| Confirm safety/data impact | yes / no / unknown | pending |
| Confirm no sensitive information included | no token/auth/env/private key/proprietary source | pending |
| Confirm duplicate status | new / duplicate / related / needs review | pending |
| Confirm triage status | pending / triaged / needs more info / blocked | pending |
| Confirm linked issue ID | existing ID or pending new issue ID | pending |
| Confirm decision | fix batch / docs update / known limitation / no action / blocked / awaiting confirmation | pending |

## Source Classification Rule

- `real_tester`: actual tester-submitted feedback.
- `support_observation`: real support interaction note.
- `gm_note`: GM coordination or decision note.
- `simulated_reference`: historical context only; not real feedback.
- `placeholder`: template or pending row; not feedback.

## Required Empty-State Rule

If no real tester submission exists, do not create a feedback count or issue count. Keep Phase 25 status as:

```txt
REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS
```

