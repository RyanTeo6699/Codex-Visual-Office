import type { ReactNode } from "react";
import clsx from "clsx";
import { virtualOfficeTheme, type OfficeSurfaceTone } from "@/lib/design/virtual-office-theme";

export function OfficeSurface({
  children,
  surface = "base",
  withGrid = false,
  className,
}: {
  children: ReactNode;
  surface?: OfficeSurfaceTone;
  withGrid?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden rounded-[22px]", virtualOfficeTheme.surfaces[surface], withGrid ? virtualOfficeTheme.backgrounds.officeGrid : "", className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
