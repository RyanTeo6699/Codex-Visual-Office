import type { LocalShellReadiness } from "@/lib/local-shell/local-shell-types";

export type LocalLauncherMode = "status_only" | "open_browser";

export interface LocalLauncherExecutionAttempted {
  codex: false;
  git: false;
  qualityGate: false;
  devServer: false;
  packageInstall: false;
  desktopRuntime: false;
  cloudSync: false;
}

export interface LocalLauncherReport {
  appUrl: string;
  localShellReadiness: LocalShellReadiness;
  localDatabasePath: string;
  approvedProjectPathsReady: boolean;
  approvedProjectPathsCount: number;
  codexCliDetected: boolean;
  codexCliStatusLabel: string;
  qualityGateConfigReady: boolean;
  qualityGateConfigCount: number;
  browserOpenSupported: boolean;
  appReachable?: boolean;
  launchMode: LocalLauncherMode;
  executionAttempted: LocalLauncherExecutionAttempted;
}

export interface LocalLauncherCliOptions {
  open: boolean;
  checkUrl: boolean;
  json: boolean;
}

export interface BrowserOpenResult {
  attempted: boolean;
  supported: boolean;
  appUrl: string;
}

export type BrowserOpener = (appUrl: string) => Promise<void>;
