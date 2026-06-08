"use server";

import { revalidatePath } from "next/cache";
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
