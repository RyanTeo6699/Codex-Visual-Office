import fs from "node:fs";
import path from "node:path";
import { getAppRuntimeStatus } from "@/lib/app-runtime/app-runtime-status";

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type TauriConfigShape = {
  build?: {
    devUrl?: string;
    beforeDevCommand?: string;
    beforeBuildCommand?: string;
    frontendDist?: string;
  };
  bundle?: {
    active?: boolean;
  };
  plugins?: Record<string, unknown>;
};

type TauriCapabilitiesShape = {
  permissions?: string[];
};

const projectRoot = process.cwd();

const requiredFiles = [
  "docs/phase-32-app-first-desktop-runtime-scope-lock.md",
  "docs/phase-32-app-first-desktop-runtime-integration.md",
  "docs/app-first-runtime-diagnostics.md",
  "lib/app-runtime/app-runtime-types.ts",
  "lib/app-runtime/app-runtime-config.ts",
  "lib/app-runtime/app-runtime-status.ts",
  "lib/app-runtime/app-runtime-health.ts",
  "components/settings/AppFirstRuntimeCard.tsx",
];

const phase32ImplementationFiles = [
  "lib/app-runtime/app-runtime-types.ts",
  "lib/app-runtime/app-runtime-config.ts",
  "lib/app-runtime/app-runtime-status.ts",
  "lib/app-runtime/app-runtime-health.ts",
  "components/settings/AppFirstRuntimeCard.tsx",
  "components/settings/LocalAppShellCard.tsx",
  "components/settings/SettingsPanel.tsx",
  "components/safety/SafetyAuditPanel.tsx",
  "app/settings/page.tsx",
  "app/safety/page.tsx",
];

const forbiddenDependencyPatterns = [
  /^electron$/i,
  /electron-updater|update-electron-app/i,
  /node-pty/i,
  /tauri-plugin-(?:shell|updater|fs)/i,
  /^openai$/i,
  /@openai/i,
  /octokit|github/i,
  /vercel/i,
  /supabase/i,
  /stripe|clerk|next-auth|auth0/i,
  /modelcontextprotocol|mcp/i,
];

const forbiddenActiveTextPatterns = [
  /command text box/i,
  /token input/i,
  /terminal emulator/i,
  /arbitrary shell/i,
  /node-pty/i,
  /Install App/i,
  /Build DMG|Build EXE/i,
  /Auto Update/i,
  /Cloud Sync/i,
  /Connect GitHub|Connect Vercel|Connect Supabase|Connect OpenAI/i,
  /readFile(?:Sync)?\([^)]*(?:auth\.json|\.env)/i,
  /process\.env\.OPENAI_API_KEY/i,
  /api\.openai\.com/i,
  /shell:\s*true/i,
];

