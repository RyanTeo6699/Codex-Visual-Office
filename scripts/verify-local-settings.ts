import { initializeLocalDb } from "@/lib/local-db/init";
import {
  getLocalSetting,
  listLocalSettings,
  listLocalSettingsByCategory,
  seedDefaultLocalSettings,
  updateLocalSettingValue,
  upsertLocalSetting,
} from "@/lib/local-db/operations/local-settings";
import { seedFromMockData } from "@/lib/local-db/seed/seed-from-mock-data";

const requiredKeys = [
  "app.localMode",
  "app.themePreference",
  "codex.runtimeStatusDisplay",
  "localDb.pathDisplay",
  "quality.defaultEnabledGateKeys",
  "projectPaths.statusDisplay",
  "backup.statusDisplay",
  "desktopPackaging.statusDisplay",
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoSensitiveValue(value: unknown): void {
  const serialized = JSON.stringify(value);
  assert(!/OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD|~\/\.codex|auth\.json|\.env\.local|\.env/i.test(serialized), "Local settings must not store sensitive token/auth/env values");
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
  await seedDefaultLocalSettings();
  await seedDefaultLocalSettings();

  const settings = await listLocalSettings();
  for (const key of requiredKeys) {
    const setting = settings.find((item) => item.key === key);
    assert(setting, `Missing default local setting: ${key}`);
    assertNoSensitiveValue(setting.value);
  }

  const appSettings = await listLocalSettingsByCategory("app");
  assert(appSettings.some((setting) => setting.key === "app.localMode"), "App category should include app.localMode");

  const updated = await updateLocalSettingValue("app.themePreference", { theme: "light" });
  assert(updated.value.theme === "light", "updateLocalSettingValue should persist JSON");

  const upserted = await upsertLocalSetting({
    key: "verify.localSettings",
    value: { enabled: true, label: "Verification setting" },
    category: "verification",
    description: "Created by settings verification",
  });
  assert(upserted.key === "verify.localSettings", "upsertLocalSetting should create a setting");

  const readBack = await getLocalSetting("verify.localSettings");
  assert(readBack?.value.enabled === true, "getLocalSetting should read the upserted value");

  await expectRejected("OpenAI token marker", () => upsertLocalSetting({
    key: "verify.sensitiveToken",
    value: { OPENAI_API_KEY: "abc" },
    category: "verification",
    description: "Should be rejected",
  }));

  await expectRejected("auth json marker", () => upsertLocalSetting({
    key: "verify.authJson",
    value: { path: "~/.codex/auth.json" },
    category: "verification",
    description: "Should be rejected",
  }));

  await expectRejected("env marker", () => upsertLocalSetting({
    key: "verify.env",
    value: { path: ".env.local" },
    category: "verification",
    description: "Should be rejected",
  }));

  const summary = {
    defaultsSeeded: requiredKeys.length,
    totalSettings: (await listLocalSettings()).length,
    appCategoryCount: appSettings.length,
    updateVerified: true,
    upsertVerified: true,
    sensitiveSettingsRejected: true,
    commandExecutionAttempted: false,
    backupRestoreAttempted: false,
    projectImportAttempted: false,
    cloudSyncAttempted: false,
    tokenStored: false,
  };

  console.log("Local settings verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local settings verification failed");
  console.error(error);
  process.exit(1);
});
