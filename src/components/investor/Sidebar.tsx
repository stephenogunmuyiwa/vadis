// components/investor/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/investor/cn";
import {
  Boxes,
  LayoutGrid,
  Headphones,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/api";
import { ENV } from "@/config/env";

export default function Sidebar() {
  const pathname = usePathname();
  const isInvestor = pathname?.startsWith("/investor");
  const router = useRouter();

  return (
    // Pin the sidebar to the route's viewport height; it won't create a page scrollbar
    <aside className="hidden h-full w-64 shrink-0 border-r border-neutral-200 bg-white p-4 lg:flex lg:flex-col lg:justify-between lg:overflow-y-auto">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <Boxes className="h-5 w-5 text-neutral-900" />
          <span className="text-sm font-medium text-neutral-900">
            Vadis AI Media
          </span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/investor"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
              isInvestor
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Investor hub
          </Link>
        </nav>
      </div>

      <div className="mt-auto space-y-1 px-2">
        <button
          onClick={() => (window.location.href = `mailto:${ENV.API_BASE}`)}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-neutral-600 hover:bg-white"
        >
          <Headphones size={16} className="text-neutral-700" />
          Support
        </button>

        <button
          onClick={async () => {
            await logout();
            router.replace("/");
          }}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-neutral-600 hover:bg-white"
        >
          <LogOut size={16} className="text-neutral-700" />
          <span>Log out</span>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>
      </div>
    </aside>
  );
}
