import { AppShell } from "@/components/layout/AppShell";
import { BetaOpsPanel } from "@/components/beta/BetaOpsPanel";
import { getBetaOpsSummary } from "@/lib/beta-ops/beta-ops-summary";

export default function BetaOpsPage() {
  const summary = getBetaOpsSummary();

  return (
    <AppShell>
      <BetaOpsPanel summary={summary} />
    </AppShell>
  );
}
