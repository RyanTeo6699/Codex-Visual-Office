# Risk Register

| Risk | Severity | Area | Current mitigation | Remaining limitation | Release impact | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- |
| Codex CLI auth unknown | medium | Codex Runtime | CLI detection reports coarse auth status only. | Does not verify private auth material. | caution | Keep auth status coarse; document setup steps. |
| Tauri not signed/notarized | high | Desktop Shell | Tauri is marked beta/prototype/candidate only. | macOS trust prompts and distribution friction remain. | caution | Plan signing/notarization only in a later GM-approved phase. |
| No production installer | high | Distribution | Browser launcher remains official fallback. | Users must run local app/runtime manually. | caution | Create installer release plan before Production 1.0 finalization. |
| Local DB corruption | medium | Data | Backup / Restore exists for SQLite DB. | No automated corruption recovery or remote replica. | caution | Add DB health checks and restore rehearsal checklist. |
| User restore mistakes | medium | Backup / Restore | Dry-run restore and pre-restore safety backup. | User may restore an unintended backup. | caution | Improve restore labeling and confirmation copy. |
| No cloud sync | low | Sync | Explicit local-first boundary. | No cross-device state. | acceptable | Keep out of Production 1.0 candidate unless GM expands scope. |
| No team permissions | low | Collaboration | No auth/team model exists. | Single-local-user workflow only. | acceptable | Defer to future collaboration phase. |
| No source indexing | medium | Project Workspace | Approved path model avoids full scans. | Cannot provide code search or semantic project context. | acceptable | Plan explicit opt-in indexing separately. |
| No full diff viewer | medium | Git Observation | Bounded diff stats and changed paths exist. | User cannot inspect full patch in app. | acceptable | Consider opt-in viewer in future with content safety boundaries. |
| No semantic code review | medium | Review | Scope Guard is path-level only; Quality Gates are command-based. | Does not judge business correctness or security semantics. | caution | Keep human review central; consider future AI review only with GM approval. |
| Backup storage growth | low | Backup | Backups stored under `.local/backups/` and ignored by Git. | No automatic cleanup. | acceptable | Add explicit retention with confirmation in future. |
| Archive dry-run only | low | Archive | Retention preview is dry-run only. | No actual archive cleanup. | acceptable | Keep non-destructive for RC; add explicit cleanup later if approved. |
| Manual approved path setup | medium | Project Import | Manual input only; sensitive path strings rejected. | No folder picker or validation. | caution | Add safe picker later only after desktop permissions are finalized. |
| Localhost app must be running | medium | Local Launcher | Launcher reports status and local URL. | Browser launcher cannot start every environment by itself. | caution | Improve local startup docs and launcher checks. |
| Browser launcher fallback dependency | low | Local Launcher | Browser-only launcher is documented as fallback. | Requires local browser and app runtime. | acceptable | Keep fallback while desktop packaging is not production-ready. |
| Current beta UI limitations | medium | UI | Phase 15 fixed copy/responsive issues. | Some screens still feel beta-grade. | caution | Continue focused UI bug bash before final Production 1.0 freeze. |
