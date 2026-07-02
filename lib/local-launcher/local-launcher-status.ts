import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getConfiguredLocalAppUrl, isBrowserOpenSupported, type LocalLauncherEnv } from "./local-launcher-config";
import type {
  BrowserOpener,
  BrowserOpenResult,
  LocalLauncherCliOptions,
  LocalLauncherExecutionAttempted,
  LocalLauncherMode,
  LocalLauncherReport,
} from "./local-launcher-types";
import { getLocalShellStatus } from "@/lib/local-shell/local-shell-status";

const execFileAsync = promisify(execFile);

export const fixedNoExecutionAttempted: LocalLauncherExecutionAttempted = {
  codex: false,
  git: false,
  qualityGate: false,
  devServer: false,
  packageInstall: false,
  desktopRuntime: false,
  cloudSync: false,
};

function fixedPlatformBrowserOpenCommand(appUrl: string, platform: NodeJS.Platform = process.platform): {
  command: string;
  args: string[];
} {
  if (platform === "darwin") {
    return { command: "open", args: [appUrl] };
  }

  if (platform === "win32") {
    return { command: "rundll32", args: ["url.dll,FileProtocolHandler", appUrl] };
  }

  return { command: "xdg-open", args: [appUrl] };
}

export async function openLocalAppUrl(appUrl: string): Promise<void> {
  const command = fixedPlatformBrowserOpenCommand(appUrl);

  await execFileAsync(command.command, command.args, {
    shell: false,
    timeout: 5000,
    windowsHide: true,
  });
}

export async function checkLocalAppReachable(appUrl: string): Promise<boolean> {
  try {
    const response = await fetch(appUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(2000),
    });

    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

export async function buildLocalLauncherReport(input: {
  mode?: LocalLauncherMode;
  checkUrl?: boolean;
  env?: LocalLauncherEnv;
} = {}): Promise<LocalLauncherReport> {
  const appUrl = getConfiguredLocalAppUrl(input.env);
  const localShellStatus = await getLocalShellStatus();
  const appReachable = input.checkUrl ? await checkLocalAppReachable(appUrl) : undefined;

  return {
    appUrl,
    localShellReadiness: localShellStatus.shellReadiness,
    localDatabasePath: localShellStatus.localDatabasePath,
    approvedProjectPathsReady: localShellStatus.approvedProjectPathsReady,
    approvedProjectPathsCount: localShellStatus.counts.approvedProjectPaths,
    codexCliDetected: localShellStatus.codexCliDetected,
    codexCliStatusLabel: localShellStatus.codexCliStatusLabel,
    qualityGateConfigReady: localShellStatus.qualityGatesConfigured,
    qualityGateConfigCount: localShellStatus.counts.qualityGateConfigs,
    browserOpenSupported: isBrowserOpenSupported(),
    appReachable,
    launchMode: input.mode ?? "status_only",
    executionAttempted: fixedNoExecutionAttempted,
  };
}

export async function maybeOpenBrowser(input: {
  appUrl: string;
  mode: LocalLauncherMode;
  opener?: BrowserOpener;
  platform?: NodeJS.Platform;
}): Promise<BrowserOpenResult> {
  if (input.mode !== "open_browser") {
    return {
      attempted: false,
      supported: isBrowserOpenSupported(input.platform),
      appUrl: input.appUrl,
    };
  }

  const supported = isBrowserOpenSupported(input.platform);
  if (!supported) {
    return {
      attempted: false,
      supported,
      appUrl: input.appUrl,
    };
  }

  await (input.opener ?? openLocalAppUrl)(input.appUrl);

  return {
    attempted: true,
    supported,
    appUrl: input.appUrl,
  };
}

export function parseLocalLauncherArgs(args: string[]): LocalLauncherCliOptions {
  const options: LocalLauncherCliOptions = {
    open: false,
    checkUrl: false,
    json: false,
  };

  for (const arg of args) {
    if (arg === "--open") {
      options.open = true;
      continue;
    }

    if (arg === "--check-url") {
      options.checkUrl = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    throw new Error(`Unknown local launcher argument: ${arg}`);
  }

  return options;
}
