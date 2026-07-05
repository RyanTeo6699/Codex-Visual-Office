import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-24-real-private-beta-feedback-review-scope-lock.md",
  "docs/private-beta-feedback-evidence-policy.md",
  "docs/private-beta-feedback-ledger-review.md",
  "docs/private-beta-issue-triage-review.md",
  "docs/private-beta-fix-batch-2-candidate-list.md",
  "docs/private-beta-known-limitations-candidates.md",
  "docs/private-beta-public-beta-blocker-list.md",
  "docs/private-beta-feedback-review-gm-decision-worksheet.md",
  "docs/private-beta-readiness-decision-report.md",
  "docs/phase-24-real-private-beta-feedback-review.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 24 name", patterns: [/Phase 24 - Real Private Beta Feedback Review \/ Decision Gate/i] },
  { name: "no fake tester feedback", patterns: [/fake tester feedback/i, /Do not fabricate/i, /must not be counted as real/i] },
  { name: "awaiting tester feedback", patterns: [/AWAITING_TESTER_FEEDBACK/i] },
  { name: "no public release", patterns: [/no public release|not a public release|public release implementation/i] },
  { name: "no signed or notarized installer", patterns: [/signed or notarized installer|signing.*notarization|no signed/i] },
  { name: "no auto updater", patterns: [/auto updater/i] },
  { name: "no cloud sync", patterns: [/cloud sync/i] },
  { name: "no auth payment team MCP", patterns: [/auth.*payment.*team.*MCP|auth, payment, team workspace, MCP|auth\/payment\/team\/MCP/i] },
  { name: "no token sharing", patterns: [/token/i, /auth\.json/i, /\.env/i] },
  { name: "no fake counts", patterns: [/fake tester count/i, /fake issue count/i, /tester count.*pending|issue count.*pending/i] },
  { name: "Phase 25 not started", patterns: [/Phase 25 has not started|Phase 25 implementation/i] },
];

const unsupportedClaims = [
  /real private beta completed/i,
  /private beta round 1 completed/i,
  /tester feedback received/i,
  /tester count\s*[:|]\s*\d+/i,
  /issue count\s*[:|]\s*\d+/i,
  /setup success rate\s*[:|]\s*\d+/i,
  /launch success rate\s*[:|]\s*\d+/i,
  /GO_TO_FIX_BATCH_2 selected/i,
  /GO_TO_PUBLIC_TECHNICAL_BETA_SCOPE selected/i,
  /public release implemented/i,
  /commercial launch ready/i,
  /signed installer included/i,
  /notarized app included/i,
  /auto updater included/i,
  /cloud sync included/i,
  /auth.*included/i,
  /payment.*included/i,
  /team workspace.*included/i,
  /MCP.*included/i,
];

const boundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|planning|future|known strategic|pending|awaiting|requires real|cannot|should not|did not|was not|not counted|not selected)\b/i;

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
  "beta:verify:feedback-review",
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
    name: `required Phase 24 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:feedback-review",
  passed: packageJson.scripts?.["beta:verify:feedback-review"] === "tsx scripts/verify-private-beta-feedback-review.ts",
  detail: packageJson.scripts?.["beta:verify:feedback-review"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `Phase 24 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const feedbackLedgerReview = readText("docs/private-beta-feedback-ledger-review.md");
const readinessReport = readText("docs/private-beta-readiness-decision-report.md");
const gmWorksheet = readText("docs/private-beta-feedback-review-gm-decision-worksheet.md");

checks.push({
  name: "feedback ledger review states no real tester feedback",
  passed: /No real tester feedback has been recorded yet/i.test(feedbackLedgerReview),
  detail: /No real tester feedback has been recorded yet/i.test(feedbackLedgerReview) ? "awaiting feedback" : "missing empty-state statement",
});

checks.push({
  name: "readiness decision remains awaiting feedback",
  passed:
    /Recommended Decision[\s\S]*AWAITING_TESTER_FEEDBACK/i.test(readinessReport) &&
    /Phase 25 - Continue Real Private Beta Round 1 \/ Collect Tester Feedback/i.test(readinessReport),
  detail: "readiness decision and next phase checked",
});

checks.push({
  name: "GM worksheet does not approve beta expansion",
  passed:
    /Recommended Decision[\s\S]*AWAITING_TESTER_FEEDBACK/i.test(gmWorksheet) &&
    /GM decision \| pending/i.test(gmWorksheet),
  detail: "GM decision worksheet checked",
});

const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !boundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not claim beta completion or fake measured results",
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
    .flatMap((line, index) => (/phase 24|feedback review|private beta feedback/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 24 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 24 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-private-beta-feedback-review.ts");
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
  name: "feedback review verifier is static and non-executing",
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

