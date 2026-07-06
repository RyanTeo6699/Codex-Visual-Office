import type { AppRuntimeHealth } from "./app-runtime-types";
import { APP_FIRST_RUNTIME_HEALTH_CHECK_MODE, APP_FIRST_RUNTIME_TARGET_URL } from "./app-runtime-config";

export function getAppRuntimeHealth(): AppRuntimeHealth {
  return {
    checked: false,
    mode: APP_FIRST_RUNTIME_HEALTH_CHECK_MODE,
    targetUrl: APP_FIRST_RUNTIME_TARGET_URL,
    diagnostic: "Phase 32 records runtime strategy only. Live process supervision and failure-screen probing are planned next.",
  };
}
