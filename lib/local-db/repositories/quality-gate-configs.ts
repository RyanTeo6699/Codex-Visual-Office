import { eq } from "drizzle-orm";
import { db } from "../client";
import { qualityGateConfigs } from "../schema";

export type QualityGateConfigRow = typeof qualityGateConfigs.$inferSelect;
export type NewQualityGateConfigRow = typeof qualityGateConfigs.$inferInsert;

export async function listQualityGateConfigs(): Promise<QualityGateConfigRow[]> {
  return db.select().from(qualityGateConfigs).all();
}

export async function listQualityGateConfigsForProject(projectId: string): Promise<QualityGateConfigRow[]> {
  return db.select().from(qualityGateConfigs).where(eq(qualityGateConfigs.projectId, projectId)).all();
}

export async function getQualityGateConfigById(id: string): Promise<QualityGateConfigRow | undefined> {
  return db.select().from(qualityGateConfigs).where(eq(qualityGateConfigs.id, id)).get();
}

export async function insertQualityGateConfig(config: NewQualityGateConfigRow): Promise<void> {
  db.insert(qualityGateConfigs).values(config).run();
}

export async function upsertQualityGateConfigRow(config: NewQualityGateConfigRow): Promise<void> {
  db.insert(qualityGateConfigs).values(config).onConflictDoUpdate({
    target: qualityGateConfigs.id,
    set: {
      projectId: config.projectId,
      name: config.name,
      commandKey: config.commandKey,
      command: config.command,
      enabled: config.enabled,
      allowlisted: config.allowlisted,
      description: config.description,
      updatedAt: config.updatedAt,
    },
  }).run();
}

export async function updateQualityGateConfig(id: string, changes: Partial<Omit<NewQualityGateConfigRow, "id" | "createdAt">>): Promise<void> {
  db.update(qualityGateConfigs).set(changes).where(eq(qualityGateConfigs.id, id)).run();
}
