import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { buildCodexTaskPrompt } from "@/lib/codex-cli/prompt-builder";
import { getRunnerSafetyStatus } from "@/lib/codex-cli/runner-safety";
import type { ScopedCodexRunnerOutput } from "@/lib/codex-cli/scoped-runner-types";
import { readSelectedReviewRoom } from "@/lib/local-db/selected-reads";
import { agentSeats, buildChecks, projects, reviewRecords, tasks } from "@/lib/mock-data";
import type { TaskEvent } from "@/lib/types";
import { persistReviewDecisionAction, recordCodexPromptHandoffAction, runScopedCodexTaskAction } from "./actions";

function readStringPayload(event: TaskEvent | undefined, key: string): string | undefined {
  const value = event?.payload?.[key];
  return typeof value === "string" ? value : undefined;
}

function readNumberPayload(event: TaskEvent | undefined, key: string): number | undefined {
  const value = event?.payload?.[key];
  return typeof value === "number" ? value : undefined;
}

function readBooleanPayload(event: TaskEvent | undefined, key: string): boolean | undefined {
  const value = event?.payload?.[key];
  return typeof value === "boolean" ? value : undefined;
}

function readReasonsPayload(event: TaskEvent | undefined): string | undefined {
  const value = event?.payload?.reasons;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join("\n") : undefined;
}

function calculateDurationMs(startedAt: string, endedAt: string): number | undefined {
  if (!startedAt || !endedAt) {
    return undefined;
  }

  return Math.max(0, new Date(endedAt).getTime() - new Date(startedAt).getTime());
}

function buildRunnerResultFromEvents(events: TaskEvent[]): ScopedCodexRunnerOutput | undefined {
  const completed = events.find((event) => event.payload?.lifecycleEvent === "runner_completed");
  const failed = events.find((event) => event.payload?.lifecycleEvent === "runner_failed");
  const started = events.find((event) => event.payload?.lifecycleEvent === "runner_started");
  const output = events.find((event) => event.payload?.lifecycleEvent === "runner_output_received");
  const requested = events.find((event) => event.payload?.lifecycleEvent === "runner_requested");
  const terminalEvent = completed ?? failed;

  if (!terminalEvent && !started && !requested) {
    return undefined;
  }

  const status = completed ? "completed" : failed ? "failed" : started ? "running" : "blocked";
  const startedAt = readStringPayload(started, "startedAt") ?? readStringPayload(terminalEvent, "startedAt") ?? "";
  const endedAt = readStringPayload(terminalEvent, "endedAt") ?? "";
  const stdoutPreview = readStringPayload(output, "stdoutPreview") ?? readStringPayload(terminalEvent, "stdoutPreview") ?? readStringPayload(output, "outputPreview") ?? readStringPayload(failed, "outputPreview") ?? "";
  const stderrPreview = readStringPayload(output, "stderrPreview") ?? readStringPayload(terminalEvent, "stderrPreview") ?? readStringPayload(output, "errorPreview") ?? readStringPayload(failed, "errorPreview") ?? readReasonsPayload(requested) ?? "";

  return {
    status,
    exitCode: readNumberPayload(terminalEvent, "exitCode"),
    startedAt,
    endedAt,
    durationMs: readNumberPayload(terminalEvent, "durationMs") ?? readNumberPayload(output, "durationMs") ?? calculateDurationMs(startedAt, endedAt),
    stdoutPreview,
    stderrPreview,
    stdoutTruncated: readBooleanPayload(output, "stdoutTruncated") ?? readBooleanPayload(terminalEvent, "stdoutTruncated") ?? false,
    stderrTruncated: readBooleanPayload(output, "stderrTruncated") ?? readBooleanPayload(terminalEvent, "stderrTruncated") ?? false,
    outputPreview: stdoutPreview,
    errorPreview: stderrPreview,
    taskExecutionAttempted: status !== "blocked",
    autoPushAttempted: false,
    autoDeployAttempted: false,
    eventIds: events
      .filter((event) => typeof event.payload?.lifecycleEvent === "string")
      .map((event) => event.id),
  };
}

export default async function ReviewRoom({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  let localRead: Awaited<ReturnType<typeof readSelectedReviewRoom>> | undefined;

  try {
    localRead = await readSelectedReviewRoom(taskId);
  } catch (error) {
    console.error("Review Room selected local read failed", error);
  }

  const task = localRead?.task ?? tasks.find((item) => item.id === taskId);

  if (!task) {
    notFound();
  }

  const project = projects.find((item) => item.id === task.projectId);

  if (!project) {
    notFound();
  }

  const agent = agentSeats.find((item) => item.id === task.agentSeatId);
  const review = localRead?.review ?? reviewRecords.find((item) => item.taskId === task.id);
  const reviewChecks = buildChecks.filter((check) => review?.qualityGateIds.includes(check.id) || check.taskId === task.id);
  const reviewEvents = localRead?.taskEvents ?? [];
  const runnerResult = buildRunnerResultFromEvents(reviewEvents);
  const codexPrompt = buildCodexTaskPrompt({ project, task }).prompt;
  const runnerSafetyStatus = getRunnerSafetyStatus({
    projectId: project.id,
    localPath: project.localPathPlaceholder,
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 text-sm">
            <Link href="/" className="rounded-[14px] border border-white/8 bg-white/[0.04] px-3 py-2 text-slate-300 hover:text-white">
              Office Home
            </Link>
            <Link href={`/projects/${project.id}`} className="rounded-[14px] border border-sky-200/16 bg-sky-200/8 px-3 py-2 text-sky-100 hover:bg-sky-200/12">
              Project Room
            </Link>
          </div>
        </div>
        <ReviewPanel
          task={task}
          project={project}
          agent={agent}
          review={review}
          checks={reviewChecks}
          events={reviewEvents}
          codexPrompt={codexPrompt}
          runnerSafetyStatus={runnerSafetyStatus}
          approvedProjectPath={process.cwd()}
          initialRunnerResult={runnerResult}
          gitSnapshots={localRead?.gitSnapshots ?? {}}
          fileChanges={localRead?.fileChanges ?? []}
          persistDecisionAction={persistReviewDecisionAction}
          recordCodexPromptHandoffAction={recordCodexPromptHandoffAction}
          runScopedCodexTaskAction={runScopedCodexTaskAction}
        />
      </div>
    </AppShell>
  );
}
