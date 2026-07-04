import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-18-public-release-packaging-scope-lock.md",
  "docs/distribution-option-matrix.md",
  "docs/public-beta-readiness-assessment.md",
  "docs/packaging-risk-register.md",
  "docs/code-signing-notarization-plan.md",
  "docs/self-hosted-delivery-plan.md",
  "docs/commercialization-pre-scope.md",
  "docs/phase-18-public-release-packaging-strategy.md",
];

const requiredAssertions = [
  { name: "no signed/notarized package implemented", patterns: [/signed\/notarized.*not implemented/i, /no signed\/notarized/i, /not a signed.*notarized/i] },
  { name: "no auto updater", patterns: [/no auto updater/i, /auto updater.*not implemented/i] },
  { name: "no cloud sync", patterns: [/no cloud sync/i, /cloud sync.*not implemented/i] },
  { name: "no auth/payment/team/MCP", patterns: [/no auth.*payment.*team.*MCP/i, /auth, payment, team.*MCP.*not/i, /auth\/payment\/team\/MCP/i] },
  { name: "local-first baseline", patterns: [/local-first baseline/i, /Production 1\.0 local-first baseline/i] },
  { name: "browser launcher fallback", patterns: [/browser launcher fallback/i, /browser-only local launcher/i] },
];

const unsupportedClaims = [
  /public commercial launch ready/i,
  /commercial public launch ready/i,
  /public commercial release implemented/i,
  /signed.*notarized.*package.*implemented/i,
  /auto updater.*implemented/i,
  /cloud sync.*implemented/i,
  /team workspace.*implemented/i,
  /MCP.*implemented/i,
  /ChatGPT App.*implemented/i,
  /payment.*implemented/i,
  /auth.*implemented/i,
];

const negativeBoundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|planning only|not-ready|no-go)\b/i;

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
    name: `required Phase 18 doc: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

checks.push({
  name: "required script: release:verify:strategy",
  passed: Boolean(packageJson.scripts?.["release:verify:strategy"]),
  detail: packageJson.scripts?.["release:verify:strategy"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `release strategy docs state ${assertion.name}`,
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
  name: "docs do not claim unsupported public commercial release",
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
  name: "signing/notarization/updater/deploy release scripts absent",
  passed: forbiddenScriptMatches.length === 0,
  detail: forbiddenScriptMatches.length === 0 ? "none found" : forbiddenScriptMatches.join(", "),
});

const schemaOrMigrationMarkers = [
  ["lib/local-db/schema.ts", readText("lib/local-db/schema.ts")] as const,
  ["drizzle.config.ts", readText("drizzle.config.ts")] as const,
].flatMap(([file, text]) =>
  text
    .split(/\r?\n/)
    .flatMap((line, index) =>
      /phase 18|public release packaging|distribution strategy/i.test(line)
        ? [`${file}:${index + 1}`]
        : [],
    ),
);

checks.push({
  name: "no Phase 18 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 18 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-release-strategy.ts");
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
  name: "release strategy verifier is static and non-executing",
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
