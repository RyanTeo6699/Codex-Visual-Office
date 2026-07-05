import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-23-real-private-beta-round-1-execution-scope-lock.md",
  "docs/private-beta-round-1-execution-plan.md",
  "docs/private-beta-round-1-tester-roster.md",
  "docs/private-beta-round-1-environment-matrix.md",
  "docs/private-beta-round-1-execution-log.md",
  "docs/private-beta-round-1-feedback-ledger.md",
  "docs/private-beta-round-1-issue-triage-ledger.md",
  "docs/private-beta-round-1-go-no-go-worksheet.md",
  "docs/private-beta-round-1-results-report.md",
  "docs/phase-23-real-private-beta-round-1-execution.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 23 name", patterns: [/Phase 23 - Real Private Beta Round 1 Execution/i] },
  { name: "private beta", patterns: [/private beta/i] },
  { name: "local-first", patterns: [/local-first/i] },
  { name: "no public release", patterns: [/not a public release|no public release|does not implement public release/i] },
  { name: "no signed or notarized installer", patterns: [/not a signed installer|no signed.*notarized|signed or notarized installer/i] },
  { name: "no auto updater", patterns: [/no auto updater|not auto-updating|auto updater.*not/i] },
  { name: "no cloud sync", patterns: [/no cloud sync|cloud sync.*not/i] },
  { name: "no auth/payment/team/MCP", patterns: [/auth.*payment.*team.*MCP|auth, payment, team.*MCP|auth\/payment\/team\/MCP/i] },
  { name: "no token sharing", patterns: [/no-token|no token|do not collect or store.*tokens|do not store tokens/i, /auth\.json/i, /\.env\.local/i] },
  { name: "no fake tester feedback", patterns: [/Do not fabricate/i, /No real tester feedback has been recorded yet/i, /must not invent/i] },
  { name: "awaiting feedback status", patterns: [/REAL_PRIVATE_BETA_EXECUTION_READY_AWAITING_TESTER_FEEDBACK/i, /AWAITING_TESTER_FEEDBACK/i] },
  { name: "Phase 24 decision options only", patterns: [/Phase 24 - Real Private Beta Feedback Review/i, /Phase 24 - Private Beta Fix Batch 2/i, /Phase 24 - Public Beta Scope Lock/i] },
];

const unsupportedClaims = [
  /real private beta completed/i,
  /real beta completed/i,
  /private beta round 1 completed/i,
  /tester feedback received/i,
  /tester count\s*[:|]\s*\d+/i,
  /completed setup count\s*[:|]\s*\d+/i,
  /completed feedback count\s*[:|]\s*\d+/i,
  /issue count\s*[:|]\s*\d+/i,
  /safety incidents\s*[:|]\s*0/i,
  /data incidents\s*[:|]\s*0/i,
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
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|planning only|not a|did not|was not|dry-run|simulated|historical|does not claim|pending|awaiting|unless|future|possible)\b/i;

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
  "beta:verify:real-execution",
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
    name: `required Phase 23 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:real-execution",
  passed: packageJson.scripts?.["beta:verify:real-execution"] === "tsx scripts/verify-real-private-beta-execution.ts",
  detail: packageJson.scripts?.["beta:verify:real-execution"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `Phase 23 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const resultsReport = readText("docs/private-beta-round-1-results-report.md");
checks.push({
  name: "results report remains awaiting feedback",
  passed: /AWAITING_TESTER_FEEDBACK/i.test(resultsReport) && /pending/i.test(resultsReport) && /does not claim beta completion/i.test(resultsReport),
  detail: /AWAITING_TESTER_FEEDBACK/i.test(resultsReport) ? "awaiting feedback" : "missing awaiting feedback status",
});

const feedbackLedger = readText("docs/private-beta-round-1-feedback-ledger.md");
checks.push({
  name: "feedback ledger distinguishes sources and states no real tester feedback",
  passed:
    /real_tester/i.test(feedbackLedger) &&
    /support_observation/i.test(feedbackLedger) &&
    /gm_note/i.test(feedbackLedger) &&
    /simulated_reference/i.test(feedbackLedger) &&
    /No real tester feedback has been recorded yet/i.test(feedbackLedger),
  detail: "source taxonomy and empty state checked",
});

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
    .flatMap((line, index) => (/phase 23|real private beta/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 23 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 23 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-real-private-beta-execution.ts");
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
  name: "real private beta verifier is static and non-executing",
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
  prohibitedExecutionAttempted,
  checks,
  failedChecks,
};

console.log(JSON.stringify(summary, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
