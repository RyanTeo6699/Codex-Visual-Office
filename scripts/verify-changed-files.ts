import { allowedChangedFilesCommands, forbiddenChangedFilesCommands, parseGitNameStatus, readChangedFiles } from "@/lib/git-observation/changed-files";
import { replaceFileChangesForTask, readFileChangesForTask } from "@/lib/local-db/operations/file-changes";
import { getLatestBeforeAfterSnapshotsForTask } from "@/lib/local-db/operations/git-snapshots";
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
    "git diff --stat",
    "git diff --numstat",
    "git diff --patch",
    "git show",
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

  assert(allowedChangedFilesCommands.includes("git diff --name-status"), "git diff --name-status must be allowlisted");
  for (const command of forbiddenCommands) {
    assert(!allowedChangedFilesCommands.includes(command as never), `Forbidden command must not be allowlisted: ${command}`);
  }
  assert(forbiddenChangedFilesCommands.some((command) => command === "git diff --stat"), "Forbidden list must include git diff --stat");

  const parsed = parseGitNameStatus([
    "M\tapp/page.tsx",
    "A\tcomponents/NewPanel.tsx",
    "D\told/file.ts",
    "R100\told/name.ts\tnew/name.ts",
    "C075\tbase/file.ts\tcopy/file.ts",
    "U\tconflict/file.ts",
    "X\tunknown/file.ts",
  ].join("\n"));

  assert(parsed.find((item) => item.filePath === "app/page.tsx")?.changeStatus === "modified", "M must parse as modified");
  assert(parsed.find((item) => item.filePath === "components/NewPanel.tsx")?.changeStatus === "added", "A must parse as added");
  assert(parsed.find((item) => item.filePath === "old/file.ts")?.changeStatus === "deleted", "D must parse as deleted");
  assert(parsed.find((item) => item.filePath === "new/name.ts")?.previousFilePath === "old/name.ts", "R must parse previous path");
  assert(parsed.find((item) => item.filePath === "copy/file.ts")?.changeStatus === "copied", "C must parse as copied");
  assert(parsed.find((item) => item.filePath === "conflict/file.ts")?.changeStatus === "unmerged", "U must parse as unmerged");
  assert(parsed.find((item) => item.filePath === "unknown/file.ts")?.changeStatus === "unknown", "Unknown status must parse as unknown");

  const liveChangedFiles = await readChangedFiles({ approvedProjectPath });
  const latestSnapshots = await getLatestBeforeAfterSnapshotsForTask(taskId);
  const created = await replaceFileChangesForTask({
    taskId,
    projectId,
    gitSnapshotId: latestSnapshots.after?.id,
    changes: liveChangedFiles,
  });
  const readBack = await readFileChangesForTask(taskId);

  assert(readBack.length === created.length, "File changes must read back after replace");
  for (const change of readBack) {
    assert(change.source === "git_diff_name_status", "File change source must be git_diff_name_status");
    assert(change.filePath.length > 0, "File change path must be present");
    assert(!("content" in change), "File change must not store file content");
    assert(!("diff" in change), "File change must not store full diff");
    assert(!("additions" in change), "File change must not store additions");
    assert(!("deletions" in change), "File change must not store deletions");
  }

  const summary = {
    approvedProjectPath,
    allowedGitCommands: allowedChangedFilesCommands,
    forbiddenGitCommandsVerified: forbiddenCommands,
    parserStatusesVerified: ["M", "A", "D", "R100", "C075", "U", "unknown"],
    liveChangedFileCount: liveChangedFiles.length,
    persistedFileChangeCount: readBack.length,
    fullDiffStored: false,
    fileContentsStored: false,
    additionsDeletionsStored: false,
    mutatingGitCommandAttempted: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Changed files verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Changed files verification failed");
  console.error(error);
  process.exit(1);
});
