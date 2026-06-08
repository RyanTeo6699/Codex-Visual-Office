import { AppShell } from "@/components/layout/AppShell";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import { initializeLocalDb } from "@/lib/local-db/init";
import { LOCAL_DB_PATH } from "@/lib/local-db/paths";
import { listApprovedProjectPaths } from "@/lib/local-db/operations/approved-project-paths";
import { listLocalSettings, seedDefaultLocalSettings } from "@/lib/local-db/operations/local-settings";
import { listProjects } from "@/lib/local-db/repositories/projects";
import { saveApprovedProjectPathAction } from "./actions";

export default async function SettingsPage() {
  initializeLocalDb();
  await seedDefaultLocalSettings();

  const [settings, codexStatus, projectRows, approvedPaths] = await Promise.all([
    listLocalSettings(),
    detectCodexCliStatus(),
    listProjects(),
    listApprovedProjectPaths(),
  ]);

  return (
    <AppShell>
      <SettingsPanel
        settings={settings}
        codexStatus={codexStatus}
        localDbPath={LOCAL_DB_PATH}
        projects={projectRows.map((project) => ({ id: project.id, name: project.name }))}
        approvedPaths={approvedPaths}
        saveApprovedProjectPathAction={saveApprovedProjectPathAction}
      />
    </AppShell>
  );
}
