"use server";

import { revalidatePath } from "next/cache";
import {
  createBetaFeedbackRecord,
  createBetaIssueRecord,
  createBetaTesterRecord,
} from "@/lib/local-db/operations/beta-intake";

export interface BetaIntakeActionState {
  ok: boolean;
  message: string;
}

const initialFailure: BetaIntakeActionState = {
  ok: false,
  message: "",
};

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function checked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function requireText(formData: FormData, key: string): string {
  const value = text(formData, key);
  if (!value) {
    throw new Error(`${key} is required.`);
  }
  return value;
}

export async function createBetaTesterRecordAction(
  _previousState: BetaIntakeActionState = initialFailure,
  formData: FormData,
): Promise<BetaIntakeActionState> {
  try {
    if (!checked(formData, "sensitiveDataChecked")) {
      throw new Error("Confirm the record contains no tokens, secrets, env contents, source dumps, or SQLite dumps.");
    }

    await createBetaTesterRecord({
      testerLabel: requireText(formData, "testerLabel"),
      testerType: text(formData, "testerType") as never,
      environmentJson: text(formData, "environmentJson"),
      consentStatus: text(formData, "consentStatus") as never,
      invitationStatus: text(formData, "invitationStatus") as never,
      onboardingStatus: text(formData, "onboardingStatus") as never,
      feedbackStatus: text(formData, "feedbackStatus") as never,
      notes: text(formData, "notes"),
    });

    revalidatePath("/beta");
    return { ok: true, message: "Local tester record saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save tester record." };
  }
}

export async function createBetaFeedbackRecordAction(
  _previousState: BetaIntakeActionState = initialFailure,
  formData: FormData,
): Promise<BetaIntakeActionState> {
  try {
    await createBetaFeedbackRecord({
      testerId: requireText(formData, "testerId"),
      sourceType: text(formData, "sourceType") as never,
      area: requireText(formData, "area"),
      summary: requireText(formData, "summary"),
      evidenceType: text(formData, "evidenceType") as never,
      severity: text(formData, "severity") as never,
      priority: text(formData, "priority") as never,
      status: text(formData, "status") as never,
      sensitiveDataChecked: checked(formData, "sensitiveDataChecked"),
      notes: text(formData, "notes"),
    });

    revalidatePath("/beta");
    return { ok: true, message: "Local feedback record saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save feedback record." };
  }
}

export async function createBetaIssueRecordAction(
  _previousState: BetaIntakeActionState = initialFailure,
  formData: FormData,
): Promise<BetaIntakeActionState> {
  try {
    await createBetaIssueRecord({
      feedbackId: requireText(formData, "feedbackId"),
      area: requireText(formData, "area"),
      summary: requireText(formData, "summary"),
      severity: text(formData, "severity") as never,
      priority: text(formData, "priority") as never,
      reproStatus: text(formData, "reproStatus") as never,
      safetyDataImpact: text(formData, "safetyDataImpact"),
      decision: text(formData, "decision") as never,
      targetPhase: text(formData, "targetPhase"),
      status: text(formData, "status") as never,
      notes: text(formData, "notes"),
    });

    revalidatePath("/beta");
    return { ok: true, message: "Local issue record saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save issue record." };
  }
}
