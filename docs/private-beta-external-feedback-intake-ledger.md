# Private Beta External Feedback Intake Ledger

## Status

```txt
AWAITING_EXTERNAL_TESTER_FEEDBACK
```

No external tester feedback has been recorded yet.

The Phase 28 GM / local validation sample remains recorded separately and is not counted as `external_real_tester` feedback.

## Current Counts

| Evidence category | Count | Counted as external tester feedback? |
| --- | ---: | --- |
| External tester feedback submissions | 0 | Yes, when real submissions exist |
| GM / local validation samples | 1 | No |
| Support observations | 0 | No |
| Simulated references | 0 | No |
| Placeholders | 0 | No |

## Source Types

- `external_real_tester`
- `gm_local_validation`
- `support_observation`
- `simulated_reference`
- `placeholder`

Only `external_real_tester` entries backed by real external tester submissions may count toward external tester feedback.

## Ledger

| Feedback ID | Source type | External Tester ID | Date | Area | Summary | Evidence type | Sensitive data checked? | Severity | Priority | Status | Linked issue ID | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Rules

- Do not count GM local validation as external tester feedback.
- Do not fabricate external tester feedback.
- Do not fabricate tester count.
- Do not fabricate submission count.
- Do not record tokens, `auth.json`, `.env`, private keys, proprietary source, local SQLite DB files, or unredacted logs with secrets.
- Do not claim beta completion from an empty ledger.
