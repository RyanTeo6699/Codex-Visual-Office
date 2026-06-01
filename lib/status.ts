import type { AgentStatus, BuildStatus, EventTone, ProjectStatus, ReviewDecision, TaskStatus } from "./types";

export const taskStatusLabel: Record<TaskStatus, string> = {
  backlog: "Backlog",
  ready: "Ready",
  running: "Running",
  waiting_review: "Waiting Review",
  blocked: "Blocked",
  done: "Done",
};

export const agentStatusLabel: Record<AgentStatus, string> = {
  idle: "Idle",
  reading_repo: "Reading Repo",
  planning: "Planning",
  editing: "Editing",
  running_checks: "Running Checks",
  build_failed: "Build Failed",
  fixing: "Fixing",
  waiting_review: "Waiting Review",
  done: "Done",
  blocked: "Blocked",
};

export const buildStatusLabel: Record<BuildStatus, string> = {
  pending: "Pending",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
  skipped: "Skipped",
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  active: "Active",
  quiet: "Quiet",
  attention: "Attention",
  reviewing: "Reviewing",
  blocked: "Blocked",
};

export const reviewDecisionLabel: Record<ReviewDecision, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  revision_requested: "Revision Requested",
};

export const statusColor: Record<TaskStatus | AgentStatus | BuildStatus | ProjectStatus | EventTone | ReviewDecision, string> = {
  active: "border-sky-200/22 bg-sky-200/9 text-sky-100",
  quiet: "border-slate-300/16 bg-slate-200/7 text-slate-200",
  attention: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  reviewing: "border-blue-200/20 bg-blue-200/10 text-blue-100",
  backlog: "border-slate-300/16 bg-slate-200/7 text-slate-200",
  ready: "border-sky-200/20 bg-sky-200/8 text-sky-100",
  running: "border-emerald-200/22 bg-emerald-200/10 text-emerald-100",
  waiting_review: "border-blue-200/20 bg-blue-200/10 text-blue-100",
  blocked: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  done: "border-emerald-200/22 bg-emerald-200/9 text-emerald-100",
  idle: "border-slate-300/16 bg-slate-200/7 text-slate-200",
  reading_repo: "border-sky-200/20 bg-sky-200/8 text-sky-100",
  planning: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  editing: "border-emerald-200/22 bg-emerald-200/10 text-emerald-100",
  running_checks: "border-sky-200/20 bg-sky-200/8 text-sky-100",
  build_failed: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  fixing: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  passed: "border-emerald-200/22 bg-emerald-200/9 text-emerald-100",
  failed: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  pending: "border-slate-300/16 bg-slate-200/7 text-slate-200",
  skipped: "border-slate-300/16 bg-slate-200/7 text-slate-300",
  info: "border-sky-200/20 bg-sky-200/8 text-sky-100",
  success: "border-emerald-200/22 bg-emerald-200/9 text-emerald-100",
  warning: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  danger: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  approved: "border-emerald-200/22 bg-emerald-200/9 text-emerald-100",
  rejected: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  revision_requested: "border-amber-200/24 bg-amber-200/10 text-amber-100",
};
