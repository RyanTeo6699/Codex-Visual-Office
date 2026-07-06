import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { inspectBetaIntakeText } from "@/lib/beta-ops/beta-intake-guard";
import { initializeLocalDb } from "@/lib/local-db/init";
import { sqliteClient } from "@/lib/local-db/client";
import {
  createBetaFeedbackRecord,
  createBetaIssueRecord,
  createBetaTesterRecord,
  getBetaIntakeSummary,
  listBetaFeedbackRecords,
  listBetaIssueRecords,
  listBetaTesterRecords,
} from "@/lib/local-db/operations/beta-intake";

const rootDir = process.cwd();

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relativePath: string): string {
  const fullPath = path.join(rootDir, relativePath);
  assert(existsSync(fullPath), `Missing required file: ${relativePath}`);
  return readFileSync(fullPath, "utf8");
}

function assertNoForbiddenImplementation(relativePath: string): void {
  const source = read(relativePath);
  const forbidden = [
    "node-pty",
    "shell:true",
    "shell: true",
    "OpenAI(",
    "api.openai.com",
    "gmail",
    "slack",
    "discord",
    "sendEmail",
    "sendMail",
    "fetch(\"https://",
    "fetch('https://",
    "process.env.OPENAI_API_KEY",
    "~/.codex/auth.json",
  ];

  for (const token of forbidden) {
    assert(!source.includes(token), `${relativePath} contains forbidden implementation marker: ${token}`);
  }
}

async function verifyTransactionalOperations(): Promise<{ testers: number; feedback: number; issues: number }> {
  sqliteClient.exec("BEGIN");
  try {
    const tester = await createBetaTesterRecord({
      testerLabel: "verifier-local-tester",
      testerType: "support_observation",
      environmentJson: "{\"browser\":\"local verification\"}",
      consentStatus: "acknowledged",
      invitationStatus: "accepted",
      onboardingStatus: "passed",
      feedbackStatus: "submitted",
      notes: "redacted local verification note",
    });
    const feedback = await createBetaFeedbackRecord({
      testerId: tester.id,
      sourceType: "support_observation",
      area: "beta intake",
      summary: "redacted local verification feedback",
      evidenceType: "none",
      severity: "p3",
      priority: "low",
      status: "submitted",
      sensitiveDataChecked: true,
      notes: "local verification only",
    });
    await createBetaIssueRecord({
      feedbackId: feedback.id,
      area: "beta intake",
      summary: "redacted local verification issue",
      severity: "p3",
      priority: "low",
      reproStatus: "not_applicable",
      safetyDataImpact: "none",
      decision: "defer",
      targetPhase: "verification",
      status: "triaged",
      notes: "local verification only",
    });

    const [testers, feedbackRecords, issues, summary] = await Promise.all([
      listBetaTesterRecords(),
      listBetaFeedbackRecords(),
      listBetaIssueRecords(),
      getBetaIntakeSummary(),
    ]);

    assert(testers.some((record) => record.id === tester.id), "Tester operation did not create readable record.");
    assert(feedbackRecords.some((record) => record.id === feedback.id), "Feedback operation did not create readable record.");
    assert(issues.some((record) => record.feedbackId === feedback.id), "Issue operation did not create readable record.");
    assert(summary.testerCount >= 1, "Summary did not include transactional tester.");

    sqliteClient.exec("ROLLBACK");
    return { testers: testers.length, feedback: feedbackRecords.length, issues: issues.length };
  } catch (error) {
    sqliteClient.exec("ROLLBACK");
    throw error;
  }
}

async function main() {
  initializeLocalDb();

  const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
  assert(packageJson.scripts?.["beta:verify:intake-ui"] === "tsx scripts/verify-beta-intake.ts", "Missing beta:verify:intake-ui script.");
  assert(packageJson.scripts?.["beta:intake:export"] === "tsx scripts/export-beta-intake-report.ts", "Missing beta:intake:export script.");

  for (const table of ["beta_tester_records", "beta_feedback_records", "beta_issue_records"]) {
    const row = sqliteClient.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
    assert(row, `Missing SQLite table: ${table}`);
  }

  assert(!inspectBetaIntakeText("redacted local setup feedback").violations.length, "Safe local intake text should pass.");
  assert(!inspectBetaIntakeText("OPENAI_API_KEY=secret").safe, "Token marker should be rejected.");
  assert(!inspectBetaIntakeText("~/.codex/auth.json").safe, "Codex auth path should be rejected.");
  assert(!inspectBetaIntakeText(".env.local").safe, "Env file marker should be rejected.");
  assert(!inspectBetaIntakeText("PLACEHOLDER_DO_NOT_COUNT").safe, "Placeholder marker should be rejected.");

  const sourceFiles = [
    "app/beta/actions.ts",
    "components/beta/BetaIntakeForm.tsx",
    "lib/local-db/operations/beta-intake.ts",
    "lib/beta-ops/beta-intake-guard.ts",
    "scripts/export-beta-intake-report.ts",
  ];
  sourceFiles.forEach(assertNoForbiddenImplementation);

  const operationsCounts = await verifyTransactionalOperations();

  console.log("beta intake UI verification passed");
  console.log(`transactionalReadCounts testers=${operationsCounts.testers} feedback=${operationsCounts.feedback} issues=${operationsCounts.issues}`);
  console.log("transactionRolledBack=true");
  console.log("externalApiAttempted=false");
  console.log("autoSendAttempted=false");
  console.log("cloudSyncAttempted=false");
  console.log("fakeFeedbackSeeded=false");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
