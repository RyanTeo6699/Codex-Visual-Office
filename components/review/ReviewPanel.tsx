"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { Check, RotateCcw, X } from "lucide-react";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { CodexPromptHandoff } from "./CodexPromptHandoff";
import { CodexRunnerSafetyPanel } from "./CodexRunnerSafetyPanel";
import { GitSnapshotPanel } from "./GitSnapshotPanel";
import { MockDiffSummary } from "./MockDiffSummary";
import { QualityGatePanel } from "./QualityGatePanel";
import { ScopedCodexRunnerPanel } from "./ScopedCodexRunnerPanel";
import { reviewDecisionLabel, statusColor } from "@/lib/status";
import type { CodexPromptHandoffMode, CodexPromptHandoffResult } from "@/lib/codex-cli/prompt-types";
import type { RunnerSafetyStatus } from "@/lib/codex-cli/runner-types";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";
import type { AgentSeat, BuildCheck, GitSnapshot, Project, ReviewDecision, ReviewRecord, Task, TaskEvent, TaskStatus } from "@/lib/types";

interface PersistDecisionResult {
  ok: boolean;
  decision: ReviewDecision;
  taskStatus?: TaskStatus;
  error?: string;
}

type PersistDecisionAction = (taskId: string, decision: ReviewDecision) => Promise<PersistDecisionResult>;
type RecordCodexPromptHandoffAction = (taskId: string, mode: CodexPromptHandoffMode) => Promise<CodexPromptHandoffResult>;
type RunScopedCodexTaskAction = (
  taskId: string,
  confirmations: {
    projectPathApproved: boolean;
    promptReviewed: boolean;
    forbiddenScopeAcknowledged: boolean;
    noAutoCommitPushDeployAcknowledged: boolean;
  },
) => Promise<ScopedCodexRunnerOutput>;

