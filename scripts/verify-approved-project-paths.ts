import { initializeLocalDb } from "@/lib/local-db/init";
import {
  assertSafeApprovedProjectPath,
  getApprovedProjectPathById,
  getPrimaryApprovedPathForProject,
  listApprovedProjectPaths,
  listApprovedProjectPathsForProject,
  removeApprovedProjectPathRecord,
  updateApprovedProjectPathStatus,
  upsertApprovedProjectPath,
} from "@/lib/local-db/operations/approved-project-paths";
import { getProjectById } from "@/lib/local-db/repositories/projects";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

const projectId = "provider-workspace";
const localPath = "/Users/ryanteo/Desktop/上线版本/CODEX可视化办公室";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function expectRejected(label: string, action: () => Promise<unknown> | unknown): Promise<void> {
  try {
    await action();
  } catch {
    return;
  }

  throw new Error(`Expected rejection did not happen: ${label}`);
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const project = await getProjectById(projectId);
  assert(project, `Project should exist: ${projectId}`);

  const created = await upsertApprovedProjectPath({
    projectId,
    localPath,
    label: "Codex Visual Office local repo",
    approved: true,
    note: "Verification approved path record",
  });
  assert(created.projectId === projectId, "Approved path project id should persist");
  assert(created.localPath === localPath, "Approved path string should persist");
  assert(created.approved === true, "Approved path should be approved");

  const listed = await listApprovedProjectPaths();
  assert(listed.some((item) => item.id === created.id), "Global list should include approved path");

  const projectPaths = await listApprovedProjectPathsForProject(projectId);
  assert(projectPaths.some((item) => item.id === created.id), "Project list should include approved path");

  const byId = await getApprovedProjectPathById(created.id);
  assert(byId?.localPath === localPath, "getApprovedProjectPathById should return saved path");

  const primary = await getPrimaryApprovedPathForProject(projectId);
  assert(primary?.id === created.id, "Primary approved path should return approved record");

  const disabled = await updateApprovedProjectPathStatus(created.id, false);
  assert(disabled.approved === false, "Approved path status should update to false");
  assert(!disabled.approvedAt, "Unapproved path should clear approvedAt");

  const missingPrimary = await getPrimaryApprovedPathForProject(projectId);
  assert(!missingPrimary || missingPrimary.id !== created.id, "Unapproved path should not be primary");

  const enabled = await updateApprovedProjectPathStatus(created.id, true);
  assert(enabled.approved === true, "Approved path status should update to true");
  assert(Boolean(enabled.approvedAt), "Approved path should have approvedAt");

  assert(assertSafeApprovedProjectPath(localPath) === localPath, "Safe absolute path should pass string validation");
  await expectRejected("relative path", () => assertSafeApprovedProjectPath("relative/project"));
  await expectRejected("auth json", () => assertSafeApprovedProjectPath("/Users/ryanteo/.codex/auth.json"));
  await expectRejected("env", () => assertSafeApprovedProjectPath("/Users/ryanteo/project/.env"));
  await expectRejected("env local", () => assertSafeApprovedProjectPath("/Users/ryanteo/project/.env.local"));
  await expectRejected("private key", () => assertSafeApprovedProjectPath("/Users/ryanteo/.ssh/id_rsa"));

  await removeApprovedProjectPathRecord(created.id);
  const removed = await getApprovedProjectPathById(created.id);
  assert(!removed, "removeApprovedProjectPathRecord should delete only the DB record");
  const projectAfterRemove = await getProjectById(projectId);
  assert(projectAfterRemove?.id === projectId, "Removing approved path record must not delete the project");

  const summary = {
    projectId,
    localPathSaved: localPath,
    listVerified: true,
    getVerified: true,
    primaryVerified: true,
    statusUpdateVerified: true,
    removeRecordOnlyVerified: true,
    sensitivePathStringsRejected: true,
    pathContentReadAttempted: false,
    codexExecutionAttempted: false,
    gitExecutionAttempted: false,
    qualityGateExecutionAttempted: false,
    folderPickerImplemented: false,
    fullDiskScanAttempted: false,
  };

  console.log("Approved project paths verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Approved project paths verification failed");
  console.error(error);
  process.exit(1);
});
