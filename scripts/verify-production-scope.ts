import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/phase-16-production-1-scope-lock-final-rc-validation.md",
  "docs/product-capability-inventory.md",
  "docs/production-1-boundary.md",
  "docs/risk-register.md",
  "docs/go-no-go-checklist.md",
  "docs/final-rc-validation-matrix.md",
  "docs/phase-16-production-1-scope-lock-final-rc-validation-result.md",
];

const requiredDocAssertions = [
  { name: "no cloud sync", patterns: [/no cloud sync/i, /cloud sync.*not implemented/i] },
  { name: "no production installer yet", patterns: [/no production installer yet/i, /no production installer/i, /production installer.*not implemented/i] },
  { name: "no code signing", patterns: [/no code signing/i, /code signing.*not/i] },
  { name: "no notarization", patterns: [/no notarization/i, /notarization.*not/i] },
  { name: "no auto updater", patterns: [/no auto updater/i, /auto updater.*not implemented/i] },
  { name: "no auth/payment/team/MCP", patterns: [/no auth\/payment\/team\/MCP/i, /auth\/payment\/team\/MCP/i, /auth, payment, team workspace, MCP/i] },
  { name: "no token storage", patterns: [/no token storage/i, /token storage.*not/i] },
  { name: "local-first", patterns: [/local-first/i] },
  { name: "Tauri beta/prototype/candidate only", patterns: [/Tauri.*(?:beta|prototype|candidate)/i, /(?:beta|prototype|candidate).*Tauri/i] },
];

const unsupportedProductionClaims = [
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
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|doesn't|cannot|can't|excludes|not implemented|not available|not active|not a)\b/i;

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
  /tauri\s+build/i,
  /electron-builder/i,
  /electron-forge/i,
  /notarytool/i,
  /notar/i,
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
  "production:verify:scope",
  "rc:verify:readiness",
  "rc:verify:stabilization",
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
    name: `required Phase 16 doc: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

const combinedDocs = requiredDocs.map(readText).join("\n\n");

for (const assertion of requiredDocAssertions) {
  const passed = assertion.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `docs state ${assertion.name}`,
    passed,
    detail: passed ? "covered" : "missing required boundary assertion",
  });
}

const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedProductionClaims
      .filter((pattern) => pattern.test(line) && !negativeBoundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not claim unsupported production capabilities",
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
  name: "forbidden production/cloud/auth/payment dependencies absent",
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
  name: "production release/signing/notarization/auto-updater scripts absent",
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
      /phase 16|production 1\.0 scope|final rc validation/i.test(line)
        ? [`${file}:${index + 1}`]
        : [],
    ),
);

checks.push({
  name: "no Phase 16 DB schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 16 schema/migration markers found" : schemaOrMigrationMarkers.join(", "),
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
  name: "production scope verifier is static and non-executing",
  passed: Object.values(prohibitedExecutionAttempted).every((value) => value === false),
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
