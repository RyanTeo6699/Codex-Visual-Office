import { eq } from "drizzle-orm";
import { db } from "../client";
import { settings } from "../schema";

export type SettingRow = typeof settings.$inferSelect;
export type NewSettingRow = typeof settings.$inferInsert;

// Phase 2 Step 1 repository skeleton. UI integration starts in a later step.
export async function listSettings(): Promise<SettingRow[]> {
  return db.select().from(settings).all();
}

export async function getSetting(key: string): Promise<SettingRow | undefined> {
  return db.select().from(settings).where(eq(settings.key, key)).get();
}

export async function setSetting(setting: NewSettingRow): Promise<void> {
  db.insert(settings).values(setting).onConflictDoUpdate({
    target: settings.key,
    set: {
      valueJson: setting.valueJson,
      updatedAt: setting.updatedAt,
    },
  }).run();
}

export async function deleteSetting(key: string): Promise<void> {
  db.delete(settings).where(eq(settings.key, key)).run();
}
