import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-29-external-tester-intake-scope-lock.md",
  "docs/private-beta-external-tester-intake-plan.md",
  "docs/private-beta-external-tester-consent-safety-acknowledgment.md",
  "docs/private-beta-external-tester-onboarding-tracker.md",
  "docs/private-beta-external-feedback-intake-ledger.md",
  "docs/private-beta-external-issue-intake-ledger.md",
  "docs/private-beta-external-tester-evidence-checklist.md",
  "docs/private-beta-phase-30-decision-gate.md",
  "docs/phase-29-external-tester-intake.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 29 name", pattern: /Phase 29 - Continue Real Private Beta Collection \/ External Tester Intake/i },
  { name: "external intake awaiting submissions status", pattern: /EXTERNAL_TESTER_INTAKE_READY_AWAITING_EXTERNAL_SUBMISSIONS/i },
  { name: "no fake external tester feedback", pattern: /fake external tester feedback|Do not fabricate external tester feedback|without fabricating tester feedback/i },
  { name: "no fake tester count", pattern: /fake tester count|Do not fabricate tester count|No external tester count/i },
  { name: "no fake submission count", pattern: /fake submission count|Do not fabricate submission count|No external tester count, invitation count, submission count/i },
  { name: "no fake issue count", pattern: /fake issue count|Do not fabricate issue rows|No external issue count/i },
  { name: "no public release", pattern: /not a public release|No public release|public release implementation/i },
  { name: "no signed or notarized installer", pattern: /not a signed installer|notarized|signed or notarized installer/i },
  { name: "no auto updater", pattern: /not auto-updating|auto updater/i },
  { name: "no cloud sync", pattern: /No cloud sync|cloud sync/i },
  { name: "no auth payment team MCP", pattern: /auth, payment, team workspace, MCP|auth\/payment\/team\/MCP/i },
  { name: "no token auth env private key sharing", pattern: /No token sharing|No `~\/\.codex\/auth\.json` sharing|No `\.env`|No private key sharing/i },
  { name: "GM local validation not external tester feedback", pattern: /GM local validation is not counted as `external_real_tester` feedback|not counted as external tester feedback|not counted as external tester onboarding/i },
  { name: "no beta completion claim", pattern: /does not claim private beta completion|does not make the product public beta ready|Do not claim beta completion/i },
  { name: "Phase 30 not started", pattern: /Phase 30 implementation has not started|Phase 30 has not started/i },
  { name: "continue external tester intake recommendation", pattern: /CONTINUE_EXTERNAL_TESTER_INTAKE/i },
];

const unsupportedClaims = [
  /private beta completed/i,
  /real private beta completed/i,
  /public beta ready/i,
  /public release ready/i,
  /commercial launch ready/i,
  /external tester feedback received/i,
  /external tester submissions received/i,
  /external tester count\s*[:|]\s*[1-9]\d*/i,
  /tester count\s*[:|]\s*[1-9]\d*/i,
  /submission count\s*[:|]\s*[1-9]\d*/i,
  /issue count\s*[:|]\s*[1-9]\d*/i,
  /setup success rate\s*[:|]\s*[1-9]\d*%/i,
  /launch success rate\s*[:|]\s*[1-9]\d*%/i,
  /all beta issues are zero/i,
  /production package build completed/i,
  /public release implemented/i,
  /signed installer included/i,
  /notarized app included/i,
  /auto updater included/i,
  /cloud sync included/i,
  /Phase 30 implementation started/i,
];

const boundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|future|pending|awaiting|requires real|cannot|should not|did not|was not|not counted|not selected|not approved|0|zero|if no|unless|only|sample|limitation|possible|recommendation|has not started|empty|no external|no real|does not claim)\b/i;

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
  "beta:verify:external-intake",
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
    name: `required Phase 29 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:external-intake",
  passed: packageJson.scripts?.["beta:verify:external-intake"] === "tsx scripts/verify-external-tester-intake.ts",
  detail: packageJson.scripts?.["beta:verify:external-intake"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.pattern.test(combinedDocs);
  checks.push({
    name: `Phase 29 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const onboarding = readText("docs/private-beta-external-tester-onboarding-tracker.md");
