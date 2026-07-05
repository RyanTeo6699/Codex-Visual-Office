import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-22-private-beta-fix-batch-1-scope-lock.md",
  "docs/private-beta-fix-batch-1-issue-list.md",
  "docs/phase-22-private-beta-fix-batch-1.md",
  "docs/private-beta-round-1-dry-run-results.md",
  "docs/private-beta-sample-triage-output.md",
  "docs/private-beta-sample-issue-reports.md",
  "docs/private-beta-tester-guide.md",
  "docs/private-beta-support-runbook.md",
  "docs/private-beta-feedback-template.md",
  "docs/private-beta-issue-report-template.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 22 name", patterns: [/Phase 22 - Private Beta Fix Batch 1/i] },
  { name: "ready for real private beta status", patterns: [/PRIVATE_BETA_FIX_BATCH_1_READY_FOR_REAL_PRIVATE_BETA/i] },
  { name: "docs/copy/status/verifier hardening only", patterns: [/documentation clarity|docs clarity/i, /copy|help-text|status wording/i, /verifier hardening|static verifier/i] },
  { name: "no-token/no-secret warning", patterns: [/do not include tokens/i, /no-token|no-secret/i, /~\/\.codex\/auth\.json/i, /\.env\.local/i] },
  { name: "manual approved path guidance", patterns: [/approved project path/i, /manual/i, /no folder scan|does not scan/i] },
  { name: "Codex auth unknown explanation", patterns: [/Auth unknown/i, /did not verify login state/i, /does not mean the app read/i] },
  { name: "backup dry-run and confirm restore", patterns: [/Dry Run Restore/i, /does not overwrite|non-destructive/i, /Confirm Restore/i, /safety backup/i] },
  { name: "localhost local-only explanation", patterns: [/localhost:3000/i, /served from.*machine/i, /not.*cloud/i] },
  { name: "no real private beta completion", patterns: [/does not claim real private beta/i, /No real private beta tester round was executed/i, /did not run a real private beta/i] },
  { name: "Phase 23 recommendation", patterns: [/Phase 23 - Real Private Beta Round 1 Execution/i] },
];

const unsupportedClaims = [
  /real private beta completed/i,
  /real beta completed/i,
  /public commercial release ready/i,
  /public release implemented/i,
  /commercial launch ready/i,
  /signed installer included/i,
  /notarized app included/i,
  /auto updater included/i,
  /cloud sync included/i,
  /team workspace included/i,
  /MCP.*included/i,
  /payment.*included/i,
  /auth.*included/i,
];

const boundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|planning only|not a|did not|was not|dry-run|simulated|does not claim)\b/i;

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
];

const forbiddenUiControlPatterns = [
  /command text box/i,
  /arbitrary shell/i,
  /terminal emulator/i,
  /cleanup now/i,
  /delete logs/i,
  /delete backups/i,
  /folder picker/i,
  /scan filesystem/i,
  /cloud sync/i,
  /auto fix/i,
  /auto commit/i,
  /auto push/i,
  /auto deploy/i,
];

const uiFilesToScan = [
  "app/page.tsx",
  "app/settings/page.tsx",
  "app/safety/page.tsx",
  "app/archive/page.tsx",
  "app/projects/[id]/page.tsx",
  "app/review/[taskId]/page.tsx",
  "components/settings/SettingsPanel.tsx",
  "components/settings/CodexRuntimeReliabilityCard.tsx",
  "components/settings/ApprovedProjectPathsCard.tsx",
  "components/settings/BackupRestoreCard.tsx",
  "components/archive/ArchiveRoomPanel.tsx",
  "components/archive/CleanupDryRunPreviewCard.tsx",
  "components/safety/SafetyAuditPanel.tsx",
  "components/office/ApprovedProjectPathStatus.tsx",
  "components/office/ProjectWorkflowSummary.tsx",
  "components/review/ReviewPanel.tsx",
  "components/review/ScopedCodexRunnerPanel.tsx",
  "components/review/CodexPromptHandoff.tsx",
  "components/review/ReviewDecisionPanel.tsx",
];

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
];

const allowedScriptNames = new Set([
  "beta:verify:private",
  "beta:verify:intake",
  "beta:verify:dry-run",
  "beta:verify:fix-batch",
  "release:verify:strategy",
  "production:verify:freeze",
  "production:verify:scope",
  "desktop:check:beta",
  "tauri:dev:prototype",
]);

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

