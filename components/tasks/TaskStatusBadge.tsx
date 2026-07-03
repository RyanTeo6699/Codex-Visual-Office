import clsx from "clsx";
import { taskStatusLabel, statusColor } from "@/lib/status";
import type { TaskStatus } from "@/lib/types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={clsx("inline-flex items-center border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em]", statusColor[status])}>
      {taskStatusLabel[status]}
    </span>
  );
}
