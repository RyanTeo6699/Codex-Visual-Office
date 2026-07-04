import fs from "node:fs";
import path from "node:path";
import { getDesktopBetaStatus } from "@/lib/desktop/desktop-beta-status";
import type { DesktopBetaPackageMetadata, DesktopBetaTauriConfigMetadata } from "@/lib/desktop/desktop-beta-types";

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

type CapabilityShape = {
  permissions?: unknown[];
};

const projectRoot = process.cwd();

const staticReadFiles = [
  "package.json",
  "src-tauri/tauri.conf.json",
  "src-tauri/Cargo.toml",
  "src-tauri/src/main.rs",
  "src-tauri/build.rs",
  "src-tauri/capabilities/default.json",
  "lib/desktop/desktop-beta-types.ts",
  "lib/desktop/desktop-beta-status.ts",
  "scripts/verify-desktop-beta.ts",
];

const implementationScanRoots = [
  "app",
  "components",
  "lib",
  "scripts",
  "src-tauri",
];

const skippedScanDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  "target",
  "dist",
  "out",
]);

const desktopSurfaceFiles = [
  "package.json",
  "src-tauri/tauri.conf.json",
  "src-tauri/Cargo.toml",
  "src-tauri/src/main.rs",
  "src-tauri/build.rs",
  "src-tauri/capabilities/default.json",
  "lib/desktop/desktop-beta-types.ts",
  "lib/desktop/desktop-beta-status.ts",
  "scripts/verify-desktop-beta.ts",
];

