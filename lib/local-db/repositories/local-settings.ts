import { eq } from "drizzle-orm";
import { db } from "../client";
import { localSettings } from "../schema";

export type LocalSettingRow = typeof localSettings.$inferSelect;
export type NewLocalSettingRow = typeof localSettings.$inferInsert;

export async function listLocalSettingRows(): Promise<LocalSettingRow[]> {
  return db.select().from(localSettings).all();
}

export async function listLocalSettingRowsByCategory(category: string): Promise<LocalSettingRow[]> {
  return db.select().from(localSettings).where(eq(localSettings.category, category)).all();
}

export async function getLocalSettingRow(key: string): Promise<LocalSettingRow | undefined> {
  return db.select().from(localSettings).where(eq(localSettings.key, key)).get();
}

export async function upsertLocalSettingRow(setting: NewLocalSettingRow): Promise<void> {
  db.insert(localSettings).values(setting).onConflictDoUpdate({
    target: localSettings.key,
    set: {
      valueJson: setting.valueJson,
      category: setting.category,
      description: setting.description,
      updatedAt: setting.updatedAt,
    },
  }).run();
}
