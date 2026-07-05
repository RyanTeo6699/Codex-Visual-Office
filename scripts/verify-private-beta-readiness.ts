import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-19-private-local-beta-packaging-validation-scope-lock.md",
  "docs/private-beta-package-checklist.md",
  "docs/private-beta-tester-guide.md",
  "docs/private-beta-feedback-template.md",
  "docs/private-beta-issue-report-template.md",
  "docs/private-beta-support-runbook.md",
  "docs/private-beta-release-artifact-manifest.md",
  "docs/phase-19-private-local-beta-packaging-validation.md",
];

const requiredScripts = [
  "typecheck",
  "build",
  "local:launcher:verify",
  "local:shell:verify",
  "safety:verify:permissions",
  "desktop:verify:beta",
  "production:verify:freeze",
];

const requiredAssertions = [
  { name: "private beta", patterns: [/private beta/i] },
  { name: "local-first", patterns: [/local-first/i] },
  { name: "source checkout delivery", patterns: [/source checkout/i, /source-checkout/i] },
  { name: "no public commercial release", patterns: [/not a public commercial release/i, /no public commercial release/i] },
  { name: "no signed/notarized installer", patterns: [/no signed.*notarized/i, /not a signed.*notarized/i, /signed or notarized installer/i] },
  { name: "no auto updater", patterns: [/no auto updater/i, /not an auto-updating/i] },
  { name: "no cloud sync", patterns: [/no cloud sync/i] },
  { name: "no auth/payment/team/MCP", patterns: [/no auth.*payment.*team.*MCP/i, /auth\/payment\/team\/MCP/i] },
  { name: "no token sharing", patterns: [/no token sharing/i, /token.*should be shared/i, /must not ask for.*tokens/i] },
];

const unsupportedClaims = [
  /public commercial release ready/i,
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
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|excludes|not implemented|not included|not available|planning only|not a)\b/i;

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
    name: `required Phase 19 doc: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

for (const script of requiredScripts) {
  checks.push({
    name: `required private beta script: ${script}`,
    passed: Boolean(packageJson.scripts?.[script]),
    detail: packageJson.scripts?.[script] ?? "missing",
  });
}

checks.push({
  name: "required script: beta:verify:private",
  passed: Boolean(packageJson.scripts?.["beta:verify:private"]),
  detail: packageJson.scripts?.["beta:verify:private"] ?? "missing",
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `private beta docs state ${assertion.name}`,
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
  name: "docs do not claim unsupported public/commercial release capabilities",
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
    .flatMap((line, index) =>
      /phase 19|private local beta|private beta packaging/i.test(line)
        ? [`${file}:${index + 1}`]
        : [],
    ),
);

checks.push({
  name: "no Phase 19 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 19 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const ownSource = readText("scripts/verify-private-beta-readiness.ts");
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
  name: "private beta verifier is static and non-executing",
  passed: executionViolations.length === 0,
  detail: executionViolations.length === 0 ? JSON.stringify(prohibitedExecutionAttempted) : executionViolations.join(", "),
});

const failedChecks = checks.filter((check) => !check.passed);
const summary = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredDocs,
  requiredScripts,
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
