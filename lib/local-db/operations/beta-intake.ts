import { randomUUID } from "node:crypto";
import { assertSafeBetaIntakeFields, truncateBetaIntakeText } from "@/lib/beta-ops/beta-intake-guard";
import { summarizeBetaIntake } from "@/lib/beta-ops/beta-intake-summary";
import type {
  BetaConsentStatus,
  BetaEvidenceType,
  BetaFeedbackRecord,
  BetaFeedbackSourceType,
  BetaFeedbackStatus,
  BetaIssueDecision,
  BetaIssueRecord,
  BetaOnboardingStatus,
  BetaPriority,
  BetaRecordStatus,
  BetaReproStatus,
  BetaSeverity,
  BetaTesterRecord,
  BetaTesterType,
  BetaInvitationStatus,
} from "@/lib/types";
import type { BetaIntakeSummary } from "@/lib/beta-ops/beta-intake-types";
import {
  getBetaFeedbackRecordRowById,
  insertBetaFeedbackRecord,
  listBetaFeedbackRecordRows,
  type BetaFeedbackRecordRow,
} from "../repositories/beta-feedback-records";
import {
  insertBetaIssueRecord,
  listBetaIssueRecordRows,
  type BetaIssueRecordRow,
} from "../repositories/beta-issue-records";
import {
  getBetaTesterRecordRowById,
  insertBetaTesterRecord,
  listBetaTesterRecordRows,
  type BetaTesterRecordRow,
} from "../repositories/beta-tester-records";
import { nowIso } from "./time";

export interface CreateBetaTesterRecordInput {
  testerLabel: string;
  testerType: BetaTesterType;
  environmentJson?: string;
  consentStatus: BetaConsentStatus;
  invitationStatus: BetaInvitationStatus;
  onboardingStatus: BetaOnboardingStatus;
  feedbackStatus: BetaFeedbackStatus;
  notes?: string;
}

export interface CreateBetaFeedbackRecordInput {
  testerId: string;
  sourceType: BetaFeedbackSourceType;
  area: string;
  summary: string;
  evidenceType: BetaEvidenceType;
  severity: BetaSeverity;
  priority: BetaPriority;
  status: BetaRecordStatus;
  sensitiveDataChecked: boolean;
  notes?: string;
}

export interface CreateBetaIssueRecordInput {
  feedbackId: string;
  area: string;
  summary: string;
  severity: BetaSeverity;
  priority: BetaPriority;
  reproStatus: BetaReproStatus;
  safetyDataImpact?: string;
  decision: BetaIssueDecision;
  targetPhase?: string;
  status: BetaRecordStatus;
  notes?: string;
}

function parseEnvironmentJson(value: string): Record<string, unknown> {
  if (!value.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed && !Array.isArray(parsed) ? parsed as Record<string, unknown> : { note: value };
  } catch {
    return { note: value };
  }
}

