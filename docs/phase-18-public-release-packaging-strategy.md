# Phase 18 - Public Release Packaging Strategy

## What This Phase Implemented

Phase 18 created a release packaging and distribution strategy lock after the Production 1.0 local-first baseline.

It added documentation for:

- Phase 18 release packaging scope.
- Distribution options.
- Public beta readiness.
- Packaging risks.
- Code signing / notarization planning.
- Self-hosted delivery planning.
- Commercialization pre-scope.
- Release strategy verification.

No public release implementation was added.

## Distribution Option Summary

- Current ready path: source checkout plus local npm scripts.
- Current beta-ready fallback: browser-only local launcher.
- Possible next beta path: unsigned Mac-first Tauri beta with explicit warnings.
- Future production path: signed/notarized Mac package after a dedicated signing phase.
- Not-ready paths: Windows/Linux packages, commercial package, cloud/team SaaS, MCP / ChatGPT App.

## Beta Readiness Summary

Recommended decisions:

- `GO_FOR_PRIVATE_LOCAL_BETA`
- `GO_WITH_CAUTION_FOR_TECHNICAL_PUBLIC_BETA`
- `NO_GO_FOR_COMMERCIAL_PUBLIC_LAUNCH`

The current product can support technical beta users, but it is not ready for commercial public launch.

## Packaging Risk Summary

Primary risks:

- Unsigned app trust friction.
- No code signing or notarization.
- No auto updater.
- Tauri packaging remains beta/prototype.
- Localhost and browser launcher dependency.
- Codex CLI installation/auth uncertainty.
- Local DB backup/restore user mistakes.
- No telemetry or support policy.
- Platform-specific packaging variability.

## Signing / Notarization Planning Summary

A future macOS public package requires Apple Developer account, Developer ID certificate, hardened runtime review, notarization workflow, artifact verification, and clean release environment decisions.

Phase 18 does not add signing config, notarization scripts, credentials, or release build automation.

## Self-Hosted Delivery Summary

The safest near-term distribution path is a technical self-hosted package based on source checkout, setup guide, local DB verification, browser launcher fallback, backup/restore docs, Safety Audit docs, and Codex CLI prerequisite guidance.

## Commercialization Pre-Scope Summary

Commercialization remains future planning. Required future work includes license model, support policy, pricing, update policy, privacy/security statement, terms/disclaimers, and customer onboarding.

No payment, auth, license enforcement, SaaS backend, or team workspace was added.

## What Did Not Change

- No app behavior changed.
- No DB schema or migration changed.
- No dependencies changed.
- No lockfiles changed.
- No Codex runner behavior changed.
- No Quality Gate policy changed.
- No Backup / Restore behavior changed.
- No Archive cleanup behavior changed.
- No Tauri production packaging was added.
- No public release package was built.

## Recommended Phase 19

GM should choose one of:

```txt
Phase 19 - Private Local Beta Packaging Validation
Phase 19 - Mac Signing / Notarization Scope Lock
```

Recommended default: `Phase 19 - Private Local Beta Packaging Validation`.

Reason: validate real user setup, browser launcher fallback, unsigned Mac friction, backup/restore guidance, and support burden before investing in signing/notarization or commercial release.

## Explicit Phase Status

Phase 18 is complete as a strategy and scope-lock phase. Phase 19 has not started.
