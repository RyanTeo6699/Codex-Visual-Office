import clsx from "clsx";
import { taskStatusLabel, statusColor } from "@/lib/status";
import type { TaskStatus } from "@/lib/types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={clsx("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold", statusColor[status])}>
      {taskStatusLabel[status]}
    </span>
  );
}
