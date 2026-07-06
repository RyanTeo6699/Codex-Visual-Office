# Private Beta Phase 30 Decision Gate

## Purpose

Define the decision options after Phase 29 external tester intake is ready. Phase 30 has not started.

## Required Evidence To Move Forward

- External tester onboarding records.
- External tester consent / safety acknowledgment records.
- External tester feedback entries, if any.
- External issue intake entries, if any.
- Sensitive-data checks for every feedback item.
- Clear distinction between `external_real_tester`, `gm_local_validation`, `support_observation`, `simulated_reference`, and `placeholder`.

## External Tester Submission Threshold

The preferred threshold for considering public technical beta scope is multiple real external tester submissions with:

- Setup outcome recorded.
- Launch outcome recorded.
- Feedback submitted or explicit no-issue report recorded.
- Sensitive data checked.

If no external tester submissions exist, the recommended decision must be:

```txt
CONTINUE_EXTERNAL_TESTER_INTAKE
```

## Safety / Data Incident Threshold

Any confirmed data loss, credential exposure, destructive cleanup, backup deletion, token exposure, private key exposure, or unsafe command execution should block public beta consideration and move to a fix or safety response path.

## P0 / P1 Threshold

- Any P0 issue blocks public technical beta scope.
- Any unresolved P1 setup or launch blocker should move to a fix batch or continue external tester intake.
- P2 / P3 issues may become fix batch candidates depending on frequency and impact.

## Decision Options

```txt
CONTINUE_EXTERNAL_TESTER_INTAKE
GO_TO_PRIVATE_BETA_FIX_BATCH_2
GO_TO_PUBLIC_TECHNICAL_BETA_SCOPE
BLOCKED_NO_EXTERNAL_TESTERS
```

## Current Recommended Decision

Because no external tester submissions have been recorded yet, the current recommendation is:

```txt
CONTINUE_EXTERNAL_TESTER_INTAKE
```

## Boundary

This gate does not implement Phase 30. It does not approve public release, commercial launch, signing, notarization, auto updater, cloud sync, GitHub API, Vercel, Supabase, auth/payment/team/MCP, OpenAI API, or production deploy.
