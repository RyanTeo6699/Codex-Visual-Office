# Private Beta Regression Decision Matrix

| Issue type | Required fix phase | Blocks private beta? | Blocks public beta? | Blocks commercial release? | Can be known limitation? | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| data loss | Phase 22 - Private Beta Fix Batch 1 | Yes | Yes | Yes | No | Stop expansion, reproduce, fix, verify, document. |
| safety boundary breach | Phase 22 - Private Beta Fix Batch 1 | Yes | Yes | Yes | No | Escalate immediately; verify no token/env/destructive exposure. |
| auto execution bug | Phase 22 - Private Beta Fix Batch 1 | Yes | Yes | Yes | No | Fix before continuing beta if Codex/Git/Quality runs without explicit user action. |
| route crash | Phase 21 unless isolated | Usually | Yes if common | Yes if common | Sometimes | Fix common core-route crashes; document isolated environment issues. |
| setup failure | Phase 21 or docs patch | If broad | Yes if broad | Yes | Sometimes | Identify environment pattern; fix docs or setup path. |
| Codex runtime confusion | Phase 21 or documentation fix | No unless blocking | Possibly | Possibly | Yes | Clarify status/auth unknown/execution boundaries. |
| UI blocker | Phase 21 | If core flow blocked | Yes if repeated | Yes if repeated | Sometimes | Fix workflow-blocking layout or responsive issue. |
| documentation confusion | Phase 21 docs fix | No unless setup blocked | Possibly | Possibly | Yes | Update guide/checklist/support runbook. |
| Tauri beta confusion | Future desktop packaging scope | No | No for browser beta | Yes before desktop release | Yes | Clarify browser/local launcher vs future signed desktop app. |
| backup restore failure | Phase 21 | Yes if real restore unsafe | Yes | Yes | No if data risk | Fix restore safety, dry-run, and pre-restore backup behavior. |
| backup record display confusion | Phase 21 or docs patch | No | Possibly | Possibly | Yes | Clarify UI/docs if no data risk. |
| archive dry-run confusion | Phase 21 or docs patch | No | Possibly | Possibly | Yes | Clarify no data is deleted. |
| responsive overflow | Phase 21 polish/fix | No unless route unusable | Possibly | Possibly | Yes | Fix if repeated at 390px or core desktop sizes. |

## Decision Rules

- Any data loss, token exposure, unexpected command execution, destructive cleanup, or backup deletion is not a known limitation.
- Repeated setup blockers must enter Phase 21 before public beta scope work.
- UI polish can be known limitation only if core workflows remain usable.
- Documentation confusion can be caution if it affects one tester; it becomes Phase 21 work if repeated.
- Public beta and commercial release remain blocked until P0/P1 safety, data, setup, and route crash issues are resolved.
