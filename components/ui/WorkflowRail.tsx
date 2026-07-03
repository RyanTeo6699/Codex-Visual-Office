import type { ReactNode } from "react";
import clsx from "clsx";
import { getStatusVisual, type OfficeVisualStatus } from "@/lib/design/status-visuals";
import { virtualOfficeTheme } from "@/lib/design/virtual-office-theme";

export interface WorkflowRailStep {
  id: string;
  label: string;
  detail?: ReactNode;
  status: OfficeVisualStatus;
}

export function WorkflowRail({
  steps,
  orientation = "vertical",
  className,
}: {
  steps: WorkflowRailStep[];
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  if (orientation === "horizontal") {
    return (
      <ol className={clsx("grid gap-3 md:grid-flow-col md:auto-cols-fr", className)}>
        {steps.map((step) => (
          <RailStep key={step.id} step={step} horizontal />
        ))}
      </ol>
    );
  }

  return (
    <ol className={clsx("space-y-3", className)}>
      {steps.map((step) => (
        <RailStep key={step.id} step={step} />
      ))}
    </ol>
  );
}

function RailStep({ step, horizontal = false }: { step: WorkflowRailStep; horizontal?: boolean }) {
  const visual = getStatusVisual(step.status);

  return (
    <li className={clsx("relative", horizontal ? "min-w-0" : "grid grid-cols-[auto_1fr] gap-3")}>
      <div className={clsx("grid h-8 w-8 place-items-center rounded-xl border", visual.pill)}>
        <span className={clsx("h-2.5 w-2.5 rounded-full", visual.dot)} />
      </div>
      <div className={clsx("min-w-0 rounded-[14px] p-3", virtualOfficeTheme.surfaces.sunken)}>
        <p className="truncate text-xs font-bold text-slate-100">{step.label}</p>
        {step.detail ? <div className="mt-1 text-[11px] leading-5 text-slate-500">{step.detail}</div> : null}
      </div>
      {horizontal ? <div className={clsx("mt-3 h-1 rounded-full", visual.rail)} /> : null}
    </li>
  );
}
