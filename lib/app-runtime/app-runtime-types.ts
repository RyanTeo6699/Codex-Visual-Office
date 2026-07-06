export type AppRuntimeStrategy = "app_first_desktop_runtime";
export type AppRuntimeHealthCheckMode = "status_only" | "internal_local_http_probe";
export type AppRuntimeReadiness = "configured_strategy" | "needs_runtime_process_prototype" | "blocked";
export type AppRuntimeMode = "dev_mode" | "app_mode" | "fallback_mode";

export interface AppRuntimeModeStatus {
  mode: AppRuntimeMode;
  label: string;
  description: string;
  targetUrl: string;
  endUserPrimaryPath: boolean;
}

export interface AppRuntimeHealth {
  checked: boolean;
  reachable?: boolean;
  mode: AppRuntimeHealthCheckMode;
  targetUrl: string;
  diagnostic: string;
}

export interface AppRuntimeStatus {
  appFirstMode: true;
  desktopShellConfigured: boolean;
  tauriPrototypeConfigured: boolean;
  internalRuntimeStrategy: AppRuntimeStrategy;
  targetUrl: string;
  healthCheckMode: AppRuntimeHealthCheckMode;
  health: AppRuntimeHealth;
  readiness: AppRuntimeReadiness;
  modes: AppRuntimeModeStatus[];
  browserFallbackAvailable: boolean;
  manualLocalhostRequiredForEndUser: false;
  productionPackagingImplemented: false;
  signingImplemented: false;
  notarizationImplemented: false;
  autoUpdaterImplemented: false;
  electronImplemented: false;
  cloudSyncImplemented: false;
  warnings: string[];
  nextRecommendedAction: string;
}
