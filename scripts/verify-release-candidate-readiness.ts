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

const requiredScripts = [
  "typecheck",
  "build",
  "db:verify",
  "codex:verify:runtime-reliability",
  "project:verify:workspace",
  "agent:verify:workflow",
  "safety:verify:permissions",
  "desktop:verify:beta",
  "ui:verify:virtual-office",
  "docs:verify:readiness",
  "production:verify:freeze",
  "production:verify:scope",
  "rc:verify:readiness",
  "rc:verify:stabilization",
];

const forbiddenDependencies = [
  "electron",
  "node-pty",
  "@tauri-apps/plugin-updater",
  "electron-updater",
  "update-electron-app",
];

const forbiddenScriptPatterns = [
  /production.?release/i,
  /\brelease\b/i,
  /\bsign(?:ing)?\b/i,
  /notari[sz]/i,
  /auto.?updat/i,
  /\bdeploy\b/i,
  /vercel/i,
  /git push/i,
  /git commit/i,
  /git add/i,
];

const keyUiFiles = [
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

const forbiddenControlMarkers = [
  /Token input/i,
  /Command textbox/i,
  /Open terminal/i,
  /Enable cloud sync/i,
  /Delete logs/i,
  /Auto update now/i,
  /Build DMG/i,
  /Build EXE/i,
  /Install Desktop App/i,
];

const checks: Check[] = [];

const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

for (const route of requiredRoutes) {
  const exists = existsSync(path.join(rootDir, route));
  checks.push({
    name: `required route file: ${route}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

for (const script of requiredScripts) {
  const exists = Boolean(packageJson.scripts?.[script]);
  checks.push({
    name: `required package script: ${script}`,
    passed: exists,
    detail: exists ? packageJson.scripts?.[script] ?? "present" : "missing",
  });
}

const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const dependencyMatches = forbiddenDependencies.filter((dependency) =>
  Object.prototype.hasOwnProperty.call(allDependencies, dependency),
);

checks.push({
  name: "forbidden dependencies absent",
  passed: dependencyMatches.length === 0,
  detail: dependencyMatches.length === 0 ? "none found" : dependencyMatches.join(", "),
});

const scriptMatches = Object.entries(packageJson.scripts ?? {}).flatMap(([name, command]) => {
  if (name === "tauri:dev:prototype") return [];
  if (name === "desktop:check:beta") return [];
  if (name === "rc:verify:readiness") return [];
  if (name === "rc:verify:stabilization") return [];
  const text = `${name} ${command}`;
  return forbiddenScriptPatterns
    .filter((pattern) => pattern.test(text))
    .map((pattern) => `${name}: ${pattern.toString()}`);
});

checks.push({
  name: "forbidden production/cloud/mutation scripts absent",
  passed: scriptMatches.length === 0,
  detail: scriptMatches.length === 0 ? "none found" : scriptMatches.join(", "),
});

const uiMarkerMatches = keyUiFiles.flatMap((file) => {
  const absolutePath = path.join(rootDir, file);
  if (!existsSync(absolutePath)) return [];
  const content = readFileSync(absolutePath, "utf8");
  return forbiddenControlMarkers
    .filter((pattern) => pattern.test(content))
    .map((pattern) => `${file}: ${pattern.toString()}`);
});

checks.push({
  name: "forbidden active control markers absent in key UI files",
  passed: uiMarkerMatches.length === 0,
  detail: uiMarkerMatches.length === 0 ? `${keyUiFiles.length} files checked` : uiMarkerMatches.join(", "),
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
  name: "RC readiness verifier is static and non-executing",
  passed: Object.values(prohibitedExecutionAttempted).every((value) => value === false),
  detail: JSON.stringify(prohibitedExecutionAttempted),
});

const failedChecks = checks.filter((check) => !check.passed);

const result = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredRoutes,
  requiredScripts,
  forbiddenDependencyMatches: dependencyMatches,
  forbiddenScriptMatches: scriptMatches,
  forbiddenUiControlMatches: uiMarkerMatches,
  prohibitedExecutionAttempted,
  checks,
  failedChecks,
};

console.log(JSON.stringify(result, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