const feedbackLedger = readText("docs/private-beta-external-feedback-intake-ledger.md");
const issueLedger = readText("docs/private-beta-external-issue-intake-ledger.md");
const evidenceChecklist = readText("docs/private-beta-external-tester-evidence-checklist.md");
const phase30Gate = readText("docs/private-beta-phase-30-decision-gate.md");
const resultDoc = readText("docs/phase-29-external-tester-intake.md");

checks.push({
  name: "external onboarding tracker remains empty and count-honest",
  passed:
    /No external tester has been recorded yet/i.test(onboarding) &&
    /Invited external testers[\s\S]*0/i.test(onboarding) &&
    /Do not fabricate tester rows/i.test(onboarding),
  detail: "onboarding tracker checked",
});

checks.push({
  name: "external feedback ledger keeps GM local validation separate",
  passed:
    /No external tester feedback has been recorded yet/i.test(feedbackLedger) &&
    /GM \/ local validation samples[\s\S]*1[\s\S]*No/i.test(feedbackLedger) &&
    /Do not count GM local validation as external tester feedback/i.test(feedbackLedger),
  detail: "external feedback ledger checked",
});

checks.push({
  name: "external issue ledger remains empty without overclaiming",
  passed:
    /No external tester issue has been recorded yet/i.test(issueLedger) &&
    /Confirmed external issues[\s\S]*0/i.test(issueLedger) &&
    /not proof that the product has no issues/i.test(issueLedger),
  detail: "external issue ledger checked",
});

checks.push({
  name: "evidence checklist rejects sensitive material",
  passed:
    /tokens/i.test(evidenceChecklist) &&
    /auth\.json/i.test(evidenceChecklist) &&
    /\.env/i.test(evidenceChecklist) &&
    /Private keys/i.test(evidenceChecklist) &&
    /Local SQLite DB/i.test(evidenceChecklist) &&
    /not external tester evidence/i.test(evidenceChecklist),
  detail: "evidence checklist checked",
});

checks.push({
  name: "Phase 30 gate defaults to continue intake without submissions",
  passed:
    /If no external tester submissions exist/i.test(phase30Gate) &&
    /CONTINUE_EXTERNAL_TESTER_INTAKE/i.test(phase30Gate) &&
    /Phase 30 has not started/i.test(phase30Gate),
  detail: "Phase 30 decision gate checked",
});

checks.push({
  name: "Phase 29 result contains non-change and non-claim summary",
  passed:
    /No app feature was added/i.test(resultDoc) &&
    /No DB schema or migration was changed/i.test(resultDoc) &&
    /No dependency or lockfile was changed/i.test(resultDoc) &&
    /No external tester has been recorded yet/i.test(resultDoc) &&
    /Phase 30 implementation has not started/i.test(resultDoc),
  detail: "Phase 29 result checked",
});

const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !boundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not overclaim beta completion, external feedback, public release, launch, or issue scope",
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
    .flatMap((line, index) => (/phase 29|external tester intake|external feedback/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 29 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 29 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-external-tester-intake.ts");
const childModulePattern = new RegExp(`node:child_${"process"}|from ["']child_${"process"}["']`, "i");
const executionApiPattern = new RegExp(
  "\\bexecFileSync\\b|\\bexecSync\\b|\\bsp" +
    "awnSync\\b|\\bexecFile\\b|\\bexec\\b|\\bsp" +
    "awn\\b|\\bfork\\b",
);
const prohibitedExecutionAttempted = {
  childProcessImport: childModulePattern.test(ownSource),
  shellExecutionApi: executionApiPattern.test(ownSource),
  processMutation: /process\.env\s*=|process\.chdir|process\.exit\s*\(\s*0\s*\)/i.test(ownSource),
  dynamicImport: /import\s*\(/i.test(ownSource),
};

checks.push({
  name: "external intake verifier is static and non-executing",
  passed: Object.values(prohibitedExecutionAttempted).every((value) => !value),
  detail: JSON.stringify(prohibitedExecutionAttempted),
});

const failedChecks = checks.filter((check) => !check.passed);

const result = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredDocs,
  forbiddenDependencyMatches,
  forbiddenScriptMatches,
  unsupportedDocClaims,
  prohibitedExecutionAttempted,
  checks,
  failedChecks,
};

console.log(JSON.stringify(result, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
