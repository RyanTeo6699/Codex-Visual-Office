import packageJson from "@/package.json";
import { buildArchiveSummary } from "@/lib/archive/archive-summary";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listApprovedProjectPaths } from "@/lib/local-db/operations/approved-project-paths";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listLocalSettings, seedDefaultLocalSettings } from "@/lib/local-db/operations/local-settings";
import { listQualityGateConfigs } from "@/lib/local-db/operations/quality-gate-configs";
import { listRetentionPolicies, seedDefaultRetentionPolicies } from "@/lib/local-db/operations/retention-policies";
import type { LocalShellReadiness, LocalShellStatus } from "./local-shell-types";

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const typedPackage = packageJson as PackageShape;
const allowedTauriPrototypeDevDependency = "@tauri-apps/cli";
const allowedTauriPrototypeScripts = new Map([
  ["tauri:dev:prototype", "tauri dev"],
  ["tauri:verify:prototype", "tsx scripts/verify-tauri-prototype.ts"],
]);

const forbiddenDependencyPatterns = {
  tauri: [/tauri/i],
  electron: [/electron/i],
  autoUpdater: [/auto-?updater/i, /electron-updater/i],
  githubApi: [/octokit/i, /github/i],
  vercel: [/vercel/i],
  supabase: [/supabase/i],
  authPaymentMcp: [/next-auth/i, /clerk/i, /stripe/i, /mcp/i],
};

const forbiddenScriptPatterns = {
  backgroundDaemon: [/daemon/i, /cron/i, /launchctl/i, /startup/i],
  cloudSync: [/cloud/i, /sync/i],
  dangerousCommandRunner: [/node-pty/i, /shell:true/i, /terminal/i],
  install: [/npm install/i, /brew install/i],
  deploy: [/deploy/i, /vercel deploy/i],
};

function dependencyNames(): string[] {
  return [
    ...Object.keys(typedPackage.dependencies ?? {}),
    ...Object.keys(typedPackage.devDependencies ?? {}),
  ];
}

function packageScripts(): Record<string, string> {
  return typedPackage.scripts ?? {};
}

function hasOnlyAllowedTauriPrototypeDependency(): boolean {
  const productionTauriDependencies = Object.keys(typedPackage.dependencies ?? {}).filter((name) => /tauri/i.test(name));
  const developmentTauriDependencies = Object.keys(typedPackage.devDependencies ?? {}).filter((name) => /tauri/i.test(name));

  return productionTauriDependencies.length === 0 &&
    developmentTauriDependencies.length > 0 &&
    developmentTauriDependencies.every((name) => name === allowedTauriPrototypeDevDependency);
}

function hasOnlyAllowedTauriPrototypeScripts(scripts: Record<string, string>): boolean {
  const tauriScripts = Object.entries(scripts).filter(([name, command]) => /tauri/i.test(name) || /tauri/i.test(command));

  return tauriScripts.every(([name, command]) => allowedTauriPrototypeScripts.get(name) === command);
}

function hasDependencyMatch(patterns: RegExp[]): boolean {
  return dependencyNames().some((name) => patterns.some((pattern) => pattern.test(name)));
}

