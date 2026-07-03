import type { ReactNode } from "react";
import clsx from "clsx";
import { virtualOfficeTheme } from "@/lib/design/virtual-office-theme";
import { getStatusVisual, type OfficeVisualStatus } from "@/lib/design/status-visuals";

export function MetricCard({
  label,
  value,
  detail,
  icon,
  status = "muted",
  className,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  status?: OfficeVisualStatus;
  className?: string;
}) {
  const visual = getStatusVisual(status);

  return (
    <div className={clsx("rounded-[16px] p-4", virtualOfficeTheme.surfaces.raised, visual.glow, className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={virtualOfficeTheme.typography.overline}>{label}</p>
          <div className={clsx("mt-2", virtualOfficeTheme.typography.metric)}>{value}</div>
        </div>
        {icon ? <div className={clsx("grid h-9 w-9 shrink-0 place-items-center rounded-xl border", visual.pill)}>{icon}</div> : null}
      </div>
      {detail ? <div className="mt-3 text-xs leading-5 text-slate-400">{detail}</div> : null}
    </div>
  );
}
