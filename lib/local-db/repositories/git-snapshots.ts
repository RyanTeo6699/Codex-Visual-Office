import { and, desc, eq } from "drizzle-orm";
import { db } from "../client";
import { gitSnapshots } from "../schema";

export type GitSnapshotRow = typeof gitSnapshots.$inferSelect;
export type NewGitSnapshotRow = typeof gitSnapshots.$inferInsert;

export async function listGitSnapshots(): Promise<GitSnapshotRow[]> {
  return db.select().from(gitSnapshots).all();
}

export async function listGitSnapshotsForTask(taskId: string): Promise<GitSnapshotRow[]> {
  return db.select().from(gitSnapshots).where(eq(gitSnapshots.taskId, taskId)).orderBy(desc(gitSnapshots.createdAt)).all();
}

export async function getLatestGitSnapshotForTask(taskId: string): Promise<GitSnapshotRow | undefined> {
  return db.select().from(gitSnapshots).where(eq(gitSnapshots.taskId, taskId)).orderBy(desc(gitSnapshots.createdAt)).get();
}

export async function getLatestGitSnapshotForTaskByKind(taskId: string, snapshotKind: GitSnapshotRow["snapshotKind"]): Promise<GitSnapshotRow | undefined> {
  return db
    .select()
    .from(gitSnapshots)
    .where(and(eq(gitSnapshots.taskId, taskId), eq(gitSnapshots.snapshotKind, snapshotKind)))
    .orderBy(desc(gitSnapshots.createdAt))
    .get();
}

export async function insertGitSnapshot(snapshot: NewGitSnapshotRow): Promise<void> {
  db.insert(gitSnapshots).values(snapshot).run();
}

export async function upsertGitSnapshot(snapshot: NewGitSnapshotRow): Promise<void> {
  db.insert(gitSnapshots).values(snapshot).onConflictDoUpdate({
    target: gitSnapshots.id,
    set: {
      taskId: snapshot.taskId,
      projectId: snapshot.projectId,
      snapshotKind: snapshot.snapshotKind,
      branch: snapshot.branch,
      headSha: snapshot.headSha,
      repoRoot: snapshot.repoRoot,
      porcelainStatus: snapshot.porcelainStatus,
      isDirty: snapshot.isDirty,
      statusSummaryJson: snapshot.statusSummaryJson,
      createdAt: snapshot.createdAt,
    },
  }).run();
}
