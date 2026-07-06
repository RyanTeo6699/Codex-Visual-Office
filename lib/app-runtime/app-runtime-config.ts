import { DEFAULT_LOCAL_APP_URL } from "@/lib/local-launcher/local-launcher-config";

export const APP_FIRST_RUNTIME_TARGET_URL = DEFAULT_LOCAL_APP_URL;
export const APP_FIRST_RUNTIME_HEALTH_CHECK_MODE = "status_only";

export const appRuntimeModes = [
  {
    mode: "dev_mode",
    label: "Contributor dev mode",
    description: "Next dev server may still be used by contributors while building or debugging the app.",
    targetUrl: DEFAULT_LOCAL_APP_URL,
    endUserPrimaryPath: false,
  },
  {
    mode: "app_mode",
    label: "App-first desktop mode",
    description: "The desktop app owns runtime readiness and displays Codex Visual Office in its own window.",
    targetUrl: DEFAULT_LOCAL_APP_URL,
    endUserPrimaryPath: true,
  },
  {
    mode: "fallback_mode",
    label: "Browser fallback mode",
    description: "The existing browser launcher remains available as a contributor/support fallback.",
    targetUrl: DEFAULT_LOCAL_APP_URL,
    endUserPrimaryPath: false,
  },
] as const;
