# Code Signing / Notarization Plan

## Purpose

This document describes what future macOS signing and notarization would require. It is planning-only.

## Requirements For Future macOS Public Distribution

- Apple Developer account.
- Developer ID Application certificate.
- Secure certificate storage and access policy.
- Hardened runtime review.
- Entitlements review.
- Release artifact build process.
- Notarization submission workflow.
- Stapling and verification workflow.
- Artifact checksum and provenance record.
- Installer or app bundle distribution policy.

## Notarization Workflow Concept

1. Build release artifact in a clean release environment.
2. Sign the app with Developer ID Application certificate.
3. Verify code signature locally.
4. Submit artifact to Apple notarization service.
5. Wait for notarization result.
6. Staple notarization ticket to artifact when applicable.
7. Verify Gatekeeper acceptance on a clean machine.
8. Publish checksum and release notes.

## Hardened Runtime Considerations

- Confirm required entitlements are minimal.
- Avoid broad filesystem access.
- Preserve no token storage and no `~/.codex/auth.json` reads.
- Preserve no arbitrary shell and no terminal emulator.
- Preserve no auto updater until a separately approved updater phase.

## Artifact Verification

Future release artifacts should be checked for:

- Expected version and bundle identifier.
- Code signature validity.
- Notarization status.
- Checksum match.
- Absence of secrets and local DB files.
- Absence of unsupported auto updater or cloud capabilities.

## Why Not Implemented In Phase 18

Phase 18 is only a distribution strategy scope lock. It does not add signing configuration, notarization scripts, Apple credentials, environment variables, release package builds, or production distribution workflows.

## Recommended Future Phase

If GM chooses a Mac public beta path, create:

```txt
Phase 19 - Mac Signing / Notarization Scope Lock
```

That phase should decide credentials, build environment, artifact verification, support policy, and whether unsigned beta validation should happen first.
