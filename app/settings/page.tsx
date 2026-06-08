import { AppShell } from "@/components/layout/AppShell";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listLocalSettings, seedDefaultLocalSettings } from "@/lib/local-db/operations/local-settings";

export default async function SettingsPage() {
  initializeLocalDb();
  await seedDefaultLocalSettings();

  const [settings, codexStatus] = await Promise.all([
    listLocalSettings(),
    detectCodexCliStatus(),
  ]);

  return (
    <AppShell>
      <SettingsPanel settings={settings} codexStatus={codexStatus} localDbPath={LOCAL_DB_PATH} />
    </AppShell>
  );
}
