# Private Beta Sample Feedback Entries

These entries are simulated dry-run examples. They are not real tester feedback.

| ID | Scenario | Feedback | Area | Severity | Priority | Safety/data impact | Suggested handling |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SFB-001 | Fresh local setup tester | The checklist has all commands, but success markers after DB seed and verification could be clearer. | setup | medium | P2 | none | Documentation clarification. |
| SFB-002 | Codex CLI present but auth unknown tester | "CLI available auth not verified" looks like an error even though the app still works. | Codex runtime | medium | P2 | none | Docs/UI wording candidate for Phase 22. |
| SFB-003 | Missing approved project path tester | Tester reaches Review Room runner and does not know where to approve a local path. | approved path | high | P1 | none | Add clearer Settings link/copy in future fix batch if repeated. |
| SFB-004 | Fresh local setup tester | `localhost:3000` wording should explain that the app is local and not a hosted service. | launcher | low | P3 | none | Documentation clarification. |
| SFB-005 | Backup/restore cautious tester | Confirm Restore feels risky; tester wants stronger reminder that safety backup is created first. | backup/restore | medium | P2 | possible local DB overwrite concern | Documentation/UI caution candidate. |
| SFB-006 | UI/responsive reviewer | Review Room is usable but dense on narrow width; summary helps but sections feel long. | UI/responsive | low | P3 | none | Known limitation or later polish. |
| SFB-007 | Safety-conscious tester | Feedback template should repeat not to share `.env`, tokens, private keys, or `auth.json`. | safety | high | P1 | possible credential exposure if omitted | Documentation fix candidate. |
| SFB-008 | Safety-conscious tester | Archive dry-run says no deletion, but tester wants explicit "backup files are not deleted" near preview. | archive | medium | P2 | backup deletion concern | Documentation/UI clarification. |
| SFB-009 | Existing developer environment tester | Existing `.local` records make counts differ from docs examples. | documentation | cosmetic | P3 | none | Known limitation note. |

## Coverage

The sample set covers setup confusion, Codex auth unknown confusion, approved path setup confusion, launcher localhost confusion, backup/restore caution, archive dry-run confusion, responsive UI issue, documentation gap, and safety reassurance.
