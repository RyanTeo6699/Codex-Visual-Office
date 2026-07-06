import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  renderBetaFeedbackCsv,
  renderBetaIntakeMarkdownReport,
  renderBetaIssueCsv,
  renderBetaTesterCsv,
} from "@/lib/beta-ops/beta-intake-export";
import { initializeLocalDb } from "@/lib/local-db/init";
import {
  getBetaIntakeSummary,
  listBetaFeedbackRecords,
  listBetaIssueRecords,
  listBetaTesterRecords,
} from "@/lib/local-db/operations/beta-intake";

async function main() {
  initializeLocalDb();
  const [summary, testers, feedback, issues] = await Promise.all([
    getBetaIntakeSummary(),
    listBetaTesterRecords(),
    listBetaFeedbackRecords(),
    listBetaIssueRecords(),
  ]);

  const outputDir = path.join(process.cwd(), "docs", "private-beta-ops-export", "local-intake");
  mkdirSync(outputDir, { recursive: true });

  writeFileSync(path.join(outputDir, "beta-intake-report.md"), renderBetaIntakeMarkdownReport({ summary, testers, feedback, issues }));
  writeFileSync(path.join(outputDir, "beta-testers.csv"), renderBetaTesterCsv(testers));
  writeFileSync(path.join(outputDir, "beta-feedback.csv"), renderBetaFeedbackCsv(feedback));
  writeFileSync(path.join(outputDir, "beta-issues.csv"), renderBetaIssueCsv(issues));

  console.log("Private beta local intake export generated.");
  console.log(`testers=${summary.testerCount}`);
  console.log(`feedback=${summary.feedbackCount}`);
  console.log(`issues=${summary.issueCount}`);
  console.log("externalApiAttempted=false");
  console.log("autoSendAttempted=false");
  console.log("cloudSyncAttempted=false");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
