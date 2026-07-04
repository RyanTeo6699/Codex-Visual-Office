# Public Beta Readiness Assessment

## Current Readiness Summary

Codex Visual Office is ready as a local-first technical baseline with noted limitations. It is suitable for controlled local beta use by technical users who understand local setup, Codex CLI prerequisites, unsigned app limitations, and local data ownership.

It is not ready for public commercial launch.

## Ready For Technical Beta

- Local-first SQLite workflow persistence.
- Review Room 2.0.
- Codex CLI detection and scoped runner safety surfaces.
- Runtime reliability classification.
- Read-only Git/file/diff observation.
- Path-level Scope Guard.
- Allowlisted Quality Gates.
- Settings Center.
- Approved project paths.
- Local backup/restore for the app SQLite DB.
- Archive Room with dry-run retention preview.
- Safety Audit Room.
- Browser-only launcher fallback.
- Tauri packaging prototype / desktop beta candidate posture.

## Blocks Public Commercial Release

- No signed installer.
- No notarization.
- No auto updater.
- Tauri remains prototype / beta candidate.
- Codex CLI auth status is coarse and may be unknown.
- Setup requires technical familiarity.
- No support policy.
- No license model.
- No privacy/security statement for public distribution.
- No commercial terms or pricing.
- No telemetry or crash reporting.
- No cloud sync or team workspace.

## Acceptable Cautions For Technical Public Beta

- Source checkout or browser launcher fallback can be acceptable for technical users.
- Unsigned Mac-first beta can be considered only with clear trust and Gatekeeper disclaimers.
- Local SQLite ownership is acceptable if backup/restore limitations are clearly explained.
- Scope Guard and Quality Gates are advisory, not semantic review or correctness proof.

## Required Disclaimers

- Local-first beta; data stays local unless the user independently moves it.
- Not a public commercial launch.
- Not a signed or notarized installer.
- No auto updater.
- No cloud sync.
- No auth, payment, team workspace, MCP, or ChatGPT App.
- Codex CLI must be installed and authenticated by the user outside this app.
- Backup/restore covers the app SQLite DB only, not source projects or credentials.

## Recommended Beta Audience

- Founder / technical operator testing local Codex workflows.
- Developers comfortable with local Node setup.
- Internal design partners who can tolerate unsigned beta friction.
- Teams evaluating workflow shape before requesting cloud/team features.

## Non-Goals

- Public commercial launch.
- Consumer-grade installer experience.
- Signed/notarized release.
- Auto-updating desktop app.
- Hosted SaaS.
- Team collaboration.
- License enforcement.
- Payment or auth.

## Go / No-Go Recommendation

| Decision | Result | Rationale |
| --- | --- | --- |
| Private local beta | `GO_FOR_PRIVATE_LOCAL_BETA` | Current baseline is strong enough for controlled technical users. |
| Technical public beta | `GO_WITH_CAUTION_FOR_TECHNICAL_PUBLIC_BETA` | Possible only with explicit local-first, unsigned, and setup disclaimers. |
| Commercial public launch | `NO_GO_FOR_COMMERCIAL_PUBLIC_LAUNCH` | Installer, signing, support, license, privacy, and update policy are not ready. |
