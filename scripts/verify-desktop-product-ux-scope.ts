import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

const projectRoot = process.cwd();

const requiredDocs = [
  "docs/phase-33a-desktop-product-ux-scope-lock.md",
  "docs/desktop-app-information-architecture.md",
  "docs/desktop-app-user-surface-vs-diagnostics-boundary.md",
  "docs/desktop-app-settings-boundary.md",
  "docs/desktop-app-developer-diagnostics-boundary.md",
  "docs/open-source-desktop-app-surface.md",
  "docs/phase-33a-desktop-product-ux-scope-result.md",
];

const forbiddenDependencyPatterns = [
  /^electron$/i,
  /electron-updater|update-electron-app/i,
  /node-pty/i,
  /^openai$/i,
  /@openai/i,
  /octokit|github/i,
  /vercel/i,
  /supabase/i,
  /stripe|clerk|next-auth|auth0/i,
  /modelcontextprotocol|mcp/i,
];

const requiredBoundaryChecks = [
  {
    name: "Main App boundary",
    patterns: [/Main App/i, /Office Home/i, /Project Rooms/i, /Review Room/i],
  },
  {
    name: "Settings boundary",
    patterns: [/Settings/i, /approved project paths/i, /local DB/i],
  },
  {
    name: "Developer Diagnostics boundary",
    patterns: [/Developer Diagnostics/i, /verifier matrix/i, /runtime health/i],
  },
  {
    name: "About and open source boundary",
    patterns: [/About/i, /Open Source/i, /license/i],
  },
  {
    name: "diagnostics kept out of Main App",
    patterns: [/npm scripts/i, /localhost/i, /phase documents/i, /not expose/i],
  },
  {
    name: "no implementation in Phase 33A",
    patterns: [/No UI redesign/i, /No AppShell rewrite/i, /No database schema changes/i, /No dependency changes/i],
  },
  {
    name: "future Phase 33B and 33C gated",
    patterns: [/Phase 33B - Desktop IA Redesign Plan/i, /Phase 33C - App Shell UI Redesign/i, /has not started/i],
  },
];

function filePath(relativePath: string): string {
  return path.join(projectRoot, relativePath);
}

function readText(relativePath: string): string {
  return readFileSync(filePath(relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function addCheck(checks: CheckResult[], name: string, passed: boolean, detail: string): void {
  checks.push({ name, passed, detail });
}

function dependencyNames(packageJson: PackageShape): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function main(): void {
  const checks: CheckResult[] = [];
  const packageJson = readJson<PackageShape>("package.json");

  for (const doc of requiredDocs) {
    const exists = existsSync(filePath(doc));
    addCheck(checks, `required Phase 33A doc exists: ${doc}`, exists, exists ? "present" : "missing");
  }

  const existingDocs = requiredDocs.filter((doc) => existsSync(filePath(doc)));
  const combinedDocs = existingDocs.map(readText).join("\n\n");

  for (const boundaryCheck of requiredBoundaryChecks) {
    const missingPatterns = boundaryCheck.patterns.filter((pattern) => !pattern.test(combinedDocs));
    addCheck(
      checks,
      `docs cover ${boundaryCheck.name}`,
      missingPatterns.length === 0,
      missingPatterns.length === 0 ? "covered" : `missing ${missingPatterns.map(String).join(", ")}`,
    );
  }

  addCheck(
    checks,
    "package script desktop:verify:product-ux-scope is registered",
    packageJson.scripts?.["desktop:verify:product-ux-scope"] === "tsx scripts/verify-desktop-product-ux-scope.ts",
    packageJson.scripts?.["desktop:verify:product-ux-scope"] ?? "missing",
  );

  addCheck(
    checks,
    "package script desktop:verify:ux is an existing UI verifier alias",
    packageJson.scripts?.["desktop:verify:ux"] === "npm run ui:verify:virtual-office",
    packageJson.scripts?.["desktop:verify:ux"] ?? "missing",
  );

  const forbiddenDeps = dependencyNames(packageJson).filter((dependency) =>
    forbiddenDependencyPatterns.some((pattern) => pattern.test(dependency)),
  );
  addCheck(
    checks,
    "forbidden integration dependencies absent",
    forbiddenDeps.length === 0,
    forbiddenDeps.length ? forbiddenDeps.join(", ") : "none found",
  );

  const forbiddenImplementationClaims = [
    /Phase 33B.*completed/i,
    /Phase 33C.*completed/i,
    /implemented AppShell redesign/i,
    /implemented Developer Diagnostics page/i,
    /implemented About page/i,
    /changed database schema/i,
    /added dependency/i,
  ];
  const unsupportedClaims = combinedDocs
    .split(/\r?\n/)
    .flatMap((line, index) =>
      forbiddenImplementationClaims
        .filter((pattern) => pattern.test(line))
        .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
    );
  addCheck(
    checks,
    "docs do not claim Phase 33B/33C implementation",
    unsupportedClaims.length === 0,
    unsupportedClaims.length ? unsupportedClaims.join(", ") : "no unsupported implementation claims found",
  );

  const prohibitedActionsAttempted = {
    uiRedesign: false,
    appShellRewrite: false,
    databaseMigration: false,
    dependencyInstall: false,
    runtimeRunnerChange: false,
    tauriPermissionExpansion: false,
    externalIntegration: false,
    commandExecutionSurface: false,
  };
  addCheck(
    checks,
    "Phase 33A verifier is static and non-executing",
    Object.values(prohibitedActionsAttempted).every((value) => value === false),
    JSON.stringify(prohibitedActionsAttempted),
  );

  const failedChecks = checks.filter((check) => !check.passed);
  const result = {
    status: failedChecks.length === 0 ? "passed" : "failed",
    mode: "static_documentation_scope_verifier",
    requiredDocs,
    prohibitedActionsAttempted,
    checks,
    failedChecks,
  };

  console.log(JSON.stringify(result, null, 2));

  if (failedChecks.length > 0) {
    process.exit(1);
  }
}

main();
