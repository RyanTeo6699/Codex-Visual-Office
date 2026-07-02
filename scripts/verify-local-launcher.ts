import packageJson from "@/package.json";
import { DEFAULT_LOCAL_APP_URL, getConfiguredLocalAppUrl, validateLocalAppUrl } from "@/lib/local-launcher/local-launcher-config";
import { buildLocalLauncherReport, maybeOpenBrowser, parseLocalLauncherArgs } from "@/lib/local-launcher/local-launcher-status";

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const typedPackage = packageJson as PackageShape;

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

async function main(): Promise<void> {
  assert(getConfiguredLocalAppUrl({}) === DEFAULT_LOCAL_APP_URL, "Default local app URL should be used without env override");
  assert(validateLocalAppUrl("http://localhost:3000") === "http://localhost:3000", "localhost URL should be accepted");
  assert(validateLocalAppUrl("http://127.0.0.1:3000/review/task") === "http://127.0.0.1:3000/review/task", "127.0.0.1 URL should be accepted");
  assert(validateLocalAppUrl("http://[::1]:3000") === "http://[::1]:3000", "::1 URL should be accepted");
  assertThrows(() => validateLocalAppUrl("https://localhost:3000"), "https localhost URL should be rejected");
  assertThrows(() => validateLocalAppUrl("http://example.com:3000"), "Remote URL should be rejected");
  assertThrows(() => parseLocalLauncherArgs(["--command", "npm run dev"]), "Unknown CLI args should be rejected");

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

  const dependencyNames = packageDependencyNames();
  assert(dependencyNames.every((name) => !/tauri/i.test(name)), "Tauri dependency must not be added");
  assert(dependencyNames.every((name) => !/electron/i.test(name)), "Electron dependency must not be added");

  const scripts = typedPackage.scripts ?? {};
  assert(scripts["local:launcher"] === "tsx scripts/local-launcher.ts", "local:launcher script should be present");
  assert(scripts["local:launcher:open"] === "tsx scripts/local-launcher.ts --open", "local:launcher:open script should be present");
  assert(scripts["local:launcher:verify"] === "tsx scripts/verify-local-launcher.ts", "local:launcher:verify script should be present");
  assert(Object.values(scripts).every((script) => !/tauri|electron/i.test(script)), "Tauri/Electron scripts must not be added");

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
