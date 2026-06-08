"use server";

import { revalidatePath } from "next/cache";
import { createLocalDatabaseBackup, restoreDryRun, restoreLocalDatabaseBackup } from "@/lib/local-backup/backup-service";
import { initializeLocalDb } from "@/lib/local-db/init";
import { upsertApprovedProjectPath } from "@/lib/local-db/operations/approved-project-paths";

export async function saveApprovedProjectPathAction(formData: FormData): Promise<void> {
  try {
    initializeLocalDb();

    const projectId = String(formData.get("projectId") ?? "").trim();
    const localPath = String(formData.get("localPath") ?? "").trim();
    const label = String(formData.get("label") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const approved = formData.get("approved") === "on";

    if (!projectId) {
      throw new Error("Project is required.");
    }

    await upsertApprovedProjectPath({
      projectId,
      localPath,
      label,
      note,
      approved,
    });

    revalidatePath("/settings");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/review/task-provider-review");

  } catch (error) {
    console.error("Approved project path could not be saved", error);
  }
}

export async function createBackupNowAction(formData: FormData): Promise<void> {
  try {
    initializeLocalDb();
    const note = String(formData.get("note") ?? "").trim();
    await createLocalDatabaseBackup({
      note: note || "Manual backup from Settings",
    });
    revalidatePath("/settings");
  } catch (error) {
    console.error("Local database backup could not be created", error);
  }
}

export async function restoreDryRunAction(formData: FormData): Promise<void> {
  try {
    initializeLocalDb();
    const backupRecordId = String(formData.get("backupRecordId") ?? "").trim();
    if (!backupRecordId) {
      throw new Error("Backup record id is required.");
    }

    await restoreDryRun(backupRecordId);
    revalidatePath("/settings");
  } catch (error) {
    console.error("Restore dry-run could not complete", error);
  }
}

export async function confirmRestoreAction(formData: FormData): Promise<void> {
  try {
    initializeLocalDb();
    const backupRecordId = String(formData.get("backupRecordId") ?? "").trim();
    if (!backupRecordId) {
      throw new Error("Backup record id is required.");
    }

    await restoreLocalDatabaseBackup({
      backupRecordId,
      confirmRestore: true,
    });
    revalidatePath("/settings");
    revalidatePath("/");
    revalidatePath("/projects/provider-workspace");
    revalidatePath("/review/task-provider-review");
  } catch (error) {
    console.error("Local database restore could not complete", error);
  }
}
