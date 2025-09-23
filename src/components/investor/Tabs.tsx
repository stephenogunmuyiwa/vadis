// components/investor/Tabs.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/investor/cn";

const tabs = [
  { href: "/investor", label: "Explore projects" },
  { href: "/investor/investments", label: "Investments" },
  { href: "/investor/saved", label: "Saved" },
];

export default function Tabs() {
  const pathname = usePathname();
  return (
    <div className="border-b border-neutral-200">
      <div className="flex items-center gap-6">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "relative py-3 text-sm font-medium",
                active
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              {t.label}
              {active && (
                <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
