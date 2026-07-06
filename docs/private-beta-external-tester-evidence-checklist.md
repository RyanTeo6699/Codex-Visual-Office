# Private Beta External Tester Evidence Checklist

## Allowed Evidence

```txt
EXTERNAL_TESTER_EVIDENCE_NOT_YET_RECEIVED
```

- Redacted screenshot.
- Bounded and redacted log note.
- Bounded and redacted log excerpt.
- Tester statement.
- Environment summary.
- Reproduction steps.
- Route or page.
- Observed error message without secrets.
- Command result summary without full sensitive output.

## Forbidden Evidence

- Tokens.
- `auth.json`.
- `~/.codex/auth.json`.
- `.env`.
- `.env.local`.
- Private keys.
- Passwords.
- API keys.
- Proprietary source files.
- Local SQLite DB.
- Unredacted logs with secrets.
- Full filesystem dumps.
- Full home directory paths beyond the minimum needed for environment summary.

## Evidence Intake Checks

| Check | Required |
| --- | --- |
| Evidence source identified | Yes |
| Real external source confirmed | Yes for external tester evidence |
| Anonymized tester ID assigned | Yes for external tester evidence |
| External Tester ID provided | Yes for external feedback |
| Sensitive data removed | Yes |
| Route/page included if UI issue | Yes when applicable |
| Repro steps included if bug report | Yes when applicable |
| Environment summary included | Recommended |
| Expected / actual result clear | Recommended |
| Raw secret-bearing files rejected | Yes |

## Boundary

GM local validation is useful context but is not external tester evidence. Evidence intake is manual. Phase 29 does not add upload flows, cloud storage, GitHub issue creation, Vercel, Supabase, auth/payment, MCP, OpenAI API, or automatic log collection.
