import fs from "node:fs";
import path from "node:path";

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

const projectRoot = process.cwd();

const requiredFiles = [
  "app/page.tsx",
  "app/projects/[id]/page.tsx",
  "app/review/[taskId]/page.tsx",
  "app/settings/page.tsx",
  "app/archive/page.tsx",
  "components/office/OfficeMap.tsx",
  "components/office/ProjectRoomCard.tsx",
  "components/office/AgentSeat.tsx",
  "components/office/BuildWall.tsx",
  "components/office/EventTicker.tsx",
  "components/office/ApprovedProjectPathStatus.tsx",
  "components/office/QualityGateConfigStatus.tsx",
  "components/tasks/TaskBoard.tsx",
  "components/tasks/TaskCard.tsx",
  "components/tasks/TaskStatusBadge.tsx",
  "components/review/ReviewPanel.tsx",
  "components/review/ReviewReadinessSummary.tsx",
  "components/review/ScopedCodexRunnerPanel.tsx",
  "components/review/CodexPromptHandoff.tsx",
  "components/review/ReviewEvidenceGrid.tsx",
  "components/review/GitSnapshotPanel.tsx",
  "components/review/ChangedFilesPanel.tsx",
  "components/review/DiffSummaryCard.tsx",
  "components/review/ScopeGuardPanel.tsx",
  "components/review/QualityGateSummaryCard.tsx",
  "components/review/QualityGateResultsPanel.tsx",
  "components/review/ReviewDecisionPanel.tsx",
  "components/review/MockDiffSummary.tsx",
  "components/review/QualityGatePanel.tsx",
  "components/settings/SettingsPanel.tsx",
  "components/settings/ApprovedProjectPathsCard.tsx",
  "components/settings/ArchiveRetentionCard.tsx",
  "components/settings/BackupRestoreCard.tsx",
  "components/settings/CodexRuntimeReliabilityCard.tsx",
  "components/settings/LocalAppShellCard.tsx",
  "components/archive/ArchiveRoomPanel.tsx",
  "components/archive/ArchiveSummaryCard.tsx",
  "components/archive/CleanupDryRunPreviewCard.tsx",
  "components/archive/RetentionPoliciesCard.tsx",
  "components/archive/ArchiveRecentRecords.tsx",
  "components/ui/StatusPill.tsx",
  "components/ui/MetricCard.tsx",
  "components/ui/SectionFrame.tsx",
  "components/ui/WorkflowRail.tsx",
  "components/ui/OfficeSurface.tsx",
  "lib/design/status-visuals.ts",
  "lib/design/virtual-office-theme.ts",
  "scripts/verify-virtual-office-ui.ts",
];

const scanFiles = requiredFiles.filter((file) => file.startsWith("app/") || file.startsWith("components/") || file.startsWith("lib/design/"));
const uiFiles = scanFiles.filter((file) => file.startsWith("app/") || file.startsWith("components/"));

const forbiddenDependencyPatterns = [
  /^openai$/,
  /^@openai\//,
  /^@supabase\//,
  /^supabase$/,
  /^firebase$/,
  /^@octokit\//,
  /^@vercel\//,
  /^vercel$/,
  /^next-auth$/,
  /^@auth\//,
  /^stripe$/,
  /^@stripe\//,
  /^node-pty$/,
  /^electron$/,
  /^@modelcontextprotocol\//,
];

const forbiddenScriptPatterns = [
  /^deploy/,
  /^vercel/,
  /^github:/,
  /^supabase:/,
  /^mcp:/,
  /^auth:/,
  /^payment/,
  /^stripe/,
  /^tauri:build/,
  /^electron/,
];

const forbiddenUiPatterns = [
  /\brun automatically\b/i,
  /\bauto codex\b/i,
  /\bauto fix\b/i,
  /\bcommand input\b/i,
  /\btoken input\b/i,
  /\bterminal\s+(emulator|runner|console|panel|input)\b/i,
  /\bcloud sync\b/i,
  /\bteam workspace\b/i,
  /\b(?:github|vercel|supabase)\s+connect\b/i,
  /\bconnect\s+(?:github|vercel|supabase)\b/i,
  /\b(connect|sync)\s+(github|vercel|supabase|cloud|openai)\b/i,
  /\b(github|vercel|supabase|cloud|openai)\s+(connect|sync)\b/i,
  /\b(scan project|auto import|folder picker|github connect|cloud sync|team workspace|source file viewer)\b/i,
  /\b(login|log in|register account|create account|sign in|sign up|oauth|billing|payment|checkout|team permissions)\b/i,
  /\b(command text box|terminal emulator|free-form shell|arbitrary command input)\b/i,
  /\b(delete archive|delete records|cleanup now|purge records|remove records)\b/i,
];

const boundaryPattern = /\b(no|not|without|never|disabled|absent|forbidden|blocked|preview only|dry-run only|dry run only|check only|static|display only|future evaluation|not connected|not implemented|not triggered|not installed)\b/i;

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function dependencyNames(packageJson: PackageShape): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function addCheck(checks: CheckResult[], name: string, passed: boolean, detail: string): void {
  checks.push({ name, passed, detail });
}

function findUnboundedMatches(files: string[], patterns: RegExp[]): string[] {
  const matches: string[] = [];

  for (const file of files) {
    if (!fileExists(file)) {
      continue;
    }

    const lines = readText(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      const matched = patterns.some((pattern) => pattern.test(line));
      const isBoundary = boundaryPattern.test(line);

      if (matched && !isBoundary) {
        matches.push(`${file}:${index + 1}`);
      }
    });
  }

  return matches;
}