for (const doc of requiredDocs) {
  const exists = existsSync(path.join(rootDir, doc));
  checks.push({
    name: `required Phase 22 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:fix-batch",
  passed: packageJson.scripts?.["beta:verify:fix-batch"] === "tsx scripts/verify-private-beta-fix-batch.ts",
  detail: packageJson.scripts?.["beta:verify:fix-batch"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `Phase 22 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !boundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not claim real beta/public/commercial release completion",
  passed: unsupportedDocClaims.length === 0,
  detail: unsupportedDocClaims.length === 0 ? "no unsupported claims found" : unsupportedDocClaims.join(", "),
});

const dependencyNames = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
];
const forbiddenDependencyMatches = dependencyNames.filter((name) =>
  forbiddenDependencies.some((forbidden) => forbidden.toLowerCase() === name.toLowerCase()),
);

checks.push({
  name: "forbidden release/cloud/auth/payment dependencies absent",
  passed: forbiddenDependencyMatches.length === 0,
  detail: forbiddenDependencyMatches.length === 0 ? "none found" : forbiddenDependencyMatches.join(", "),
});

const forbiddenScriptMatches = Object.entries(packageJson.scripts ?? {}).flatMap(([name, command]) => {
  if (allowedScriptNames.has(name)) return [];
  const text = `${name} ${command}`;
  return forbiddenScriptPatterns
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `${name}: ${pattern.toString()}`);
});

checks.push({
  name: "public release/signing/notarization/updater/deploy scripts absent",
  passed: forbiddenScriptMatches.length === 0,
  detail: forbiddenScriptMatches.length === 0 ? "none found" : forbiddenScriptMatches.join(", "),
});

const schemaOrMigrationMarkers = [
  ["lib/local-db/schema.ts", readText("lib/local-db/schema.ts")] as const,
  ["drizzle.config.ts", readText("drizzle.config.ts")] as const,
].flatMap(([file, text]) =>
  text
    .split(/\r?\n/)
    .flatMap((line, index) => (/phase 22|private beta fix batch/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 22 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 22 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const uiBoundaryHits = uiFilesToScan.flatMap((file) =>
  readText(file)
    .split(/\r?\n/)
    .flatMap((line, index) =>
      forbiddenUiControlPatterns
        .filter((pattern) => pattern.test(line) && !boundaryContext.test(line) && !isReadOnlyStatusLabel(line))
        .map((pattern) => `${file}:${index + 1}: ${pattern.toString()}`),
    ),
);

checks.push({
  name: "UI copy does not introduce forbidden controls",
  passed: uiBoundaryHits.length === 0,
  detail: uiBoundaryHits.length === 0 ? "no unbounded forbidden UI control claims found" : uiBoundaryHits.join(", "),
});

function isReadOnlyStatusLabel(line: string): boolean {
  return /RunnerRow label=|\["(Arbitrary shell|Auto push|Auto deploy|Cloud sync|Auto commit|Terminal emulator|Command text box)"/i.test(line);
}

const ownSource = readText("scripts/verify-private-beta-fix-batch.ts");
const childModulePattern = new RegExp(`node:child_${"process"}|from ["']child_${"process"}["']`, "i");
const executionApiPattern = new RegExp(
  "\\bexecFileSync\\b|\\bexecSync\\b|\\bsp" +
    "awnSync\\b|\\bexecFile\\b|\\bexec\\b|\\bsp" +
    "awn\\b",
);
const prohibitedExecutionAttempted = {
  childProcessImport: childModulePattern.test(ownSource),
  shellExecutionApi: executionApiPattern.test(ownSource),
  processMutation: /process\.chdir|process\.kill|process\.env\[[^\]]+\]\s*=/i.test(ownSource),
  dynamicImport: /await import\(|import\(/i.test(ownSource),
};

const executionViolations = Object.entries(prohibitedExecutionAttempted)
  .filter(([, attempted]) => attempted)
  .map(([name]) => name);

checks.push({
  name: "private beta fix-batch verifier is static and non-executing",
  passed: executionViolations.length === 0,
  detail: executionViolations.length === 0 ? JSON.stringify(prohibitedExecutionAttempted) : executionViolations.join(", "),
});

const failedChecks = checks.filter((check) => !check.passed);
const summary = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredDocs,
  forbiddenDependencyMatches,
  forbiddenScriptMatches,
  unsupportedDocClaims,
  uiBoundaryHits,
  prohibitedExecutionAttempted,
  checks,
  failedChecks,
};

console.log(JSON.stringify(summary, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