export function mapBetaTesterRecordRow(row: BetaTesterRecordRow): BetaTesterRecord {
  return {
    id: row.id,
    testerLabel: row.testerLabel,
    testerType: row.testerType,
    environment: parseEnvironmentJson(row.environmentJson),
    consentStatus: row.consentStatus,
    invitationStatus: row.invitationStatus,
    onboardingStatus: row.onboardingStatus,
    feedbackStatus: row.feedbackStatus,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapBetaFeedbackRecordRow(row: BetaFeedbackRecordRow): BetaFeedbackRecord {
  return {
    id: row.id,
    testerId: row.testerId,
    sourceType: row.sourceType,
    area: row.area,
    summary: row.summary,
    evidenceType: row.evidenceType,
    severity: row.severity,
    priority: row.priority,
    status: row.status,
    sensitiveDataChecked: row.sensitiveDataChecked,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapBetaIssueRecordRow(row: BetaIssueRecordRow): BetaIssueRecord {
  return {
    id: row.id,
    feedbackId: row.feedbackId,
    area: row.area,
    summary: row.summary,
    severity: row.severity,
    priority: row.priority,
    reproStatus: row.reproStatus,
    safetyDataImpact: row.safetyDataImpact,
    decision: row.decision,
    targetPhase: row.targetPhase,
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createBetaTesterRecord(input: CreateBetaTesterRecordInput): Promise<BetaTesterRecord> {
  assertSafeBetaIntakeFields({
    testerLabel: input.testerLabel,
    environmentJson: input.environmentJson,
    notes: input.notes,
  });

  const id = `beta-tester-${randomUUID()}`;
  const timestamp = nowIso();
  await insertBetaTesterRecord({
    id,
    testerLabel: truncateBetaIntakeText(input.testerLabel, 120),
    testerType: input.testerType,
    environmentJson: truncateBetaIntakeText(input.environmentJson, 2000),
    consentStatus: input.consentStatus,
    invitationStatus: input.invitationStatus,
    onboardingStatus: input.onboardingStatus,
    feedbackStatus: input.feedbackStatus,
    notes: truncateBetaIntakeText(input.notes, 1200),
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const row = await getBetaTesterRecordRowById(id);
  if (!row) {
    throw new Error(`Beta tester record was not persisted: ${id}`);
  }

  return mapBetaTesterRecordRow(row);
}

export async function createBetaFeedbackRecord(input: CreateBetaFeedbackRecordInput): Promise<BetaFeedbackRecord> {
  if (!input.sensitiveDataChecked) {
    throw new Error("Confirm sensitive data has been redacted before recording feedback.");
  }

  const tester = await getBetaTesterRecordRowById(input.testerId);
  if (!tester) {
    throw new Error(`Tester record not found: ${input.testerId}`);
  }

  assertSafeBetaIntakeFields({
    area: input.area,
    summary: input.summary,
    notes: input.notes,
  });

  const id = `beta-feedback-${randomUUID()}`;
  const timestamp = nowIso();
  await insertBetaFeedbackRecord({
    id,
    testerId: input.testerId,
    sourceType: input.sourceType,
    area: truncateBetaIntakeText(input.area, 120),
    summary: truncateBetaIntakeText(input.summary, 1400),
    evidenceType: input.evidenceType,
    severity: input.severity,
    priority: input.priority,
    status: input.status,
    sensitiveDataChecked: true,
    notes: truncateBetaIntakeText(input.notes, 1200),
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const row = await getBetaFeedbackRecordRowById(id);
  if (!row) {
    throw new Error(`Beta feedback record was not persisted: ${id}`);
  }

  return mapBetaFeedbackRecordRow(row);
}

export async function createBetaIssueRecord(input: CreateBetaIssueRecordInput): Promise<BetaIssueRecord> {
  const feedback = await getBetaFeedbackRecordRowById(input.feedbackId);
  if (!feedback) {
    throw new Error(`Feedback record not found: ${input.feedbackId}`);
  }

  assertSafeBetaIntakeFields({
    area: input.area,
    summary: input.summary,
    safetyDataImpact: input.safetyDataImpact,
    targetPhase: input.targetPhase,
    notes: input.notes,
  });

  const id = `beta-issue-${randomUUID()}`;
  const timestamp = nowIso();
  await insertBetaIssueRecord({
    id,
    feedbackId: input.feedbackId,
    area: truncateBetaIntakeText(input.area, 120),
    summary: truncateBetaIntakeText(input.summary, 1400),
    severity: input.severity,
    priority: input.priority,
    reproStatus: input.reproStatus,
    safetyDataImpact: truncateBetaIntakeText(input.safetyDataImpact, 1200),
    decision: input.decision,
    targetPhase: truncateBetaIntakeText(input.targetPhase, 80),
    status: input.status,
    notes: truncateBetaIntakeText(input.notes, 1200),
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const row = await listBetaIssueRecordRows();
  const created = row.find((record) => record.id === id);
  if (!created) {
    throw new Error(`Beta issue record was not persisted: ${id}`);
  }

  return mapBetaIssueRecordRow(created);
}

export async function listBetaTesterRecords(): Promise<BetaTesterRecord[]> {
  return (await listBetaTesterRecordRows()).map(mapBetaTesterRecordRow);
}

export async function listBetaFeedbackRecords(): Promise<BetaFeedbackRecord[]> {
  return (await listBetaFeedbackRecordRows()).map(mapBetaFeedbackRecordRow);
}

export async function listBetaIssueRecords(): Promise<BetaIssueRecord[]> {
  return (await listBetaIssueRecordRows()).map(mapBetaIssueRecordRow);
}

export async function getBetaIntakeSummary(): Promise<BetaIntakeSummary> {
  const [testers, feedback, issues] = await Promise.all([
    listBetaTesterRecords(),
    listBetaFeedbackRecords(),
    listBetaIssueRecords(),
  ]);

  return summarizeBetaIntake({ testers, feedback, issues });
}
