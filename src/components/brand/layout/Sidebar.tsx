"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/brand/cn";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import {
  Boxes,
  Computer,
  Headphones,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { ENV } from "@/config/env";

function Item({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 items-center rounded-md px-3 text-sm text-zinc-700 hover:bg-zinc-100",
        active && "bg-zinc-100 font-medium"
      )}
    >
      {label}
    </Link>
  );
}

export function Sidebar() {
  const params = useParams<{ brand: string }>();
  const base = `/brand/${params.brand}`;
  const router = useRouter();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-[#F3F3F3] bg-white px-3 py-4 md:flex md:flex-col">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Boxes className="h-5 w-5 text-neutral-900" />{" "}
        <span className="text-sm font-medium">Vadis AI Media</span>
      </div>
      <nav className="space-y-1">
        <Item href={`${base}/catalogue`} label="Product Catalogue" />
        <Item href={`${base}/placements`} label="Placements" />
      </nav>

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
