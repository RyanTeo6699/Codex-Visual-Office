# Private Beta Sample Issue Reports

These reports are simulated dry-run examples. They are not real tester reports and do not create remote issues.

## ISSUE-001 - Setup Failure

- Summary: Fresh setup tester cannot tell whether DB seed succeeded.
- Environment: macOS, fresh clone, Node/npm installed.
- Steps: Follow package checklist through DB init/seed/verify.
- Expected: Clear success marker and next command.
- Actual: Tester sees counts but is unsure whether they are expected.
- Severity: medium.
- Priority: P2.
- Safety/data impact: none.
- Recommended disposition: documentation clarification.

## ISSUE-002 - Local Launcher Confusion

- Summary: Tester thinks `localhost:3000` might be a hosted preview.
- Environment: macOS, browser local route.
- Steps: Run local launcher guidance and open app.
- Expected: Local-only browser launch is obvious.
- Actual: Tester asks whether data leaves machine.
- Severity: low.
- Priority: P3.
- Safety/data impact: none if clarified.
- Recommended disposition: documentation clarification.

## ISSUE-003 - Codex CLI Not Detected

- Summary: Tester without Codex CLI sees missing runtime and thinks app setup failed.
- Environment: macOS, Codex CLI absent.
- Steps: Open Settings and Review Room.
- Expected: Missing CLI is explained as optional/limited runtime state.
- Actual: Tester reports blocker.
- Severity: medium.
- Priority: P2.
- Safety/data impact: none.
- Recommended disposition: docs/support runbook clarification.

## ISSUE-004 - Approved Path Missing

- Summary: Scoped Runner shows missing approved path and tester does not know how to proceed.
- Environment: Existing clone, approved path not configured.
- Steps: Open Review Room and inspect runner.
- Expected: Clear path to Settings approved path configuration.
- Actual: Tester stops at runner status.
- Severity: high.
- Priority: P1.
- Safety/data impact: none.
- Recommended disposition: Phase 22 fix candidate if repeated.

## ISSUE-005 - Backup Dry-Run Misunderstanding

- Summary: Tester believes Dry Run Restore might overwrite the current DB.
- Environment: Local DB with backup records.
- Steps: Open Settings Backup / Restore area.
- Expected: Dry-run clearly says it only checks and does not overwrite.
- Actual: Tester avoids testing restore guidance.
- Severity: medium.
- Priority: P2.
- Safety/data impact: local DB overwrite concern.
- Recommended disposition: documentation/UI caution candidate.

## ISSUE-006 - Review Room Too Dense

- Summary: Review Room contains all required evidence but feels dense.
- Environment: Desktop browser.
- Steps: Open `/review/task-provider-review`.
- Expected: Readiness and final decision area guide review.
- Actual: Tester scrolls repeatedly and misses evidence grouping.
- Severity: low.
- Priority: P3.
- Safety/data impact: none.
- Recommended disposition: known limitation or later UI polish.

## ISSUE-007 - Safety Page Terminology Confusion

- Summary: Tester does not understand "auth unknown" versus "auth checked".
- Environment: Codex CLI present, auth not verified.
- Steps: Open Safety and Settings.
- Expected: Auth status wording is clear and reassuring.
- Actual: Tester asks whether the app read auth files.
- Severity: medium.
- Priority: P2.
- Safety/data impact: possible trust concern.
- Recommended disposition: documentation clarification.

## ISSUE-008 - Mobile Layout Caution

- Summary: 390px layout works but Review Room sections feel long.
- Environment: Mobile-ish browser width.
- Steps: Inspect required routes at 390px.
- Expected: No horizontal overflow, core content readable.
- Actual: No route failure; density remains high.
- Severity: cosmetic.
- Priority: P3.
- Safety/data impact: none.
- Recommended disposition: known limitation.

## ISSUE-009 - Safety Redaction Reminder Missing

- Summary: Simulated tester attempts to paste token-like text into feedback.
- Environment: Feedback template workflow.
- Steps: Fill issue report template.
- Expected: Template warns not to share tokens or auth files.
- Actual: Reminder exists but should be more prominent in triage/support handoff.
- Severity: blocker.
- Priority: P0.
- Safety/data impact: potential credential exposure.
- Recommended disposition: Phase 22 fix candidate before real beta if template reminders are insufficient.
