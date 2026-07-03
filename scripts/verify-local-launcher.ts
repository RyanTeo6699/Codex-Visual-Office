import packageJson from "@/package.json";
import { readFileSync } from "node:fs";
import { DEFAULT_LOCAL_APP_URL, getConfiguredLocalAppUrl, validateLocalAppUrl } from "@/lib/local-launcher/local-launcher-config";
import { buildLocalLauncherReport, maybeOpenBrowser, parseLocalLauncherArgs } from "@/lib/local-launcher/local-launcher-status";

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const typedPackage = packageJson as PackageShape;
const allowedTauriPrototypeScriptName = "tauri:dev:prototype";
const allowedTauriPrototypeScriptCommand = "tauri dev";
const allowedTauriPrototypeVerifyScriptName = "tauri:verify:prototype";
const allowedTauriPrototypeVerifyScriptCommand = "tsx scripts/verify-tauri-prototype.ts";
const allowedTauriPrototypeDevDependency = "@tauri-apps/cli";
const forbiddenDesktopRuntimeDependencyPattern = /electron|node-pty/i;
const forbiddenCloudOrIntegrationDependencyPattern = /github|vercel|supabase|firebase|openai|mcp|auth|payment/i;
const forbiddenDesktopPackagingScriptPattern = /tauri\s+build|cargo\s+tauri\s+build|electron-builder|electron-forge|auto.?updat|installer|release|daemon|cron|startup|cloud.?sync/i;
const forbiddenLauncherTextPattern = /shell\s*:\s*true|node-pty|terminal|command text box/i;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(fn: () => unknown, message: string): void {
  let threw = false;

  try {
    fn();
  } catch {
    threw = true;
  }

  assert(threw, message);
}

function packageDependencyNames(): string[] {
  return [
    ...Object.keys(typedPackage.dependencies ?? {}),
    ...Object.keys(typedPackage.devDependencies ?? {}),
  ];
}

function assertNoForbiddenLauncherText(): void {
  const launcherFiles = [
    "scripts/local-launcher.ts",
    "lib/local-launcher/local-launcher-config.ts",
    "lib/local-launcher/local-launcher-status.ts",
    "lib/local-launcher/local-launcher-types.ts",
  ];

  for (const filePath of launcherFiles) {
    const fileText = readFileSync(filePath, "utf8");
    assert(!forbiddenLauncherTextPattern.test(fileText), `${filePath} must not include shell:true, terminal, node-pty, or command text box behavior`);
  }
}

function assertPhase7dTauriPrototypeAllowance(scripts: Record<string, string>): void {
  const productionDependencies = Object.keys(typedPackage.dependencies ?? {});
  const developmentDependencies = Object.keys(typedPackage.devDependencies ?? {});
  const tauriProductionDependencies = productionDependencies.filter((name) => /tauri/i.test(name));
  const tauriDevelopmentDependencies = developmentDependencies.filter((name) => /tauri/i.test(name));
  const tauriScripts = Object.entries(scripts).filter(([name, command]) => /tauri/i.test(name) || /tauri/i.test(command));

  assert(tauriProductionDependencies.length === 0, "Tauri runtime dependency must not be added to production dependencies");
  assert(
    tauriDevelopmentDependencies.every((name) => name === allowedTauriPrototypeDevDependency),
    "Only @tauri-apps/cli may be added as a Tauri devDependency for the Phase 7D prototype",
  );
  assert(
    tauriScripts.every(([name, command]) => (
      (name === allowedTauriPrototypeScriptName && command === allowedTauriPrototypeScriptCommand) ||
      (name === allowedTauriPrototypeVerifyScriptName && command === allowedTauriPrototypeVerifyScriptCommand)
    )),
    "Only tauri:dev:prototype and tauri:verify:prototype may reference Tauri, and both must use fixed prototype commands",
  );
}

function assertNoForbiddenDependencies(): void {
  const dependencyNames = packageDependencyNames();
  const disallowedRuntimeNames = dependencyNames.filter((name) => forbiddenDesktopRuntimeDependencyPattern.test(name));
  const disallowedIntegrationNames = dependencyNames.filter((name) => forbiddenCloudOrIntegrationDependencyPattern.test(name));

  assert(disallowedRuntimeNames.length === 0, `Forbidden desktop/runtime dependency found: ${disallowedRuntimeNames.join(", ")}`);
  assert(disallowedIntegrationNames.length === 0, `Forbidden cloud/API/auth/payment/MCP dependency found: ${disallowedIntegrationNames.join(", ")}`);
}

function assertNoForbiddenScripts(scripts: Record<string, string>): void {
  const forbiddenScripts = Object.entries(scripts).filter(([name, command]) => {
    if (name === allowedTauriPrototypeScriptName && command === allowedTauriPrototypeScriptCommand) {
      return false;
    }

    return forbiddenDesktopPackagingScriptPattern.test(name) || forbiddenDesktopPackagingScriptPattern.test(command) || /electron/i.test(name) || /electron/i.test(command);
  });

  assert(forbiddenScripts.length === 0, `Forbidden desktop packaging/updater/background script found: ${forbiddenScripts.map(([name]) => name).join(", ")}`);
}

