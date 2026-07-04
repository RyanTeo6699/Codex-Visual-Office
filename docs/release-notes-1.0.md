# Codex Visual Office 1.0 Local-First Baseline - Release Notes

## Release Name

Codex Visual Office 1.0 Local-First Baseline

## Release Status

Local-first production baseline / desktop beta candidate with noted limitations.

This is not a public commercial launch, not a signed or notarized desktop installer, and not an auto-updating production distribution.

## Major Capabilities

- Virtual Office UI: visual project rooms, Codex seats, task boards, event streams, and review surfaces.
- Local SQLite state: local-first persistence for workflow records.
- Project Workspace: project status, approved path status, and local workspace health summaries.
- Codex Runtime Reliability: safe CLI detection, coarse runtime status, and failure classification.
- Scoped Codex Runner: confirmation-gated scoped runner surface with bounded output previews.
- Agent Workflow 2.0: local workflow summaries, prompt/run history, and agent visual state.
- Review Room 2.0: acceptance desk with task brief, prompt handoff, runner status, Git evidence, Scope Guard, Quality Gates, final decision, and timeline.
- Git/File/Diff Observation: read-only snapshots, changed file metadata, and bounded diff statistics.
- Scope Guard: path-level forbidden scope checking.
- Quality Gates: allowlisted command model, bounded output, redaction, and results summary.
- Settings Center: local status, Codex status, local DB status, approved paths, backup/archive links, and safety boundaries.
- Approved Project Paths: manual local path approval records.
- Backup / Restore: local SQLite backup, dry-run restore, safety backup, checksum metadata.
- Archive Room: local record summaries and dry-run-only retention preview.
- Safety Audit Room: visible permission and safety boundary audit.
- Local Launcher: browser-only local launcher/status helper.
- Tauri Desktop Beta Candidate: prototype/candidate desktop shell posture only.
- Documentation / QA: user, developer, setup, troubleshooting, recovery, safety, RC, production scope, and release freeze docs.

## Explicit Exclusions

- No cloud sync.
- No team workspace.
- No MCP / ChatGPT App.
- No auth/payment.
- No signed or notarized installer.
- No auto updater.
- No source indexing.
- No semantic code review.
- No automatic Git/Codex/Quality execution.
- No production installer distribution.
- No GitHub, Vercel, Supabase, or OpenAI API integration.
- No arbitrary shell, command text box, terminal emulator, or node-pty.
- No destructive cleanup or backup file deletion.

## Upgrade / Operation Notes

- The app remains local-first and uses `.local/codex-visual-office.sqlite`.
- Local backups remain under `.local/backups/`.
- Browser launcher fallback remains the safest baseline.
- Tauri is a beta candidate/prototype posture, not a signed production installer.
- Users should keep backups before restore operations.
