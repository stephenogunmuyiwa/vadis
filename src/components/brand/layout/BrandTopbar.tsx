"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Check, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/brand/ui/Button";
import { useProfiles } from "@/hooks/brand/useProfiles";
import type { BrandProfile } from "@/types/brand/brand";
import { cn } from "@/lib/brand/cn";

export function BrandTopbar({
  onAdd,
  currentProfile,
  title = "Product Catalogue",
}: {
  onAdd?: () => void;
  currentProfile: Pick<BrandProfile, "id" | "name">;
  title?: string;
}) {
  const router = useRouter();
  const { profiles, loading } = useProfiles();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = (p: BrandProfile) => {
    setOpen(false);
    router.push(`/brand/${p.id}/catalogue`);
  };

  const goCreate = () => {
    setOpen(false);
    // Force the create-profile screen
    router.push("/brand?create=1");
  };

  const label =
    profiles.find((p) => p.id === currentProfile.id)?.name ||
    currentProfile.name;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-[15px] font-semibold">{title}</h1>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>

      <div className="flex items-center gap-3" ref={boxRef}>
        {/* Profile Switcher */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-9 items-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm"
        >
          Brand: {label}
          <ChevronDown className="h-4 w-4 text-zinc-600" />
        </button>

        {onAdd && (
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add new product
          </Button>
        )}

        {/* Dropdown */}
        <div
          className={cn(
            "absolute right-0 top-12 z-30 w-72 overflow-hidden rounded-xl border bg-white shadow-lg transition",
            open ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {loading ? (
            <div className="flex items-center gap-2 p-3 text-sm text-zinc-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading profiles…
            </div>
          ) : (
            <>
              <ul className="max-h-72 overflow-auto py-1">
                {profiles.map((p) => {
                  const active = p.id === currentProfile.id;
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => handleSelect(p)}
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50",
                          active && "bg-zinc-50"
                        )}
                      >
                        <span className="truncate">{p.name}</span>
                        {active && <Check className="h-4 w-4 text-zinc-700" />}
                      </button>
                    </li>
                  );
                })}
                {profiles.length === 0 && (
                  <li className="px-3 py-2 text-sm text-zinc-500">
                    No profiles yet.
                  </li>
                )}
              </ul>

              <div className="border-t">
                <button
                  onClick={goCreate}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50"
                >
                  <UserPlus className="h-4 w-4" />
                  Create new profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