function findArchiveCleanupControls(files: string[]): string[] {
  const matches: string[] = [];

  for (const file of files.filter((item) => item.startsWith("components/archive/") || item === "app/archive/page.tsx")) {
    if (!fileExists(file)) {
      continue;
    }

    const text = readText(file);
    const buttonLikeLines = text
      .split(/\r?\n/)
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => /<button|role="button"|action=|onClick=/i.test(line))
      .filter(({ line }) => /\b(delete|cleanup|purge|remove|destroy)\b/i.test(line));

    for (const { index } of buttonLikeLines) {
      matches.push(`${file}:${index + 1}`);
    }
  }

  return matches;
}

function packageScriptEntries(packageJson: PackageShape): Array<[string, string]> {
  return Object.entries(packageJson.scripts ?? {});
}

function main(): void {
  const checks: CheckResult[] = [];
  const packageJson = readJson<PackageShape>("package.json");

  const missingFiles = requiredFiles.filter((file) => !fileExists(file));
  addCheck(
    checks,
    "required virtual office UI files exist",
    missingFiles.length === 0,
    missingFiles.length ? `Missing: ${missingFiles.join(", ")}` : `${requiredFiles.length} files present`,
  );

  const scriptCommand = packageJson.scripts?.["ui:verify:virtual-office"];
  addCheck(
    checks,
    "ui verifier npm script is registered",
    scriptCommand === "tsx scripts/verify-virtual-office-ui.ts",
    scriptCommand ?? "missing",
  );

  const deps = dependencyNames(packageJson);
  const riskyDeps = deps.filter((dep) => forbiddenDependencyPatterns.some((pattern) => pattern.test(dep)));
  addCheck(
    checks,
    "no risky integration dependencies are present",
    riskyDeps.length === 0,
    riskyDeps.length ? riskyDeps.join(", ") : `${deps.length} package names checked`,
  );

  const riskyScripts = packageScriptEntries(packageJson).filter(([name]) => forbiddenScriptPatterns.some((pattern) => pattern.test(name)));
  addCheck(
    checks,
    "no production deploy/auth/payment/mcp scripts were added",
    riskyScripts.length === 0,
    riskyScripts.length ? riskyScripts.map(([name]) => name).join(", ") : `${packageScriptEntries(packageJson).length} scripts checked`,
  );

  const forbiddenUiMatches = findUnboundedMatches(uiFiles, forbiddenUiPatterns);
  addCheck(
    checks,
    "forbidden UI surfaces are absent",
    forbiddenUiMatches.length === 0,
    forbiddenUiMatches.length ? forbiddenUiMatches.join(", ") : `${uiFiles.length} UI files scanned`,
  );

  const archiveCleanupControls = findArchiveCleanupControls(uiFiles);
  addCheck(
    checks,
    "archive room has no destructive cleanup controls",
    archiveCleanupControls.length === 0,
    archiveCleanupControls.length ? archiveCleanupControls.join(", ") : "archive UI has no delete/purge/cleanup controls",
  );

  const settingsText = ["components/settings/SettingsPanel.tsx", "components/settings/ArchiveRetentionCard.tsx"]
    .filter(fileExists)
    .map(readText)
    .join("\n");
  addCheck(
    checks,
    "settings center presents product-control-center framing",
    /Settings Center/.test(settingsText) && /Local-first/.test(settingsText) && /Safety Boundary/.test(settingsText),
    "settings hero, local-first marker, and safety boundary checked",
  );

  const archiveText = ["components/archive/ArchiveRoomPanel.tsx", "components/archive/CleanupDryRunPreviewCard.tsx"]
    .filter(fileExists)
    .map(readText)
    .join("\n");
  addCheck(
    checks,
    "archive room makes dry-run and no-delete meaning clear",
    /dry-run only/i.test(archiveText) && /No data is deleted/i.test(archiveText) && /Backup files are never deleted/i.test(archiveText),
    "dry-run, no-delete, and backup safety copy checked",
  );

  const ownedUiImports = scanFiles.map((file) => (fileExists(file) ? readText(file) : "")).join("\n");
  addCheck(
    checks,
    "virtual office UI/design files do not import DB schema, migrations, or Tauri runtime APIs",
    !/local-db\/schema|drizzle-kit|src-tauri|@tauri-apps/i.test(ownedUiImports),
    `${scanFiles.length} UI/design files scanned`,
  );

  const forbiddenRuntimeCalls = /\b(child_process|node-pty|execSync|spawnSync|spawn\(|exec\(|openai|process\.env|auth\.json)\b/i;
  const runtimeMatches = findUnboundedMatches(scanFiles, [forbiddenRuntimeCalls]);
  addCheck(
    checks,
    "virtual office UI/design files have no runtime command/token surfaces",
    runtimeMatches.length === 0,
    runtimeMatches.length ? runtimeMatches.join(", ") : "no command execution or token/env reads in UI/design files",
  );

  const failures = checks.filter((check) => !check.passed);

  for (const check of checks) {
    const prefix = check.passed ? "PASS" : "FAIL";
    console.log(`${prefix} ${check.name}: ${check.detail}`);
  }

  const summary = {
    checkedFiles: requiredFiles.length,
    scannedUiFiles: uiFiles.length,
    scannedDesignFiles: scanFiles.length - uiFiles.length,
    riskyDependencies: riskyDeps,
    forbiddenUiMatches,
    archiveCleanupControls,
    codexExecutionAttempted: false,
    gitMutationAttempted: false,
    qualityGateExecutionAttempted: false,
    browserLaunched: false,
    tauriLaunched: false,
    installAttempted: false,
    deployAttempted: false,
    dbSchemaChangedByVerifier: false,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (failures.length > 0) {
    throw new Error(`Virtual office UI verification failed: ${failures.map((check) => check.name).join(", ")}`);
  }

  console.log("Virtual office UI verification passed");
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
