import { getSetting, listSettings, setSetting, type SettingRow } from "../repositories/settings";
import { nowIso } from "./time";

export async function readSetting(key: string): Promise<SettingRow | undefined> {
  return getSetting(key);
}

export async function updateSetting(key: string, value: unknown): Promise<SettingRow> {
  await setSetting({
    key,
    valueJson: JSON.stringify(value),
    updatedAt: nowIso(),
  });

  const updated = await getSetting(key);
  if (!updated) {
    throw new Error(`Setting was not found after update: ${key}`);
  }

  return updated;
}

export { listSettings };
