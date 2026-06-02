import { allowedGitSnapshotCommands, forbiddenGitSnapshotCommands, readGitSnapshot } from "@/lib/git-observation/git-snapshot";
import { createGitSnapshot, getLatestBeforeAfterSnapshotsForTask, readGitSnapshotsForTask } from "@/lib/local-db/operations/git-snapshots";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

const approvedProjectPath = "/Users/ryanteo/Desktop/上线版本/CODEX可视化办公室";
const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const forbiddenCommands = [
    "git add",
    "git commit",
    "git push",
    "git pull",
    "git reset",
    "git clean",
    "git checkout",
    "git switch",
    "git merge",
    "git rebase",
    "git stash",
    "git tag",
    "git remote add",
    "git remote remove",
  ];

  for (const command of forbiddenCommands) {
    assert(!allowedGitSnapshotCommands.includes(command as never), `Forbidden command must not be allowlisted: ${command}`);
  }
  assert(forbiddenGitSnapshotCommands.some((command) => command === "git commit"), "Forbidden command list must include git commit");

  const beforeRead = await readGitSnapshot({
    approvedProjectPath,
    snapshotKind: "before_runner",
  });
  const afterRead = await readGitSnapshot({
    approvedProjectPath,
    snapshotKind: "after_runner",
  });

  const before = await createGitSnapshot({
    id: "verify-git-snapshot-before",
    taskId,
    projectId,
    snapshotKind: "before_runner",
    branch: beforeRead.branch,
    headSha: beforeRead.headSha,
    repoRoot: beforeRead.repoRoot,
    porcelainStatus: beforeRead.porcelainStatus,
    isDirty: beforeRead.isDirty,
    statusSummary: beforeRead.statusSummary,
  });
  const after = await createGitSnapshot({
    id: "verify-git-snapshot-after",
    taskId,
    projectId,
    snapshotKind: "after_runner",
    branch: afterRead.branch,
    headSha: afterRead.headSha,
    repoRoot: afterRead.repoRoot,
    porcelainStatus: afterRead.porcelainStatus,
    isDirty: afterRead.isDirty,
    statusSummary: afterRead.statusSummary,
  });

  const snapshots = await readGitSnapshotsForTask(taskId);
  const latest = await getLatestBeforeAfterSnapshotsForTask(taskId);

  for (const snapshot of [before, after]) {
    assert(snapshot.branch.length > 0, "Snapshot branch must be present");
    assert(snapshot.headSha.length > 0, "Snapshot head_sha must be present");
    assert(snapshot.repoRoot === approvedProjectPath, "Snapshot repo_root must match approved project path");
    assert(typeof snapshot.porcelainStatus === "string", "Snapshot porcelain_status must be present");
    assert(typeof snapshot.isDirty === "boolean", "Snapshot is_dirty must be present");
    assert(["before_runner", "after_runner", "manual"].includes(snapshot.snapshotKind), "Snapshot kind must be valid");
  }
  assert(snapshots.some((snapshot) => snapshot.id === before.id), "Before snapshot must read back by task");
  assert(snapshots.some((snapshot) => snapshot.id === after.id), "After snapshot must read back by task");
  assert(latest.before, "Latest before snapshot must be readable");
  assert(latest.after, "Latest after snapshot must be readable");

  const summary = {
    approvedProjectPath,
    allowedGitCommands: allowedGitSnapshotCommands,
    forbiddenGitCommandsVerified: forbiddenCommands,
    before: {
      branch: before.branch,
      headSha: before.headSha.slice(0, 7),
      isDirty: before.isDirty,
      changedFileCount: before.statusSummary.changedFileCount,
    },
    after: {
      branch: after.branch,
      headSha: after.headSha.slice(0, 7),
      isDirty: after.isDirty,
      changedFileCount: after.statusSummary.changedFileCount,
    },
    snapshotsForTask: snapshots.length,
    mutatingGitCommandAttempted: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Git snapshot verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Git snapshot verification failed");
  console.error(error);
  process.exit(1);
});
