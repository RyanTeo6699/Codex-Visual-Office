import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listAgentSeats } from "@/lib/local-db/repositories/agent-seats";
import { listBuildChecks } from "@/lib/local-db/repositories/build-checks";
import { listFileChanges } from "@/lib/local-db/repositories/file-changes";
import { listGitSnapshots } from "@/lib/local-db/repositories/git-snapshots";
import { listProjects } from "@/lib/local-db/repositories/projects";
import { listReviewRecords } from "@/lib/local-db/repositories/review-records";
import { listSettings } from "@/lib/local-db/repositories/settings";
import { listTaskEvents } from "@/lib/local-db/repositories/task-events";
import { listTasks } from "@/lib/local-db/repositories/tasks";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

type CountKey =
  | "projects"
  | "agent_seats"
  | "tasks"
  | "task_events"
  | "build_checks"
  | "file_changes"
  | "git_snapshots"
  | "review_records"
  | "settings";

const minimumExpectedCounts: Record<CountKey, number> = {
  projects: 5,
  agent_seats: 3,
  tasks: 8,
  task_events: 12,
  build_checks: 8,
  file_changes: 0,
  git_snapshots: 0,
  review_records: 3,
  settings: 2,
};

initializeLocalDb();
seedFromMockData();
seedFromMockData();

async function main(): Promise<void> {
  const counts: Record<CountKey, number> = {
    projects: (await listProjects()).length,
    agent_seats: (await listAgentSeats()).length,
    tasks: (await listTasks()).length,
    task_events: (await listTaskEvents()).length,
    build_checks: (await listBuildChecks()).length,
    file_changes: (await listFileChanges()).length,
    git_snapshots: (await listGitSnapshots()).length,
    review_records: (await listReviewRecords()).length,
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