function hasScriptMatch(patterns: RegExp[]): boolean {
  return Object.values(packageScripts()).some((script) => patterns.some((pattern) => pattern.test(script)));
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function calculateReadiness(input: {
  localDatabaseConfigured: boolean;
  settingsCenterReady: boolean;
  approvedProjectPathsReady: boolean;
  backupRestoreReady: boolean;
  archiveRoomReady: boolean;
  qualityGatesConfigured: boolean;
  forbiddenDetected: boolean;
}): LocalShellReadiness {
  if (input.forbiddenDetected || !input.localDatabaseConfigured || !input.settingsCenterReady) {
    return "blocked";
  }

  if (input.approvedProjectPathsReady && input.backupRestoreReady && input.archiveRoomReady && input.qualityGatesConfigured) {
    return "ready_for_local_dev";
  }

  return "partial";
}

export async function getLocalShellStatus(): Promise<LocalShellStatus> {
  initializeLocalDb();
  await seedDefaultLocalSettings();
  await seedDefaultRetentionPolicies();

  const [settings, approvedProjectPaths, backupRecords, retentionPolicies, qualityGateConfigs, archiveSummary, codexStatus] = await Promise.all([
    listLocalSettings(),
    listApprovedProjectPaths(),
    listBackupRecords(),
    listRetentionPolicies(),
    listQualityGateConfigs(),
    buildArchiveSummary(),
    detectCodexCliStatus(),
  ]);

  const settingMap = new Map(settings.map((setting) => [setting.key, setting]));
  const localMode = readRecord(settingMap.get("app.localMode")?.value);
  const scripts = packageScripts();
  const tauriPrototypeConfigured = hasOnlyAllowedTauriPrototypeDependency() && hasOnlyAllowedTauriPrototypeScripts(scripts);
  const forbiddenCapabilities = {
    tauri: hasDependencyMatch(forbiddenDependencyPatterns.tauri) && !tauriPrototypeConfigured,
    electron: hasDependencyMatch(forbiddenDependencyPatterns.electron),
    autoUpdater: hasDependencyMatch(forbiddenDependencyPatterns.autoUpdater),
    backgroundDaemon: hasScriptMatch(forbiddenScriptPatterns.backgroundDaemon),
    cloudSync: hasScriptMatch(forbiddenScriptPatterns.cloudSync),
    githubApi: hasDependencyMatch(forbiddenDependencyPatterns.githubApi),
    vercel: hasDependencyMatch(forbiddenDependencyPatterns.vercel),
    supabase: hasDependencyMatch(forbiddenDependencyPatterns.supabase),
    authPaymentMcp: hasDependencyMatch(forbiddenDependencyPatterns.authPaymentMcp),
    dangerousCommandRunner: hasScriptMatch(forbiddenScriptPatterns.dangerousCommandRunner),
  };
  const forbiddenDetected = Object.values(forbiddenCapabilities).some(Boolean);
  const localLaunchScriptsAvailable = ["dev", "local:shell:status", "local:shell:verify"].filter((script) => Boolean(scripts[script]));
  const localDatabaseConfigured = LOCAL_DB_PATH.includes(".local/codex-visual-office.sqlite");
  const settingsCenterReady = settings.length >= 8;
  const approvedProjectPathsReady = approvedProjectPaths.length > 0;
  const backupRestoreReady = backupRecords.length >= 0;
  const archiveRoomReady = retentionPolicies.length >= 10;
  const qualityGatesConfigured = qualityGateConfigs.length > 0;

  return {
    localModeEnabled: localMode.enabled === true,
    localDatabaseConfigured,
    localDatabasePath: LOCAL_DB_PATH,
    settingsCenterReady,
    approvedProjectPathsReady,
    backupRestoreReady,
    archiveRoomReady,
    codexCliDetected: codexStatus.installed,
    codexCliStatusLabel: codexStatus.installed ? `${codexStatus.version ?? "installed"} / ${codexStatus.authStatus}` : "not detected",
    qualityGatesConfigured,
    localLaunchScriptsAvailable,
    desktopPackagingStatus: tauriPrototypeConfigured ? "tauri_prototype_configured" : "future_evaluation",
    shellReadiness: calculateReadiness({
      localDatabaseConfigured,
      settingsCenterReady,
      approvedProjectPathsReady,
      backupRestoreReady,
      archiveRoomReady,
      qualityGatesConfigured,
      forbiddenDetected,
    }),
    counts: {
      approvedProjectPaths: approvedProjectPaths.length,
      backupRecords: backupRecords.length,
      retentionPolicies: retentionPolicies.length,
      qualityGateConfigs: qualityGateConfigs.length,
      archiveRecords: Object.values(archiveSummary.counts).reduce((total, count) => total + count, 0),
    },
    forbiddenCapabilities,
    executionAttempted: {
      codex: false,
      git: false,
      qualityGate: false,
      devServer: false,
      install: hasScriptMatch(forbiddenScriptPatterns.install),
      deploy: hasScriptMatch(forbiddenScriptPatterns.deploy),
    },
  };
}