export function ReviewPanel({
  task,
  project,
  agent,
  review,
  checks,
  events = [],
  codexPrompt,
  runnerSafetyStatus,
  approvedProjectPath,
  initialRunnerResult,
  gitSnapshots,
  persistDecisionAction,
  recordCodexPromptHandoffAction,
  runScopedCodexTaskAction,
}: {
  task: Task;
  project: Project;
  agent?: AgentSeat;
  review?: ReviewRecord;
  checks: BuildCheck[];
  events?: TaskEvent[];
  codexPrompt: string;
  runnerSafetyStatus: RunnerSafetyStatus;
  approvedProjectPath: string;
  initialRunnerResult?: ScopedCodexRunnerOutput;
  gitSnapshots: {
    before?: GitSnapshot;
    after?: GitSnapshot;
  };
  persistDecisionAction: PersistDecisionAction;
  recordCodexPromptHandoffAction: RecordCodexPromptHandoffAction;
  runScopedCodexTaskAction: RunScopedCodexTaskAction;
}) {
  const [decision, setDecision] = useState<ReviewDecision>(review?.decision ?? "pending");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(task.status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activityEvents = prioritizeReviewActivity(events);

  function handleDecision(nextDecision: ReviewDecision) {
    setError(null);
    startTransition(async () => {
      const result = await persistDecisionAction(task.id, nextDecision);
      if (!result.ok) {
        setError(result.error ?? "Review decision could not be persisted.");
        return;
      }

      setDecision(result.decision);
      if (result.taskStatus) {
        setTaskStatus(result.taskStatus);
      }
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[22px] border border-white/8 bg-[#111a25]/78 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Review Desk / {project.name} / {agent?.name ?? "Unassigned"}</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white">{task.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={taskStatus} />
            <span className={clsx("rounded-md border px-3 py-1.5 text-xs font-semibold", statusColor[decision])}>
              {reviewDecisionLabel[decision]}
            </span>
          </div>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <ReviewList title="Acceptance Criteria" items={task.acceptanceCriteria} tone="cyan" />
          <ReviewList title="Forbidden Scope" items={task.forbiddenScope} tone="red" />
        </div>
        <div className="mt-7 flex flex-wrap gap-3 border-t border-white/8 pt-5">
          <button disabled={isPending} onClick={() => handleDecision("approved")} className="inline-flex items-center gap-2 rounded-[14px] border border-emerald-200/24 bg-emerald-200/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-200/16 disabled:cursor-not-allowed disabled:opacity-50">
            <Check className="h-4 w-4" />
            Approve
          </button>
          <button disabled={isPending} onClick={() => handleDecision("rejected")} className="inline-flex items-center gap-2 rounded-[14px] border border-rose-200/20 bg-rose-200/8 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-200/14 disabled:cursor-not-allowed disabled:opacity-50">
            <X className="h-4 w-4" />
            Reject
          </button>
          <button disabled={isPending} onClick={() => handleDecision("revision_requested")} className="inline-flex items-center gap-2 rounded-[14px] border border-amber-200/24 bg-amber-200/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/16 disabled:cursor-not-allowed disabled:opacity-50">
            <RotateCcw className="h-4 w-4" />
            Ask Revision
          </button>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-rose-100">{error}</p> : null}
      </section>
      <CodexPromptHandoff taskId={task.id} prompt={codexPrompt} recordHandoffAction={recordCodexPromptHandoffAction} />
      <CodexRunnerSafetyPanel status={runnerSafetyStatus} />
      <ScopedCodexRunnerPanel taskId={task.id} approvedProjectPath={approvedProjectPath} initialResult={initialRunnerResult} runScopedCodexTaskAction={runScopedCodexTaskAction} />
      <GitSnapshotPanel before={gitSnapshots.before} after={gitSnapshots.after} />
      <MockDiffSummary task={task} review={review} />
      <QualityGatePanel checks={checks} />
      {events.length ? (
        <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
          <h2 className="text-sm font-bold tracking-tight text-slate-100">Review Activity</h2>
          <div className="mt-3 space-y-2">
            {activityEvents.map((event) => (
              <div key={event.id} className="grid grid-cols-[42px_1fr] gap-3 rounded-[14px] border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
                <span className="text-[11px] text-slate-500">{event.time}</span>
                <p className="text-xs leading-relaxed text-slate-300">{event.message}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {review?.riskNotes?.length ? (
        <section className="rounded-[18px] border border-amber-100/12 bg-amber-950/10 p-4">
          <h2 className="text-sm font-bold tracking-tight text-amber-100">Review Notes</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {review.riskNotes.map((note) => (
              <p key={note} className="rounded-[14px] bg-white/[0.035] p-3 text-sm text-slate-300">{note}</p>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

const lifecycleOrder = ["runner_requested", "runner_started", "runner_output_received", "runner_completed", "runner_failed"] as const;

function prioritizeReviewActivity(events: TaskEvent[]): TaskEvent[] {
  const lifecycleEvents = lifecycleOrder
    .map((lifecycleEvent) => events.find((event) => event.payload?.lifecycleEvent === lifecycleEvent))
    .filter((event): event is TaskEvent => Boolean(event));
  const lifecycleIds = new Set(lifecycleEvents.map((event) => event.id));
  const remainingEvents = events.filter((event) => !lifecycleIds.has(event.id));

  return [...lifecycleEvents, ...remainingEvents].slice(0, 12);
}

function ReviewList({ title, items, tone }: { title: string; items: string[]; tone: "cyan" | "red" }) {
  return (
    <div className={clsx("rounded-[18px] border p-4", tone === "cyan" ? "border-sky-200/12 bg-sky-200/[0.035]" : "border-rose-200/14 bg-rose-200/[0.035]")}>
      <h2 className={clsx("text-xs font-bold", tone === "cyan" ? "text-sky-100" : "text-rose-100")}>{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-[12px] bg-black/12 px-3 py-2 text-sm leading-relaxed text-slate-300">{item}</li>
        ))}
      </ul>
    </div>
  );
}
