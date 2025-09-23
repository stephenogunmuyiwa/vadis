// components/investor/TopStats.tsx
import { cn } from "@/lib/investor/cn";

export default function TopStats() {
  const item = (label: string, value: string, className?: string) => (
    <div className={cn("flex-1 border-neutral-200 p-6 text-center", className)}>
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="mt-3 text-5xl font-semibold tracking-tight text-neutral-900">
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:grid-cols-3">
      {item("Total Investments made", "32", "md:border-r")}
      {item("Total Projects included", "234", "md:border-r")}
      {item("Expected ROI", "$1m+")}
    </div>
  );
}
