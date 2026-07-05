import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-25-private-beta-feedback-collection-scope-lock.md",
  "docs/private-beta-tester-invitation-packet.md",
  "docs/private-beta-tester-onboarding-message.md",
  "docs/private-beta-feedback-submission-instructions.md",
  "docs/private-beta-real-feedback-intake-checklist.md",
  "docs/private-beta-tester-data-handling-policy.md",
  "docs/private-beta-gm-feedback-collection-checklist.md",
  "docs/private-beta-feedback-import-review-procedure.md",
  "docs/private-beta-round-1-collection-status-report.md",
  "docs/private-beta-phase-26-decision-worksheet.md",
  "docs/phase-25-private-beta-feedback-collection.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 25 name", patterns: [/Phase 25 - Continue Real Private Beta Round 1 \/ Collect Tester Feedback/i] },
  { name: "collection ready awaiting submissions", patterns: [/REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS/i] },
  { name: "private beta", patterns: [/private beta/i] },
  { name: "local-first", patterns: [/local-first/i] },
  { name: "no fake tester feedback", patterns: [/fake tester feedback/i, /do not fabricate/i, /must not be counted/i] },
  { name: "no public release", patterns: [/no public release|not a public release|public release implementation/i] },
  { name: "no signed or notarized installer", patterns: [/signed or notarized installer|notarized app|no signed/i] },
  { name: "no auto updater", patterns: [/auto updater/i] },
  { name: "no cloud sync", patterns: [/cloud sync/i] },
  { name: "no auth payment team MCP", patterns: [/auth.*payment.*team.*MCP|auth, payment, team workspace, MCP|auth\/payment\/team\/MCP/i] },
  { name: "no token auth env private key sharing", patterns: [/token/i, /auth\.json/i, /\.env/i, /private key/i] },
  { name: "Phase 26 not started", patterns: [/Phase 26 has not started|Phase 26 implementation/i] },
];

const unsupportedClaims = [
  /private beta completed/i,
  /real private beta completed/i,
  /tester feedback received/i,
  /tester count\s*[:|]\s*\d+/i,
  /issue count\s*[:|]\s*\d+/i,
  /setup success rate\s*[:|]\s*\d+/i,
  /launch success rate\s*[:|]\s*\d+/i,
  /public beta approved/i,
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
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|future|known strategic|pending|awaiting|requires real|cannot|should not|did not|was not|not counted|not selected|not approved|0|zero)\b/i;

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
  "beta:verify:feedback-collection",
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
    name: `required Phase 25 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:feedback-collection",
  passed: packageJson.scripts?.["beta:verify:feedback-collection"] === "tsx scripts/verify-private-beta-feedback-collection.ts",
  detail: packageJson.scripts?.["beta:verify:feedback-collection"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `Phase 25 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const statusReport = readText("docs/private-beta-round-1-collection-status-report.md");
const phase25Result = readText("docs/phase-25-private-beta-feedback-collection.md");
const phase26Worksheet = readText("docs/private-beta-phase-26-decision-worksheet.md");

checks.push({
  name: "collection status report remains awaiting submissions",
  passed:
    /REAL_PRIVATE_BETA_FEEDBACK_COLLECTION_READY_AWAITING_SUBMISSIONS/i.test(statusReport) &&
    /Real tester feedback received \| 0/i.test(statusReport) &&
    /Private beta is not complete/i.test(statusReport),
  detail: "collection status checked",
});

checks.push({
  name: "Phase 25 result does not claim real feedback",
  passed:
    /No real private beta tester submissions have been recorded yet/i.test(phase25Result) &&
    /Real tester feedback \| 0/i.test(phase25Result) &&
    /Phase 26 has not started/i.test(phase25Result),
  detail: "Phase 25 result checked",
});

checks.push({
  name: "Phase 26 worksheet recommends continued collection",
  passed:
    /CONTINUE_REAL_PRIVATE_BETA_ROUND_1_COLLECTION/i.test(phase26Worksheet) &&
    /Phase 26 has not started/i.test(phase26Worksheet),
  detail: "Phase 26 decision worksheet checked",
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
    .flatMap((line, index) => (/phase 25|feedback collection|private beta collection/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 25 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 25 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-private-beta-feedback-collection.ts");
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
  name: "feedback collection verifier is static and non-executing",
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

