import { cn } from "@/lib/brand/cn";

export function Badge({
  children,
  tone = "pink",
}: {
  children: React.ReactNode;
  tone?: "pink" | "purple" | "orange" | "green" | "blue";
}) {
  const tones = {
    pink: "bg-pink-50 text-pink-700",
    purple: "bg-violet-50 text-violet-700",
    orange: "bg-orange-50 text-orange-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium",
        tones
      )}
    >
      {children}
    </span>
  );
}
