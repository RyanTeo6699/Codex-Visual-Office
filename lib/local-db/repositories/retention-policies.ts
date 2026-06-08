import { eq } from "drizzle-orm";
import { db } from "../client";
import { retentionPolicies } from "../schema";

export type RetentionPolicyRow = typeof retentionPolicies.$inferSelect;
export type NewRetentionPolicyRow = typeof retentionPolicies.$inferInsert;

export async function upsertRetentionPolicyRow(policy: NewRetentionPolicyRow): Promise<void> {
  db.insert(retentionPolicies).values(policy).onConflictDoUpdate({
    target: retentionPolicies.id,
    set: {
      target: policy.target,
      retentionDays: policy.retentionDays,
      enabled: policy.enabled,
      mode: policy.mode,
      description: policy.description,
      updatedAt: policy.updatedAt,
    },
  }).run();
}

export async function listRetentionPolicyRows(): Promise<RetentionPolicyRow[]> {
  return db.select().from(retentionPolicies).all();
}

export async function getRetentionPolicyRowByTarget(target: RetentionPolicyRow["target"]): Promise<RetentionPolicyRow | undefined> {
  return db.select().from(retentionPolicies).where(eq(retentionPolicies.target, target)).get();
}

export async function getRetentionPolicyRowById(id: string): Promise<RetentionPolicyRow | undefined> {
  return db.select().from(retentionPolicies).where(eq(retentionPolicies.id, id)).get();
}

export async function updateRetentionPolicyRow(
  id: string,
  changes: Partial<Omit<NewRetentionPolicyRow, "id" | "createdAt">>,
): Promise<void> {
  db.update(retentionPolicies).set(changes).where(eq(retentionPolicies.id, id)).run();
}
