# Final Verification Manifest - Codex Visual Office 1.0 Local-First Baseline

| Verification area | Script / manual check | Expected result | Last result | Notes |
| --- | --- | --- | --- | --- |
| Typecheck | `npm run typecheck` | Pass | To be recorded in final report | No TypeScript errors. |
| Build | `npm run build` | Pass | To be recorded in final report | Next.js build completes. |
| Production freeze | `npm run production:verify:freeze` | Pass | To be recorded in final report | Release docs and forbidden release surfaces checked. |
| Production scope | `npm run production:verify:scope` | Pass | To be recorded in final report | Phase 16 boundary remains valid. |
| RC stabilization | `npm run rc:verify:stabilization` | Pass | To be recorded in final report | Static RC stabilization checks pass. |
| Docs readiness | `npm run docs:verify:readiness` | Pass | To be recorded in final report | Required docs and boundary language present. |
| RC readiness | `npm run rc:verify:readiness` | Pass | To be recorded in final report | Routes, scripts, and forbidden controls pass. |
| DB verification | `npm run db:verify` and DB operation scripts | Pass | To be recorded in final report | Local SQLite records read correctly. |
| Codex verification | `npm run codex:verify:*` | Pass | To be recorded in final report | Detection, prompt handoff, safety, scoped runner, output, runtime reliability. |
| Runtime reliability | `npm run codex:verify:runtime-reliability` | Pass | To be recorded in final report | No token reads or unsafe execution. |
| Git observation | `npm run git:verify:*` | Pass | To be recorded in final report | Read-only snapshots, changed files, diff summary, scope check. |
| Quality gates | `npm run quality:verify:*` | Pass | To be recorded in final report | Allowlisted only; no arbitrary command. |
| Review readiness | `npm run review:verify:readiness` | Pass | To be recorded in final report | Advisory readiness rules remain valid. |
| Settings | `npm run settings:verify` and `npm run settings:verify:project-paths` | Pass | To be recorded in final report | Local settings and approved path records valid. |
| Project workspace | `npm run project:verify:workspace` | Pass | To be recorded in final report | Workspace summary remains local and bounded. |
| Agent workflow | `npm run agent:verify:workflow` | Pass | To be recorded in final report | Agent workflow summaries remain local. |
| Safety permissions | `npm run safety:verify:permissions` | Pass | To be recorded in final report | Forbidden permissions remain blocked. |
| Desktop beta | `npm run desktop:verify:beta` | Pass | To be recorded in final report | Desktop remains beta/candidate, not production installer. |
| Launcher | `npm run local:launcher:verify` and `npm run local:shell:verify` | Pass | To be recorded in final report | Local launcher/shell remain status-only bounded. |
| Tauri prototype | `npm run tauri:verify:prototype` | Pass | To be recorded in final report | No signing/notarization/updater/installer. |
| Browser route checks | Manual browser QA | Pass | To be recorded in final report | `/`, `/settings`, `/safety`, `/archive`, `/projects/provider-workspace`, `/review/task-provider-review`. |
| Responsive checks | Manual 1280px and 390px | Pass | To be recorded in final report | No horizontal overflow. |
| Forbidden controls checks | Manual DOM/control check | Pass | To be recorded in final report | No production install/cloud/token/terminal/destructive controls. |
| Final git status | `git status` | Clean | To be recorded in final report | Final commit and push result are recorded in the closeout report. |
| Whitespace | `git diff --check` | Pass | To be recorded in final report | No whitespace errors. |
