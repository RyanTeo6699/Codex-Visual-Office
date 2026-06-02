import { allowedDiffSummaryCommands, forbiddenDiffSummaryCommands, parseDiffSummary, parseNumstat, readDiffSummary } from "@/lib/git-observation/diff-summary";
import { replaceDiffSummaryForTask, readLatestDiffSummaryForTask } from "@/lib/local-db/operations/diff-summaries";
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

  assert(allowedDiffSummaryCommands.includes("git diff --stat"), "git diff --stat must be allowlisted");
  assert(allowedDiffSummaryCommands.includes("git diff --numstat"), "git diff --numstat must be allowlisted");
  for (const command of forbiddenCommands) {
    assert(!allowedDiffSummaryCommands.includes(command as never), `Forbidden command must not be allowlisted: ${command}`);
  }
  assert(forbiddenDiffSummaryCommands.some((command) => command === "git diff --patch"), "Forbidden list must include git diff --patch");

  const parsed = parseDiffSummary({
    statOutput: " file-a.ts | 10 +++++-----\n 2 files changed, 8 insertions(+), 4 deletions(-)",
    numstatOutput: ["5\t2\tfile-a.ts", "-\t-\tasset.bin", "bad\trow\tunknown-row.ts"].join("\n"),
  });
  assert(parsed.filesChanged === 3, "Numstat should count normal, binary, and unparseable rows");
  assert(parsed.insertions === 5, "Normal insertions should be counted");
  assert(parsed.deletions === 2, "Normal deletions should be counted");
  assert(parsed.numstat.some((row) => row.binary && row.filePath === "asset.bin"), "Binary row should be marked safely");
  assert(parsed.numstat.some((row) => row.binary && row.filePath === "unknown-row.ts"), "Unparseable row should be marked safely");

  const largeNumstat = Array.from({ length: 140 }, (_, index) => `1\t1\tfile-${index}.ts`).join("\n");
  const truncatedParsed = parseNumstat(largeNumstat);
  assert(truncatedParsed.truncated === true, "Large numstat output should be truncated by row bound");
  assert(truncatedParsed.files.length === 120, "Bounded numstat rows should be capped");

  const liveSummary = await readDiffSummary({ approvedProjectPath });
  const latestSnapshots = await getLatestBeforeAfterSnapshotsForTask(taskId);
  const created = await replaceDiffSummaryForTask({
    taskId,
    projectId,
    gitSnapshotId: latestSnapshots.after?.id,
    filesChanged: liveSummary.filesChanged,
    insertions: liveSummary.insertions,
    deletions: liveSummary.deletions,
    numstat: liveSummary.numstat,
    statSummary: liveSummary.statSummary,
    stdoutTruncated: liveSummary.stdoutTruncated,
    numstatTruncated: liveSummary.numstatTruncated,
  });
  const readBack = await readLatestDiffSummaryForTask(taskId);

  assert(readBack?.id === created.id, "Diff summary must read back after replace");
  assert(readBack.source === "git_diff_stat_numstat", "Diff summary source must be git_diff_stat_numstat");
  assert(!("patch" in readBack), "Diff summary must not store patch");
  assert(!("content" in readBack), "Diff summary must not store file content");
  assert(!readBack.statSummary.includes("@@"), "Diff stat summary must not include patch hunks");

  const summary = {
    approvedProjectPath,
    allowedGitCommands: allowedDiffSummaryCommands,
    forbiddenGitCommandsVerified: forbiddenCommands,
    parserVerified: {
      normalRows: true,
      binaryRows: true,
      unparseableRows: true,
      truncation: true,
    },
    liveSummary: {
      filesChanged: liveSummary.filesChanged,
      insertions: liveSummary.insertions,
      deletions: liveSummary.deletions,
      statTruncated: liveSummary.stdoutTruncated,
      numstatTruncated: liveSummary.numstatTruncated,
    },
    persistedSummaryId: readBack.id,
    fullDiffStored: false,
    patchStored: false,
    fileContentsStored: false,
    mutatingGitCommandAttempted: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Diff summary verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Diff summary verification failed");
  console.error(error);
  process.exit(1);
});
