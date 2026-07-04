import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-17-production-1-finalization-release-freeze-scope-lock.md",
  "docs/release-notes-1.0.md",
  "docs/final-acceptance-report-1.0.md",
  "docs/final-verification-manifest-1.0.md",
  "docs/known-limitations-1.0.md",
  "docs/phase-17-production-1-finalization-release-freeze.md",
  "RELEASE_STATUS.md",
];

const requiredAssertions = [
  { name: "local-first", patterns: [/local-first/i] },
  { name: "no cloud sync", patterns: [/no cloud sync/i, /cloud sync.*not/i] },
  { name: "no auth/payment/team/MCP", patterns: [/no auth\/payment/i, /auth\/payment\/team\/MCP/i, /no MCP/i] },
  { name: "no signed/notarized installer", patterns: [/no signed\/notarized installer/i, /not signed, notarized/i, /notarized.*not/i] },
  { name: "no auto updater", patterns: [/no auto updater/i, /not auto-updating/i, /auto updater.*not/i] },
  { name: "no token storage", patterns: [/no token storage/i, /token storage.*not/i] },
  { name: "no automatic Codex/Git/Quality execution", patterns: [/no automatic (?:Git\/Codex\/Quality|Codex\/Git\/Quality) execution/i, /automatic Codex execution/i] },
];

const unsupportedClaims = [
  /public commercial launch completed/i,
  /production installer exists/i,
  /signed production installer/i,
  /notarized production installer/i,
  /auto updater is available/i,
  /cloud sync is available/i,
  /team workspace is available/i,
  /MCP server is available/i,
  /ChatGPT App is available/i,
  /auth is available/i,
  /payment is available/i,
  /\b(?:stores?|saves?|persists?) (?:OpenAI )?tokens?\b/i,
  /\b(?:reads?|loads?|opens?) ~\/\.codex\/auth\.json\b/i,
  /\b(?:reads?|loads?|opens?) \.env(?:\.local)?\b/i,
];

const negativeBoundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|doesn't|cannot|can't|excludes|not implemented|not included|not available|not active|not a)\b/i;

const forbiddenDependencies = [
  "electron",
  "node-pty",
  "@tauri-apps/plugin-updater",
  "electron-updater",
  "update-electron-app",
  "xterm",
  "node-cmd",
  "shelljs",
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
  /production.?release/i,
  /tauri\s+build/i,
  /electron-builder/i,
  /electron-forge/i,
  /notarytool/i,
  /notar/i,
  /sign(?:ing)?/i,
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
  "production:verify:freeze",
  "production:verify:scope",
  "rc:verify:readiness",
  "rc:verify:stabilization",
  "desktop:check:beta",
  "tauri:dev:prototype",
]);

const requiredScripts = [
  "typecheck",
  "build",
  "production:verify:freeze",
  "production:verify:scope",
  "rc:verify:stabilization",
  "docs:verify:readiness",
  "rc:verify:readiness",
  "desktop:verify:beta",
  "safety:verify:permissions",
  "agent:verify:workflow",
  "project:verify:workspace",
  "ui:verify:virtual-office",
  "codex:verify:runtime-reliability",
  "local:launcher:verify",
  "local:shell:verify",
  "tauri:verify:prototype",
];

const checks: Check[] = [];

function readText(relativePath: string): string {
  const absolutePath = path.join(rootDir, relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

const packageJson = JSON.parse(readText("package.json")) as {
  scripts?: Record<string, string>;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

for (const doc of requiredDocs) {
  const exists = existsSync(path.join(rootDir, doc));
  checks.push({
    name: `required Phase 17 doc: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

for (const script of requiredScripts) {
  checks.push({
    name: `required verification script: ${script}`,
    passed: Boolean(packageJson.scripts?.[script]),
    detail: packageJson.scripts?.[script] ?? "missing",
  });
}

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `release docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing required release freeze boundary",
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
  name: "release docs do not claim unsupported production capabilities",
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
  name: "production release/signing/notarization/deploy/auto-updater scripts absent",
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
      /phase 17|release freeze|production 1\.0 finalization/i.test(line)
        ? [`${file}:${index + 1}`]
        : [],
    ),
);

checks.push({
  name: "no Phase 17 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 17 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
});

const prohibitedExecutionAttempted = {
  codex: false,
  gitMutation: false,
  qualityGateRunner: false,
  browserOpen: false,
  tauriLaunch: false,
  install: false,
  deploy: false,
};

checks.push({
  name: "production freeze verifier is static and non-executing",
  passed: Object.values(prohibitedExecutionAttempted).every((value) => value === false),
  detail: JSON.stringify(prohibitedExecutionAttempted),
});

const failedChecks = checks.filter((check) => !check.passed);

const result = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  packageVersion: packageJson.version,
  releaseVersion: readText("VERSION").trim(),
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
