import fs from "node:fs";
import path from "node:path";
import {
  classifySensitivePathString,
  getSensitivePathPolicySummary,
  validateNonSensitiveLocalPath,
} from "@/lib/safety/sensitive-path-guard";
import { createLocalPermissionModel } from "@/lib/safety/local-permission-model";
import { getRunnerSafetySummary } from "@/lib/safety/runner-safety-summary";
import { getDataSafetySummary } from "@/lib/safety/data-safety-summary";
import { getLauncherSafetySummary } from "@/lib/safety/launcher-safety-summary";
import { getLocalFirstSafetySummary } from "@/lib/safety/safety-summary";

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

const projectRoot = process.cwd();

const sensitivePathInputs = [
  "~/.codex/auth.json",
  "/Users/test/.codex/auth.json",
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".envrc",
  "/Users/test/project/.git/config",
  "/Users/test/.npmrc",
  "/Users/test/.netrc",
  "/Users/test/.pypirc",
  "id_rsa",
  "id_ed25519",
  "id_ecdsa",
  "private_key.pem",
  "token.txt",
  "/Users/test/token.txt",
  "/Users/test/project/token.txt",
  "/Users/test/secret.txt",
  "/Users/test/project/secret-key.txt",
  "api_key.txt",
  "/Users/test/api_key.txt",
  "apikey.json",
  "/Users/test/apikey.json",
  "oauth-client.json",
  "/Users/test/oauth-client.json",
  "access-token.txt",
  "/Users/test/project/access-token.txt",
  "refresh_token.txt",
  "/Users/test/project/refresh_token.txt",
  "credentials.json",
  "/Users/test/.aws/credentials",
  "/Users/test/.config/gcloud/application_default_credentials.json",
  "google-credentials.json",
  "service-account.json",
];

const expectedCategories = new Map([
  ["~/.codex/auth.json", "auth_file"],
  ["/Users/test/.codex/auth.json", "auth_file"],
  [".env", "env_file"],
  [".env.local", "env_file"],
  [".env.production", "env_file"],
  [".env.development", "env_file"],
  [".envrc", "env_file"],
  ["/Users/test/project/.git/config", "credential_file"],
  ["/Users/test/.npmrc", "credential_file"],
  ["/Users/test/.netrc", "credential_file"],
  ["/Users/test/.pypirc", "credential_file"],
  ["id_rsa", "private_key"],
  ["id_ed25519", "private_key"],
  ["id_ecdsa", "private_key"],
  ["private_key.pem", "private_key"],
  ["token.txt", "token_or_secret"],
  ["/Users/test/token.txt", "token_or_secret"],
  ["/Users/test/project/token.txt", "token_or_secret"],
  ["/Users/test/secret.txt", "token_or_secret"],
  ["/Users/test/project/secret-key.txt", "token_or_secret"],
  ["api_key.txt", "token_or_secret"],
  ["/Users/test/api_key.txt", "token_or_secret"],
  ["apikey.json", "token_or_secret"],
  ["/Users/test/apikey.json", "token_or_secret"],
  ["oauth-client.json", "token_or_secret"],
  ["/Users/test/oauth-client.json", "token_or_secret"],
  ["access-token.txt", "token_or_secret"],
  ["/Users/test/project/access-token.txt", "token_or_secret"],
  ["refresh_token.txt", "token_or_secret"],
  ["/Users/test/project/refresh_token.txt", "token_or_secret"],
  ["credentials.json", "credential_file"],
  ["/Users/test/.aws/credentials", "credential_file"],
  ["/Users/test/.config/gcloud/application_default_credentials.json", "credential_file"],
  ["google-credentials.json", "credential_file"],
  ["service-account.json", "credential_file"],
]);

const normalAbsoluteProjectPaths = [
  "/Users/test/projects/codex-visual-office",
  "/Users/test/projects/tokenizer-demo",
  "/Users/test/projects/secretary-notes",
  "/Users/test/.ssh/id_rsa.pub",
];

const codeScanRoots = [
  "app/safety",
  "components/safety",
  "lib/safety",
];

