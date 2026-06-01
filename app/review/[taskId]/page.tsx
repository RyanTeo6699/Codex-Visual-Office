import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { initializeLocalDb } from "@/lib/local-db/init";
import { getReviewRecordByTaskId } from "@/lib/local-db/operations/reviews";
import { getTaskById } from "@/lib/local-db/operations/tasks";
import { agentSeats, buildChecks, projects, reviewRecords, tasks } from "@/lib/mock-data";
import type { ReviewRecord } from "@/lib/types";
import { persistReviewDecisionAction } from "./actions";

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapPersistedReviewRecord(row: Awaited<ReturnType<typeof getReviewRecordByTaskId>>): ReviewRecord | undefined {
  if (!row) {
    return undefined;
  }

  return {
    taskId: row.taskId,
    diffSummary: parseJsonArray(row.diffSummaryJson),
    riskNotes: parseJsonArray(row.riskNotesJson),
    qualityGateIds: parseJsonArray(row.qualityGateIdsJson),
    decision: row.decision,
  };
}

export default async function ReviewRoom({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    notFound();
  }

  const project = projects.find((item) => item.id === task.projectId);

  if (!project) {
    notFound();
  }

  const agent = agentSeats.find((item) => item.id === task.agentSeatId);
  let persistedTaskStatus = task.status;
  let persistedReview: ReviewRecord | undefined;

  try {
    initializeLocalDb();
    const [persistedTask, persistedReviewRow] = await Promise.all([
      getTaskById(task.id),
      getReviewRecordByTaskId(task.id),
    ]);

    persistedTaskStatus = persistedTask?.status ?? task.status;
    persistedReview = mapPersistedReviewRecord(persistedReviewRow);
  } catch (error) {
    console.error("Review Room local persistence read failed", error);
  }

  const displayTask = { ...task, status: persistedTaskStatus };
  const review = persistedReview ?? reviewRecords.find((item) => item.taskId === task.id);
  const reviewChecks = buildChecks.filter((check) => review?.qualityGateIds.includes(check.id) || check.taskId === task.id);

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
        <ReviewPanel task={displayTask} project={project} agent={agent} review={review} checks={reviewChecks} persistDecisionAction={persistReviewDecisionAction} />
      </div>
    </AppShell>
  );
}
