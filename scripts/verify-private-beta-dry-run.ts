import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-21-private-beta-dry-run-scope-lock.md",
  "docs/private-beta-simulated-tester-scenarios.md",
  "docs/private-beta-dry-run-execution-checklist.md",
  "docs/private-beta-sample-feedback-entries.md",
  "docs/private-beta-sample-issue-reports.md",
  "docs/private-beta-sample-triage-output.md",
  "docs/private-beta-round-1-dry-run-results.md",
  "docs/phase-21-private-beta-dry-run-feedback-simulation.md",
];

const requiredAssertions = [
  { name: "dry-run / simulated feedback", patterns: [/dry-run/i, /simulated feedback/i, /simulated tester/i] },
  { name: "not real public release", patterns: [/not.*real public release/i, /no public release/i] },
  { name: "local-first", patterns: [/local-first/i] },
  { name: "no signed/notarized installer", patterns: [/no signed.*notarized/i, /signed.*notarized.*installer/i] },
  { name: "no auto updater", patterns: [/no auto updater/i, /auto updater.*was added/i] },
  { name: "no cloud sync", patterns: [/no cloud sync/i] },
  { name: "no auth/payment/team/MCP", patterns: [/auth.*payment.*team.*MCP/i, /auth\/payment\/team\/MCP/i] },
  { name: "no token sharing", patterns: [/tokens/i, /auth.json/i, /\\.env/i] },
  { name: "readiness conclusion", patterns: [/READY_FOR_REAL_PRIVATE_BETA/i, /READY_WITH_CAUTION/i, /BLOCKED_NEEDS_FIX_BATCH/i] },
  { name: "Phase 22 recommendation", patterns: [/Phase 22 - Private Beta Fix Batch 1/i, /Phase 22 - Real Private Beta Round 1 Execution/i] },
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

const negativeBoundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|planning only|not a|did not|was not|dry-run|simulated)\b/i;

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
    name: `required Phase 21 doc: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: beta:verify:dry-run",
  passed: Boolean(packageJson.scripts?.["beta:verify:dry-run"]),
  detail: packageJson.scripts?.["beta:verify:dry-run"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `private beta dry-run docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing",
  });
}

const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !negativeBoundaryContext.test(line))
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
    .flatMap((line, index) => (/phase 21|private beta dry-run|feedback simulation/i.test(line) ? [`${file}:${index + 1}`] : [])),
);

checks.push({
  name: "no Phase 21 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 21 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-private-beta-dry-run.ts");
const childProcessModulePattern = new RegExp(`node:child_${"process"}|from ["']child_${"process"}["']`, "i");
const prohibitedExecutionAttempted = {
  childProcessImport: childProcessModulePattern.test(ownSource),
  shellExecutionApi: /\bexecFileSync\b|\bexecSync\b|\bspawnSync\b|\bexecFile\b|\bexec\b|\bspawn\b/.test(ownSource),
  processMutation: /process\.chdir|process\.kill|process\.env\[[^\]]+\]\s*=/i.test(ownSource),
  dynamicImport: /await import\(|import\(/i.test(ownSource),
};

const executionViolations = Object.entries(prohibitedExecutionAttempted)
  .filter(([, attempted]) => attempted)
  .map(([name]) => name);

checks.push({
  name: "private beta dry-run verifier is static and non-executing",
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
