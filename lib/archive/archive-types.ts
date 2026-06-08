import type { BackupRecord, RetentionPolicy } from "@/lib/types";

export interface ArchiveCounts {
  taskEvents: number;
  reviewRecords: number;
  runnerOutputPreviewRecords: number;
  qualityGateRuns: number;
  qualityGateEvents: number;
  gitSnapshots: number;
  fileChanges: number;
  diffSummaries: number;
  scopeChecks: number;
  backupRecords: number;
}

export interface ArchiveRecentRecords {
  taskEvents: Array<{ id: string; message: string; createdAt: string }>;
  reviewRecords: Array<{ id: string; taskId: string; decision: string; createdAt: string }>;
  qualityGateRuns: Array<{ id: string; command: string; status: string; createdAt: string }>;
  qualityGateEvents: Array<{ id: string; eventType: string; createdAt: string }>;
  gitSnapshots: Array<{ id: string; snapshotKind: string; branch: string; createdAt: string }>;
  fileChanges: Array<{ id: string; filePath: string; changeStatus: string; createdAt: string }>;
  diffSummaries: Array<{ id: string; filesChanged: number; createdAt: string }>;
  scopeChecks: Array<{ id: string; status: string; createdAt: string }>;
  backupRecords: BackupRecord[];
}

export interface ArchiveSummary {
  counts: ArchiveCounts;
  retentionPolicies: RetentionPolicy[];
  latestActivityTime?: string;
  latestBackupTime?: string;
  recentRecords: ArchiveRecentRecords;
}

export interface CleanupDryRunPolicyResult {
  target: string;
  mode: "dry_run_only";
  enabled: boolean;
  retentionDays: number;
  wouldDeleteCount: number;
  candidatesPreview: Array<{ id: string; createdAt: string; label: string }>;
}

export interface CleanupDryRunPreview {
  mode: "dry_run_only";
  totalWouldDeleteCount: number;
  policyResults: CleanupDryRunPolicyResult[];
  dataDeleted: false;
  backupFilesDeleted: false;
}
