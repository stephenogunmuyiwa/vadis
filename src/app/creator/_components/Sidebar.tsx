"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Computer, Headphones, ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const active = pathname.startsWith("/creator");
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-neutral-200 bg-neutral-50/60 px-4 py-5 md:flex md:flex-col">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="rounded-md bg-neutral-900 p-1.5">
          <Computer size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium">Vadis AI Media</span>
      </div>

      <nav className="flex-1">
        <Link
          href="/creator"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
            active
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-600 hover:bg-white"
          }`}
        >
          <Computer size={16} className="text-neutral-500" />
          Creator hub
        </Link>
      </nav>

      <div className="mt-auto space-y-1 px-2">
        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-neutral-600 hover:bg-white">
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