async function main(): Promise<void> {
  assert(getConfiguredLocalAppUrl({}) === DEFAULT_LOCAL_APP_URL, "Default local app URL should be used without env override");
  assert(validateLocalAppUrl("http://localhost:3000") === "http://localhost:3000", "localhost URL should be accepted");
  assert(validateLocalAppUrl("http://127.0.0.1:3000/review/task") === "http://127.0.0.1:3000/review/task", "127.0.0.1 URL should be accepted");
  assert(validateLocalAppUrl("http://[::1]:3000") === "http://[::1]:3000", "::1 URL should be accepted");
  assertThrows(() => validateLocalAppUrl("https://localhost:3000"), "https localhost URL should be rejected");
  assertThrows(() => validateLocalAppUrl("http://example.com:3000"), "Remote URL should be rejected");
  assertThrows(() => validateLocalAppUrl("http://0.0.0.0:3000"), "0.0.0.0 URL should be rejected");
  assertThrows(() => validateLocalAppUrl("http://localhost.example.com:3000"), "localhost-looking remote URL should be rejected");
  assertThrows(() => validateLocalAppUrl("http://user:pass@localhost:3000"), "URLs with credentials should be rejected");
  assert(parseLocalLauncherArgs(["--json"]).json === true, "--json should be accepted");
  assert(parseLocalLauncherArgs(["--open"]).open === true, "--open should be accepted");
  assert(parseLocalLauncherArgs(["--check-url"]).checkUrl === true, "--check-url should be accepted");
  assertThrows(() => parseLocalLauncherArgs(["--command", "npm run dev"]), "Unknown CLI args should be rejected");
  assertThrows(() => parseLocalLauncherArgs(["npm", "run", "dev"]), "Custom command positional args should be rejected");

  const statusOnlyReport = await buildLocalLauncherReport({
    mode: "status_only",
    checkUrl: false,
    env: {},
  });
  assert(statusOnlyReport.appUrl === DEFAULT_LOCAL_APP_URL, "Launcher report should include app URL");
  assert(statusOnlyReport.localDatabasePath.includes(".local/codex-visual-office.sqlite"), "Launcher report should include local DB path");
  assert(typeof statusOnlyReport.approvedProjectPathsReady === "boolean", "Launcher report should include project path readiness");
  assert(typeof statusOnlyReport.approvedProjectPathsCount === "number", "Launcher report should include project path count");
  assert(typeof statusOnlyReport.codexCliDetected === "boolean", "Launcher report should include Codex CLI detection");
  assert(statusOnlyReport.codexCliStatusLabel.length > 0, "Launcher report should include Codex CLI status label");
  assert(typeof statusOnlyReport.qualityGateConfigReady === "boolean", "Launcher report should include quality gate readiness");
  assert(typeof statusOnlyReport.browserOpenSupported === "boolean", "Launcher report should include browser open support");
  assert(statusOnlyReport.appReachable === undefined, "Status-only mode should not check app reachability unless requested");
  assert(statusOnlyReport.launchMode === "status_only", "Default launcher mode should be status-only");
  assert(statusOnlyReport.executionAttempted.codex === false, "Codex execution must not be attempted");
  assert(statusOnlyReport.executionAttempted.git === false, "Git execution must not be attempted");
  assert(statusOnlyReport.executionAttempted.qualityGate === false, "Quality Gate execution must not be attempted");
  assert(statusOnlyReport.executionAttempted.devServer === false, "Dev server execution must not be attempted");
  assert(statusOnlyReport.executionAttempted.packageInstall === false, "Package install must not be attempted");
  assert(statusOnlyReport.executionAttempted.desktopRuntime === false, "Desktop runtime must not be attempted");
  assert(statusOnlyReport.executionAttempted.cloudSync === false, "Cloud sync must not be attempted");

  let openedUrl: string | undefined;
  const statusOnlyOpen = await maybeOpenBrowser({
    appUrl: statusOnlyReport.appUrl,
    mode: "status_only",
    opener: async (appUrl) => {
      openedUrl = appUrl;
    },
  });
  assert(statusOnlyOpen.attempted === false, "Status-only mode must not open the browser");
  assert(openedUrl === undefined, "Status-only mode must not call the injected opener");

  const openReport = await buildLocalLauncherReport({
    mode: "open_browser",
    checkUrl: false,
    env: {
      CVO_LOCAL_APP_URL: "http://127.0.0.1:3000",
    },
  });
  const openResult = await maybeOpenBrowser({
    appUrl: openReport.appUrl,
    mode: "open_browser",
    opener: async (appUrl) => {
      openedUrl = appUrl;
    },
  });
  assert(openResult.attempted === true, "--open mode should call the injected opener");
  assert(openedUrl === "http://127.0.0.1:3000", "--open mode should only pass the validated fixed local URL");

  const scripts = typedPackage.scripts ?? {};
  assert(scripts["local:launcher"] === "tsx scripts/local-launcher.ts", "local:launcher script should be present");
  assert(scripts["local:launcher:open"] === "tsx scripts/local-launcher.ts --open", "local:launcher:open script should be present");
  assert(scripts["local:launcher:verify"] === "tsx scripts/verify-local-launcher.ts", "local:launcher:verify script should be present");
  assertPhase7dTauriPrototypeAllowance(scripts);
  assertNoForbiddenDependencies();
  assertNoForbiddenScripts(scripts);
  assertNoForbiddenLauncherText();

  console.log("Local launcher verification passed");
  console.log(JSON.stringify({
    appUrl: statusOnlyReport.appUrl,
    localShellReadiness: statusOnlyReport.localShellReadiness,
    approvedProjectPathsReady: statusOnlyReport.approvedProjectPathsReady,
    approvedProjectPathsCount: statusOnlyReport.approvedProjectPathsCount,
    qualityGateConfigReady: statusOnlyReport.qualityGateConfigReady,
    codexCliDetected: statusOnlyReport.codexCliDetected,
    browserOpenSupported: statusOnlyReport.browserOpenSupported,
    openPathVerifiedWithFakeOpener: openResult.attempted,
    executionAttempted: statusOnlyReport.executionAttempted,
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local launcher verification failed");
  console.error(error);
  process.exit(1);
});
