# Private Beta Fix Batch 1 Issue List

## Source

This list is derived from Phase 21 dry-run artifacts:

- `docs/private-beta-round-1-dry-run-results.md`
- `docs/private-beta-sample-feedback-entries.md`
- `docs/private-beta-sample-issue-reports.md`
- `docs/private-beta-sample-triage-output.md`

No real private beta tester round was executed for this batch.

## Issue List

| ID | Priority | Area | Fix type | Resolution |
| --- | --- | --- | --- | --- |
| FB1-001 | P0 | Safety / feedback intake | Documentation | Added prominent no-token/no-secret warnings to feedback, issue, tester, and support docs. |
| FB1-002 | P1 | Approved project path | Docs + copy | Clarified manual Settings setup, missing-path recovery, and no folder scan/source read behavior. |
| FB1-003 | P2 | Setup / DB verification | Documentation | Added local DB success markers and noted `.local` count variance. |
| FB1-004 | P2 | Codex CLI / auth unknown | Docs + copy | Clarified Codex CLI optionality and that auth unknown does not imply auth file reads. |
| FB1-005 | P2 | Backup / Restore | Docs + copy | Clarified Dry Run Restore is non-destructive and Confirm Restore requires a safety backup first. |
| FB1-006 | P2 | Archive dry-run | Copy | Updated archive dry-run copy to private beta wording and reiterated no backup deletion. |
| FB1-007 | P3 | Localhost wording | Documentation | Added plain-language note that localhost is served from the tester's machine. |
| FB1-008 | P3 | Review Room density | Copy / limitation | Kept behavior unchanged; clarified optional runner and manual review wording. |
| FB1-009 | P3 | Existing `.local` counts | Documentation | Documented expected count variance in tester/package/support docs. |
| FB1-010 | Docs consistency | Phase numbering | Documentation | Updated fix-batch references from Phase 21 to Phase 22 where they were no longer historical. |

## Deferred Items

- Large Review Room redesign remains deferred.
- Real private beta execution remains deferred to GM-approved Phase 23.
- Public release, signing, notarization, updater, cloud, team, auth, payment, MCP, OpenAI API, GitHub API, Vercel, and Supabase remain outside scope.

## Acceptance Status

```txt
PRIVATE_BETA_FIX_BATCH_1_READY_FOR_REAL_PRIVATE_BETA
```

This means the known low-risk dry-run clarity issues were addressed enough to proceed to a real private beta round by GM approval. It is not a claim that real private beta testers completed the round.
