import clsx from "clsx";
import { getStatusVisual, type OfficeVisualStatus } from "@/lib/design/status-visuals";

const sizeClass = {
  xs: "gap-1.5 rounded-md px-2 py-0.5 text-[10px]",
  sm: "gap-2 rounded-lg px-2.5 py-1 text-[11px]",
  md: "gap-2.5 rounded-xl px-3 py-1.5 text-xs",
} as const;

const dotSizeClass = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
} as const;

export function StatusPill({
  status,
  label,
  size = "sm",
  showDot = true,
  className,
}: {
  status: OfficeVisualStatus;
  label?: string;
  size?: keyof typeof sizeClass;
  showDot?: boolean;
  className?: string;
}) {
  const visual = getStatusVisual(status);

  return (
    <span className={clsx("inline-flex items-center border font-bold leading-none", sizeClass[size], visual.pill, className)}>
      {showDot ? <span className={clsx("shrink-0 rounded-full", dotSizeClass[size], visual.dot)} /> : null}
      {label ?? visual.label}
    </span>
  );
}
