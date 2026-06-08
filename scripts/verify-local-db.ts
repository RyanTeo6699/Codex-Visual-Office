import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listAgentSeats } from "@/lib/local-db/repositories/agent-seats";
import { listApprovedProjectPaths } from "@/lib/local-db/operations/approved-project-paths";
import { listBackupRecords } from "@/lib/local-db/operations/backup-records";
import { listBuildChecks } from "@/lib/local-db/repositories/build-checks";
import { listDiffSummaries } from "@/lib/local-db/operations/diff-summaries";
import { listFileChanges } from "@/lib/local-db/repositories/file-changes";
import { listGitSnapshots } from "@/lib/local-db/repositories/git-snapshots";
import { listLocalSettings } from "@/lib/local-db/operations/local-settings";
import { listProjects } from "@/lib/local-db/repositories/projects";
import { listQualityGateConfigs } from "@/lib/local-db/operations/quality-gate-configs";
import { listQualityGateEvents } from "@/lib/local-db/operations/quality-gate-events";
import { listQualityGateRuns } from "@/lib/local-db/operations/quality-gate-runs";
import { listReviewRecords } from "@/lib/local-db/repositories/review-records";
import { listScopeChecks } from "@/lib/local-db/operations/scope-checks";
import { listSettings } from "@/lib/local-db/repositories/settings";
import { listTaskEvents } from "@/lib/local-db/repositories/task-events";
import { listTasks } from "@/lib/local-db/repositories/tasks";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

type CountKey =
  | "projects"
  | "agent_seats"
  | "approved_project_paths"
  | "backup_records"
  | "tasks"
  | "task_events"
  | "build_checks"
  | "diff_summaries"
  | "file_changes"
  | "git_snapshots"
  | "local_settings"
  | "quality_gate_configs"
  | "quality_gate_events"
  | "quality_gate_runs"
  | "review_records"
  | "scope_checks"
  | "settings";

const minimumExpectedCounts: Record<CountKey, number> = {
  projects: 5,
  agent_seats: 3,
  approved_project_paths: 0,
  backup_records: 0,
  tasks: 8,
  task_events: 12,
  build_checks: 8,
  diff_summaries: 0,
  file_changes: 0,
  git_snapshots: 0,
  local_settings: 8,
  quality_gate_configs: 30,
  quality_gate_events: 0,
  quality_gate_runs: 0,
  review_records: 3,
  scope_checks: 0,
  settings: 2,
};

initializeLocalDb();
seedFromMockData();
seedFromMockData();

async function main(): Promise<void> {
  const counts: Record<CountKey, number> = {
    projects: (await listProjects()).length,
    agent_seats: (await listAgentSeats()).length,
    approved_project_paths: (await listApprovedProjectPaths()).length,
    backup_records: (await listBackupRecords()).length,
    tasks: (await listTasks()).length,
    task_events: (await listTaskEvents()).length,
    build_checks: (await listBuildChecks()).length,
    diff_summaries: (await listDiffSummaries()).length,
    file_changes: (await listFileChanges()).length,
    git_snapshots: (await listGitSnapshots()).length,
    local_settings: (await listLocalSettings()).length,
    quality_gate_configs: (await listQualityGateConfigs()).length,
    quality_gate_events: (await listQualityGateEvents()).length,
    quality_gate_runs: (await listQualityGateRuns()).length,
    review_records: (await listReviewRecords()).length,
    scope_checks: (await listScopeChecks()).length,
    settings: (await listSettings()).length,
  };

  console.log(`Local database path: ${LOCAL_DB_PATH}`);
  console.log(JSON.stringify(counts, null, 2));

  const failures = Object.entries(minimumExpectedCounts).filter(([key, expected]) => {
    return counts[key as CountKey] < expected;
  });

  if (failures.length > 0) {
    console.error("Local database verification failed:");
    for (const [key, expected] of failures) {
      console.error(`- ${key}: expected at least ${expected}, got ${counts[key as CountKey]}`);
    }
    process.exit(1);
  }

  console.log("Local database verification passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
