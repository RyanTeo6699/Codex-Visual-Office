# Private Beta Issue Severity / Priority Matrix

## Severity Levels

| Severity | Definition | Examples | Required action | Release impact |
| --- | --- | --- | --- | --- |
| blocker | Prevents safe setup, launch, core route access, or violates a safety/data boundary. | App cannot start for most testers; data loss; token exposure; automatic Git mutation; backup deleted unexpectedly. | Immediate triage, reproduce, assign owner, consider stopping round. | Blocks public beta and commercial release; usually enters next fix batch. |
| high | Breaks a major workflow for a meaningful tester segment but does not expose secrets or destroy data. | Review Room route crash; approved path flow unusable; backup dry-run misleading; Codex runtime status unusable. | Prioritize for Phase 21 unless clearly environment-specific. | Blocks public beta if common; may continue private beta with caution. |
| medium | Workflow works with workaround, but confusion or failure is likely. | Setup docs missing step; quality gate result unclear; responsive layout awkward; archive copy confusing. | Add to fix batch or documentation update. | Does not block private beta; may block wider beta if repeated. |
| low | Minor issue that does not stop evaluation. | Label inconsistency; slow non-critical page; minor wording issue. | Track and batch when convenient. | Known limitation or polish item. |
| cosmetic | Visual or copy polish with no workflow impact. | Alignment issue; spacing issue; typo. | Track as polish. | Does not block release unless pervasive. |

## Priority Levels

| Priority | Definition | Typical target |
| --- | --- | --- |
| P0 | Must address before continuing or expanding beta. | Safety/data breach, setup blocker, destructive behavior. |
| P1 | Should address in next fix batch. | Major workflow failure or repeated confusion. |
| P2 | Address after P0/P1, before public beta if repeated. | Medium usability or documentation issues. |
| P3 | Backlog or polish. | Low/cosmetic issues. |

## Categories

- setup
- launcher
- Codex runtime
- approved path
- runner safety
- review workflow
- quality gates
- backup/restore
- archive
- safety
- UI/responsive
- documentation

## Category Handling Strategy

| Category | Handling strategy |
| --- | --- |
| setup | Capture exact step, environment, and command output. Avoid requesting secrets. |
| launcher | Confirm browser-only launcher expectation; do not imply signed installer or auto updater. |
| Codex runtime | Separate detection/status confusion from actual execution defects. |
| approved path | Confirm manual path input only; no folder picker or scan expectation in Phase 20. |
| runner safety | Escalate if tester reports unexpected execution, Git mutation, or command input. |
| review workflow | Check route, readiness summary, decision persistence, and activity timeline clarity. |
| quality gates | Confirm only allowlisted commands run and output remains bounded/redacted. |
| backup/restore | Escalate if restore safety backup fails or tester fears overwrite. |
| archive | Confirm dry-run-only; any real deletion report is blocker. |
| safety | Treat token, env, destructive, or auto-execution concerns as P0/P1. |
| UI/responsive | Capture route, viewport, screenshot if safe, and overflow/console state. |
| documentation | Deduplicate repeated confusion and convert to docs fix candidates. |
