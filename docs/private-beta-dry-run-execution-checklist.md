# Private Beta Dry-Run Execution Checklist

## Preflight

- Confirm current baseline commit is recorded.
- Confirm working tree is clean before dry-run documentation work.
- Confirm Phase 20 docs exist.
- Confirm no real public release, signing, notarization, auto updater, cloud sync, auth/payment/team/MCP, OpenAI API, or Phase 22 implementation is in scope.

## Docs Readiness

- Read private beta tester guide.
- Read private beta package checklist.
- Read feedback template.
- Read issue report template.
- Read support runbook.
- Read Phase 20 feedback intake workflow.
- Read Phase 20 triage and regression matrices.

## Source Checkout Path

- Simulate a fresh tester receiving source checkout instructions.
- Confirm the instructions do not imply signed installer or production packaging.
- Confirm no secret or token sharing is requested.

## Local Setup Path

- Simulate install, DB init/seed/verify, typecheck, and build instructions.
- Mark which steps require real tester environment validation.

## Local Launcher Path

- Simulate local launcher verification and browser route launch.
- Confirm launcher stays local and does not start cloud sync or external deployment.

## Approved Path Setup Path

- Simulate missing approved path and configured approved path states.
- Confirm manual path setup is clear.
- Confirm no folder picker, filesystem scan, Codex execution, Git execution, or quality gate execution is expected.

## Review Room Inspection Path

- Simulate reviewing Prompt Handoff, Scoped Runner, Git evidence, Scope Guard, Quality Gates, Readiness Summary, and Final Decision.
- Confirm no automatic approve/reject or auto fix is implied.

## Safety Audit Inspection Path

- Confirm safety boundaries are understandable.
- Confirm support does not request `auth.json`, `.env`, `.env.local`, tokens, passwords, or private keys.

## Backup / Restore Inspection Path

- Simulate Backup Now, Dry Run Restore, and Confirm Restore guidance.
- Confirm backup is SQLite-only and local-only.
- Confirm pre-restore safety backup is explained.

## Archive Inspection Path

- Confirm Archive Room dry-run behavior is clear.
- Confirm no real deletion, backup deletion, scheduled cleanup, daemon, or cloud archive is implied.

## Feedback Submission Simulation

- Fill sample feedback entries.
- Fill sample issue reports.
- Confirm all reports include environment, area, severity, priority, reproduction details, and safety/data impact.

## Issue Triage Simulation

- Apply Phase 20 issue severity / priority matrix.
- Group P0/P1/P2/P3 items.
- Flag safety/data escalation candidates.

## Regression Decision Simulation

- Apply Phase 20 regression decision matrix.
- Decide fix batch candidates, documentation-only candidates, known limitation candidates, and no-action candidates.

## Final Dry-Run Decision

Choose one:

```txt
READY_FOR_REAL_PRIVATE_BETA
READY_WITH_CAUTION
BLOCKED_NEEDS_FIX_BATCH
```

Record the Phase 22 recommendation for GM decision.
