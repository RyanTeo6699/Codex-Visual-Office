import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredFiles = [
  "app/beta/page.tsx",
  "components/beta/BetaOpsPanel.tsx",
  "components/beta/BetaOpsSummaryCard.tsx",
  "components/beta/BetaOutreachPacketCard.tsx",
  "components/beta/BetaTrackerStatusCard.tsx",
  "components/beta/BetaNextActionCard.tsx",
  "lib/beta-ops/beta-ops-types.ts",
  "lib/beta-ops/beta-ops-summary.ts",
  "docs/phase-30-private-beta-ops-automation-scope-lock.md",
  "docs/phase-30-private-beta-ops-automation.md",
  "docs/private-beta-ops-export/invitee-tracker-template.csv",
  "docs/private-beta-ops-export/feedback-ledger-template.csv",
  "docs/private-beta-ops-export/issue-ledger-template.csv",
  "docs/private-beta-ops-export/invitation-message-pack.md",
  "docs/private-beta-ops-export/feedback-submission-template.md",
  "docs/private-beta-ops-export/issue-report-template.md",
  "docs/private-beta-ops-export/gm-next-actions.md",
  "scripts/generate-private-beta-ops-export.ts",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const checks: Check[] = [];

function readText(relativePath: string): string {
  const absolutePath = path.join(rootDir, relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

const packageJson = JSON.parse(readText("package.json")) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

for (const file of requiredFiles) {
  const present = existsSync(path.join(rootDir, file));
  checks.push({
    name: `required Phase 30 file: ${file}`,
    passed: present,
    detail: present ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:ops:export",
  passed: packageJson.scripts?.["beta:ops:export"] === "tsx scripts/generate-private-beta-ops-export.ts",
  detail: packageJson.scripts?.["beta:ops:export"] ?? "missing",
});

checks.push({
  name: "required script: beta:verify:ops",
  passed: packageJson.scripts?.["beta:verify:ops"] === "tsx scripts/verify-private-beta-ops.ts",
  detail: packageJson.scripts?.["beta:verify:ops"] ?? "missing",
});

const docsText = [
  "docs/phase-30-private-beta-ops-automation-scope-lock.md",
  "docs/phase-30-private-beta-ops-automation.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
  "docs/private-beta-ops-export/invitation-message-pack.md",
  "docs/private-beta-ops-export/feedback-submission-template.md",
  "docs/private-beta-ops-export/issue-report-template.md",
  "docs/private-beta-ops-export/gm-next-actions.md",
].map(readText).join("\n\n");

const uiText = [
  "app/beta/page.tsx",
  "components/beta/BetaOpsPanel.tsx",
  "components/beta/BetaOpsSummaryCard.tsx",
  "components/beta/BetaOutreachPacketCard.tsx",
  "components/beta/BetaTrackerStatusCard.tsx",
  "components/beta/BetaNextActionCard.tsx",
].map(readText).join("\n\n");

const helperText = [
  "lib/beta-ops/beta-ops-types.ts",
  "lib/beta-ops/beta-ops-summary.ts",
].map(readText).join("\n\n");

const exportScriptText = readText("scripts/generate-private-beta-ops-export.ts");
const verifierText = readText("scripts/verify-private-beta-ops.ts");
const combinedTemplates = [
  "docs/private-beta-ops-export/invitee-tracker-template.csv",
  "docs/private-beta-ops-export/feedback-ledger-template.csv",
  "docs/private-beta-ops-export/issue-ledger-template.csv",
  "docs/private-beta-ops-export/invitation-message-pack.md",
  "docs/private-beta-ops-export/feedback-submission-template.md",
  "docs/private-beta-ops-export/issue-report-template.md",
  "docs/private-beta-ops-export/gm-next-actions.md",
].map(readText).join("\n\n");

const requiredDocPatterns: Array<[string, RegExp]> = [
  ["Phase 30 name", /Phase 30 - Private Beta Ops Automation \/ Internal Execution Pack/i],
  ["status code", /BETA_OPS_READY_AWAITING_EXTERNAL_TESTER_SUBMISSIONS/i],
  ["no fake feedback", /fake tester feedback|fake feedback|fabricate feedback/i],
  ["no fake counts", /fake tester count|fake submission count|fake issue count/i],
  ["no beta completion claim", /does not claim private beta completion|Beta completion claim|Private beta completion: not claimed/i],
  ["no public release", /No public release|not a public release|Public release readiness: not claimed/i],
  ["no external API", /external communication API|external service connection|external API integration/i],
  ["Phase 31 not started", /Phase 31 implementation has not started|does not.*start Phase 31|Phase 31 should ingest real feedback/i],
];

for (const [name, pattern] of requiredDocPatterns) {
  const passed = pattern.test(docsText);
  checks.push({
    name: `Phase 30 docs state ${name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

checks.push({
  name: "/beta UI exposes Beta Ops Room and required state",
  passed:
    /Beta Ops Room/i.test(uiText) &&
    /Current private beta status/i.test(uiText) &&
    /External submissions/i.test(uiText) &&
    /No fake tester feedback/i.test(uiText) &&
    /No external submissions recorded yet/i.test(uiText) &&
    /No token collection/i.test(uiText),
  detail: "UI text checked",
});

const forbiddenUiControls = [
  /Send Email/i,
  /Connect Gmail/i,
  /Connect GitHub/i,
  /Connect Slack/i,
  /Connect Discord/i,
  /Upload Feedback/i,
  /Token input/i,
  /Command input/i,
  /\bTerminal\b/i,
  /Auto Invite/i,
  /Auto Submit/i,
];

const forbiddenUiMatches = forbiddenUiControls
  .filter((pattern) => pattern.test(uiText))
  .map((pattern) => pattern.toString());

checks.push({
  name: "/beta UI has no forbidden send/connect/upload/token/command/terminal controls",
  passed: forbiddenUiMatches.length === 0,
  detail: forbiddenUiMatches.length === 0 ? "none found" : forbiddenUiMatches.join(", "),
});

checks.push({
  name: "Beta Ops helper is summary-only and count-honest",
  passed:
    /gmLocalValidationCount/i.test(helperText) &&
    /externalTesterFeedbackCount/i.test(helperText) &&
    /externalIssueCount/i.test(helperText) &&
    /betaCompletionClaimed: false/i.test(helperText) &&
    /publicReleaseReadyClaimed: false/i.test(helperText),
  detail: "helper checked",
});

checks.push({
  name: "export templates are placeholder-only and sensitive-data aware",
  passed:
    /PLACEHOLDER_DO_NOT_COUNT/i.test(combinedTemplates) &&
    /TBD_BY_GM/i.test(combinedTemplates) &&
    /tokens/i.test(combinedTemplates) &&
    /auth\.json/i.test(combinedTemplates) &&
    /\.env/i.test(combinedTemplates) &&
    /private keys/i.test(combinedTemplates) &&
    /SQLite DB/i.test(combinedTemplates),
  detail: "templates checked",
});

const unsupportedClaims = [
  /private beta completed/i,
  /public beta ready/i,
  /public release ready/i,
  /commercial launch ready/i,
  /tester feedback received/i,
  /external tester feedback received/i,
  /tester count\s*[:|]\s*[1-9]\d*/i,
  /submission count\s*[:|]\s*[1-9]\d*/i,
  /issue count\s*[:|]\s*[1-9]\d*/i,
  /setup success rate\s*[:|]\s*[1-9]\d*%/i,
  /launch success rate\s*[:|]\s*[1-9]\d*%/i,
];

const boundaryContext =
  /\b(no|not|does not|do not|never|without|forbidden|absent|blocked|not claimed|not counted|pending|awaiting|placeholder|TBD_BY_GM|0|zero|cannot|still cannot|must not)\b/i;

const unsupportedDocClaims = docsText
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !boundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not overclaim beta completion, external feedback, counts, or release readiness",
  passed: unsupportedDocClaims.length === 0,
  detail: unsupportedDocClaims.length === 0 ? "no unsupported claims found" : unsupportedDocClaims.join(", "),
});

const forbiddenDependencies = [
  "electron",
  "node-pty",
  "@tauri-apps/plugin-updater",
  "electron-updater",
  "update-electron-app",
  "@octokit/rest",
  "@vercel/sdk",
  "vercel",
  "@supabase/supabase-js",
  "firebase",
  "next-auth",
  "@auth/core",
  "stripe",
  "openai",
  "@modelcontextprotocol/sdk",
  "@slack/web-api",
  "googleapis",
];

const dependencyNames = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
];
const forbiddenDependencyMatches = dependencyNames.filter((name) =>
  forbiddenDependencies.some((forbidden) => forbidden.toLowerCase() === name.toLowerCase()),
);

checks.push({
  name: "forbidden external API/cloud/auth/payment dependencies absent",
  passed: forbiddenDependencyMatches.length === 0,
  detail: forbiddenDependencyMatches.length === 0 ? "none found" : forbiddenDependencyMatches.join(", "),
});

const allowedScriptNames = new Set([
  "beta:ops:export",
  "beta:verify:ops",
  "beta:verify:private",
  "beta:verify:intake",
  "beta:verify:dry-run",
  "beta:verify:fix-batch",
  "beta:verify:real-execution",
  "beta:verify:feedback-review",
  "beta:verify:feedback-collection",
  "beta:verify:collection-window",
  "beta:verify:outreach",
  "beta:verify:feedback-decision",
  "beta:verify:external-intake",
  "release:verify:strategy",
  "production:verify:freeze",
  "production:verify:scope",
  "desktop:check:beta",
  "tauri:dev:prototype",
]);

const forbiddenScriptPatterns = [
  /tauri\s+build/i,
  /electron-builder/i,
  /electron-forge/i,
  /notarytool/i,
  /notar/i,
  /codesign/i,
  /auto.?updat/i,
  /\bdeploy\b/i,
  /vercel/i,
  /supabase/i,
  /git\s+add/i,
  /git\s+commit/i,
  /git\s+push/i,
  /rm\s+-rf/i,
  /curl\b.*\|\s*sh/i,
  /gmail|slack|discord|sendgrid|mailgun|resend/i,
];

const forbiddenScriptMatches = Object.entries(packageJson.scripts ?? {}).flatMap(([name, command]) => {
  if (allowedScriptNames.has(name)) return [];
  const text = `${name} ${command}`;
  return forbiddenScriptPatterns
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `${name}: ${pattern.toString()}`);
});

checks.push({
  name: "package scripts have no public release, deploy, send, or dangerous mutation command",
  passed: forbiddenScriptMatches.length === 0,
  detail: forbiddenScriptMatches.length === 0 ? "none found" : forbiddenScriptMatches.join(", "),
});

const schemaOrMigrationMarkers = [
  ["lib/local-db/schema.ts", readText("lib/local-db/schema.ts")] as const,
  ["drizzle.config.ts", readText("drizzle.config.ts")] as const,
].flatMap(([file, text]) =>
  text
    .split(/\r?\n/)
    .flatMap((line, index) => (/phase 30|beta ops|private beta ops/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 30 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 30 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const unsafeSourceText = [helperText, exportScriptText, uiText].join("\n\n");
const childProcessPattern = new RegExp(`node:child_${"process"}|from ["']child_${"process"}["']|require\\(["']child_${"process"}["']\\)`, "i");

const unsafePatterns = [
  childProcessPattern,
  /\bexecFileSync\b|\bexecSync\b|\bspawnSync\b|\bexecFile\b|\bexec\b|\bspawn\b|\bfork\b/,
  /process\.env/i,
  /~\/\.codex\/auth\.json.*read|read.*~\/\.codex\/auth\.json/i,
  /\.env\.local.*read|read.*\.env\.local/i,
  /from ["']googleapis["']|require\(["']googleapis["']\)|from ["']@slack\/web-api["']|require\(["']@slack\/web-api["']\)/i,
  /from ["']@octokit\/rest["']|require\(["']@octokit\/rest["']\)|from ["']@vercel\/sdk["']|from ["']@supabase\/supabase-js["']|from ["']openai["']/i,
  /node-pty/i,
  /shell:\s*true/i,
];

const unsafeSourceMatches = unsafePatterns
  .filter((pattern) => pattern.test(unsafeSourceText))
  .map((pattern) => pattern.toString());

checks.push({
  name: "Beta Ops implementation has no external API, secret read, command execution, terminal, or node-pty surface",
  passed: unsafeSourceMatches.length === 0,
  detail: unsafeSourceMatches.length === 0 ? "none found" : unsafeSourceMatches.join(", "),
});

const verifierExecutionPatterns = [
  childProcessPattern,
  /\bexecFileSync\b|\bexecSync\b|\bspawnSync\b|\bexecFile\b|\bexec\b|\bspawn\b|\bfork\b/,
  /import\s*\(/i,
];
const verifierExecutionMatches = verifierExecutionPatterns
  .filter((pattern) => pattern.test(verifierText))
  .map((pattern) => pattern.toString());

checks.push({
  name: "Beta Ops verifier is static and non-executing",
  passed: verifierExecutionMatches.length === 0,
  detail: verifierExecutionMatches.length === 0 ? "none found" : verifierExecutionMatches.join(", "),
});

const failedChecks = checks.filter((check) => !check.passed);

const result = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredFiles,
  forbiddenDependencyMatches,
  forbiddenScriptMatches,
  forbiddenUiMatches,
  unsafeSourceMatches,
  unsupportedDocClaims,
  checks,
  failedChecks,
};

console.log(JSON.stringify(result, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
