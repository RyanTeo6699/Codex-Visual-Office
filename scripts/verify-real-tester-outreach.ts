import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-27-real-tester-outreach-execution-packet-scope-lock.md",
  "docs/private-beta-round-1-invitee-shortlist-template.md",
  "docs/private-beta-outbound-invitation-messages.md",
  "docs/private-beta-round-1-follow-up-schedule.md",
  "docs/private-beta-tester-feedback-submission-packet.md",
  "docs/private-beta-gm-manual-collection-playbook.md",
  "docs/private-beta-first-response-support-script.md",
  "docs/private-beta-tester-privacy-safety-notice.md",
  "docs/private-beta-phase-28-feedback-review-readiness-gate.md",
  "docs/phase-27-real-tester-outreach-execution-packet.md",
  "RELEASE_STATUS.md",
  "docs/ROADMAP.md",
  "docs/phase-7-roadmap.md",
];

const requiredAssertions = [
  { name: "Phase 27 name", patterns: [/Phase 27 - Continue Collection \/ Real Tester Outreach Execution Packet/i] },
  { name: "outreach packet awaiting invitations or submissions", patterns: [/REAL_TESTER_OUTREACH_PACKET_READY_AWAITING_INVITATIONS_OR_SUBMISSIONS/i] },
  { name: "private beta", patterns: [/private beta/i] },
  { name: "local-first", patterns: [/local-first/i] },
  { name: "source checkout or local launcher", patterns: [/source checkout|local launcher/i] },
  { name: "no fake tester feedback", patterns: [/fake tester feedback|without fabricating tester feedback|do not claim tester feedback/i] },
  { name: "no fake tester count", patterns: [/fake tester count|No real invitees|Placeholder rows do not count/i] },
  { name: "no fake invitation count", patterns: [/fake invitation count|draft.*not count as sent|no invitation count/i] },
  { name: "no fake submission count", patterns: [/fake submission count|No real feedback submissions|no submission count/i] },
  { name: "no public release", patterns: [/no public release|not a public release|public release implementation/i] },
  { name: "no signed or notarized installer", patterns: [/signed or notarized installer|notarized app|no signed/i] },
  { name: "no auto updater", patterns: [/auto updater/i] },
  { name: "no cloud sync", patterns: [/cloud sync/i] },
  { name: "no auth payment team MCP", patterns: [/auth.*payment.*team.*MCP|auth, payment, team workspace, MCP|auth\/payment\/team\/MCP/i] },
  { name: "no token auth env private key sharing", patterns: [/token/i, /auth\.json/i, /\.env/i, /private key/i] },
  { name: "continue collection without submissions", patterns: [/CONTINUE_COLLECTION/i] },
  { name: "Phase 28 not started", patterns: [/Phase 28 implementation has not started|not Phase 28 implementation/i] },
];

const unsupportedClaims = [
  /private beta completed/i,
  /real private beta completed/i,
  /tester feedback received/i,
  /feedback received/i,
  /submissions collected/i,
  /survey responses/i,
  /tester count\s*[:|]\s*\d+/i,
  /invitee count\s*[:|]\s*\d+/i,
  /invitation count\s*[:|]\s*\d+/i,
  /submission count\s*[:|]\s*[1-9]\d*/i,
  /issue count\s*[:|]\s*\d+/i,
  /setup success rate\s*[:|]\s*\d+/i,
  /launch success rate\s*[:|]\s*\d+/i,
  /PROCEED_TO_PHASE_28_FEEDBACK_REVIEW selected/i,
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
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|future|pending|awaiting|requires real|cannot|should not|did not|was not|not counted|not selected|not approved|0|zero|if no|unless|template|placeholder|possible decision|example|only after)\b/i;

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
    name: `required Phase 27 doc/status file: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:outreach",
  passed: packageJson.scripts?.["beta:verify:outreach"] === "tsx scripts/verify-real-tester-outreach.ts",
  detail: packageJson.scripts?.["beta:verify:outreach"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `Phase 27 docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const shortlist = readText("docs/private-beta-round-1-invitee-shortlist-template.md");
const invitations = readText("docs/private-beta-outbound-invitation-messages.md");
const schedule = readText("docs/private-beta-round-1-follow-up-schedule.md");
const submissionPacket = readText("docs/private-beta-tester-feedback-submission-packet.md");
const gate = readText("docs/private-beta-phase-28-feedback-review-readiness-gate.md");
const resultDoc = readText("docs/phase-27-real-tester-outreach-execution-packet.md");

checks.push({
  name: "invitee shortlist remains template-only",
  passed:
    /No real invitees have been recorded/i.test(shortlist) &&
    /Placeholder rows do not count as invitees/i.test(shortlist),
  detail: "shortlist template checked",
});

checks.push({
  name: "outbound messages are manual and local-first",
  passed:
    /GM may copy these messages manually/i.test(invitations) &&
    /local-first/i.test(invitations) &&
    /no signed installer/i.test(invitations) &&
    /no cloud sync/i.test(invitations),
  detail: "invitation messages checked",
});

checks.push({
  name: "follow-up schedule has no automation",
  passed:
    /does not automate messages/i.test(schedule) &&
    /Day 0/i.test(schedule) &&
    /Day 2/i.test(schedule) &&
    /Day 5/i.test(schedule) &&
    /Day 7/i.test(schedule),
  detail: "follow-up schedule checked",
});

checks.push({
  name: "submission packet forbids sensitive data",
  passed:
    /What Not To Include/i.test(submissionPacket) &&
    /auth\.json/i.test(submissionPacket) &&
    /\.env/i.test(submissionPacket) &&
    /Private keys/i.test(submissionPacket) &&
    /Local SQLite database files/i.test(submissionPacket),
  detail: "submission packet checked",
});

checks.push({
  name: "Phase 28 gate remains gated and continues collection without submissions",
  passed:
    /Required Conditions To Enter Phase 28/i.test(gate) &&
    /At least one real feedback submission exists/i.test(gate) &&
    /CONTINUE_COLLECTION/i.test(gate) &&
    /Phase 28 implementation has not started/i.test(gate),
  detail: "Phase 28 gate checked",
});

checks.push({
  name: "Phase 27 result does not claim beta completion",
  passed:
    /REAL_TESTER_OUTREACH_PACKET_READY_AWAITING_INVITATIONS_OR_SUBMISSIONS/i.test(resultDoc) &&
    /No fake tester feedback was added/i.test(resultDoc) &&
    /No beta completion claim was added/i.test(resultDoc) &&
    /Phase 28 implementation has not started/i.test(resultDoc),
  detail: "Phase 27 result checked",
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
    .flatMap((line, index) => (/phase 27|tester outreach|outreach packet/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 27 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 27 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-real-tester-outreach.ts");
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
  name: "outreach verifier is static and non-executing",
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

