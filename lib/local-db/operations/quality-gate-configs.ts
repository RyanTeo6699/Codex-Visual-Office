import type { QualityGateCommandKey, QualityGateConfig } from "@/lib/types";
import {
  getQualityGateConfigById as getQualityGateConfigRowById,
  insertQualityGateConfig,
  listQualityGateConfigs,
  listQualityGateConfigsForProject as listQualityGateConfigRowsForProject,
  updateQualityGateConfig,
  upsertQualityGateConfigRow,
  type NewQualityGateConfigRow,
  type QualityGateConfigRow,
} from "../repositories/quality-gate-configs";
import { nowIso } from "./time";

export interface QualityGateCommandDefinition {
  commandKey: QualityGateCommandKey;
  name: string;
  command: string;
  description: string;
  defaultEnabled: boolean;
}

export const qualityGateCommandCatalog: Record<QualityGateCommandKey, QualityGateCommandDefinition> = {
  npm_typecheck: {
    commandKey: "npm_typecheck",
    name: "Typecheck",
    command: "npm run typecheck",
    description: "Configured candidate for TypeScript validation. Not executed in Phase 5 Step 1.",
    defaultEnabled: true,
  },
  npm_build: {
    commandKey: "npm_build",
    name: "Build",
    command: "npm run build",
    description: "Configured candidate for production build verification. Not executed in Phase 5 Step 1.",
    defaultEnabled: true,
  },
  npm_lint: {
    commandKey: "npm_lint",
    name: "Lint",
    command: "npm run lint",
    description: "Configured candidate only; projects may not define lint. Not executed in Phase 5 Step 1.",
    defaultEnabled: false,
  },
  npm_test: {
    commandKey: "npm_test",
    name: "Test",
    command: "npm test",
    description: "Configured candidate only; projects may not define npm test. Not executed in Phase 5 Step 1.",
    defaultEnabled: false,
  },
  npm_run_test: {
    commandKey: "npm_run_test",
    name: "Run Test",
    command: "npm run test",
    description: "Configured candidate only; projects may not define test script. Not executed in Phase 5 Step 1.",
    defaultEnabled: false,
  },
  git_diff_check: {
    commandKey: "git_diff_check",
    name: "Diff Whitespace Check",
    command: "git diff --check",
    description: "Configured candidate for whitespace diff checks. Not executed in Phase 5 Step 1.",
    defaultEnabled: true,
  },
};

export const qualityGateCommandKeys = Object.keys(qualityGateCommandCatalog) as QualityGateCommandKey[];

export interface CreateQualityGateConfigInput {
  id: string;
  projectId: string;
  name?: string;
  commandKey: QualityGateCommandKey;
  command?: string;
  enabled?: boolean;
  allowlisted?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

function assertAllowlistedCommand(commandKey: QualityGateCommandKey, command?: string): QualityGateCommandDefinition {
  const definition = qualityGateCommandCatalog[commandKey];
  if (!definition) {
    throw new Error(`Quality gate command key is not allowlisted: ${commandKey}`);
  }

  if (command !== undefined && command !== definition.command) {
    throw new Error(`Quality gate command text does not match allowlist for ${commandKey}`);
  }

  return definition;
}

export function mapQualityGateConfigRow(row: QualityGateConfigRow): QualityGateConfig {
  return {
    id: row.id,
    projectId: row.projectId,
    name: row.name,
    commandKey: row.commandKey,
    command: row.command,
    enabled: row.enabled,
    allowlisted: row.allowlisted,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createQualityGateConfig(input: CreateQualityGateConfigInput): Promise<QualityGateConfig> {
  const definition = assertAllowlistedCommand(input.commandKey, input.command);
  const timestamp = nowIso();
  const row: NewQualityGateConfigRow = {
    id: input.id,
    projectId: input.projectId,
    name: input.name ?? definition.name,
    commandKey: input.commandKey,
    command: definition.command,
    enabled: input.enabled ?? definition.defaultEnabled,
    allowlisted: input.allowlisted ?? true,
    description: input.description ?? definition.description,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  };

  if (!row.allowlisted) {
    throw new Error("Quality gate configs must be allowlisted in Phase 5 Step 1.");
  }

  await insertQualityGateConfig(row);
  const created = await getQualityGateConfigRowById(input.id);
  if (!created) {
    throw new Error(`Quality gate config was not created: ${input.id}`);
  }

  return mapQualityGateConfigRow(created);
}

export async function upsertQualityGateConfig(input: CreateQualityGateConfigInput): Promise<QualityGateConfig> {
  const definition = assertAllowlistedCommand(input.commandKey, input.command);
  const existing = await getQualityGateConfigRowById(input.id);
  const timestamp = nowIso();
  const row: NewQualityGateConfigRow = {
    id: input.id,
    projectId: input.projectId,
    name: input.name ?? definition.name,
    commandKey: input.commandKey,
    command: definition.command,
    enabled: input.enabled ?? existing?.enabled ?? definition.defaultEnabled,
    allowlisted: input.allowlisted ?? true,
    description: input.description ?? definition.description,
    createdAt: input.createdAt ?? existing?.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  };

  if (!row.allowlisted) {
    throw new Error("Quality gate configs must be allowlisted in Phase 5 Step 1.");
  }

  await upsertQualityGateConfigRow(row);
  const upserted = await getQualityGateConfigRowById(input.id);
  if (!upserted) {
    throw new Error(`Quality gate config was not upserted: ${input.id}`);
  }

  return mapQualityGateConfigRow(upserted);
}

export async function getQualityGateConfigById(id: string): Promise<QualityGateConfig | undefined> {
  const row = await getQualityGateConfigRowById(id);
  return row ? mapQualityGateConfigRow(row) : undefined;
}

export async function listQualityGateConfigsForProject(projectId: string): Promise<QualityGateConfig[]> {
  const rows = await listQualityGateConfigRowsForProject(projectId);
  return rows.map(mapQualityGateConfigRow).sort((a, b) => qualityGateCommandKeys.indexOf(a.commandKey) - qualityGateCommandKeys.indexOf(b.commandKey));
}

export async function updateQualityGateConfigEnabled(id: string, enabled: boolean): Promise<QualityGateConfig> {
  await updateQualityGateConfig(id, {
    enabled,
    updatedAt: nowIso(),
  });

  const updated = await getQualityGateConfigById(id);
  if (!updated) {
    throw new Error(`Quality gate config was not found after update: ${id}`);
  }

  return updated;
}

export async function seedDefaultQualityGateConfigsForProject(projectId: string): Promise<QualityGateConfig[]> {
  const created: QualityGateConfig[] = [];
  for (const commandKey of qualityGateCommandKeys) {
    const definition = qualityGateCommandCatalog[commandKey];
    created.push(await upsertQualityGateConfig({
      id: `quality-gate-config-${projectId}-${commandKey}`,
      projectId,
      name: definition.name,
      commandKey,
      command: definition.command,
      enabled: definition.defaultEnabled,
      allowlisted: true,
      description: definition.description,
    }));
  }

  return created;
}

export { listQualityGateConfigs };
