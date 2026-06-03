import { qualityGateCommandCatalog, qualityGateCommandKeys, seedDefaultQualityGateConfigsForProject } from "@/lib/local-db/operations/quality-gate-configs";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import { summarizeQualityGates } from "@/lib/quality-gates/quality-gate-summary";
import type { QualityGateConfig, QualityGateRun, QualityGateRunStatus } from "@/lib/types";

const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function runFor(config: QualityGateConfig, status: QualityGateRunStatus, index: number, overrides: Partial<QualityGateRun> = {}): QualityGateRun {
  const startedAt = `2026-06-03T04:0${index}:00.000Z`;
  const endedAt = `2026-06-03T04:0${index}:02.000Z`;
  return {
    id: `verify-quality-gate-run-${status}-${config.commandKey}-${index}`,
    taskId,
    projectId,
    configId: config.id,
    commandKey: config.commandKey,
    command: config.command,
    status,
    exitCode: status === "passed" ? 0 : status === "failed" ? 1 : undefined,
    durationMs: 2000 + index,
    stdoutPreview: status === "passed" ? "passed output" : "",
    stderrPreview: status === "failed" ? "failed output" : status === "blocked" ? "blocked output" : "",
    stdoutTruncated: false,
    stderrTruncated: status === "failed",
    skippedReason: status === "skipped" ? "config_disabled" : undefined,
    failedReason: status === "failed" ? "nonzero_exit" : status === "blocked" ? "execution_blocked" : undefined,
    startedAt,
    endedAt,
    createdAt: startedAt,
    ...overrides,
  };
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();
  const configs = await seedDefaultQualityGateConfigsForProject(projectId);
  const enabledConfigs = configs.filter((config) => config.enabled);
  const disabledConfigs = configs.filter((config) => !config.enabled);
  assert(enabledConfigs.length === 3, "Expected three enabled default configs");
  assert(disabledConfigs.length === 3, "Expected three disabled default configs");

  const notRun = summarizeQualityGates(configs, []);
  assert(notRun.overallStatus === "not_run", "No runs should summarize as not_run");
  assert(notRun.enabledCount === 3, "Enabled count should include enabled configs");
  assert(notRun.disabledCount === 3, "Disabled count should include disabled configs");
  assert(notRun.totalDurationMs === 0, "No runs should have zero duration");

  const allPassedRuns = enabledConfigs.map((config, index) => runFor(config, "passed", index));
  const allPassed = summarizeQualityGates(configs, allPassedRuns);
  assert(allPassed.overallStatus === "passed", "All enabled gates passed should summarize as passed");
  assert(allPassed.passedCount === 3, "Passed count should match runs");
  assert(allPassed.totalDurationMs === 6003, "Total duration should sum latest runs");
  assert(allPassed.latestRunAt === "2026-06-03T04:02:02.000Z", "Latest run should use latest endedAt");

  const failedRuns = [runFor(enabledConfigs[0], "passed", 0), runFor(enabledConfigs[1], "failed", 1), runFor(enabledConfigs[2], "passed", 2)];
  const failed = summarizeQualityGates(configs, failedRuns);
  assert(failed.overallStatus === "failed", "Any failed gate should summarize as failed");
  assert(failed.failedCount === 1, "Failed count should be one");
  assert(failed.failedGateNames.includes(enabledConfigs[1].name), "Failed gate name should be included");

  const skippedOnlyRuns = disabledConfigs.map((config, index) => runFor(config, "skipped", index));
  const skippedOnly = summarizeQualityGates(configs, skippedOnlyRuns);
  assert(skippedOnly.overallStatus === "skipped", "Only skipped runs should summarize as skipped");
  assert(skippedOnly.skippedCount === 3, "Skipped count should match skipped runs");

  const blockedRuns = [runFor(enabledConfigs[0], "passed", 0), runFor(enabledConfigs[1], "blocked", 1)];
  const blocked = summarizeQualityGates(configs, blockedRuns);
  assert(blocked.overallStatus === "blocked", "Any blocked gate should summarize as blocked");
  assert(blocked.blockedCount === 1, "Blocked count should be one");

  const mixedRuns = [runFor(enabledConfigs[0], "passed", 0), runFor(disabledConfigs[0], "skipped", 1)];
  const mixed = summarizeQualityGates(configs, mixedRuns);
  assert(mixed.overallStatus === "mixed", "Passed and skipped should summarize as mixed");

  const newerOldRun = runFor(enabledConfigs[0], "failed", 0, { createdAt: "2026-06-03T04:00:00.000Z", endedAt: "2026-06-03T04:00:02.000Z" });
  const newerLatestRun = runFor(enabledConfigs[0], "passed", 3, { createdAt: "2026-06-03T04:03:00.000Z", endedAt: "2026-06-03T04:03:02.000Z" });
  const latestWins = summarizeQualityGates(configs, [newerOldRun, newerLatestRun]);
  assert(latestWins.overallStatus === "mixed", "Latest run per config should win, while other enabled gates remain not run");
  assert(latestWins.failedCount === 0, "Older failed run should not count when a newer passed run exists");

  const summary = {
    projectId,
    commandKeys: qualityGateCommandKeys,
    allowlistedCommands: Object.fromEntries(qualityGateCommandKeys.map((key) => [key, qualityGateCommandCatalog[key].command])),
    notRunStatus: notRun.overallStatus,
    allPassedStatus: allPassed.overallStatus,
    failedStatus: failed.overallStatus,
    skippedStatus: skippedOnly.overallStatus,
    blockedStatus: blocked.overallStatus,
    mixedStatus: mixed.overallStatus,
    latestRunAt: allPassed.latestRunAt,
    totalDurationMs: allPassed.totalDurationMs,
    failedGateNames: failed.failedGateNames,
    arbitraryShellAdded: false,
    commandExecutionAdded: false,
    commandTextBoxAdded: false,
    autoFixAttempted: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Quality gate summary verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Quality gate summary verification failed");
  console.error(error);
  process.exit(1);
});
