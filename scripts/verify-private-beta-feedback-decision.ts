import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-28-real-private-beta-feedback-review-fix-decision-scope-lock.md",
  "docs/private-beta-round-1-local-validation-feedback-record.md",
  "docs/private-beta-feedback-ledger-review.md",
  "docs/private-beta-issue-triage-review.md",
  "docs/private-beta-fix-batch-2-decision-report.md",
  "docs/private-beta-phase-29-recommendation.md",
  "docs/phase-28-real-private-beta-feedback-review-fix-decision.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 28 name", patterns: [/Phase 28 - Real Private Beta Feedback Review \/ Fix Batch Decision/i] },
  { name: "GM local validation sample", patterns: [/GM \/ local validation tester|GM local validation sample|gm_local_validation/i] },
  { name: "local validation pass", patterns: [/LOCAL_VALIDATION_SAMPLE_PASS/i] },
  { name: "single-machine limitation", patterns: [/single-machine validation/i] },
  { name: "no fake feedback", patterns: [/No fake tester feedback|fake tester feedback|without fabricating/i] },
  { name: "no beta completion claim", patterns: [/does not mean private beta round 1 is complete|does not mark private beta complete|not full private beta completion/i] },
  { name: "continue collection", patterns: [/CONTINUE_PRIVATE_BETA_COLLECTION|CONTINUE_COLLECTION|Continue Real Private Beta Collection/i] },
  { name: "no external tester feedback", patterns: [/No external tester feedback has been recorded yet/i] },
  { name: "no issues from this sample", patterns: [/P0[\s\S]*0[\s\S]*P1[\s\S]*0[\s\S]*P2[\s\S]*0[\s\S]*P3[\s\S]*0|Confirmed issues from GM local validation sample[\s\S]*0/i] },
  { name: "Fix Batch 2 not required from this sample", patterns: [/NO_FIX_BATCH_2_REQUIRED_FROM_THIS_SAMPLE/i] },
  { name: "Phase 29 not started", patterns: [/Phase 29 implementation has not started|Phase 29 Not Started/i] },
];

const unsupportedClaims = [
  /private beta completed/i,
  /real private beta completed/i,
  /public beta ready/i,
  /commercial launch ready/i,
  /external tester round completed/i,
  /external tester feedback received/i,
  /external tester count\s*[:|]\s*[1-9]\d*/i,
  /tester count\s*[:|]\s*[1-9]\d*/i,
  /issue count\s*[:|]\s*[1-9]\d*/i,
  /all beta issues are zero/i,
  /production package build completed/i,
  /public release implemented/i,
  /signed installer included/i,
  /notarized app included/i,
  /auto updater included/i,
  /cloud sync included/i,
  /Phase 29 implementation started/i,
];

const boundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|future|pending|awaiting|requires real|cannot|should not|did not|was not|not counted|not selected|not approved|0|zero|if no|unless|only|sample|limitation|possible|recommendation|has not started)\b/i;

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
  "beta:verify:collection-window",
  "beta:verify:outreach",
  "beta:verify:feedback-decision",
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
    name: `required Phase 28 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:feedback-decision",
  passed: packageJson.scripts?.["beta:verify:feedback-decision"] === "tsx scripts/verify-private-beta-feedback-decision.ts",
  detail: packageJson.scripts?.["beta:verify:feedback-decision"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `Phase 28 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const localRecord = readText("docs/private-beta-round-1-local-validation-feedback-record.md");
const ledger = readText("docs/private-beta-feedback-ledger-review.md");
const triage = readText("docs/private-beta-issue-triage-review.md");
const decision = readText("docs/private-beta-fix-batch-2-decision-report.md");
const recommendation = readText("docs/private-beta-phase-29-recommendation.md");
const resultDoc = readText("docs/phase-28-real-private-beta-feedback-review-fix-decision.md");

checks.push({
  name: "local validation record captures environment and commands",
  passed:
    /v24\.15\.0/i.test(localRecord) &&
    /11\.12\.1/i.test(localRecord) &&
    /npm run db:init/i.test(localRecord) &&
    /npm run build/i.test(localRecord) &&
    /http:\/\/localhost:3000/i.test(localRecord) &&
    /LOCAL_VALIDATION_SAMPLE_PASS/i.test(localRecord),
  detail: "local validation record checked",
});

checks.push({
  name: "feedback ledger keeps external tester count honest",
  passed:
    /One GM \/ local validation sample has been recorded/i.test(ledger) &&
    /External tester feedback[\s\S]*0/i.test(ledger) &&
    /does not claim external tester feedback/i.test(ledger),
  detail: "feedback ledger checked",
});

checks.push({
  name: "issue triage is limited to this sample",
  passed:
    /No issue was found in the GM \/ local validation sample/i.test(triage) &&
    /P0 count from this sample[\s\S]*0/i.test(triage) &&
    /does not claim all beta issues are zero/i.test(triage),
  detail: "issue triage checked",
});

checks.push({
  name: "Fix Batch 2 decision remains conservative",
  passed:
    /NO_FIX_BATCH_2_REQUIRED_FROM_THIS_SAMPLE/i.test(decision) &&
    /CONTINUE_PRIVATE_BETA_COLLECTION/i.test(decision) &&
    /external tester coverage remains insufficient/i.test(decision),
  detail: "fix batch decision checked",
});

checks.push({
  name: "Phase 29 recommendation is not implementation",
  passed:
    /Phase 29 - Continue Real Private Beta Collection \/ External Tester Intake/i.test(recommendation) &&
    /Phase 29 implementation has not started/i.test(recommendation),
  detail: "Phase 29 recommendation checked",
});

checks.push({
  name: "Phase 28 result contains non-claims",
  passed:
    /No fake tester feedback was added/i.test(resultDoc) &&
    /No private beta completion claim was added/i.test(resultDoc) &&
    /No public beta readiness claim was added/i.test(resultDoc) &&
    /Phase 29 implementation has not started/i.test(resultDoc),
  detail: "Phase 28 result checked",
});

const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !boundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not overclaim beta completion, public beta, launch, or issue scope",
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
    .flatMap((line, index) => (/phase 28|local validation sample|fix batch 2/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 28 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 28 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-private-beta-feedback-decision.ts");
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
  name: "feedback decision verifier is static and non-executing",
  passed: executionViolations.length === 0,
  detail: executionViolations.length === 0 ? JSON.stringify(prohibitedExecutionAttempted) : executionViolations.join(", "),
});

const failedChecks = checks.filter((check) => !check.passed);

console.log(
  JSON.stringify(
    {
      status: failedChecks.length === 0 ? "passed" : "failed",
      requiredDocs,
      forbiddenDependencyMatches,
      forbiddenScriptMatches,
      unsupportedDocClaims,
      prohibitedExecutionAttempted,
      checks,
      failedChecks,
    },
    null,
    2,
  ),
);

if (failedChecks.length > 0) {
  process.exit(1);
}

