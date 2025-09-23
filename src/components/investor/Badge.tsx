// components/investor/Badge.tsx
import { cn } from "@/lib/investor/cn";

type Props = {
  children: React.ReactNode;
  tone?: "purple" | "green" | "blue" | "gray";
};
export default function Badge({ children, tone = "gray" }: Props) {
  const tones = {
    purple: "bg-purple-100 text-purple-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-sky-100 text-sky-700",
    gray: "bg-neutral-100 text-neutral-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
