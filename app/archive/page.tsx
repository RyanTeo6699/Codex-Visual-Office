import { AppShell } from "@/components/layout/AppShell";
import { ArchiveRoomPanel } from "@/components/archive/ArchiveRoomPanel";
import { buildCleanupDryRunPreview } from "@/lib/archive/archive-retention-preview";
import { buildArchiveSummary } from "@/lib/archive/archive-summary";
import { initializeLocalDb } from "@/lib/local-db/init";

export default async function ArchiveRoomPage() {
  initializeLocalDb();
  const [summary, dryRunPreview] = await Promise.all([
    buildArchiveSummary(),
    buildCleanupDryRunPreview(),
  ]);

  return (
    <AppShell>
      <ArchiveRoomPanel summary={summary} dryRunPreview={dryRunPreview} />
    </AppShell>
  );
}
