import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type {
  AgentStatus,
  ApprovedProjectPathApprovalSource,
  BackupKind,
  BackupRecordStatus,
  BetaConsentStatus,
  BetaEvidenceType,
  BetaFeedbackSourceType,
  BetaFeedbackStatus,
  BetaInvitationStatus,
  BetaIssueDecision,
  BetaOnboardingStatus,
  BetaPriority,
  BetaRecordStatus,
  BetaReproStatus,
  BetaSeverity,
  BetaTesterType,
  BuildStatus,
  EventTone,
  FileChangeStatus,
  GitSnapshotKind,
  ProjectStatus,
  QualityGateCommandKey,
  QualityGateEventType,
  QualityGateRunStatus,
  ReviewDecision,
  RetentionMode,
  RetentionTarget,
  ScopeCheckStatus,
  TaskStatus,
} from "@/lib/types";

export const projectStatuses = ["active", "quiet", "attention", "reviewing", "blocked"] as const satisfies readonly ProjectStatus[];
export const agentStatuses = [
  "idle",
  "reading_repo",
  "planning",
  "editing",
  "running_checks",
  "build_failed",
  "fixing",
  "waiting_review",
  "done",
  "blocked",
] as const satisfies readonly AgentStatus[];
export const taskStatuses = ["backlog", "ready", "running", "waiting_review", "blocked", "done"] as const satisfies readonly TaskStatus[];
export const taskPriorities = ["low", "medium", "high", "critical"] as const;
export const eventTones = ["info", "success", "warning", "danger"] as const satisfies readonly EventTone[];
export const buildStatuses = ["pending", "running", "passed", "failed", "skipped"] as const satisfies readonly BuildStatus[];
export const reviewDecisions = ["pending", "approved", "rejected", "revision_requested"] as const satisfies readonly ReviewDecision[];
export const gitSnapshotKinds = ["before_runner", "after_runner", "manual"] as const satisfies readonly GitSnapshotKind[];
export const fileChangeStatuses = ["modified", "added", "deleted", "renamed", "copied", "unmerged", "unknown"] as const satisfies readonly FileChangeStatus[];
export const scopeCheckStatuses = ["pass", "warning", "blocked"] as const satisfies readonly ScopeCheckStatus[];
export const qualityGateCommandKeys = ["npm_typecheck", "npm_build", "npm_lint", "npm_test", "npm_run_test", "git_diff_check"] as const satisfies readonly QualityGateCommandKey[];
export const qualityGateRunStatuses = ["pending", "running", "passed", "failed", "skipped", "blocked"] as const satisfies readonly QualityGateRunStatus[];
export const qualityGateEventTypes = [
  "quality_gate_queued",
  "quality_gate_started",
  "quality_gate_passed",
  "quality_gate_failed",
  "quality_gate_skipped",
  "quality_gate_blocked",
] as const satisfies readonly QualityGateEventType[];
export const approvedProjectPathApprovalSources = ["manual"] as const satisfies readonly ApprovedProjectPathApprovalSource[];
export const backupKinds = ["manual", "pre_restore_safety"] as const satisfies readonly BackupKind[];
export const backupRecordStatuses = ["created", "verified", "failed", "restored", "dry_run_passed"] as const satisfies readonly BackupRecordStatus[];
export const retentionTargets = [
  "task_events",
  "runner_outputs",
  "quality_gate_events",
  "quality_gate_runs",
  "git_snapshots",
  "file_changes",
  "diff_summaries",
  "scope_checks",
  "review_records",
  "backup_records",
  "verify_target",
] as const satisfies readonly RetentionTarget[];
export const retentionModes = ["dry_run_only"] as const satisfies readonly RetentionMode[];
export const betaTesterTypes = ["external_real_tester", "gm_local_validation", "support_observation"] as const satisfies readonly BetaTesterType[];
export const betaConsentStatuses = ["not_sent", "pending", "acknowledged", "declined"] as const satisfies readonly BetaConsentStatus[];
export const betaInvitationStatuses = ["not_invited", "invited", "declined", "accepted", "no_response"] as const satisfies readonly BetaInvitationStatus[];
export const betaOnboardingStatuses = ["not_started", "attempted", "passed", "failed", "blocked"] as const satisfies readonly BetaOnboardingStatus[];
export const betaFeedbackStatuses = ["not_requested", "pending", "submitted", "triaged", "closed"] as const satisfies readonly BetaFeedbackStatus[];
export const betaFeedbackSourceTypes = ["external_real_tester", "gm_local_validation", "support_observation", "simulated_reference", "placeholder"] as const satisfies readonly BetaFeedbackSourceType[];
export const betaEvidenceTypes = ["redacted_screenshot", "redacted_log_note", "environment_summary", "repro_steps", "route_page", "observed_error", "none"] as const satisfies readonly BetaEvidenceType[];
export const betaSeverities = ["p0", "p1", "p2", "p3", "pending"] as const satisfies readonly BetaSeverity[];
export const betaPriorities = ["critical", "high", "medium", "low", "pending"] as const satisfies readonly BetaPriority[];
export const betaRecordStatuses = ["pending", "submitted", "triaged", "closed", "blocked"] as const satisfies readonly BetaRecordStatus[];
export const betaReproStatuses = ["not_attempted", "reproduced", "not_reproduced", "needs_more_info", "not_applicable"] as const satisfies readonly BetaReproStatus[];
export const betaIssueDecisions = ["fix_batch_candidate", "known_limitation", "needs_more_evidence", "no_action", "defer"] as const satisfies readonly BetaIssueDecision[];
export const projectAccents = ["cyan", "teal", "amber", "red", "violet"] as const;

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  phase: text("phase").notNull(),
  status: text("status", { enum: projectStatuses }).notNull(),
  localPath: text("local_path"),
  accent: text("accent", { enum: projectAccents }).notNull().default("cyan"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const agentSeats = sqliteTable("agent_seats", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  agentType: text("agent_type").notNull().default("codex"),
  status: text("status", { enum: agentStatuses }).notNull(),
  currentTaskId: text("current_task_id"),
  currentProjectId: text("current_project_id").references(() => projects.id),
  focus: text("focus").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  status: text("status", { enum: taskStatuses }).notNull(),
  priority: text("priority", { enum: taskPriorities }).notNull(),
  assignedSeatId: text("assigned_seat_id").references(() => agentSeats.id),
  acceptanceCriteriaJson: text("acceptance_criteria_json").notNull().default("[]"),
  forbiddenScopeJson: text("forbidden_scope_json").notNull().default("[]"),
  changedFilesJson: text("changed_files_json").notNull().default("[]"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const taskEvents = sqliteTable("task_events", {
  id: text("id").primaryKey(),
  taskId: text("task_id").references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  seatId: text("seat_id").references(() => agentSeats.id),
  type: text("type", { enum: eventTones }).notNull(),
  message: text("message").notNull(),
  payloadJson: text("payload_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
});

export const buildChecks = sqliteTable("build_checks", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  taskId: text("task_id").references(() => tasks.id),
  name: text("name").notNull(),
  status: text("status", { enum: buildStatuses }).notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const reviewRecords = sqliteTable("review_records", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  decision: text("decision", { enum: reviewDecisions }).notNull(),
  notes: text("notes").notNull().default(""),
  diffSummaryJson: text("diff_summary_json").notNull().default("[]"),
  riskNotesJson: text("risk_notes_json").notNull().default("[]"),
  qualityGateIdsJson: text("quality_gate_ids_json").notNull().default("[]"),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const localSettings = sqliteTable("local_settings", {
  key: text("key").primaryKey(),
  valueJson: text("value_json").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  updatedAt: text("updated_at").notNull(),
});

export const approvedProjectPaths = sqliteTable("approved_project_paths", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  localPath: text("local_path").notNull(),
  label: text("label").notNull().default(""),
  approved: integer("approved", { mode: "boolean" }).notNull(),
  approvalSource: text("approval_source", { enum: approvedProjectPathApprovalSources }).notNull().default("manual"),
  approvedAt: text("approved_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  note: text("note"),
});

export const backupRecords = sqliteTable("backup_records", {
  id: text("id").primaryKey(),
  backupPath: text("backup_path").notNull(),
  backupKind: text("backup_kind", { enum: backupKinds }).notNull(),
  sourceDbPath: text("source_db_path").notNull(),
  fileSizeBytes: integer("file_size_bytes").notNull(),
  checksumSha256: text("checksum_sha256").notNull(),
  status: text("status", { enum: backupRecordStatuses }).notNull(),
  note: text("note"),
  createdAt: text("created_at").notNull(),
  restoredAt: text("restored_at"),
});

export const retentionPolicies = sqliteTable("retention_policies", {
  id: text("id").primaryKey(),
  target: text("target", { enum: retentionTargets }).notNull(),
  retentionDays: integer("retention_days").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull(),
  mode: text("mode", { enum: retentionModes }).notNull(),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const gitSnapshots = sqliteTable("git_snapshots", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  snapshotKind: text("snapshot_kind", { enum: gitSnapshotKinds }).notNull(),
  branch: text("branch").notNull(),
  headSha: text("head_sha").notNull(),
  repoRoot: text("repo_root").notNull(),
  porcelainStatus: text("porcelain_status").notNull().default(""),
  isDirty: integer("is_dirty", { mode: "boolean" }).notNull(),
  statusSummaryJson: text("status_summary_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
});

export const fileChanges = sqliteTable("file_changes", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  gitSnapshotId: text("git_snapshot_id").references(() => gitSnapshots.id),
  changeStatus: text("change_status", { enum: fileChangeStatuses }).notNull(),
  rawStatus: text("raw_status").notNull(),
  filePath: text("file_path").notNull(),
  previousFilePath: text("previous_file_path"),
  source: text("source").notNull(),
  createdAt: text("created_at").notNull(),
});

export const diffSummaries = sqliteTable("diff_summaries", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  gitSnapshotId: text("git_snapshot_id").references(() => gitSnapshots.id),
  filesChanged: integer("files_changed").notNull(),
  insertions: integer("insertions").notNull(),
  deletions: integer("deletions").notNull(),
  numstatJson: text("numstat_json").notNull().default("[]"),
  statSummary: text("stat_summary").notNull().default(""),
  stdoutTruncated: integer("stdout_truncated", { mode: "boolean" }).notNull(),
  numstatTruncated: integer("numstat_truncated", { mode: "boolean" }).notNull(),
  source: text("source").notNull(),
  createdAt: text("created_at").notNull(),
});

export const scopeChecks = sqliteTable("scope_checks", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  status: text("status", { enum: scopeCheckStatuses }).notNull(),
  forbiddenScopeJson: text("forbidden_scope_json").notNull().default("[]"),
  matchedFilesJson: text("matched_files_json").notNull().default("[]"),
  unmatchedFilesJson: text("unmatched_files_json").notNull().default("[]"),
  ruleResultsJson: text("rule_results_json").notNull().default("[]"),
  reason: text("reason").notNull(),
  checkSource: text("check_source").notNull(),
  createdAt: text("created_at").notNull(),
});

export const qualityGateConfigs = sqliteTable("quality_gate_configs", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  name: text("name").notNull(),
  commandKey: text("command_key", { enum: qualityGateCommandKeys }).notNull(),
  command: text("command").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull(),
  allowlisted: integer("allowlisted", { mode: "boolean" }).notNull(),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const qualityGateRuns = sqliteTable("quality_gate_runs", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  configId: text("config_id").notNull().references(() => qualityGateConfigs.id),
  commandKey: text("command_key", { enum: qualityGateCommandKeys }).notNull(),
  command: text("command").notNull(),
  status: text("status", { enum: qualityGateRunStatuses }).notNull(),
  exitCode: integer("exit_code"),
  durationMs: integer("duration_ms"),
  stdoutPreview: text("stdout_preview").notNull().default(""),
  stderrPreview: text("stderr_preview").notNull().default(""),
  stdoutTruncated: integer("stdout_truncated", { mode: "boolean" }).notNull(),
  stderrTruncated: integer("stderr_truncated", { mode: "boolean" }).notNull(),
  skippedReason: text("skipped_reason"),
  failedReason: text("failed_reason"),
  startedAt: text("started_at"),
  endedAt: text("ended_at"),
  createdAt: text("created_at").notNull(),
});

export const qualityGateEvents = sqliteTable("quality_gate_events", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull().references(() => qualityGateRuns.id),
  taskId: text("task_id").notNull().references(() => tasks.id),
  projectId: text("project_id").notNull().references(() => projects.id),
  eventType: text("event_type", { enum: qualityGateEventTypes }).notNull(),
  payloadJson: text("payload_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
});

export const betaTesterRecords = sqliteTable("beta_tester_records", {
  id: text("id").primaryKey(),
  testerLabel: text("tester_label").notNull(),
  testerType: text("tester_type", { enum: betaTesterTypes }).notNull(),
  environmentJson: text("environment_json").notNull().default("{}"),
  consentStatus: text("consent_status", { enum: betaConsentStatuses }).notNull(),
  invitationStatus: text("invitation_status", { enum: betaInvitationStatuses }).notNull(),
  onboardingStatus: text("onboarding_status", { enum: betaOnboardingStatuses }).notNull(),
  feedbackStatus: text("feedback_status", { enum: betaFeedbackStatuses }).notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const betaFeedbackRecords = sqliteTable("beta_feedback_records", {
  id: text("id").primaryKey(),
  testerId: text("tester_id").notNull().references(() => betaTesterRecords.id),
  sourceType: text("source_type", { enum: betaFeedbackSourceTypes }).notNull(),
  area: text("area").notNull(),
  summary: text("summary").notNull(),
  evidenceType: text("evidence_type", { enum: betaEvidenceTypes }).notNull(),
  severity: text("severity", { enum: betaSeverities }).notNull(),
  priority: text("priority", { enum: betaPriorities }).notNull(),
  status: text("status", { enum: betaRecordStatuses }).notNull(),
  sensitiveDataChecked: integer("sensitive_data_checked", { mode: "boolean" }).notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const betaIssueRecords = sqliteTable("beta_issue_records", {
  id: text("id").primaryKey(),
  feedbackId: text("feedback_id").notNull().references(() => betaFeedbackRecords.id),
  area: text("area").notNull(),
  summary: text("summary").notNull(),
  severity: text("severity", { enum: betaSeverities }).notNull(),
  priority: text("priority", { enum: betaPriorities }).notNull(),
  reproStatus: text("repro_status", { enum: betaReproStatuses }).notNull(),
  safetyDataImpact: text("safety_data_impact").notNull().default(""),
  decision: text("decision", { enum: betaIssueDecisions }).notNull(),
  targetPhase: text("target_phase").notNull().default(""),
  status: text("status", { enum: betaRecordStatuses }).notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  agentSeats: many(agentSeats),
  tasks: many(tasks),
  taskEvents: many(taskEvents),
  buildChecks: many(buildChecks),
  approvedProjectPaths: many(approvedProjectPaths),
  qualityGateConfigs: many(qualityGateConfigs),
  qualityGateRuns: many(qualityGateRuns),
  qualityGateEvents: many(qualityGateEvents),
}));

export const betaTesterRecordsRelations = relations(betaTesterRecords, ({ many }) => ({
  feedbackRecords: many(betaFeedbackRecords),
}));

export const betaFeedbackRecordsRelations = relations(betaFeedbackRecords, ({ one, many }) => ({
  tester: one(betaTesterRecords, {
    fields: [betaFeedbackRecords.testerId],
    references: [betaTesterRecords.id],
  }),
  issueRecords: many(betaIssueRecords),
}));

export const betaIssueRecordsRelations = relations(betaIssueRecords, ({ one }) => ({
  feedback: one(betaFeedbackRecords, {
    fields: [betaIssueRecords.feedbackId],
    references: [betaFeedbackRecords.id],
  }),
}));

export const agentSeatsRelations = relations(agentSeats, ({ one, many }) => ({
  currentProject: one(projects, {
    fields: [agentSeats.currentProjectId],
    references: [projects.id],
  }),
  currentTask: one(tasks, {
    fields: [agentSeats.currentTaskId],
    references: [tasks.id],
  }),
  assignedTasks: many(tasks),
  taskEvents: many(taskEvents),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignedSeat: one(agentSeats, {
    fields: [tasks.assignedSeatId],
    references: [agentSeats.id],
  }),
  events: many(taskEvents),
  buildChecks: many(buildChecks),
  reviewRecord: one(reviewRecords),
  gitSnapshots: many(gitSnapshots),
  fileChanges: many(fileChanges),
  diffSummaries: many(diffSummaries),
  scopeChecks: many(scopeChecks),
  qualityGateRuns: many(qualityGateRuns),
  qualityGateEvents: many(qualityGateEvents),
}));

export const gitSnapshotsRelations = relations(gitSnapshots, ({ one }) => ({
  project: one(projects, {
    fields: [gitSnapshots.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [gitSnapshots.taskId],
    references: [tasks.id],
  }),
}));

export const fileChangesRelations = relations(fileChanges, ({ one }) => ({
  project: one(projects, {
    fields: [fileChanges.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [fileChanges.taskId],
    references: [tasks.id],
  }),
  gitSnapshot: one(gitSnapshots, {
    fields: [fileChanges.gitSnapshotId],
    references: [gitSnapshots.id],
  }),
}));

export const diffSummariesRelations = relations(diffSummaries, ({ one }) => ({
  project: one(projects, {
    fields: [diffSummaries.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [diffSummaries.taskId],
    references: [tasks.id],
  }),
  gitSnapshot: one(gitSnapshots, {
    fields: [diffSummaries.gitSnapshotId],
    references: [gitSnapshots.id],
  }),
}));

export const scopeChecksRelations = relations(scopeChecks, ({ one }) => ({
  project: one(projects, {
    fields: [scopeChecks.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [scopeChecks.taskId],
    references: [tasks.id],
  }),
}));

export const qualityGateConfigsRelations = relations(qualityGateConfigs, ({ one }) => ({
  project: one(projects, {
    fields: [qualityGateConfigs.projectId],
    references: [projects.id],
  }),
}));

export const qualityGateRunsRelations = relations(qualityGateRuns, ({ one, many }) => ({
  project: one(projects, {
    fields: [qualityGateRuns.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [qualityGateRuns.taskId],
    references: [tasks.id],
  }),
  config: one(qualityGateConfigs, {
    fields: [qualityGateRuns.configId],
    references: [qualityGateConfigs.id],
  }),
  events: many(qualityGateEvents),
}));

export const qualityGateEventsRelations = relations(qualityGateEvents, ({ one }) => ({
  project: one(projects, {
    fields: [qualityGateEvents.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [qualityGateEvents.taskId],
    references: [tasks.id],
  }),
  run: one(qualityGateRuns, {
    fields: [qualityGateEvents.runId],
    references: [qualityGateRuns.id],
  }),
}));

export const approvedProjectPathsRelations = relations(approvedProjectPaths, ({ one }) => ({
  project: one(projects, {
    fields: [approvedProjectPaths.projectId],
    references: [projects.id],
  }),
}));

export const taskEventsRelations = relations(taskEvents, ({ one }) => ({
  project: one(projects, {
    fields: [taskEvents.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [taskEvents.taskId],
    references: [tasks.id],
  }),
  seat: one(agentSeats, {
    fields: [taskEvents.seatId],
    references: [agentSeats.id],
  }),
}));

export const buildChecksRelations = relations(buildChecks, ({ one }) => ({
  project: one(projects, {
    fields: [buildChecks.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [buildChecks.taskId],
    references: [tasks.id],
  }),
}));

export const reviewRecordsRelations = relations(reviewRecords, ({ one }) => ({
  task: one(tasks, {
    fields: [reviewRecords.taskId],
    references: [tasks.id],
  }),
}));
