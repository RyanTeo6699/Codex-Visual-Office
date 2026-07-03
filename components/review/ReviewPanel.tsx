"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { Activity, ClipboardCheck, FileSearch, GitCompareArrows, ListChecks, Route, ShieldCheck, Sparkles } from "lucide-react";
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
import type { CodexCliStatus } from "@/lib/codex-cli/types";
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
  codexStatus,
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
  codexStatus?: CodexCliStatus;
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
    <div className="relative space-y-5">
      <ReviewReadinessSummary summary={readinessSummary} />

      <section className="relative overflow-hidden border border-white/10 bg-[#0a1320]/92 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] md:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
        <div className="absolute right-0 top-0 h-36 w-80 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_58%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-cyan-200/18 bg-cyan-200/8 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                审查室 / Acceptance Desk
              </span>
              <span className="border border-white/8 bg-white/[0.035] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {project.name}
              </span>
              <span className="border border-white/8 bg-white/[0.035] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {agent?.name ?? "Unassigned"}
              </span>
            </div>
            <h1 className="mt-4 max-w-5xl text-3xl font-black leading-tight text-white md:text-4xl">{task.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
              Validate the prompt, scoped runner result, Git evidence, Scope Guard, and Quality Gates before making the final manual decision.
            </p>
            <div className="mt-5 grid gap-2 text-xs font-bold text-slate-400 sm:grid-cols-2 xl:grid-cols-4">
              <EvidenceSignal label="Runner" value={runnerResult?.status ?? "not run"} />
              <EvidenceSignal label="Changed files" value={`${fileChanges.length}`} />
              <EvidenceSignal label="Scope guard" value={scopeCheck?.status ?? "pending"} />
              <EvidenceSignal label="Quality" value={qualityGateSummary.overallStatus} />
            </div>
          </div>
          <div className="relative border border-white/8 bg-white/[0.035] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusBadge status={taskStatus} />
              <span className={clsx("border px-3 py-1.5 text-xs font-semibold", statusColor[decision])}>
                {reviewDecisionLabel[decision]}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <DeskCheckpoint icon={<ClipboardCheck className="h-4 w-4" />} label="Task brief" value="Acceptance criteria and forbidden scope" />
              <DeskCheckpoint icon={<FileSearch className="h-4 w-4" />} label="Evidence" value="Snapshots, changed files, bounded diff stats" />
              <DeskCheckpoint icon={<ShieldCheck className="h-4 w-4" />} label="Acceptance gates" value="Scope guard and quality gates" />
            </div>
            <p className="mt-5 border-t border-white/8 pt-3 text-[11px] font-semibold leading-relaxed text-slate-500">
              Manual review desk only. No auto approve, reject, revise, fix, commit, push, or deploy.
            </p>
          </div>
        </div>
        <div className="relative mt-7 grid gap-4 lg:grid-cols-2">
          <ReviewList title="Acceptance Criteria" items={task.acceptanceCriteria} tone="cyan" />
          <ReviewList title="Forbidden Scope" items={task.forbiddenScope} tone="red" />
        </div>
      </section>

      <ReviewStageHeader
        index="01"
        icon={<Route className="h-4 w-4" />}
        title="Prompt Handoff And Scoped Runner"
        description="Review the generated prompt first, then run only the scoped Codex path after the unchanged confirmations are checked."
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="space-y-4">
          <CodexPromptHandoff taskId={task.id} prompt={codexPrompt} recordHandoffAction={recordCodexPromptHandoffAction} />
          <CodexRunnerSafetyPanel status={runnerSafetyStatus} />
        </div>
          <ScopedCodexRunnerPanel
            taskId={task.id}
            approvedProjectPath={approvedProjectPath}
            approvedProjectPathSource={approvedProjectPathSource}
            codexStatus={codexStatus}
            initialResult={runnerResult}
            runScopedCodexTaskAction={runScopedCodexTaskAction}
            onResultChange={setRunnerResult}
          />
      </section>

      <ReviewStageHeader
        index="02"
        icon={<GitCompareArrows className="h-4 w-4" />}
        title="Git Evidence Wall"
        description="Read-only evidence for branch snapshots, changed paths, and bounded diff statistics."
      />
      <ReviewEvidenceGrid gitSnapshots={gitSnapshots} fileChanges={fileChanges} diffSummary={diffSummary} />

      <ReviewStageHeader
        index="03"
        icon={<ListChecks className="h-4 w-4" />}
        title="Acceptance Gates"
        description="Use Scope Guard and allowlisted quality gates as review evidence before the human final decision."
      />
      <section className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <ScopeGuardPanel scopeCheck={scopeCheck} forbiddenScope={task.forbiddenScope} />
          <QualityGateResultsPanel taskId={task.id} configs={qualityGateConfigs} initialRuns={gateRuns} runEnabledQualityGatesAction={runEnabledQualityGatesAction} onRunsChange={setGateRuns} />
        </div>
        <ReviewDecisionPanel decision={decision} isPending={isPending} error={error} readiness={readinessSummary} onDecision={handleDecision} />
      </section>

      <ReviewStageHeader
        index="04"
        icon={<Sparkles className="h-4 w-4" />}
        title="Prototype Reference"
        description="Legacy mock summary and mock quality checks retained for Phase 1 comparison context."
      />
      <section className="grid gap-4 xl:grid-cols-2">
        <MockDiffSummary task={task} review={review} />
        <QualityGatePanel checks={checks} />
      </section>

      {events.length ? (
        <section className="border border-white/8 bg-[#0d1724]/72 p-4">
          <ReviewStageHeader
            index="05"
            icon={<Activity className="h-4 w-4" />}
            title="Activity Timeline"
            description="Recent review-room events, ordered to foreground runner and scope lifecycle."
            compact
          />
          <div className="mt-3 space-y-2">
            {activityEvents.map((event) => (
              <div key={event.id} className="grid grid-cols-[56px_1fr] gap-3 border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
                <span className="text-[11px] font-semibold text-slate-500">{event.time}</span>
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
    <div className={clsx("border p-4", tone === "cyan" ? "border-sky-200/12 bg-sky-200/[0.035]" : "border-rose-200/14 bg-rose-200/[0.035]")}>
      <h2 className={clsx("text-xs font-black uppercase tracking-[0.14em]", tone === "cyan" ? "text-sky-100" : "text-rose-100")}>{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="border border-white/[0.04] bg-black/12 px-3 py-2 text-sm leading-relaxed text-slate-300">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function EvidenceSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/[0.06] bg-black/16 px-3 py-2.5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-100">{value.replaceAll("_", " ")}</p>
    </div>
  );
}

function DeskCheckpoint({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[34px_1fr] gap-3">
      <span className="grid h-8 w-8 place-items-center border border-cyan-200/14 bg-cyan-200/8 text-cyan-100">{icon}</span>
      <span>
        <span className="block text-xs font-black uppercase tracking-[0.12em] text-slate-300">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-slate-500">{value}</span>
      </span>
    </div>
  );
}

function ReviewStageHeader({
  index,
  icon,
  title,
  description,
  compact = false,
}: {
  index: string;
  icon: ReactNode;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className={clsx("flex items-start gap-3", compact ? "mb-0" : "pt-1")}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-cyan-200/14 bg-cyan-200/8 text-cyan-100">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/55">Review Step {index}</p>
        <h2 className="mt-1 text-base font-black tracking-tight text-slate-100">{title}</h2>
        <p className="mt-1 max-w-4xl text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}
