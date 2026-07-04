# Final RC Validation Matrix

| Area | Check | Command / Method | Expected result | Pass/fail |
| --- | --- | --- | --- | --- |
| TypeScript | Static type check | `npm run typecheck` | Passes with no type errors. | TBD |
| Build | Next build | `npm run build` | Production build completes. | TBD |
| Production Scope | Scope and boundary verifier | `npm run production:verify:scope` | Required docs exist; forbidden production claims and scripts absent. | TBD |
| RC Stabilization | RC static verifier | `npm run rc:verify:stabilization` | Routes/docs/scripts/safety boundaries pass. | TBD |
| Docs | Documentation readiness | `npm run docs:verify:readiness` | Required docs and safety language present. | TBD |
| RC Readiness | Release candidate readiness | `npm run rc:verify:readiness` | Required routes/scripts and forbidden controls pass. | TBD |
| Desktop Beta | Desktop beta checks | `npm run desktop:verify:beta` | Desktop beta boundary remains candidate/prototype only. | TBD |
| Safety | Permission audit | `npm run safety:verify:permissions` | No dangerous controls or unsafe permission claims. | TBD |
| Agent Workflow | Agent workflow checks | `npm run agent:verify:workflow` | Agent workflow records and display remain valid. | TBD |
| Project Workspace | Workspace hardening | `npm run project:verify:workspace` | Approved path and workspace summaries remain valid. | TBD |
| UI | Virtual office UI | `npm run ui:verify:virtual-office` | Required visual office surfaces remain present. | TBD |
| Codex Runtime | Runtime reliability | `npm run codex:verify:runtime-reliability` | Runtime status is bounded and non-secret. | TBD |
| Launcher | Local launcher | `npm run local:launcher:verify` | Browser-only launcher remains status-only and local. | TBD |
| Local Shell | Local shell | `npm run local:shell:verify` | Local shell readiness remains bounded. | TBD |
| Tauri | Packaging prototype | `npm run tauri:verify:prototype` | Tauri remains prototype/candidate only. | TBD |
| Git Hygiene | Whitespace | `git diff --check` | No whitespace errors. | TBD |

## Manual Route QA

| Route | Expected result | Pass/fail |
| --- | --- | --- |
| `/` | Loads Office Home. | TBD |
| `/settings` | Loads Settings; no production install, cloud, token, or terminal controls. | TBD |
| `/safety` | Loads Safety Audit Room. | TBD |
| `/archive` | Loads Archive Room; dry-run only remains visible. | TBD |
| `/projects/provider-workspace` | Loads Project Room. | TBD |
| `/review/task-provider-review` | Loads Review Room 2.0 / Agent Workflow. | TBD |

## Responsive QA

| Viewport | Expected result | Pass/fail |
| --- | --- | --- |
| Desktop width | No horizontal overflow; critical cards visible. | TBD |
| 390px mobile-ish width | No horizontal overflow; navigation and cards wrap. | TBD |

## Safety QA

| Boundary | Expected result | Pass/fail |
| --- | --- | --- |
| Dangerous command UI | No arbitrary shell, command text box, terminal emulator, or node-pty surface. | TBD |
| Auto actions | No auto Codex, Git mutation, Quality Gate execution, commit, push, deploy, or fix. | TBD |
| Token/env/auth | No token storage, no `~/.codex/auth.json` read, no `.env` / `.env.local` read. | TBD |
| Cloud/external | No GitHub API, Vercel, Supabase, cloud sync, auth, payment, team, MCP, ChatGPT App, or OpenAI API. | TBD |

## Backup / Restore QA

| Check | Expected result | Pass/fail |
| --- | --- | --- |
| Backup target | Only `.local/codex-visual-office.sqlite` is backed up. | TBD |
| Restore dry-run | Does not overwrite current DB. | TBD |
| Confirm restore | Requires confirmation and creates safety backup first. | TBD |
| Exclusions | Does not back up source, home directory, tokens, `.env`, or Codex auth. | TBD |

## Archive QA

| Check | Expected result | Pass/fail |
| --- | --- | --- |
| Retention preview | Dry-run only. | TBD |
| Cleanup | No real deletion in current candidate. | TBD |
| Backup files | Backup files are not deleted. | TBD |

## Documentation QA

| Check | Expected result | Pass/fail |
| --- | --- | --- |
| Capability inventory | Current capabilities and non-capabilities are explicit. | TBD |
| Production boundary | Release boundary and non-release status are explicit. | TBD |
| Risk register | Known risks and mitigations are documented. | TBD |
| Go / No-Go | GM decision options are documented. | TBD |
