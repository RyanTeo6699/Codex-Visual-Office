import type { ReactNode } from "react";
import clsx from "clsx";
import { virtualOfficeTheme, type OfficeSurfaceTone } from "@/lib/design/virtual-office-theme";

export function SectionFrame({
  title,
  eyebrow,
  description,
  action,
  surface = "base",
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  surface?: OfficeSurfaceTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-[20px] p-4 md:p-5", virtualOfficeTheme.surfaces[surface], className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? <p className={virtualOfficeTheme.typography.overline}>{eyebrow}</p> : null}
          <h2 className={clsx(eyebrow ? "mt-1" : "", virtualOfficeTheme.typography.sectionTitle)}>{title}</h2>
          {description ? <div className={clsx("mt-2 max-w-3xl", virtualOfficeTheme.typography.caption)}>{description}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
