"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { Role } from "@/types/session";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

type Crumb = { label: string; href?: string };
type TabKey = "dashboard" | "contract" | "exit" | (string & {});
type Tab = { key: TabKey; label: string; icon?: React.ReactNode };

interface TopBarProps {
  /** Optional brand (defaults shown below). */
  brand?: { label?: string; href?: string; logoSrc?: string };

  /** Breadcrumb segments after the brand. */
  crumbs?: Crumb[];

  /** Right-side selectable tabs. */
  tabs?: Tab[];

  /** Controlled selected tab key. */
  activeTab?: TabKey;

  /** Callback when a tab is selected. */
  onTabChange?: (key: TabKey) => void;
}

export default function TopBar({
  brand,
  crumbs,
  tabs = [
    // {
    //   key: "dashboard",
    //   label: "Dashboard",
    //   icon: <LayoutDashboard className="h-4 w-4" />,
    // },
    // {
    //   key: "contract",
    //   label: "Contract",
    //   icon: <FileText className="h-4 w-4" />,
    // },
  ],
  activeTab,
  onTabChange,
}: TopBarProps) {
  const [innerTab, setInnerTab] = useState<TabKey>(tabs[0]?.key);
  const current = activeTab ?? innerTab;
  const setTab = (k: TabKey) => {
    if (activeTab === undefined) setInnerTab(k);
    onTabChange?.(k);
  };

  const brandLabel = brand?.label ?? "VadisAI production";
  const brandHref = brand?.href ?? "/";
  const brandLogo = brand?.logoSrc ?? "/logo.svg"; // replace with your logo path
  const router = useRouter();
  const crumbList: Crumb[] = crumbs ?? [];

  return (
    <header className="relative z-10 w-full border-b border-gray-300/80 bg-white/50 backdrop-blur">
      <div className="mx-auto flex h-[48px] w-full items-center justify-between px-2 sm:px-6 lg:px-4">
        {/* Brand + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={brandHref}
            className="flex items-center gap-2 rounded-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            title={brandLabel}
          >
            {/* Brand image */}
            <Image
              src={brandLogo}
              alt={brandLabel}
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">
              {brandLabel}
            </span>
          </Link>

          {/* Breadcrumb trail */}
          {crumbList.length > 0 && (
            <nav className="flex items-center text-[12px] text-gray-600 min-w-0">
              <ol className="flex items-center gap-2 min-w-0">
                {crumbList.map((c, i) => (
                  <CrumbItem
                    key={`${c.label}-${i}`}
                    {...c}
                    isLast={i === crumbList.length - 1}
                  />
                ))}
              </ol>
            </nav>
          )}
        </div>

        {/* Right-side selectable pills */}
        <div className="flex items-center gap-2">
          {tabs.map((t) => {
            const active = current === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={active}
                title={t.label}
                className={[
                  "h-8 px-3 inline-flex items-center gap-2 rounded-full text-[12px] font-medium",
                  "border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                  active
                    ? "bg-black text-white border-black"
                    : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-white",
                ].join(" ")}
              >
                {t.icon && (
                  <span className={active ? "text-white" : "text-gray-700"}>
                    {t.icon}
                  </span>
                )}
                {t.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace("/");
            }}
            className={[
              "h-8 px-3 inline-flex items-center gap-2 rounded-full text-[12px] font-medium",
              "border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
              "bg-gray-100 text-gray-800 border-gray-200 hover:bg-white",
            ].join(" ")}
          >
            <span className={"text-gray-700"}>
              <LogOut className="h-4 w-4" />
            </span>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

/* --- Helpers --- */

function CrumbItem({ label, href, isLast }: Crumb & { isLast?: boolean }) {
  return (
    <>
      <span className="text-gray-300 mx-1">/</span>
      <span className="truncate max-w-[30vw]" title={label}>
        {href && !isLast ? (
          <Link
            href={href}
            className="text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm"
          >
            {label}
          </Link>
        ) : (
          <span className="text-gray-800 font-medium">{label}</span>
        )}
      </span>
    </>
  );
}
