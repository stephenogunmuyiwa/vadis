// components/investor/Metric.tsx
import { cn } from "@/lib/investor/cn";
import { ReactNode } from "react";

export default function Metric({
  icon,
  children,
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-neutral-600",
        className
      )}
    >
      <span className="inline-flex">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
