import type {
  AgentStatus,
  BuildStatus,
  EventTone,
  ProjectStatus,
  QualityGateRunStatus,
  ReviewDecision,
  ScopeCheckStatus,
  TaskStatus,
} from "@/lib/types";

export type OfficeVisualStatus =
  | ProjectStatus
  | TaskStatus
  | AgentStatus
  | BuildStatus
  | EventTone
  | ReviewDecision
  | ScopeCheckStatus
  | QualityGateRunStatus
  | "local_only"
  | "needs_review"
  | "muted";

export interface StatusVisual {
  label: string;
  pill: string;
  dot: string;
  rail: string;
  glow: string;
}

const slate: StatusVisual = {
  label: "Idle",
  pill: "border-slate-300/16 bg-slate-200/7 text-slate-200",
  dot: "bg-slate-400",
  rail: "bg-slate-400/45",
  glow: "shadow-[0_0_24px_rgba(148,163,184,0.12)]",
};

const cyan: StatusVisual = {
  label: "Active",
  pill: "border-cyan-200/22 bg-cyan-200/9 text-cyan-100",
  dot: "bg-cyan-300",
  rail: "bg-cyan-300/70",
  glow: "shadow-[0_0_28px_rgba(103,232,249,0.16)]",
};

const emerald: StatusVisual = {
  label: "Passed",
  pill: "border-emerald-200/22 bg-emerald-200/10 text-emerald-100",
  dot: "bg-emerald-300",
  rail: "bg-emerald-300/70",
  glow: "shadow-[0_0_28px_rgba(110,231,183,0.16)]",
};

const amber: StatusVisual = {
  label: "Attention",
  pill: "border-amber-200/24 bg-amber-200/10 text-amber-100",
  dot: "bg-amber-300",
  rail: "bg-amber-300/70",
  glow: "shadow-[0_0_28px_rgba(252,211,77,0.16)]",
};

const blue: StatusVisual = {
  label: "Waiting Review",
  pill: "border-blue-200/22 bg-blue-200/10 text-blue-100",
  dot: "bg-blue-300",
  rail: "bg-blue-300/70",
  glow: "shadow-[0_0_28px_rgba(147,197,253,0.16)]",
};

const rose: StatusVisual = {
  label: "Blocked",
  pill: "border-rose-200/24 bg-rose-200/10 text-rose-100",
  dot: "bg-rose-300",
  rail: "bg-rose-300/70",
  glow: "shadow-[0_0_28px_rgba(253,164,175,0.16)]",
};

export const statusVisuals: Record<OfficeVisualStatus, StatusVisual> = {
  active: { ...cyan, label: "Active" },
  quiet: { ...slate, label: "Quiet" },
  attention: { ...amber, label: "Attention" },
  reviewing: { ...blue, label: "Reviewing" },
  backlog: { ...slate, label: "Backlog" },
  ready: { ...cyan, label: "Ready" },
  running: { ...emerald, label: "Running" },
  waiting_review: { ...blue, label: "Waiting Review" },
  blocked: { ...rose, label: "Blocked" },
  done: { ...emerald, label: "Done" },
  idle: { ...slate, label: "Idle" },
  reading_repo: { ...cyan, label: "Reading Repo" },
  planning: { ...amber, label: "Planning" },
  editing: { ...emerald, label: "Editing" },
  running_checks: { ...cyan, label: "Running Checks" },
  build_failed: { ...rose, label: "Build Failed" },
  fixing: { ...amber, label: "Fixing" },
  pending: { ...slate, label: "Pending" },
  passed: { ...emerald, label: "Passed" },
  failed: { ...rose, label: "Failed" },
  skipped: { ...slate, label: "Skipped" },
  info: { ...cyan, label: "Info" },
  success: { ...emerald, label: "Success" },
  warning: { ...amber, label: "Warning" },
  danger: { ...rose, label: "Danger" },
  approved: { ...emerald, label: "Approved" },
  rejected: { ...rose, label: "Rejected" },
  revision_requested: { ...amber, label: "Revision Requested" },
  pass: { ...emerald, label: "Pass" },
  local_only: { ...cyan, label: "Local Only" },
  needs_review: { ...blue, label: "Needs Review" },
  muted: { ...slate, label: "Muted" },
};

export function getStatusVisual(status: OfficeVisualStatus): StatusVisual {
  return statusVisuals[status];
}
