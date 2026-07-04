# Known Limitations - Codex Visual Office 1.0 Local-First Baseline

| Limitation | Impact | Mitigation | Future phase recommendation |
| --- | --- | --- | --- |
| Codex CLI auth remains safety-checked but token is not read | CLI may be installed while auth usability is unknown. | Keep auth status coarse and require user-managed CLI setup. | Future runtime diagnostics without reading credentials. |
| No cloud sync | No cross-device or remote backup sync. | Local-first operation and local SQLite backup. | Cloud/team scope lock only if GM approves. |
| No team workspace | Single-local-user workflow only. | Keep local project/review records explicit. | Team workspace phase with auth/permissions design. |
| No MCP / ChatGPT App | ChatGPT cannot query or operate the office through MCP/App integration. | Use local UI and docs. | Separate MCP/ChatGPT App scope lock. |
| No auth/payment | No account, billing, or commercial entitlement system. | Local app remains accountless. | Commercialization scope lock if needed. |
| No signed/notarized installer | Desktop distribution may hit OS trust friction. | Browser launcher fallback and Tauri prototype docs. | Public release packaging scope lock. |
| No auto updater | Users must update manually from repo/builds. | Keep release status clear. | Updater strategy only after signing/release plan. |
| Tauri is beta candidate / prototype scope | Desktop shell is not production packaged. | Keep Tauri verification prototype-only. | Production desktop packaging phase. |
| Browser launcher requires app/server availability | App must be running locally for browser use. | `npm run dev`, local launcher status, setup docs. | Local runtime packaging evaluation. |
| Backup is local SQLite only | Source files, env files, tokens, and home directory are not backed up. | Only backup `.local/codex-visual-office.sqlite`. | Optional export strategy with explicit scope. |
| Archive cleanup is dry-run only | Records and backups are not automatically pruned. | Dry-run preview avoids data loss. | Explicit cleanup with confirmation after GM approval. |
| No source indexing | App does not understand full project source tree. | Approved path records only; no scanning. | Opt-in indexing scope lock. |
| No full patch viewer | Review evidence is changed paths and bounded stats, not full patch. | Use external Git tools for patch inspection. | Safe full diff viewer design if approved. |
| No semantic code review | App does not judge code correctness or security semantics. | Human review, Scope Guard, and Quality Gates. | AI review requires separate safety and data boundary design. |
| No automatic project discovery | Users manually configure approved paths. | Settings Center path records. | Folder picker/import flow after permission review. |
| Approved path setup is manual | Mis-typed paths can reduce usability. | String-level validation and project room status. | Safer desktop path picker in future. |
| Local DB backup/restore requires care | Wrong restore choice can replace local state. | Dry-run restore and pre-restore safety backup. | Better restore UX and restore rehearsal docs. |
