import { AppShell } from "@/components/layout/AppShell";
import { BetaOpsPanel } from "@/components/beta/BetaOpsPanel";
import {
  createBetaFeedbackRecordAction,
  createBetaIssueRecordAction,
  createBetaTesterRecordAction,
} from "./actions";
import { getBetaOpsSummary } from "@/lib/beta-ops/beta-ops-summary";
import { initializeLocalDb } from "@/lib/local-db/init";
import {
  getBetaIntakeSummary,
  listBetaFeedbackRecords,
  listBetaIssueRecords,
  listBetaTesterRecords,
} from "@/lib/local-db/operations/beta-intake";

export default async function BetaOpsPage() {
  initializeLocalDb();
  const summary = getBetaOpsSummary();
  const [intakeSummary, testers, feedback, issues] = await Promise.all([
    getBetaIntakeSummary(),
    listBetaTesterRecords(),
    listBetaFeedbackRecords(),
    listBetaIssueRecords(),
  ]);

  return (
    <AppShell>
      <BetaOpsPanel
        summary={summary}
        intakeSummary={intakeSummary}
        testers={testers}
        feedback={feedback}
        issues={issues}
        createTesterAction={createBetaTesterRecordAction}
        createFeedbackAction={createBetaFeedbackRecordAction}
        createIssueAction={createBetaIssueRecordAction}
      />
    </AppShell>
  );
}
