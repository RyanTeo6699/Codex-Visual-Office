# Desktop App User Surface vs Diagnostics Boundary

## Purpose

This table defines where current and future information should live in a mature desktop version of Codex Visual Office.

| Information / feature | Current location | Future location | Audience | Should appear in Main App? | Should appear in Settings? | Should appear in Developer Diagnostics? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| projects | Office Home, Project Room | Main App | users | yes | no | summary only | Core product object. |
| AI employees / Codex agent | Office Home, Project Room, Review Room | Main App | users | yes | no | status summary only | Should feel like office staff, not CLI internals. |
| tasks | Office Home, Project Room, Review Room | Main App | users | yes | no | summary only | Core workflow state. |
| review | Review Room | Main App | users | yes | no | summary only | Human decision remains primary. |
| quality status | Review Room, Project Room | Main App summary, Diagnostics detail | users, contributors | yes, as summary | defaults only | yes, for runner details | Main App shows status, Diagnostics shows evidence. |
| Codex runtime | Settings, Review Room | Settings summary, Diagnostics detail | users, contributors | only concise runner status | yes, summary | yes | Detailed CLI/runtime facts should not dominate user flow. |
| approved paths | Settings, Project Room, Review Room | Settings and Project Room | users | project status only | yes | audit summary only | User-controlled local trust boundary. |
| backup | Settings | Settings | users | no | yes | records/details only | Backup remains local SQLite only. |
| safety | Safety Audit Room | Settings summary, Developer Diagnostics detail | users, contributors | no | summary only | yes | Full audit belongs outside normal workflow. |
| archive | Archive Room | Settings entry, optional secondary Main App | users, contributors | optional | entry/status | yes | Archive is useful but not daily primary work. |
| beta ops | Beta Ops Room | Developer / Release Ops | GM, maintainers | no | no | yes | Not a normal user app surface. |
| release ops | docs, release status | About / Developer Diagnostics | GM, maintainers | no | no | yes | Do not expose as normal workflow. |
| verifier scripts | package scripts, docs | Developer Diagnostics | contributors | no | no | yes | Static verification evidence only. |
| npm scripts | package.json, docs | Developer Diagnostics / Contributing docs | contributors | no | no | yes | Never make this an end-user workflow. |
| localhost | launcher/runtime docs | Developer Diagnostics | contributors, support | no | no | yes | Browser/localhost is fallback, not intended user path. |
| Tauri prototype | Settings, Safety, docs | Developer Diagnostics / About limitations | contributors | no | no | yes | Keep internals out of normal UI. |
| DB diagnostics | verifiers, archive/settings summaries | Developer Diagnostics | contributors, support | no | no | yes | Settings may show DB path only. |
| phase documents | docs | About docs / Developer Diagnostics | GM, maintainers | no | no | yes | Not part of normal user product. |
| roadmap | docs | About / Project docs | users, GM, contributors | no | no | optional | Product roadmap belongs in docs, not task UI. |
| logs | archive, verifiers | Developer Diagnostics | contributors, support | no | no | yes | Must remain bounded and non-sensitive. |
| developer diagnostics | Safety/Settings/various | Developer Diagnostics | contributors, support | no | link only | yes | Separate from Main App. |

## Boundary Summary

Main App should answer: what work is happening and what should I review?

Settings should answer: what local configuration can I control?

Developer Diagnostics should answer: what is the system doing internally and what boundaries are verified?

About / Open Source should answer: what is this product, what version is it, what does it exclude, and how can contributors help?
