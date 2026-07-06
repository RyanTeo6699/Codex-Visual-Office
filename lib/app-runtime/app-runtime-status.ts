import { getDesktopBetaStatus } from "@/lib/desktop/desktop-beta-status";
import { APP_FIRST_RUNTIME_HEALTH_CHECK_MODE, APP_FIRST_RUNTIME_TARGET_URL, appRuntimeModes } from "./app-runtime-config";
import { getAppRuntimeHealth } from "./app-runtime-health";
import type { AppRuntimeStatus } from "./app-runtime-types";

export function getAppRuntimeStatus(projectRoot = process.cwd()): AppRuntimeStatus {
  const desktop = getDesktopBetaStatus(projectRoot);
  const warnings: string[] = [
    "The app-first runtime strategy is configured, but bundled production runtime supervision is not implemented yet.",
    "Manual localhost access remains a contributor/support fallback, not the intended end-user path.",
  ];

  if (!desktop.tauriPrototypeConfigured) {
    warnings.push("Tauri prototype configuration needs review before app-first runtime work can proceed.");
  }

  if (!desktop.browserLauncherFallbackAvailable) {
    warnings.push("Browser launcher fallback is missing or changed.");
  }

  return {
    appFirstMode: true,
    desktopShellConfigured: desktop.desktopBetaCandidateConfigured,
    tauriPrototypeConfigured: desktop.tauriPrototypeConfigured,
    internalRuntimeStrategy: "app_first_desktop_runtime",
    targetUrl: APP_FIRST_RUNTIME_TARGET_URL,
    healthCheckMode: APP_FIRST_RUNTIME_HEALTH_CHECK_MODE,
    health: getAppRuntimeHealth(),
    readiness: desktop.tauriPrototypeConfigured ? "configured_strategy" : "needs_runtime_process_prototype",
    modes: [...appRuntimeModes],
    browserFallbackAvailable: desktop.browserLauncherFallbackAvailable,
    manualLocalhostRequiredForEndUser: false,
    productionPackagingImplemented: false,
    signingImplemented: false,
    notarizationImplemented: false,
    autoUpdaterImplemented: false,
    electronImplemented: false,
    cloudSyncImplemented: false,
    warnings,
    nextRecommendedAction: "Proceed to Phase 33 only after GM approval: implement app runtime health / failure screen or a controlled runtime process prototype without expanding shell, updater, cloud, or signing permissions.",
  };
}
