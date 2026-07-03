import type { ProjectHealthSummary, ProjectWorkspaceSummary } from "./project-health-types";

function latestDefinedTime(values: Array<string | undefined>): string | undefined {
  return values.filter((value): value is string => Boolean(value)).sort().at(-1);
}

export function summarizeProjectWorkspace(summary: ProjectHealthSummary): ProjectWorkspaceSummary {
  return {
    projectId: summary.projectId,
    projectName: summary.projectName,
    projectStatus: summary.projectStatus,
    health: summary.health,
    recommendedNextAction: summary.recommendedNextAction,
    approvedPathConfigured: summary.approvedPath.configured,
    approvedPathApproved: summary.approvedPath.approved,
    codexRuntimeReadiness: summary.codexRuntime.readiness,
    runningTaskCount: summary.tasks.running,
    reviewTaskCount: summary.tasks.review,
    blockedTaskCount: summary.tasks.blocked,
    failedGateCount: summary.quality.failedGateCount,
    isGitDirty: summary.git.isDirty,
    latestActivityAt: latestDefinedTime([
      summary.review.latestDecisionAt,
      summary.backup.latestBackupAt,
    ]),
  };
}