function addCheck(checks: CheckResult[], name: string, passed: boolean, detail: string): void {
  checks.push({ name, passed, detail });
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function dependencyNames(packageJson: PackageShape): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function hasLocalUrl(value: string | undefined): boolean {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function findForbiddenTextMatches(files: string[]): string[] {
  const matches: string[] = [];
  const boundaryText = /\b(no|not|without|must not|does not|disabled|forbidden|blocked|absent|not implemented|fallback)\b/i;

  for (const file of files) {
    if (!fileExists(file)) continue;

    const lines = readText(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (boundaryText.test(line)) return;
      if (/runnerPolicy\./.test(line)) return;
      if (forbiddenActiveTextPatterns.some((pattern) => pattern.test(line))) {
        matches.push(`${file}:${index + 1}`);
      }
    });
  }

  return matches;
}

function main(): void {
  const checks: CheckResult[] = [];
  const packageJson = readJson<PackageShape>("package.json");
  const tauriConfig = readJson<TauriConfigShape>("src-tauri/tauri.conf.json");
  const capabilities = readJson<TauriCapabilitiesShape>("src-tauri/capabilities/default.json");
  const cargoToml = readText("src-tauri/Cargo.toml");
  const status = getAppRuntimeStatus();

  for (const file of requiredFiles) {
    addCheck(checks, `required Phase 32 file exists: ${file}`, fileExists(file), fileExists(file) ? "present" : "missing");
  }

  addCheck(
    checks,
    "package script app:verify:runtime is registered",
    packageJson.scripts?.["app:verify:runtime"] === "tsx scripts/verify-app-first-runtime.ts",
    packageJson.scripts?.["app:verify:runtime"] ?? "missing",
  );

  addCheck(checks, "AppRuntimeStatus can be generated", status.appFirstMode === true, JSON.stringify({
    readiness: status.readiness,
    strategy: status.internalRuntimeStrategy,
  }));
  addCheck(checks, "manual localhost is not required for end users", status.manualLocalhostRequiredForEndUser === false, String(status.manualLocalhostRequiredForEndUser));
  addCheck(checks, "browser fallback remains available", status.browserFallbackAvailable === true, String(status.browserFallbackAvailable));
  addCheck(checks, "production packaging is not implemented", status.productionPackagingImplemented === false, String(status.productionPackagingImplemented));
  addCheck(checks, "signing/notarization/updater are not implemented", !status.signingImplemented && !status.notarizationImplemented && !status.autoUpdaterImplemented, JSON.stringify({
    signing: status.signingImplemented,
    notarization: status.notarizationImplemented,
    updater: status.autoUpdaterImplemented,
  }));

  addCheck(checks, "Tauri dev URL is local/internal", hasLocalUrl(tauriConfig.build?.devUrl), tauriConfig.build?.devUrl ?? "missing");
  addCheck(checks, "Tauri does not auto-start commands", !tauriConfig.build?.beforeDevCommand && !tauriConfig.build?.beforeBuildCommand, JSON.stringify(tauriConfig.build ?? {}));
  addCheck(checks, "Tauri bundle remains inactive", tauriConfig.bundle?.active === false, String(tauriConfig.bundle?.active));
  addCheck(checks, "Tauri has no plugins configured", !tauriConfig.plugins || Object.keys(tauriConfig.plugins).length === 0, JSON.stringify(tauriConfig.plugins ?? {}));
  addCheck(checks, "Tauri capabilities are core only", JSON.stringify(capabilities.permissions ?? []) === JSON.stringify(["core:default"]), JSON.stringify(capabilities.permissions ?? []));
  addCheck(checks, "Cargo has no shell/updater/fs plugin", !/tauri-plugin-(?:shell|updater|fs)|node-pty|electron/i.test(cargoToml), "Cargo.toml scanned");

  const forbiddenDeps = dependencyNames(packageJson).filter((dependency) => forbiddenDependencyPatterns.some((pattern) => pattern.test(dependency)));
  addCheck(checks, "forbidden dependencies absent", forbiddenDeps.length === 0, forbiddenDeps.length ? forbiddenDeps.join(", ") : "none found");

  const scriptText = Object.entries(packageJson.scripts ?? {}).map(([name, command]) => `${name}: ${command}`).join("\n");
  const forbiddenScriptHits = [
    /tauri\s+build/i,
    /electron/i,
    /auto.?updat/i,
    /\bdeploy\b/i,
    /vercel/i,
    /supabase/i,
    /git\s+(?:add|commit|push|reset|clean|checkout|merge|rebase)/i,
    /rm\s+-rf/i,
    /curl\b.*\|\s*sh/i,
  ].filter((pattern) => pattern.test(scriptText));
  addCheck(checks, "no production release/updater/deploy/mutating scripts", forbiddenScriptHits.length === 0, forbiddenScriptHits.map(String).join(", ") || "none found");

  const forbiddenTextMatches = findForbiddenTextMatches(phase32ImplementationFiles);
  addCheck(
    checks,
    "Phase 32 UI/helpers do not add forbidden active controls or secret reads",
    forbiddenTextMatches.length === 0,
    forbiddenTextMatches.length ? forbiddenTextMatches.join(", ") : `${phase32ImplementationFiles.length} files scanned`,
  );

  const failedChecks = checks.filter((check) => !check.passed);
  console.log(JSON.stringify({
    status: failedChecks.length === 0 ? "passed" : "failed",
    mode: "static_non_executing",
    appRuntimeStatus: {
      readiness: status.readiness,
      targetUrl: status.targetUrl,
      healthCheckMode: status.healthCheckMode,
      manualLocalhostRequiredForEndUser: status.manualLocalhostRequiredForEndUser,
      browserFallbackAvailable: status.browserFallbackAvailable,
      productionPackagingImplemented: status.productionPackagingImplemented,
      signingImplemented: status.signingImplemented,
      notarizationImplemented: status.notarizationImplemented,
      autoUpdaterImplemented: status.autoUpdaterImplemented,
    },
    prohibitedActionsAttempted: {
      codexExecution: false,
      gitMutation: false,
      qualityGateRunner: false,
      browserLaunch: false,
      tauriLaunch: false,
      packageInstall: false,
      deploy: false,
      destructiveCleanup: false,
      tokenOrEnvRead: false,
    },
    checks,
    failedChecks,
  }, null, 2));

  if (failedChecks.length > 0) {
    process.exit(1);
  }
}

main();
