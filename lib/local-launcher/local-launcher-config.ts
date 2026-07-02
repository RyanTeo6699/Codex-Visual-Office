export const DEFAULT_LOCAL_APP_URL = "http://localhost:3000";
export const LOCAL_APP_URL_ENV = "CVO_LOCAL_APP_URL";

export type LocalLauncherEnv = Partial<Record<string, string | undefined>>;

const allowedLocalHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function validateLocalAppUrl(value: string): string {
  const trimmedValue = value.trim();
  let parsed: URL;

  try {
    parsed = new URL(trimmedValue);
  } catch {
    throw new Error(`${LOCAL_APP_URL_ENV} must be a valid URL.`);
  }

  if (parsed.protocol !== "http:") {
    throw new Error(`${LOCAL_APP_URL_ENV} must use http:// for a local browser launch.`);
  }

  if (!allowedLocalHosts.has(parsed.hostname)) {
    throw new Error(`${LOCAL_APP_URL_ENV} must point to localhost, 127.0.0.1, or [::1].`);
  }

  if (parsed.username || parsed.password) {
    throw new Error(`${LOCAL_APP_URL_ENV} must not include credentials.`);
  }

  return trimmedValue;
}

export function getConfiguredLocalAppUrl(env: LocalLauncherEnv = process.env): string {
  const configuredUrl = env[LOCAL_APP_URL_ENV]?.trim();
  return validateLocalAppUrl(configuredUrl || DEFAULT_LOCAL_APP_URL);
}

export function isBrowserOpenSupported(platform: NodeJS.Platform = process.platform): boolean {
  return platform === "darwin" || platform === "win32" || platform === "linux";
}
