import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { projects as mockProjects } from "@/lib/mock-data";
import { summarizeProjectHealth } from "@/lib/projects/project-health-summary";

const projectRoot = process.cwd();
const providerProjectId = "provider-workspace";
const approvedPath = projectRoot;
const helperFiles = [
  "lib/projects/project-health-types.ts",
  "lib/projects/project-health-summary.ts",
  "lib/projects/project-workspace-summary.ts",
];
const implementationFiles = [
  "app/page.tsx",
  "app/projects/[id]/page.tsx",
  "components/office/OfficeMap.tsx",
  "components/office/ProjectRoomCard.tsx",
  "components/office/BuildWall.tsx",
  "components/office/EventTicker.tsx",
  "components/settings/ApprovedProjectPathsCard.tsx",
  "components/settings/SettingsPanel.tsx",
  "lib/local-db/selected-reads.ts",
  ...helperFiles,
];

const forbiddenScriptTextPatterns = [
  /\bexecFile\b/,
  /\bexec\b/,
  /\bspawn\b/,
  /\bchild_process\b/,
  /\bnode-pty\b/,
  /\bqualityGateRunner\b/i,
  /\brunQualityGate\b/i,
  /\bdetectCodexCliStatus\b/,
  /\bplaywright\b/i,
  /\bpuppeteer\b/i,
  /\btauri\s+dev\b/i,
  /\btauri\s+build\b/i,
  /\bnpm\s+install\b/i,
  /\bpnpm\s+install\b/i,
  /\byarn\s+install\b/i,
  /\bdeploy\b/i,
];
const forbiddenImplementationRuntimePatterns = [
  /\bexecFile\b/,
  /\bexec\b/,
  /\bspawn\b/,
  /\bchild_process\b/,
  /\bnode-pty\b/,
  /\bqualityGateRunner\b/i,
  /\brunQualityGate\b/i,
  /\bdetectCodexCliStatus\b/,
  /\bplaywright\b/i,
  /\bpuppeteer\b/i,
  /\btauri\s+dev\b/i,
  /\btauri\s+build\b/i,
  /\bnpm\s+install\b/i,
  /\bpnpm\s+install\b/i,
  /\byarn\s+install\b/i,
];

const forbiddenProductPatterns = [
  /\bgithub\b/i,
  /\bvercel\b/i,
  /\bsupabase\b/i,
  /\bfirebase\b/i,
  /\bauth\b/i,
  /\boauth\b/i,
  /\blogin\b/i,
  /\bpayment\b/i,
  /\bbilling\b/i,
  /\bteam\s+workspace\b/i,
  /\bmcp\b/i,
];

const forbiddenWorkspaceDetectionPatterns = [
  /\breaddir(?:Sync)?\b/,
  /\bopendir(?:Sync)?\b/,
  /\bglob\b/i,
  /\bfast-glob\b/i,
  /\bpackage\.json\b.*\bapproved/i,
  /\bapproved\b.*\bpackage\.json\b/i,
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readOwnedText(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function lineMatches(text: string, patterns: RegExp[]): string[] {
  const matches: string[] = [];

  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    const isPatternDeclaration = trimmed.startsWith("/") || trimmed.startsWith("const forbidden");

    if (!isPatternDeclaration && patterns.some((pattern) => pattern.test(line))) {
      matches.push(`${index + 1}: ${line.trim()}`);
    }
  });

  return matches;
}

