import {
  createQualityGateConfig,
  getQualityGateConfigById,
  listQualityGateConfigsForProject,
  qualityGateCommandCatalog,
  qualityGateCommandKeys,
  seedDefaultQualityGateConfigsForProject,
  updateQualityGateConfigEnabled,
  upsertQualityGateConfig,
} from "@/lib/local-db/operations/quality-gate-configs";
import { initializeLocalDb } from "@/lib/local-db/init";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";
import type { QualityGateCommandKey, QualityGateConfig } from "@/lib/types";

const projectId = "provider-workspace";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertConfigMatchesCatalog(config: QualityGateConfig): void {
  const definition = qualityGateCommandCatalog[config.commandKey];
  assert(definition, `Unknown command key: ${config.commandKey}`);
  assert(config.command === definition.command, `Command text mismatch for ${config.commandKey}`);
  assert(config.allowlisted === true, `Config must be allowlisted: ${config.id}`);
}

async function expectRejected(label: string, action: () => Promise<unknown>): Promise<void> {
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
  const verifyConfigId = `quality-gate-config-verify-project-git-diff-check-${Date.now()}`;

  const seeded = await seedDefaultQualityGateConfigsForProject(projectId);
  assert(seeded.length === qualityGateCommandKeys.length, "Default quality gate configs should be seeded for every allowlisted key");

  const configs = await listQualityGateConfigsForProject(projectId);
  const defaultConfigs = configs.filter((config) => config.id.startsWith(`quality-gate-config-${projectId}-`) && qualityGateCommandKeys.includes(config.commandKey));
  assert(defaultConfigs.length === qualityGateCommandKeys.length, "Project should have the complete default quality gate config set");

  for (const config of defaultConfigs) {
    assertConfigMatchesCatalog(config);
  }

  const enabledByDefault = new Map(defaultConfigs.map((config) => [config.commandKey, config.enabled]));
  assert(enabledByDefault.get("npm_typecheck") === true, "npm_typecheck should be enabled by default");
  assert(enabledByDefault.get("npm_build") === true, "npm_build should be enabled by default");
  assert(enabledByDefault.get("git_diff_check") === true, "git_diff_check should be enabled by default");
  assert(enabledByDefault.get("npm_lint") === false, "npm_lint should be disabled by default");
  assert(enabledByDefault.get("npm_test") === false, "npm_test should be disabled by default");
  assert(enabledByDefault.get("npm_run_test") === false, "npm_run_test should be disabled by default");

  const typecheck = defaultConfigs.find((config) => config.commandKey === "npm_typecheck");
  assert(typecheck, "npm_typecheck config should exist");
  const disabled = await updateQualityGateConfigEnabled(typecheck.id, false);
  assert(disabled.enabled === false, "Config should disable");
  const enabled = await updateQualityGateConfigEnabled(typecheck.id, true);
  assert(enabled.enabled === true, "Config should re-enable");

  const created = await createQualityGateConfig({
    id: verifyConfigId,
    projectId,
    commandKey: "git_diff_check",
    command: qualityGateCommandCatalog.git_diff_check.command,
  });
  assertConfigMatchesCatalog(created);

  const upserted = await upsertQualityGateConfig({
    id: verifyConfigId,
    projectId,
    commandKey: "git_diff_check",
    command: qualityGateCommandCatalog.git_diff_check.command,
    enabled: false,
  });
  assert(upserted.enabled === false, "Upsert should update enabled state");

  await expectRejected("unknown command key", () => createQualityGateConfig({
    id: "quality-gate-config-invalid-key",
    projectId,
    commandKey: "rm_rf" as QualityGateCommandKey,
    command: "rm -rf .",
  }));

  await expectRejected("mismatched command text", () => createQualityGateConfig({
    id: "quality-gate-config-invalid-command",
    projectId,
    commandKey: "npm_typecheck",
    command: "npm install",
  }));

  await expectRejected("non-allowlisted config", () => createQualityGateConfig({
    id: "quality-gate-config-not-allowlisted",
    projectId,
    commandKey: "npm_build",
    command: qualityGateCommandCatalog.npm_build.command,
    allowlisted: false,
  }));

  const readBack = await getQualityGateConfigById(typecheck.id);
  assert(readBack?.commandKey === "npm_typecheck", "Readback by id should work");

  const summary = {
    projectId,
    configuredCount: defaultConfigs.length,
    allowlistedCommandKeys: qualityGateCommandKeys,
    enabledDefaults: Object.fromEntries(defaultConfigs.map((config) => [config.commandKey, config.enabled])),
    arbitraryCommandRejected: true,
    mismatchedCommandRejected: true,
    nonAllowlistedConfigRejected: true,
    enableDisableVerified: true,
    qualityGateCommandExecuted: false,
    runnerImplemented: false,
    arbitraryShellImplemented: false,
    nodePtyImplemented: false,
    terminalEmulatorImplemented: false,
    autoCommitAttempted: false,
    autoPushAttempted: false,
    autoDeployAttempted: false,
  };

  console.log("Quality gate config verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Quality gate config verification failed");
  console.error(error);
  process.exit(1);
});
