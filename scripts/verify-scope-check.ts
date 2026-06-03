import { checkForbiddenScope } from "@/lib/git-observation/scope-check";
import { replaceFileChangesForTask } from "@/lib/local-db/operations/file-changes";
import { replaceScopeCheckForTask, readLatestScopeCheckForTask } from "@/lib/local-db/operations/scope-checks";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import type { FileChange } from "@/lib/types";

const projectId = "provider-workspace";
const taskId = "task-provider-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function changedFile(filePath: string): Pick<FileChange, "filePath"> {
  return { filePath };
}

async function main(): Promise<void> {
  initializeLocalDb();
  seedFromMockData();

  const noMatch = checkForbiddenScope({
    forbiddenScope: ["Do not modify Supabase schema"],
    changedFiles: [changedFile("components/review/ScopeGuardPanel.tsx")],
  });
  assert(noMatch.status === "pass", "No matching changed file path should pass");

  const supabaseMatch = checkForbiddenScope({
    forbiddenScope: ["Do not modify Supabase schema"],
    changedFiles: [changedFile("supabase/migrations/20260602000000_create_tasks.sql")],
  });
  assert(["blocked", "warning"].includes(supabaseMatch.status), "Supabase migration path should not pass");
  assert(supabaseMatch.status === "blocked", "Supabase migration path should be blocked");

  const authMatch = checkForbiddenScope({
    forbiddenScope: ["Do not touch auth logic"],
    changedFiles: [changedFile("app/auth/login/page.tsx")],
  });
  assert(["blocked", "warning"].includes(authMatch.status), "Auth path should not pass");

  const weakKeywordMatch = checkForbiddenScope({
    forbiddenScope: ["Do not modify generated reports"],
    changedFiles: [changedFile("docs/reports/provider-summary.md")],
  });
  assert(weakKeywordMatch.status === "warning", "Generic keyword path match should warn");

  const unparseable = checkForbiddenScope({
    forbiddenScope: ["???"],
    changedFiles: [changedFile("components/review/ScopeGuardPanel.tsx")],
  });
  assert(unparseable.status === "warning", "Unparseable rule should warn");

  await replaceFileChangesForTask({
    taskId,
    projectId,
    changes: [
      {
        changeStatus: "modified",
        rawStatus: "M",
        filePath: "supabase/migrations/20260602000000_forbidden.sql",
      },
      {
        changeStatus: "modified",
        rawStatus: "M",
        filePath: "components/review/ScopeGuardPanel.tsx",
      },
    ],
  });

  const persistedResult = checkForbiddenScope({
    forbiddenScope: ["Do not modify Supabase schema"],
    changedFiles: [
      changedFile("supabase/migrations/20260602000000_forbidden.sql"),
      changedFile("components/review/ScopeGuardPanel.tsx"),
    ],
  });
  const created = await replaceScopeCheckForTask({
    taskId,
    projectId,
    status: persistedResult.status,
    forbiddenScope: persistedResult.forbiddenScope,
    matchedFiles: persistedResult.matchedFiles,
    unmatchedFiles: persistedResult.unmatchedFiles,
    ruleResults: persistedResult.ruleResults,
    reason: persistedResult.reason,
  });
  const readBack = await readLatestScopeCheckForTask(taskId);

  assert(readBack?.id === created.id, "Scope check must read back after replace");
  assert(readBack.status === "blocked", "Persisted Supabase migration scope check should be blocked");
  assert(readBack.checkSource === "path_level_forbidden_scope", "Scope check source must be path_level_forbidden_scope");
  assert(readBack.matchedFiles.includes("supabase/migrations/20260602000000_forbidden.sql"), "Matched forbidden path should persist");
  assert(!("diff" in readBack), "Scope check must not store complete diff");
  assert(!("content" in readBack), "Scope check must not store file content");

  const summary = {
    noMatchStatus: noMatch.status,
    supabaseMigrationStatus: supabaseMatch.status,
    authPathStatus: authMatch.status,
    weakKeywordStatus: weakKeywordMatch.status,
    unparseableRuleStatus: unparseable.status,
    persistedScopeCheckId: readBack.id,
    persistedStatus: readBack.status,
    matchedFiles: readBack.matchedFiles,
    checkSource: readBack.checkSource,
    fileContentsRead: false,
    fullDiffRead: false,
    openAiApiCalled: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Scope check verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Scope check verification failed");
  console.error(error);
  process.exit(1);
});