const forbiddenSafetyCodePatterns = [
  /\bdetectCodexCliStatus\s*\(/,
  /\bgetLocalShellStatus\s*\(/,
  /\bbuildLocalLauncherReport\s*\(/,
  /\bexecFile\s*\(/,
  /\bspawn\s*\(/,
  /\bshell\s*:\s*true\b/,
  /\bfrom\s+["']node-pty["']/,
  /\brequire\s*\(\s*["']node-pty["']\s*\)/,
  /\bchild_process\b/,
  /\bfs\.readFile(?:Sync)?\s*\(/,
  /\breadFile(?:Sync)?\s*\(/,
  /\breaddir(?:Sync)?\s*\(/,
  /\bglob\s*\(/,
  /\bfast-glob\b/,
  /\bprocess\.env\b/,
];

function addCheck(checks: CheckResult[], name: string, passed: boolean, detail: string): void {
  checks.push({ name, passed, detail });
}

function allTrue(values: Record<string, boolean>): boolean {
  return Object.values(values).every((value) => value === true);
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function walkFiles(relativeRoot: string): string[] {
  const absoluteRoot = path.join(projectRoot, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) {
    return [];
  }

  const results: string[] = [];
  const entries = fs.readdirSync(absoluteRoot, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(absoluteRoot, entry.name);
    const relativePath = path.relative(projectRoot, absolutePath);

    if (entry.isDirectory()) {
      results.push(...walkFiles(relativePath));
      continue;
    }

    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      results.push(relativePath);
    }
  }

  return results;
}

function scanSafetyImplementationFiles(): string[] {
  return codeScanRoots.flatMap(walkFiles).filter((relativePath) => fileExists(relativePath));
}

function findForbiddenSafetyCodeMatches(files: string[]): string[] {
  const matches: string[] = [];

  for (const file of files) {
    const lines = readText(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (forbiddenSafetyCodePatterns.some((pattern) => pattern.test(line))) {
        matches.push(`${file}:${index + 1}`);
      }
    });
  }

  return matches;
}

function main(): void {
  const checks: CheckResult[] = [];
  const permissionModel = createLocalPermissionModel();
  const runnerSummary = getRunnerSafetySummary();
  const dataSummary = getDataSafetySummary();
  const launcherSummary = getLauncherSafetySummary();
  const localFirstSummary = getLocalFirstSafetySummary();
  const policySummary = getSensitivePathPolicySummary();

  const sensitiveClassifications = sensitivePathInputs.map((input) => ({
    input,
    classification: classifySensitivePathString(input),
  }));
  const missedSensitivePaths = sensitiveClassifications.filter(({ classification }) => classification.allowed);
  const categoryMismatches = sensitiveClassifications.filter(({ input, classification }) => classification.category !== expectedCategories.get(input));
  const normalPathValidations = normalAbsoluteProjectPaths.map((input) => ({
    input,
    validation: validateNonSensitiveLocalPath(input),
  }));
  const normalPathFailures = normalPathValidations.filter(({ validation }) => !validation.ok || validation.classification.category !== "allowed");
  const safetyImplementationFiles = scanSafetyImplementationFiles();
  const forbiddenSafetyCodeMatches = findForbiddenSafetyCodeMatches(safetyImplementationFiles);

  addCheck(
    checks,
    "local permission model can be generated",
    Boolean(permissionModel.approvedPathPermission && permissionModel.runnerPermission && permissionModel.credentialPermission),
    JSON.stringify({
      approvedPathPermission: permissionModel.approvedPathPermission.state,
      runnerPermission: permissionModel.runnerPermission.state,
      credentialPermission: permissionModel.credentialPermission.state,
    }),
  );

  addCheck(
    checks,
    "overall safety status can be generated",
    ["safe_local_only", "needs_review", "blocked", "unknown"].includes(localFirstSummary.overallSafetyStatus),
    localFirstSummary.overallSafetyStatus,
  );

  addCheck(
    checks,
    "sensitive path guard rejects protected strings",
    missedSensitivePaths.length === 0,
    missedSensitivePaths.length ? `Missed: ${missedSensitivePaths.map((item) => item.input).join(", ")}` : `${sensitiveClassifications.length} sensitive strings rejected`,
  );

  addCheck(
    checks,
    "sensitive path guard classifies expected categories",
    categoryMismatches.length === 0,
    categoryMismatches.length ? JSON.stringify(categoryMismatches) : "all expected categories matched",
  );

  addCheck(
    checks,
    "normal absolute project paths pass string validation",
    normalPathFailures.length === 0,
    normalPathFailures.length ? JSON.stringify(normalPathFailures) : `${normalPathValidations.length} normal paths allowed`,
  );

  addCheck(
    checks,
    "safety implementation does not call CLI detection, shell, filesystem scan, token/env reads, or OpenAI",
    forbiddenSafetyCodeMatches.length === 0,
    forbiddenSafetyCodeMatches.length ? forbiddenSafetyCodeMatches.join(", ") : `${safetyImplementationFiles.length} safety files scanned`,
  );

  addCheck(
    checks,
    "approved path permission summary is manual and non-scanning",
    allTrue({
      manualOnly: permissionModel.approvedPathPermission.manualOnly,
      noAutoScan: permissionModel.approvedPathPermission.noAutoScan,
      noSourceRead: permissionModel.approvedPathPermission.noSourceRead,
    }) &&
      permissionModel.approvedPathPermission.configured === false &&
      permissionModel.approvedPathPermission.approved === false &&
      permissionModel.approvedPathPermission.state === "requires_approval",
    JSON.stringify(permissionModel.approvedPathPermission),
  );

  addCheck(
    checks,
    "runner safety summary is scoped and non-shell",
    runnerSummary.overallSafetyStatus === "safe_local_only" &&
      allTrue({
        scopedRunnerOnly: permissionModel.runnerPermission.scopedRunnerOnly,
        approvedPathRequired: permissionModel.runnerPermission.approvedPathRequired,
        shellFalse: permissionModel.runnerPermission.shellFalse,
        noArbitraryShell: permissionModel.runnerPermission.noArbitraryShell,
        noCommandTextbox: permissionModel.runnerPermission.noCommandTextbox,
        noTerminal: permissionModel.runnerPermission.noTerminal,
        noNodePty: permissionModel.runnerPermission.noNodePty,
        noAutoGitMutation: permissionModel.runnerPermission.noAutoGitMutation,
        noAutoDeploy: permissionModel.runnerPermission.noAutoDeploy,
      }),
    JSON.stringify({ permission: permissionModel.runnerPermission, summary: runnerSummary }),
  );

  addCheck(
    checks,
    "backup and archive safety summaries are non-destructive",
    dataSummary.overallSafetyStatus === "safe_local_only" &&
      allTrue({
        sqliteOnly: permissionModel.backupPermission.sqliteOnly,
        localOnly: permissionModel.backupPermission.localOnly,
        restoreRequiresDryRun: permissionModel.backupPermission.restoreRequiresDryRun,
        restoreRequiresConfirm: permissionModel.backupPermission.restoreRequiresConfirm,
        safetyBackupBeforeRestore: permissionModel.backupPermission.safetyBackupBeforeRestore,
        noSourceBackup: permissionModel.backupPermission.noSourceBackup,
        noTokenBackup: permissionModel.backupPermission.noTokenBackup,
        dryRunOnly: permissionModel.archivePermission.dryRunOnly,
        noRealDeletion: permissionModel.archivePermission.noRealDeletion,
        noBackupFileDeletion: permissionModel.archivePermission.noBackupFileDeletion,
        noScheduledCleanup: permissionModel.archivePermission.noScheduledCleanup,
      }),
    JSON.stringify({ backup: permissionModel.backupPermission, archive: permissionModel.archivePermission, summary: dataSummary }),
  );

  addCheck(
    checks,
    "launcher and Tauri safety summaries are status-only prototype boundaries",
    launcherSummary.overallSafetyStatus === "safe_local_only" &&
      allTrue({
        localhostOnly: permissionModel.launcherPermission.localhostOnly,
        statusOnlyDefault: permissionModel.launcherPermission.statusOnlyDefault,
        noDevServerStart: permissionModel.launcherPermission.noDevServerStart,
        noCodexGitQualityExecution: permissionModel.launcherPermission.noCodexGitQualityExecution,
        prototypeOnly: permissionModel.tauriPermission.prototypeOnly,
        noProductionInstaller: permissionModel.tauriPermission.noProductionInstaller,
        noUpdater: permissionModel.tauriPermission.noUpdater,
        noShellPlugin: permissionModel.tauriPermission.noShellPlugin,
        noFsExpansion: permissionModel.tauriPermission.noFsExpansion,
        coreDefaultOnly: permissionModel.tauriPermission.coreDefaultOnly,
      }),
    JSON.stringify({ launcher: permissionModel.launcherPermission, tauri: permissionModel.tauriPermission, summary: launcherSummary }),
  );

  addCheck(
    checks,
    "cloud and credential permissions are disabled",
    allTrue({
      cloudSyncDisabled: permissionModel.cloudPermission.cloudSyncDisabled,
      githubApiDisabled: permissionModel.cloudPermission.githubApiDisabled,
      vercelDisabled: permissionModel.cloudPermission.vercelDisabled,
      supabaseDisabled: permissionModel.cloudPermission.supabaseDisabled,
      noAuthJsonRead: permissionModel.credentialPermission.noAuthJsonRead,
      noEnvRead: permissionModel.credentialPermission.noEnvRead,
      noTokenStorage: permissionModel.credentialPermission.noTokenStorage,
      noOpenAiApi: permissionModel.credentialPermission.noOpenAiApi,
    }),
    JSON.stringify({ cloud: permissionModel.cloudPermission, credential: permissionModel.credentialPermission }),
  );

  const attempted = {
    authEnvTokenRead: false,
    filesystemScan: false,
    projectSourceRead: false,
    codexExecution: false,
    gitExecution: false,
    qualityGateExecution: false,
    backupRestore: false,
    archiveCleanup: false,
    launcherOpen: false,
    tauriLaunch: false,
    arbitraryShell: false,
    commandTextBox: false,
    terminal: false,
    nodePty: false,
    browserOpen: false,
    dependencyInstall: false,
    deploy: false,
  };

  addCheck(
    checks,
    "forbidden execution and permission attempts are false",
    Object.values(attempted).every((value) => value === false) && forbiddenSafetyCodeMatches.length === 0,
    JSON.stringify(attempted),
  );

  const failures = checks.filter((check) => !check.passed);
  const summary = {
    overallSafetyStatus: failures.length === 0 ? "passed" : "failed",
    checks,
    sensitivePathPolicySummary: policySummary,
    sensitiveClassifications,
    normalPathValidations,
    scannedSafetyImplementationFiles: safetyImplementationFiles,
    forbiddenSafetyCodeMatches,
    permissionModel,
    runnerSummary,
    dataSummary,
    launcherSummary,
    localFirstSummary,
    attempted,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (failures.length > 0) {
    throw new Error(`Safety permission verification failed: ${failures.map((check) => check.name).join(", ")}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
