"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { CodexPromptHandoff } from "./CodexPromptHandoff";
import { CodexRunnerSafetyPanel } from "./CodexRunnerSafetyPanel";
import { MockDiffSummary } from "./MockDiffSummary";
import { QualityGateResultsPanel } from "./QualityGateResultsPanel";
import { QualityGatePanel } from "./QualityGatePanel";
import { ReviewDecisionPanel } from "./ReviewDecisionPanel";
import { ReviewEvidenceGrid } from "./ReviewEvidenceGrid";
import { ReviewReadinessSummary } from "./ReviewReadinessSummary";
import { ScopeGuardPanel } from "./ScopeGuardPanel";
import { ScopedCodexRunnerPanel } from "./ScopedCodexRunnerPanel";
import { evaluateReviewReadiness } from "@/lib/review/readiness";
import { reviewDecisionLabel, statusColor } from "@/lib/status";
import { summarizeQualityGates } from "@/lib/quality-gates/quality-gate-summary";
import type { CodexPromptHandoffMode, CodexPromptHandoffResult } from "@/lib/codex-cli/prompt-types";
import type { RunnerSafetyStatus } from "@/lib/codex-cli/runner-types";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";
import type { AgentSeat, BuildCheck, DiffSummary, FileChange, GitSnapshot, Project, QualityGateConfig, QualityGateRun, ReviewDecision, ReviewRecord, ScopeCheck, Task, TaskEvent, TaskStatus } from "@/lib/types";

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
type RunEnabledQualityGatesAction = (taskId: string) => Promise<{
  ok: boolean;
  runs: QualityGateRun[];
  error?: string;
}>;

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
  approvedProjectPathSource,
  initialRunnerResult,
  gitSnapshots,
  fileChanges,
  diffSummary,
  scopeCheck,
  qualityGateConfigs,
  qualityGateRuns,
  persistDecisionAction,
  recordCodexPromptHandoffAction,
  runScopedCodexTaskAction,
  runEnabledQualityGatesAction,
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
  approvedProjectPathSource?: "approved_path" | "fallback" | "missing";
  initialRunnerResult?: ScopedCodexRunnerOutput;
  gitSnapshots: {
    before?: GitSnapshot;
    after?: GitSnapshot;
  };
  fileChanges: FileChange[];
  diffSummary?: DiffSummary;
  scopeCheck?: ScopeCheck;
  qualityGateConfigs: QualityGateConfig[];
  qualityGateRuns: QualityGateRun[];
  persistDecisionAction: PersistDecisionAction;
  recordCodexPromptHandoffAction: RecordCodexPromptHandoffAction;
  runScopedCodexTaskAction: RunScopedCodexTaskAction;
  runEnabledQualityGatesAction: RunEnabledQualityGatesAction;
}) {
  const [decision, setDecision] = useState<ReviewDecision>(review?.decision ?? "pending");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(task.status);
  const [runnerResult, setRunnerResult] = useState<ScopedCodexRunnerOutput | undefined>(initialRunnerResult);
  const [gateRuns, setGateRuns] = useState<QualityGateRun[]>(qualityGateRuns);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const activityEvents = prioritizeReviewActivity(events);
  const qualityGateSummary = useMemo(() => summarizeQualityGates(qualityGateConfigs, gateRuns), [gateRuns, qualityGateConfigs]);
  const readinessSummary = useMemo(() => evaluateReviewReadiness({
    taskStatus,
    reviewDecision: decision,
    runnerStatus: runnerResult?.status,
    scopeCheck,
    changedFilesCount: fileChanges.length,
    diffSummaryAvailable: Boolean(diffSummary),
    qualityGateSummary,
  }), [decision, diffSummary, fileChanges.length, qualityGateSummary, runnerResult?.status, scopeCheck, taskStatus]);

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
      <ReviewReadinessSummary summary={readinessSummary} />
      <section className="relative overflow-hidden border border-white/8 bg-[#0d1724]/82 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100/60">Review Desk / {project.name} / {agent?.name ?? "Unassigned"}</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight tracking-tight text-white">{task.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              Validate the prompt, scoped runner result, Git evidence, Scope Guard, and Quality Gates before making the final manual decision.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={taskStatus} />
            <span className={clsx("rounded-md border px-3 py-1.5 text-xs font-semibold", statusColor[decision])}>
              {reviewDecisionLabel[decision]}
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-2 text-xs font-bold text-slate-400 md:grid-cols-4">
          <EvidenceSignal label="Runner" value={runnerResult?.status ?? "not run"} />
          <EvidenceSignal label="Changed files" value={`${fileChanges.length}`} />
          <EvidenceSignal label="Scope guard" value={scopeCheck?.status ?? "pending"} />
          <EvidenceSignal label="Quality" value={qualityGateSummary.overallStatus} />
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <ReviewList title="Acceptance Criteria" items={task.acceptanceCriteria} tone="cyan" />
          <ReviewList title="Forbidden Scope" items={task.forbiddenScope} tone="red" />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="space-y-4">
          <CodexPromptHandoff taskId={task.id} prompt={codexPrompt} recordHandoffAction={recordCodexPromptHandoffAction} />
          <CodexRunnerSafetyPanel status={runnerSafetyStatus} />
        </div>
          <ScopedCodexRunnerPanel
            taskId={task.id}
            approvedProjectPath={approvedProjectPath}
            approvedProjectPathSource={approvedProjectPathSource}
            initialResult={runnerResult}
            runScopedCodexTaskAction={runScopedCodexTaskAction}
            onResultChange={setRunnerResult}
          />
      </section>

      <ReviewEvidenceGrid gitSnapshots={gitSnapshots} fileChanges={fileChanges} diffSummary={diffSummary} />

      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Acceptance</p>
          <h2 className="mt-1 text-lg font-bold text-slate-100">Scope / Quality / Decision</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <ScopeGuardPanel scopeCheck={scopeCheck} forbiddenScope={task.forbiddenScope} />
          <QualityGateResultsPanel taskId={task.id} configs={qualityGateConfigs} initialRuns={gateRuns} runEnabledQualityGatesAction={runEnabledQualityGatesAction} onRunsChange={setGateRuns} />
        </div>
        <ReviewDecisionPanel decision={decision} isPending={isPending} error={error} readiness={readinessSummary} onDecision={handleDecision} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <MockDiffSummary task={task} review={review} />
        <QualityGatePanel checks={checks} />
      </section>
      {events.length ? (
        <section className="rounded-[18px] border border-white/8 bg-[#111a25]/66 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Timeline</p>
            <h2 className="mt-1 text-sm font-bold tracking-tight text-slate-100">Review Activity</h2>
          </div>
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

const lifecycleOrder = ["runner_requested", "runner_started", "runner_output_received", "runner_completed", "runner_failed", "scope_check_completed"] as const;

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

function EvidenceSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-100">{value.replaceAll("_", " ")}</p>
    </div>
  );
}
