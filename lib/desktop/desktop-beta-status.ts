import fs from "node:fs";
import path from "node:path";
import type {
  DesktopBetaPackageMetadata,
  DesktopBetaStatus,
  DesktopBetaTauriConfigMetadata,
} from "./desktop-beta-types";

const productionReleaseFlags = [
  /tauri\s+build/i,
  /electron-builder/i,
  /electron-forge/i,
  /\bnotarytool\b/i,
  /\bnotar/i,
  /\bsign/i,
  /\bcodesign\b/i,
  /\bpublish\b/i,
];
const signingFlags = [/\bcodesign\b/i, /\bsign\s+--/i, /\bsigning\b/i, /\bcertificate\b/i, /\bdeveloperId\b/i];
const notarizationFlags = [/\bnotarytool\b/i, /\bnotar/i];

function readJsonIfPresent<T>(projectRoot: string, relativePath: string): T | undefined {
  const absolutePath = path.join(projectRoot, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return undefined;
  }

  return JSON.parse(fs.readFileSync(absolutePath, "utf8")) as T;
}

function dependencyNames(packageJson: DesktopBetaPackageMetadata): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function packageScripts(packageJson: DesktopBetaPackageMetadata): Array<[string, string]> {
  return Object.entries(packageJson.scripts ?? {});
}

function isLocalHttpUrl(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  return parsed.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
}

function hasBrowserLauncherFallback(packageJson: DesktopBetaPackageMetadata): boolean {
  const scripts = packageJson.scripts ?? {};

  return scripts["local:launcher"] === "tsx scripts/local-launcher.ts" &&
    scripts["local:launcher:open"] === "tsx scripts/local-launcher.ts --open" &&
    scripts["local:launcher:verify"] === "tsx scripts/verify-local-launcher.ts";
}

function hasProductionReleaseScript(packageJson: DesktopBetaPackageMetadata): boolean {
  return packageScripts(packageJson).some(([name, command]) => {
    const looksLikeReleaseScript = /(^|:)(build|bundle|dist|install(er)?|make|package|publish|release)($|:)/i.test(name);
    return looksLikeReleaseScript && productionReleaseFlags.some((pattern) => pattern.test(command));
  });
}

export function getDesktopBetaStatus(projectRoot = process.cwd()): DesktopBetaStatus {
  const packageJson = readJsonIfPresent<DesktopBetaPackageMetadata>(projectRoot, "package.json") ?? {};
  const tauriConfig = readJsonIfPresent<DesktopBetaTauriConfigMetadata>(projectRoot, "src-tauri/tauri.conf.json");
  const deps = dependencyNames(packageJson);
  const warnings: string[] = [];

  const tauriPrototypeConfigured = Boolean(
    tauriConfig?.productName &&
      /prototype|beta/i.test(`${tauriConfig.productName} ${tauriConfig.identifier ?? ""}`) &&
      isLocalHttpUrl(tauriConfig.build?.devUrl) &&
      (tauriConfig.build?.beforeDevCommand ?? "") === "" &&
      (tauriConfig.build?.beforeBuildCommand ?? "") === "" &&
      tauriConfig.bundle?.active === false,
  );
  const browserLauncherFallbackAvailable = hasBrowserLauncherFallback(packageJson);
  const electronImplemented = deps.some((name) => /electron/i.test(name));
  const autoUpdaterImplemented = deps.some((name) => /updater|auto-update|autoupdate/i.test(name)) ||
    /updater|auto[-_ ]?update/i.test(JSON.stringify(tauriConfig ?? {}));
  const cloudSyncImplemented = deps.some((name) => /aws|azure|gcp|firebase|supabase|s3|cloud|sync/i.test(name));
  const productionReleaseImplemented = hasProductionReleaseScript(packageJson);
  const packageScriptText = packageScripts(packageJson).map(([name, command]) => `${name} ${command}`).join("\n");
  const tauriConfigText = JSON.stringify(tauriConfig ?? {});
  const codeSigningImplemented = signingFlags.some((pattern) => pattern.test(`${packageScriptText}\n${tauriConfigText}`));
  const notarizationImplemented = notarizationFlags.some((pattern) => pattern.test(`${packageScriptText}\n${tauriConfigText}`));

  if (!tauriConfig) {
    warnings.push("Tauri config is missing.");
  }

  if (!tauriPrototypeConfigured) {
    warnings.push("Tauri prototype config is incomplete for desktop beta candidate status.");
  }

  if (!browserLauncherFallbackAvailable) {
    warnings.push("Browser launcher fallback scripts are missing or changed.");
  }

  if (electronImplemented) {
    warnings.push("Electron dependency detected; beta candidate must remain Tauri/browser fallback only.");
  }

  if (autoUpdaterImplemented) {
    warnings.push("Updater dependency or config detected; auto updater is not part of Desktop Beta.");
  }

  if (cloudSyncImplemented) {
    warnings.push("Cloud sync dependency detected; Desktop Beta must remain local-first.");
  }

  if (productionReleaseImplemented) {
    warnings.push("Production release script detected; Desktop Beta must not ship production installers yet.");
  }

  if (codeSigningImplemented) {
    warnings.push("Code signing command or config detected; signing is not part of Desktop Beta.");
  }

  if (notarizationImplemented) {
    warnings.push("Notarization command or config detected; notarization is not part of Desktop Beta.");
  }

  const blockingFlags = electronImplemented || autoUpdaterImplemented || cloudSyncImplemented || productionReleaseImplemented || codeSigningImplemented || notarizationImplemented;
  const desktopBetaCandidateConfigured = tauriPrototypeConfigured && browserLauncherFallbackAvailable && !blockingFlags;
  const safetyStatus = desktopBetaCandidateConfigured
    ? "safe_beta_candidate"
    : blockingFlags
      ? "blocked"
      : tauriConfig
        ? "needs_review"
        : "unknown";

  return {
    tauriPrototypeConfigured,
    desktopBetaCandidateConfigured,
    appName: tauriConfig?.productName ?? packageJson.name ?? "Unknown Desktop Beta App",
    appVersion: tauriConfig?.version ?? packageJson.version ?? "0.0.0",
    macFirst: true,
    browserLauncherFallbackAvailable,
    productionReleaseImplemented,
    codeSigningImplemented,
    notarizationImplemented,
    autoUpdaterImplemented,
    electronImplemented,
    cloudSyncImplemented,
    safetyStatus,
    warnings,
    recommendedNextAction: desktopBetaCandidateConfigured
      ? "Proceed with Desktop Beta review using static verifier output; do not enable production release, signing, notarization, or updater work without GM approval."
      : "Review warnings and keep Desktop Beta limited to Tauri prototype plus browser launcher fallback.",
  };
}
