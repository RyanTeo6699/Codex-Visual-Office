# Private Beta Simulated Tester Scenarios

## Purpose

These scenarios rehearse Private Beta Round 1 before real testers are invited. They are internal dry-run scenarios and do not claim real beta execution is complete.

| Scenario | Tester profile | Environment assumptions | Steps performed | Expected outcome | Expected friction | Likely feedback | Triage expectation | Real tester validation still required |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fresh local setup tester | Developer new to the repo | macOS, fresh clone, Node/npm installed, Codex CLI optional | Follow package checklist, install dependencies, initialize DB, run required verifiers, start app | Setup path is complete and routes load | Dependency install wording, local DB initialization order | "Checklist is long; clearer success markers needed" | medium / P2 docs clarification | Yes |
| Existing developer environment tester | Developer with existing clone | macOS, repo already cloned, prior `.local` data exists | Pull latest, verify status, run build/typecheck/verifiers, launch app | Existing local state does not block verification | Old `.local` records may confuse counts | "Need note that local verification data may grow" | low / P3 known limitation or docs | Yes |
| Codex CLI present but auth unknown tester | Codex CLI user | Codex CLI installed, auth status not verified | Inspect Settings, Review Room runner panel, Safety Audit | App shows CLI present but does not read token/auth files | Auth unknown label may confuse tester | "Does auth unknown mean broken?" | medium / P2 docs/UI wording candidate | Yes |
| Codex CLI missing tester | Tester without Codex CLI | No `codex` binary in PATH | Inspect Settings, Review Room, tester guide | Missing CLI is explained as limited runtime readiness, not app failure | Tester may expect automatic install | "Should the guide say install is manual?" | medium / P2 docs clarification | Yes |
| Missing approved project path tester | Local workflow tester | No approved project path configured | Open Project Room and Review Room runner status | Runner shows missing approved path and does not auto-run | Manual path setup may be unclear | "Where do I add the path?" | high / P1 if repeated; docs/UI guidance | Yes |
| Backup/restore cautious tester | Safety-focused tester | Local DB contains seed/test data | Review Backup Now, Dry Run Restore, Confirm Restore guidance | Tester understands SQLite-only backup and safety backup before restore | Restore language may feel risky | "Confirm Restore needs clearer warning" | medium / P2 docs/UI caution | Yes |
| UI/responsive reviewer | UI reviewer | Desktop and 390px mobile-ish viewport | Inspect `/`, `/settings`, `/safety`, `/archive`, project, review routes | No horizontal overflow or route crash | Dense Review Room may feel heavy | "Review Room needs hierarchy or summary anchors" | low/medium depending impact | Yes |
| Safety-conscious tester | Security/data reviewer | Reviews docs and surfaces, no secrets shared | Inspect Safety Audit, support runbook, feedback workflow, archive dry-run | Boundaries are visible; support does not request secrets | Need stronger redaction reminder in templates | "Add no-token reminder to every issue path" | high / P1 if missing from support flow; docs fix | Yes |

## Dry-Run Interpretation

The scenarios test process completeness and likely friction. They do not replace real tester validation, real environment spread, or real support load measurement.
