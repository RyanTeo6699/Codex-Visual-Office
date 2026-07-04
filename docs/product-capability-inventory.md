# Product Capability Inventory

This inventory supports the Codex Visual Office 1.0 local-first baseline capability set. Status values are stable, beta, prototype, planned, or not implemented.

| Area | Capability | Current status | Evidence / source | Notes / limitations |
| --- | --- | --- | --- | --- |
| Local DB | SQLite local persistence | beta | `lib/local-db/*`, `npm run db:verify` | Local-only `.local/codex-visual-office.sqlite`; no cloud sync. |
| Tasks / Reviews | Task, review, event persistence | beta | `scripts/verify-local-operations.ts`, `scripts/verify-review-persistence.ts` | Supports local workflow records; not a team permission system. |
| Codex Runtime | Codex CLI detection | beta | `scripts/verify-codex-cli-detection.ts` | Detects CLI path/version only; auth remains coarse and unknown. |
| Codex Runtime | Codex runtime reliability | beta | `scripts/verify-codex-runtime-reliability.ts` | Reliability classification is local and bounded. |
| Codex Runtime | Scoped runner | beta | `lib/codex-cli/scoped-runner.ts`, `scripts/verify-scoped-codex-runner.ts` | Confirmation-gated; no arbitrary shell, auto commit, push, or deploy. |
| Git Observation | Git snapshots | beta | `scripts/verify-git-snapshots.ts` | Read-only Git status/branch/head snapshot. |
| Git Observation | Changed files | beta | `scripts/verify-changed-files.ts` | Path/status level only. |
| Git Observation | Diff summary | beta | `scripts/verify-diff-summary.ts` | Bounded stat/numstat summary; no full diff viewer. |
| Scope Guard | Path-level forbidden scope guard | beta | `scripts/verify-scope-check.ts` | Path/pattern only; not semantic review or security audit. |
| Quality Gates | Allowlisted quality gate config/runner | beta | `scripts/verify-quality-gate-config.ts`, `scripts/verify-quality-gate-runner.ts` | Only allowlisted commands; bounded and redacted output preview. |
| Review Room | Review Room 2.0 acceptance desk | beta | `app/review/[taskId]/page.tsx`, `components/review/*` | Human decision remains manual. |
| Settings | Settings Center | beta | `app/settings/page.tsx`, `scripts/verify-local-settings.ts` | Local settings only; no token storage. |
| Project Paths | Approved Project Paths | beta | `scripts/verify-approved-project-paths.ts` | Manual path entry only; no folder picker or full disk scan. |
| Backup / Restore | Local SQLite backup and restore | beta | `scripts/verify-local-backup-restore.ts` | Backs up only local SQLite DB; no source, env, token, or remote backup. |
| Archive | Archive Room and retention preview | beta | `app/archive/page.tsx`, `scripts/verify-archive-retention.ts` | Dry-run preview only; no real cleanup. |
| Safety | Safety Audit Room | beta | `app/safety/page.tsx`, `scripts/verify-safety-permissions.ts` | Permission/boundary visibility only. |
| Agent Workflow | Codex Agent Workflow 2.0 | beta | `scripts/verify-agent-workflow.ts` | Local visualization and records; not a multi-user orchestration service. |
| Project Workspace | Real Project Workspace hardening | beta | `scripts/verify-project-workspace.ts` | Approved-path based; no source indexing. |
| Local Launcher | Browser-only local launcher | beta | `scripts/local-launcher.ts`, `scripts/verify-local-launcher.ts` | Requires app runtime; no installer. |
| Desktop Shell | Tauri Desktop Beta Candidate | prototype | `src-tauri/*`, `scripts/verify-tauri-prototype.ts` | Prototype/candidate only; not signed, notarized, or production packaged. |
| Documentation | User/developer/QA docs | stable | `docs/user-manual.md`, `docs/developer-manual.md`, `docs/release-candidate-qa-checklist.md` | Production release docs remain scope-lock only. |
| Cloud | Cloud sync | not implemented | Phase 17 release freeze boundary | Explicitly out of scope. |
| Collaboration | Team workspace | not implemented | Phase 17 release freeze boundary | No team permissions or shared workspace model. |
| Platform | MCP / ChatGPT App | not implemented | Phase 17 release freeze boundary | No MCP server or ChatGPT App integration. |
| Accounts | Auth/payment | not implemented | Phase 17 release freeze boundary | No login, billing, or payment. |
| Distribution | Production signed installer | not implemented | Phase 17 release freeze boundary | No signed installer, notarization, auto updater, or public production release. |
| Distribution | Auto updater | not implemented | Phase 17 release freeze boundary | Explicitly out of scope. |

## Explicit Non-Capabilities

- Cloud sync = not implemented.
- Team workspace = not implemented.
- MCP / ChatGPT App = not implemented.
- Auth/payment = not implemented.
- Production signed installer = not implemented.
- Auto updater = not implemented.
