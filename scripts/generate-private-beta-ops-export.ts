import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const exportDir = path.join(process.cwd(), "docs/private-beta-ops-export");

const files: Record<string, string> = {
  "invitee-tracker-template.csv":
    'External Tester ID,Tester type,Invite status,Consent status,Setup status,Launch status,Feedback status,Sensitive data checked?,Notes\nPLACEHOLDER_DO_NOT_COUNT,TBD_BY_GM,pending,pending,pending,pending,pending,pending,"Template row only; not a real tester"\n',
  "feedback-ledger-template.csv":
    'Feedback ID,Source type,External Tester ID,Date,Area,Summary,Evidence type,Sensitive data checked?,Severity,Priority,Status,Linked issue ID,Notes\nPLACEHOLDER_DO_NOT_COUNT,placeholder,TBD_BY_GM,TBD_BY_GM,TBD_BY_GM,"Template row only; no feedback recorded",placeholder,pending,pending,pending,pending,TBD_BY_GM,"Do not count as external feedback"\n',
  "issue-ledger-template.csv":
    'Issue ID,Feedback ID,Source type,Area,Summary,Severity,Priority,Repro status,Safety/data impact,Decision,Target phase,Status\nPLACEHOLDER_DO_NOT_COUNT,TBD_BY_GM,placeholder,TBD_BY_GM,"Template row only; no issue recorded",pending,pending,pending,pending,pending,TBD_BY_GM,pending\n',
  "invitation-message-pack.md": `# Private Beta Ops Export - Invitation Message Pack

Status: \`TEMPLATE_ONLY_DO_NOT_COUNT\`

This packet is for manual GM use. It does not contact testers, connect to external communication services, or create tester records automatically.

## Short Invitation Template

\`\`\`txt
Hi [TBD_BY_GM],

I am inviting a small number of external testers to try Codex Visual Office as a local-first private beta.

This is not a public release, not a signed installer, and not cloud sync. Please do not share tokens, auth files, .env files, private keys, proprietary source, local SQLite DB files, or unredacted logs.

If you are willing to test, I will send the local setup steps and feedback template manually.
\`\`\`

## Detailed Invitation Template

\`\`\`txt
Hi [TBD_BY_GM],

Codex Visual Office is a local-first visual office for Codex workflows. I am collecting external tester feedback for private beta round 1.

The test asks you to run the project locally, open a few routes, and report setup / launch / workflow observations. Please redact all screenshots and logs.

Do not submit tokens, ~/.codex/auth.json, .env, .env.local, private keys, proprietary source files, local SQLite databases, or unredacted secret-bearing logs.

This is private beta intake only. It is not public beta, public release, commercial launch, signed distribution, notarized distribution, auto updater, cloud sync, auth, payment, team workspace, MCP, GitHub, Vercel, Supabase, or OpenAI API integration.
\`\`\`

## Placeholder Rule

\`[TBD_BY_GM]\` is a placeholder. It is not a tester name and must not be counted as tester evidence.
`,
  "feedback-submission-template.md": `# Private Beta Ops Export - Feedback Submission Template

Status: \`TEMPLATE_ONLY_DO_NOT_COUNT\`

## Tester Metadata

| Field | Value |
| --- | --- |
| External Tester ID | TBD_BY_GM |
| Date | TBD_BY_GM |
| OS / browser | TBD_BY_GM |
| Node / npm, if known | TBD_BY_GM |
| Codex CLI status, if known | TBD_BY_GM |
| Route / workflow tested | TBD_BY_GM |

## Feedback

| Field | Value |
| --- | --- |
| Summary | TBD_BY_GM |
| Expected result | TBD_BY_GM |
| Actual result | TBD_BY_GM |
| Evidence type | redacted screenshot / redacted bounded log note / environment summary / repro steps / route-page |
| Sensitive data checked? | pending |
| Severity | pending |
| Priority | pending |

## Forbidden Submission Material

Do not include tokens, \`~/.codex/auth.json\`, \`.env\`, \`.env.local\`, private keys, API keys, local SQLite DB files, proprietary source, or unredacted secret-bearing logs.
`,
  "issue-report-template.md": `# Private Beta Ops Export - Issue Report Template

Status: \`TEMPLATE_ONLY_DO_NOT_COUNT\`

## Issue Fields

| Field | Value |
| --- | --- |
| Issue ID | TBD_BY_GM |
| Feedback ID | TBD_BY_GM |
| External Tester ID | TBD_BY_GM |
| Area | TBD_BY_GM |
| Summary | TBD_BY_GM |
| Severity | pending |
| Priority | pending |
| Repro status | pending |
| Safety/data impact | pending |
| Decision | pending |
| Target phase | TBD_BY_GM |
| Status | pending |

## Issue Boundary

This template does not create a real issue until GM records real external tester evidence. Placeholder rows must not be counted as external tester issues.
`,
  "gm-next-actions.md": `# Private Beta Ops Export - GM Next Actions

Status: \`BETA_OPS_READY_AWAITING_EXTERNAL_TESTER_SUBMISSIONS\`

## Current Facts

- GM / local validation sample: recorded separately.
- External tester feedback: not recorded yet.
- External tester issue: not recorded yet.
- Private beta completion: not claimed.
- Public release readiness: not claimed.

## Manual Next Actions

1. Select real external testers.
2. Send the invitation message manually.
3. Confirm consent / safety acknowledgment.
4. Collect redacted setup and launch feedback.
5. Reject tokens, auth files, env files, private keys, source dumps, SQLite DB files, and unredacted logs.
6. Record real evidence in the external feedback ledger.
7. Decide whether Phase 31 should ingest real feedback or continue intake.

## Not Automated

This export pack does not contact testers, connect external services, upload feedback, create cloud records, or start Phase 31.
`,
};

mkdirSync(exportDir, { recursive: true });

for (const [fileName, content] of Object.entries(files)) {
  writeFileSync(path.join(exportDir, fileName), content);
}

console.log(
  JSON.stringify(
    {
      status: "generated",
      outputDir: "docs/private-beta-ops-export",
      files: Object.keys(files),
      externalApiAttempted: false,
      messageSendAttempted: false,
      contactReadAttempted: false,
      tokenReadAttempted: false,
      commandExecutionAttempted: false,
    },
    null,
    2,
  ),
);
