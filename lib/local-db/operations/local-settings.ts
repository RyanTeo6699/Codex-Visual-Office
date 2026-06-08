import type { LocalSetting } from "@/lib/types";
import {
  getLocalSettingRow,
  listLocalSettingRows,
  listLocalSettingRowsByCategory,
  upsertLocalSettingRow,
  type LocalSettingRow,
} from "../repositories/local-settings";
import { nowIso } from "./time";

export interface UpsertLocalSettingInput {
  key: string;
  value: Record<string, unknown>;
  category: string;
  description: string;
  updatedAt?: string;
}

export const defaultLocalSettings: UpsertLocalSettingInput[] = [
  {
    key: "app.localMode",
    value: {
      enabled: true,
      label: "Local-first mode",
    },
    category: "app",
    description: "Local-first product mode indicator.",
  },
  {
    key: "app.themePreference",
    value: {
      theme: "dark",
    },
    category: "app",
    description: "Local UI theme preference placeholder.",
  },
  {
    key: "codex.runtimeStatusDisplay",
    value: {
      enabled: true,
    },
    category: "codex",
    description: "Show safe Codex CLI runtime status.",
  },
  {
    key: "localDb.pathDisplay",
    value: {
      visible: true,
    },
    category: "local_db",
    description: "Show local SQLite database path.",
  },
  {
    key: "quality.defaultEnabledGateKeys",
    value: {
      keys: ["npm_typecheck", "npm_build", "git_diff_check"],
    },
    category: "quality",
    description: "Default enabled quality gate keys for display.",
  },
  {
    key: "projectPaths.statusDisplay",
    value: {
      status: "planned",
      note: "Project Import starts in Phase 6 Step 2",
    },
    category: "project_paths",
    description: "Approved project paths status display.",
  },
  {
    key: "backup.statusDisplay",
    value: {
      status: "planned",
      note: "Backup / Restore starts in Phase 6 Step 3",
    },
    category: "backup",
    description: "Backup and restore status display.",
  },
  {
    key: "desktopPackaging.statusDisplay",
    value: {
      status: "planned",
      note: "Desktop packaging is planning-only in Phase 6",
    },
    category: "desktop",
    description: "Desktop packaging future evaluation status.",
  },
];

const sensitiveSettingPattern = /OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD|~\/\.codex|auth\.json|\.env\.local|\.env/i;

function assertSafeLocalSettingValue(value: Record<string, unknown>): void {
  const serialized = JSON.stringify(value);
  if (sensitiveSettingPattern.test(serialized)) {
    throw new Error("Local settings cannot store token, auth, env, or credential values.");
  }
}

function parseValue(valueJson: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(valueJson);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function mapLocalSettingRow(row: LocalSettingRow): LocalSetting {
  return {
    key: row.key,
    value: parseValue(row.valueJson),
    category: row.category,
    description: row.description,
    updatedAt: row.updatedAt,
  };
}

export async function upsertLocalSetting(input: UpsertLocalSettingInput): Promise<LocalSetting> {
  assertSafeLocalSettingValue(input.value);
  await upsertLocalSettingRow({
    key: input.key,
    valueJson: JSON.stringify(input.value),
    category: input.category,
    description: input.description,
    updatedAt: input.updatedAt ?? nowIso(),
  });

  const row = await getLocalSettingRow(input.key);
  if (!row) {
    throw new Error(`Local setting was not persisted: ${input.key}`);
  }

  return mapLocalSettingRow(row);
}

export async function getLocalSetting(key: string): Promise<LocalSetting | undefined> {
  const row = await getLocalSettingRow(key);
  return row ? mapLocalSettingRow(row) : undefined;
}

export async function listLocalSettings(): Promise<LocalSetting[]> {
  return (await listLocalSettingRows()).map(mapLocalSettingRow).sort((a, b) => a.key.localeCompare(b.key));
}

export async function listLocalSettingsByCategory(category: string): Promise<LocalSetting[]> {
  return (await listLocalSettingRowsByCategory(category)).map(mapLocalSettingRow).sort((a, b) => a.key.localeCompare(b.key));
}

export async function updateLocalSettingValue(key: string, value: Record<string, unknown>): Promise<LocalSetting> {
  const existing = await getLocalSetting(key);
  if (!existing) {
    throw new Error(`Local setting does not exist: ${key}`);
  }

  return upsertLocalSetting({
    key,
    value,
    category: existing.category,
    description: existing.description,
  });
}

export async function seedDefaultLocalSettings(): Promise<LocalSetting[]> {
  const settings: LocalSetting[] = [];
  for (const setting of defaultLocalSettings) {
    settings.push(await upsertLocalSetting(setting));
  }

  return settings;
}

export { listLocalSettingRows };
