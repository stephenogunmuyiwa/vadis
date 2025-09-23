// components/investor/RoiForecastSheet.tsx
"use client";

import { X } from "lucide-react";
import { useLockBody } from "@/hooks/investor/useLockBody";
import { cn } from "@/lib/investor/cn";

export default function RoiForecastSheet({
  open,
  onClose,
  children,
  title = "ROI Forecast",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  useLockBody(open);
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-neutral-200 bg-white shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-neutral-50"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        <div className="space-y-6 overflow-y-auto px-5 py-6">{children}</div>
      </aside>
    </>
  );
}
