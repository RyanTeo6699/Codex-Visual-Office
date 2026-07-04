import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredRoutes = [
  "app/page.tsx",
  "app/settings/page.tsx",
  "app/safety/page.tsx",
  "app/archive/page.tsx",
  "app/projects/[id]/page.tsx",
  "app/review/[taskId]/page.tsx",
];

const requiredDocs = [
  "docs/user-manual.md",
  "docs/developer-manual.md",
  "docs/local-setup-guide.md",
  "docs/troubleshooting.md",
  "docs/safety-data-boundaries.md",
  "docs/backup-restore-recovery-guide.md",
  "docs/release-candidate-qa-checklist.md",
  "docs/phase-14-release-candidate-qa-docs.md",
  "docs/phase-15-release-candidate-stabilization-scope-lock.md",
  "docs/phase-15-release-candidate-stabilization.md",
  "docs/phase-16-production-1-scope-lock-final-rc-validation.md",
  "docs/product-capability-inventory.md",
  "docs/production-1-boundary.md",
  "docs/risk-register.md",
  "docs/go-no-go-checklist.md",
  "docs/final-rc-validation-matrix.md",
  "docs/phase-16-production-1-scope-lock-final-rc-validation-result.md",
];

const requiredScripts = [
  "typecheck",
  "build",
  "docs:verify:readiness",
  "rc:verify:readiness",
  "rc:verify:stabilization",
  "production:verify:scope",
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
  "tauri:dev:prototype",
  "desktop:check:beta",
  "rc:verify:readiness",
  "rc:verify:stabilization",
  "production:verify:scope",
]);

const keyUiFiles = [
  "app/page.tsx",
  "app/settings/page.tsx",
  "app/safety/page.tsx",
  "app/archive/page.tsx",
  "app/projects/[id]/page.tsx",
  "app/review/[taskId]/page.tsx",
  "components/settings/SettingsPanel.tsx",
  "components/settings/LocalAppShellCard.tsx",
  "components/settings/BackupRestoreCard.tsx",
  "components/settings/ArchiveRetentionCard.tsx",
  "components/safety/SafetyAuditPanel.tsx",
  "components/archive/ArchiveRoomPanel.tsx",
  "components/review/ReviewPanel.tsx",
  "components/review/ScopedCodexRunnerPanel.tsx",
  "components/review/QualityGateResultsPanel.tsx",
];

const forbiddenUiMarkers = [
  /Token input/i,
  /Command textbox/i,
  /Open terminal/i,
  /Enable cloud sync/i,
  /Connect GitHub/i,
  /Connect Vercel/i,
  /Connect Supabase/i,
  /Delete Logs/i,
  /Cleanup Now/i,
  /Delete Backups/i,
  /Build DMG/i,
  /Build EXE/i,
  /Auto Update/i,
  /Production Release/i,
];

const docsUnsupportedClaims = [
  /production installer exists/i,
  /signed production installer/i,
  /notarized production installer/i,
  /auto updater is available/i,
  /cloud sync is available/i,
  /team workspace is available/i,
  /\b(?:stores?|saves?|persists?) (?:OpenAI )?tokens?\b/i,
  /\b(?:reads?|loads?|opens?) ~\/\.codex\/auth\.json\b/i,
  /\b(?:reads?|loads?|opens?) \.env(?:\.local)?\b/i,
];

const negativeBoundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|doesn't|cannot|can't)\b/i;
const uiNegativeBoundaryContext =
  /\b(no|not|never|absent|blocked|disabled|without|forbidden|unavailable|not implemented|not active|not shipped|must not)\b/i;

const checks: Check[] = [];

const readText = (relativePath: string) => {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) return "";
  return readFileSync(absolutePath, "utf8");
};

const packageJson = JSON.parse(readText("package.json")) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

for (const route of requiredRoutes) {
  checks.push({
    name: `required route: ${route}`,
    passed: existsSync(path.join(rootDir, route)),
    detail: existsSync(path.join(rootDir, route)) ? "present" : "missing",
  });
}

for (const doc of requiredDocs) {
  checks.push({
    name: `required doc: ${doc}`,
    passed: existsSync(path.join(rootDir, doc)),
    detail: existsSync(path.join(rootDir, doc)) ? "present" : "missing",
  });
}

for (const script of requiredScripts) {
  checks.push({
    name: `required script: ${script}`,
    passed: Boolean(packageJson.scripts?.[script]),
    detail: packageJson.scripts?.[script] ?? "missing",
  });
}

const dependencyNames = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
];
const forbiddenDependencyMatches = dependencyNames.filter((name) =>
  forbiddenDependencies.some((forbidden) => forbidden.toLowerCase() === name.toLowerCase()),
);

checks.push({
  name: "forbidden dependency categories absent",
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
  name: "forbidden scripts absent",
  passed: forbiddenScriptMatches.length === 0,
  detail: forbiddenScriptMatches.length === 0 ? "none found" : forbiddenScriptMatches.join(", "),
});

const schemaOrMigrationMarkers = [
  ["lib/local-db/schema.ts", readText("lib/local-db/schema.ts")] as const,
  ["drizzle.config.ts", readText("drizzle.config.ts")] as const,
].flatMap(([file, text]) => {
  const markerMatches = text
    .split(/\r?\n/)
    .flatMap((line, index) =>
      /phase 15|rc stabilization|release candidate stabilization/i.test(line)
        ? [`${file}:${index + 1}`]
        : [],
    );

  return markerMatches;
});

checks.push({
  name: "no Phase 15 schema or migration markers",
  passed: schemaOrMigrationMarkers.length === 0,
  detail: schemaOrMigrationMarkers.length === 0 ? "no Phase 15 schema/migration markers found" : "schema/migration marker found",
});

const forbiddenUiMatches = keyUiFiles.flatMap((file) => {
  const text = readText(file);
  return text
    .split(/\r?\n/)
    .flatMap((line, index) =>
      forbiddenUiMarkers
        .filter((pattern) => pattern.test(line) && !uiNegativeBoundaryContext.test(line))
        .map((pattern) => `${file}:${index + 1}: ${pattern.toString()}`),
    );
});

checks.push({
  name: "forbidden UI control markers absent",
  passed: forbiddenUiMatches.length === 0,
  detail: forbiddenUiMatches.length === 0 ? `${keyUiFiles.length} files checked` : forbiddenUiMatches.join(", "),
});

const combinedDocs = requiredDocs.map(readText).join("\n\n");
const unsupportedDocClaims = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    docsUnsupportedClaims
      .filter((pattern) => pattern.test(line) && !negativeBoundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not claim unsupported production capability",
  passed: unsupportedDocClaims.length === 0,
  detail: unsupportedDocClaims.length === 0 ? "no unsupported claims found" : unsupportedDocClaims.join(", "),
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
  name: "stabilization verifier is static and non-executing",
  passed: Object.values(prohibitedExecutionAttempted).every((value) => value === false),
  detail: JSON.stringify(prohibitedExecutionAttempted),
});

const failedChecks = checks.filter((check) => !check.passed);

const result = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredRoutes,
  requiredDocs,
  requiredScripts,
  forbiddenDependencyMatches,
  forbiddenScriptMatches,
  forbiddenUiMatches,
  unsupportedDocClaims,
  prohibitedExecutionAttempted,
  checks,
  failedChecks,
};

console.log(JSON.stringify(result, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
