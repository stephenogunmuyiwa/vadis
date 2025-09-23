"use client";
import { X } from "lucide-react";
import { cn } from "@/lib/brand/cn";
import { useEffect } from "react";

export function Sheet({
  open,
  onClose,
  width = 440,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  width?: number;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none")}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        style={{ width }}
        className={cn(
          "absolute right-0 top-0 h-full bg-white shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#DADADAFF] px-6 py-4">
          <span className="text-sm font-medium">{title}</span>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-auto px-6 py-5">
          {children}
        </div>
      </aside>
    </div>
  );
}