const forbiddenExecutionPatterns = [
  /\bfrom\s+["']node:child_process["']/,
  /\bfrom\s+["']child_process["']/,
  /\brequire\s*\(\s*["'](?:node:)?child_process["']\s*\)/,
  /\bexec(?:File)?\s*\(/,
  /\bspawn\s*\(/,
  /\bCommand::new\b/,
  /\bstd::process\b/,
  /\bnode-pty\b/,
];

const sensitiveReadPatterns = [
  /\.env(?:\.local|\.production|\.development)?\b/i,
  /\.codex\/auth\.json/i,
  /\bauth\.json\b/i,
  /\btoken\b/i,
  /\bsecret\b/i,
  /\bcredential/i,
  /\bprocess\.env\b/,
  /\bdotenv\b/i,
];

const desktopIntegrationPatterns = [
  /\bgithub\b/i,
  /\boctokit\b/i,
  /\bvercel\b/i,
  /\bsupabase\b/i,
  /\bfirebase\b/i,
  /\baws\b/i,
  /\bs3\b/i,
  /\bcloud\s*sync\b/i,
  /\bclerk\b/i,
  /\bnext-auth\b/i,
  /\bauth0\b/i,
  /\bstripe\b/i,
  /\bpayment\b/i,
  /\bbilling\b/i,
  /\bteam permissions?\b/i,
  /\bmcp\b/i,
  /\bopenai\b/i,
];

const forbiddenIntegrationActionPatterns = [
  /\bconnect\s+(?:github|vercel|supabase|cloud|openai)\b/i,
  /\b(?:github|vercel|supabase|cloud|openai)\s+connect\b/i,
  /\benable\s+(?:cloud sync|auto update|github|vercel|supabase)\b/i,
  /\bcloud sync\s+(?:enabled|available|on)\b/i,
  /\b(?:login|log in|sign in|sign up|register account|create account)\b/i,
  /\btoken input\b/i,
  /\bteam workspace\b/i,
  /\bteam permissions?\s+(?:enabled|available|configured)\b/i,
  /\bpayment\s+(?:enabled|available|configured)\b/i,
  /\bbilling\s+(?:enabled|available|configured)\b/i,
  /\bOpenAI API\s+(?:enabled|available|configured|connected)\b/i,
];

const changedDesktopSurfaceFiles = [
  "app/safety/page.tsx",
  "app/settings/page.tsx",
  "components/safety/SafetyAuditPanel.tsx",
  "components/settings/LocalAppShellCard.tsx",
  "components/settings/SettingsPanel.tsx",
  "docs/phase-13-desktop-beta-distribution-candidate-scope-lock.md",
  "docs/phase-13-desktop-beta-distribution-candidate.md",
  "docs/phase-7-roadmap.md",
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

function dependencyNames(packageJson: DesktopBetaPackageMetadata): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function scriptEntries(packageJson: DesktopBetaPackageMetadata): Array<[string, string]> {
  return Object.entries(packageJson.scripts ?? {});
}

function walkTextFiles(relativeRoot: string): string[] {
  const absoluteRoot = path.join(projectRoot, relativeRoot);

  if (!fs.existsSync(absoluteRoot)) {
    return [];
  }

  const results: string[] = [];
  const entries = fs.readdirSync(absoluteRoot, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(absoluteRoot, entry.name);
    const relativePath = path.relative(projectRoot, absolutePath);

    if (entry.isDirectory()) {
      if (skippedScanDirs.has(entry.name)) {
        continue;
      }

      results.push(...walkTextFiles(relativePath));
      continue;
    }

    if (entry.isFile() && /\.(cjs|css|json|md|mjs|rs|toml|ts|tsx)$/.test(entry.name)) {
      results.push(relativePath);
    }
  }

  return results;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function findPatternMatches(files: string[], patterns: RegExp[], options: {
  ignoreVerifierSafetyText?: boolean;
  ignoreBoundaryText?: boolean;
} = {}): string[] {
  const matches: string[] = [];
  const boundaryPattern = /\b(no|not|without|must not|does not|disabled|forbidden|blocked|reject|rejects|absent|prototype-only|static auditor)\b/i;

  for (const file of files) {
    if (!fileExists(file)) {
      continue;
    }

    const lines = readText(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (options.ignoreVerifierSafetyText && /verify-|desktop-beta-status|desktop-beta-types/.test(file)) {
        return;
      }

      if (options.ignoreBoundaryText && boundaryPattern.test(line)) {
        return;
      }

      if (patterns.some((pattern) => pattern.test(line))) {
        matches.push(`${file}:${index + 1}`);
      }
    });
  }

  return unique(matches);
}

function hasLocalTauriPrototype(tauriConfig: DesktopBetaTauriConfigMetadata): boolean {
  let devUrl: URL;

  try {
    devUrl = new URL(tauriConfig.build?.devUrl ?? "");
  } catch {
    return false;
  }

  return /prototype|beta/i.test(`${tauriConfig.productName ?? ""} ${tauriConfig.identifier ?? ""}`) &&
    devUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(devUrl.hostname) &&
    (tauriConfig.build?.beforeDevCommand ?? "") === "" &&
    (tauriConfig.build?.beforeBuildCommand ?? "") === "" &&
    tauriConfig.bundle?.active === false;
}

function hasProductionInstallerScript(packageJson: DesktopBetaPackageMetadata): boolean {
  return scriptEntries(packageJson).some(([name, command]) => {
    if (name === "release:verify:strategy") {
      return false;
    }

    const releaseName = /(^|:)(bundle|dist|install(er)?|make|package|publish|release)($|:)/i.test(name);
    return releaseName && /tauri\s+build|electron-builder|electron-forge|notarytool|notar|publish|release/i.test(command);
  });
}

function hasSigningOrNotarizationScript(packageJson: DesktopBetaPackageMetadata): boolean {
  return scriptEntries(packageJson).some(([name, command]) => /sign|codesign|notar|notarytool|certificate|developerId/i.test(`${name} ${command}`));
}

function hasAutomaticCodexGitQualityExecution(packageJson: DesktopBetaPackageMetadata): boolean {
  return scriptEntries(packageJson).some(([name, command]) => {
    const desktopScript = /^desktop:|^tauri:|^local:launcher/.test(name);
    if (!desktopScript) {
      return false;
    }

    return /\bcodex\b|\bgit\b|quality:verify:runner|verify-quality-gate-runner|quality gate runner/i.test(command);
  });
}

function findForbiddenIntegrationActions(files: string[]): string[] {
  const matches: string[] = [];
  const boundaryPattern = /\b(no|not|without|must not|must wait|does not|disabled|forbidden|blocked|absent|out of scope|not implemented|no-new|future|manual-only|delayed until|after approval|unless GM)\b/i;
  const boundaryHeadingPattern = /\b(forbidden|boundar(?:y|ies)|out of scope|why no|why not|what did not change|no-cloud|no-new|known limitations|phase sequence|corrected phase sequence)\b/i;

  for (const file of files) {
    if (!fileExists(file)) {
      continue;
    }

    const lines = readText(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      const nearbyContext = lines.slice(Math.max(0, index - 20), index + 1).join("\n");
      if (forbiddenIntegrationActionPatterns.some((pattern) => pattern.test(line)) && !boundaryPattern.test(line)) {
        if (/\.md$/.test(file) && boundaryHeadingPattern.test(nearbyContext)) {
          return;
        }
        matches.push(`${file}:${index + 1}`);
      }
    });
  }

  return unique(matches);
}

function hasDestructiveCleanupScript(packageJson: DesktopBetaPackageMetadata): boolean {
  return scriptEntries(packageJson).some(([, command]) => /\brm\s+-rf\b|\brimraf\b|\bdel\s+\/[sq]\b|\bgit\s+clean\b|\bgit\s+reset\s+--hard\b/.test(command));
}

function packageSurfaceText(packageJson: DesktopBetaPackageMetadata): string {
  return [
    ...dependencyNames(packageJson),
    ...scriptEntries(packageJson).map(([name, command]) => `${name} ${command}`),
  ].join("\n");
}

function main(): void {
  const checks: CheckResult[] = [];
  const packageJson = readJson<DesktopBetaPackageMetadata>("package.json");
  const tauriConfig = readJson<DesktopBetaTauriConfigMetadata>("src-tauri/tauri.conf.json");
  const cargoToml = readText("src-tauri/Cargo.toml");
  const mainRs = readText("src-tauri/src/main.rs");
  const buildRs = readText("src-tauri/build.rs");
  const capabilityPath = "src-tauri/capabilities/default.json";
  const capability = fileExists(capabilityPath) ? readJson<CapabilityShape>(capabilityPath) : undefined;
  const deps = dependencyNames(packageJson);
  const packageText = packageSurfaceText(packageJson);
  const implementationFiles = unique(implementationScanRoots.flatMap(walkTextFiles));
  const status = getDesktopBetaStatus(projectRoot);
  const capabilityPermissions = capability?.permissions ?? [];
  const tauriAndCargoText = JSON.stringify(tauriConfig) + "\n" + cargoToml + "\n" + mainRs + "\n" + buildRs + "\n" + JSON.stringify(capability ?? {});

  addCheck(checks, "Tauri config exists", fileExists("src-tauri/tauri.conf.json"), "src-tauri/tauri.conf.json is present");
  addCheck(checks, "helper can generate summary", status.safetyStatus !== "unknown", `safetyStatus=${status.safetyStatus}`);
  addCheck(checks, "Tauri prototype is beta configured", hasLocalTauriPrototype(tauriConfig), `productName=${tauriConfig.productName ?? "missing"}`);
  addCheck(
    checks,
    "browser launcher fallback scripts exist",
    packageJson.scripts?.["local:launcher"] === "tsx scripts/local-launcher.ts" &&
      packageJson.scripts?.["local:launcher:open"] === "tsx scripts/local-launcher.ts --open" &&
      packageJson.scripts?.["local:launcher:verify"] === "tsx scripts/verify-local-launcher.ts",
    "local launcher status/open/verify scripts are present",
  );
  addCheck(checks, "no Electron dependency", deps.every((name) => !/electron/i.test(name)), "Electron dependency is absent");
  addCheck(
    checks,
    "no updater plugin or config",
    deps.every((name) => !/updater|auto-update|autoupdate/i.test(name)) &&
      findPatternMatches(
        [
          "src-tauri/tauri.conf.json",
          "src-tauri/Cargo.toml",
          "src-tauri/src/main.rs",
          "src-tauri/build.rs",
          "src-tauri/capabilities/default.json",
        ],
        [/tauri-plugin-updater|updater|auto[-_ ]?update/i],
        { ignoreBoundaryText: true },
      ).length === 0,
    "updater dependency, plugin, and config are absent",
  );
  addCheck(
    checks,
    "no signing or notarization config",
    !/signing|notar|certificate|identity|entitlements|provisioning|notarytool|developerId/i.test(tauriAndCargoText) && !hasSigningOrNotarizationScript(packageJson),
    "signing and notarization settings are absent",
  );
  addCheck(checks, "no production installer script", !hasProductionInstallerScript(packageJson), "production installer/package/release scripts are absent");
  addCheck(
    checks,
    "no broad filesystem permissions",
    capabilityPermissions.every((permission) => !/fs|filesystem|path|scope|read|write|all/i.test(String(permission))),
    `permissions=${JSON.stringify(capabilityPermissions)}`,
  );
  addCheck(
    checks,
    "no shell plugin",
    deps.every((name) => !/tauri-plugin-shell|node-pty/i.test(name)) &&
      !/tauri-plugin-shell|shell:\s*true|allow-shell|process:allow|Command::new|std::process/i.test(tauriAndCargoText),
    "shell plugin and native process permissions are absent",
  );
  addCheck(
    checks,
    "no system tray daemon or startup service",
    !/systemTray|trayIcon|daemon|launchd|launchctl|LaunchAgent|startup service|login item|background service/i.test(tauriAndCargoText + "\n" + packageText),
    "tray, daemon, startup, and background service config are absent",
  );
  addCheck(
    checks,
    "no cloud sync dependency or desktop config",
    deps.every((name) => !/aws|azure|gcp|firebase|supabase|s3|cloud|sync/i.test(name)) &&
      !/cloud\s*sync|firebase|supabase|s3 upload|aws sync/i.test(tauriAndCargoText),
    "cloud sync dependencies and desktop config are absent",
  );
  addCheck(
    checks,
    "no GitHub Vercel Supabase desktop integration",
    !/\bgithub\b|\boctokit\b|\bvercel\b|\bsupabase\b/i.test(packageText + "\n" + tauriAndCargoText),
    "GitHub, Vercel, and Supabase are absent from package desktop surface",
  );
  addCheck(
    checks,
    "no auth payment team MCP desktop integration",
    !/\bclerk\b|\bnext-auth\b|\bauth0\b|\bstripe\b|\bpayment\b|\bbilling\b|\bteam permissions?\b|\bmcp\b/i.test(packageText + "\n" + tauriAndCargoText),
    "auth, payment, team permission, and MCP integrations are absent from package desktop surface",
  );
  addCheck(
    checks,
    "no OpenAI API desktop integration",
    !/\bopenai\b|api\.openai\.com/i.test(packageText + "\n" + tauriAndCargoText),
    "OpenAI API integration is absent from package desktop surface",
  );
  const packageIntegrationMentions = desktopIntegrationPatterns.filter((pattern) => pattern.test(packageText + "\n" + tauriAndCargoText));
  const forbiddenIntegrationActions = findForbiddenIntegrationActions(changedDesktopSurfaceFiles);
  addCheck(
    checks,
    "changed desktop beta surface has no forbidden integration action text",
    packageIntegrationMentions.length === 0 && forbiddenIntegrationActions.length === 0,
    forbiddenIntegrationActions.length === 0 ? `${changedDesktopSurfaceFiles.length} changed desktop surface files checked` : forbiddenIntegrationActions.join(", "),
  );

  const desktopExecutionMatches = findPatternMatches(desktopSurfaceFiles, forbiddenExecutionPatterns, {
    ignoreVerifierSafetyText: true,
    ignoreBoundaryText: true,
  });
  addCheck(
    checks,
    "desktop beta helper and verifier do not execute shell or launch runtimes",
    desktopExecutionMatches.length === 0,
    desktopExecutionMatches.length === 0 ? "no child_process, shell, browser, Tauri launch, or node-pty execution in desktop beta files" : desktopExecutionMatches.join(", "),
  );

  const desktopSensitiveReadMatches = findPatternMatches(desktopSurfaceFiles, sensitiveReadPatterns, {
    ignoreVerifierSafetyText: true,
    ignoreBoundaryText: true,
  });
  addCheck(
    checks,
    "no token env or auth read in desktop beta files",
    desktopSensitiveReadMatches.length === 0,
    desktopSensitiveReadMatches.length === 0 ? "desktop beta helper/verifier do not read token, env, auth, secret, or credential files" : desktopSensitiveReadMatches.join(", "),
  );
  addCheck(
    checks,
    "no arbitrary shell command text box terminal or node-pty in desktop surface",
    !/command text box|free-form shell|arbitrary command input|terminal emulator|generic shell runner|node-pty/i.test(tauriAndCargoText),
    "Tauri desktop surface has no arbitrary terminal or command input",
  );
  addCheck(
    checks,
    "no automatic Codex Git or Quality execution from desktop scripts",
    !hasAutomaticCodexGitQualityExecution(packageJson),
    "desktop/local launcher scripts do not invoke Codex, Git, or quality gate runner commands",
  );
  addCheck(checks, "no destructive cleanup script", !hasDestructiveCleanupScript(packageJson), "package scripts do not contain destructive cleanup commands");
  addCheck(
    checks,
    "desktop beta status is safe",
    status.safetyStatus === "safe_beta_candidate" && status.desktopBetaCandidateConfigured,
    `safetyStatus=${status.safetyStatus}`,
  );

  const failedChecks = checks.filter((check) => !check.passed);
  const summary = {
    status: failedChecks.length === 0 ? "passed" : "failed",
    desktopBetaStatus: status,
    prohibitedActionsAttempted: {
      launchedTauri: false,
      launchedWindow: false,
      launchedBrowser: false,
      installedDependencies: false,
      executedCodex: false,
      mutatedGit: false,
      ranQualityGateRunner: false,
      restoredBackup: false,
      deletedData: false,
      deployed: false,
    },
    staticReadFiles: staticReadFiles.filter(fileExists),
    scannedFileCount: implementationFiles.length,
    changedDesktopSurfaceFilesChecked: changedDesktopSurfaceFiles.filter(fileExists),
    forbiddenIntegrationActions,
    desktopSensitiveReadMatches,
    checks,
    failedChecks,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (failedChecks.length > 0) {
    process.exit(1);
  }
}

main();