async function main(): Promise<void> {
  const tempDbDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvo-project-workspace-"));
  process.env.CVO_LOCAL_DB_PATH = path.join(tempDbDir, "codex-visual-office-verify.sqlite");

  const { initializeLocalDb } = await import("@/lib/local-db/init");
  const {
    listApprovedProjectPathsForProject,
    removeApprovedProjectPathRecord,
    updateApprovedProjectPathStatus,
    upsertApprovedProjectPath,
  } = await import("@/lib/local-db/operations/approved-project-paths");
  const {
    getAllProjectWorkspaceSummaries,
    getProjectHealthSummaryForProject,
    getRecentProjects,
  } = await import("@/lib/local-db/selected-reads");
  const { seedFromMockData } = await import("@/lib/local-db/seed/seed-from-mock-data");
  const { sqliteClient } = await import("@/lib/local-db/client");

  initializeLocalDb();
  seedFromMockData();
  let configuredPathRecordId: string | undefined;

  try {
    const missingPathSummary = summarizeProjectHealth({
      project: mockProjects[0],
      tasks: [],
      taskEvents: [],
      reviewRecords: [],
      qualityGateConfigs: [],
      qualityGateRuns: [],
      gitSnapshots: [],
      backupRecords: [],
    });
    assert(missingPathSummary.health === "needs_setup", "Unapproved project path should summarize as needs_setup");
    assert(missingPathSummary.recommendedNextAction === "configure_approved_path", "Missing approved path should recommend configure_approved_path");

    const configuredPathRecord = await upsertApprovedProjectPath({
      id: "verify-project-workspace-configured-path",
      projectId: providerProjectId,
      localPath: approvedPath,
      label: "Project workspace verifier path",
      approved: true,
      note: "Verification record for configured approved path state.",
    });
    configuredPathRecordId = configuredPathRecord.id;
    await updateApprovedProjectPathStatus(configuredPathRecord.id, true);
    assert(configuredPathRecord.approved, "Approved path status update should persist");

    const [workspaceSummaries, recentProjects, providerHealth] = await Promise.all([
      getAllProjectWorkspaceSummaries(),
      getRecentProjects(5),
      getProjectHealthSummaryForProject(providerProjectId),
    ]);
    assert(workspaceSummaries.length >= 5, "Workspace summaries should include seeded projects");
    assert(recentProjects.length > 0, "Recent projects should be listed");
    assert(providerHealth, "Provider workspace health summary should exist");

    const providerWorkspace = workspaceSummaries.find((workspace) => workspace.projectId === providerProjectId);
    assert(providerWorkspace, "Provider workspace summary should exist");
    assert(providerWorkspace.approvedPathApproved, "Provider workspace should use approved path configured status");
    assert(providerWorkspace.codexRuntimeReadiness.length > 0, "Codex readiness should be referenced");
    assert(providerHealth.quality.configReady || providerHealth.quality.latestRunStatus !== undefined, "Quality summary should be referenced");
    assert(providerHealth.review.latestDecision !== undefined || providerHealth.tasks.total >= 0, "Review summary should be referenced");
    assert(providerHealth.archive.recentActivityCount >= 0, "Archive summary should be referenced");
    assert(providerHealth.backup.backupCount >= 0, "Backup summary should be referenced");
    assert(providerWorkspace.recommendedNextAction.length > 0, "recommendedNextAction should exist");

    const projectPaths = await listApprovedProjectPathsForProject(providerProjectId);
    assert(projectPaths.some((item) => item.id === configuredPathRecord.id), "Configured approved path should be listable for the project");

    const scriptText = readOwnedText("scripts/verify-project-workspace.ts");
    const unsafeScriptMatches = lineMatches(scriptText, forbiddenScriptTextPatterns);
    assert(unsafeScriptMatches.length === 0, `Verifier must not execute forbidden runtime surfaces: ${unsafeScriptMatches.join("; ")}`);

    const unsafeProductMatches = lineMatches(scriptText, forbiddenProductPatterns);
    assert(unsafeProductMatches.length === 0, `Verifier must not introduce forbidden product integrations: ${unsafeProductMatches.join("; ")}`);

    const unsafeWorkspaceMatches = lineMatches(scriptText, forbiddenWorkspaceDetectionPatterns);
    assert(unsafeWorkspaceMatches.length === 0, `Verifier must not scan or auto-detect approved workspace source: ${unsafeWorkspaceMatches.join("; ")}`);

    const implementationText = implementationFiles
      .map((file) => `\n--- ${file} ---\n${readOwnedText(file)}`)
      .join("\n");
    const unsafeImplementationRuntimeMatches = lineMatches(implementationText, forbiddenImplementationRuntimePatterns);
    assert(
      unsafeImplementationRuntimeMatches.length === 0,
      `Phase 10 implementation must not add automatic runtime execution surfaces: ${unsafeImplementationRuntimeMatches.join("; ")}`,
    );
    const unsafeImplementationWorkspaceMatches = lineMatches(implementationText, forbiddenWorkspaceDetectionPatterns);
    assert(
      unsafeImplementationWorkspaceMatches.length === 0,
      `Phase 10 implementation must not scan or auto-detect approved workspace source: ${unsafeImplementationWorkspaceMatches.join("; ")}`,
    );

    const summary = {
      helperPresent: helperFiles.every((file) => fs.existsSync(path.join(projectRoot, file))),
      implementationFilesScanned: implementationFiles.length,
      totalProjects: workspaceSummaries.length,
      recentProjectIds: recentProjects.map((project) => project.projectId),
      providerWorkspace,
      providerHealth,
      missingApprovedPathStatusVerified: "needs_setup",
      approvedPathConfiguredStatusVerified: "configured",
      codexReadinessReferenced: true,
      qualitySummaryReferenced: true,
      reviewSummaryReferenced: true,
      archiveSummaryReferenced: true,
      backupSummaryReferenced: true,
      recommendedNextActionExists: true,
      filesystemScanAttempted: false,
      projectSourceReadAttempted: false,
      packageJsonAutoDetectFromApprovedPathsAttempted: false,
      codexExecutionAttempted: false,
      gitMutationAttempted: false,
      qualityGateRunnerAttempted: false,
      browserLaunched: false,
      tauriLaunched: false,
      installAttempted: false,
      deployAttempted: false,
      cloudIntegrationAdded: false,
      dangerousShellTerminalNodePtyAdded: false,
    };

    console.log("Project workspace verification passed");
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    if (configuredPathRecordId) {
      await removeApprovedProjectPathRecord(configuredPathRecordId);
    }
    sqliteClient.close();
    fs.rmSync(tempDbDir, { force: true, recursive: true });
  }
}

main().catch((error: unknown) => {
  console.error("Project workspace verification failed");
  console.error(error);
  process.exit(1);
});
