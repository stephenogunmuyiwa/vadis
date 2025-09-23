"use client";

import * as React from "react";
import clsx from "clsx";
import { X } from "lucide-react";

type RightSheetProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
  /** when false, backdrop and close button are disabled */
  canClose?: boolean;
};

export default function RightSheet({
  title,
  open,
  onClose,
  children,
  footer,
  widthClass = "w-[420px]",
  canClose = true,
}: RightSheetProps) {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={canClose ? onClose : undefined}
        aria-hidden
      />
      <aside
        className={clsx(
          "fixed right-0 top-0 z-50 h-full bg-white shadow-2xl transition-transform",
          widthClass,
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <h3 className="text-[15px] font-medium text-neutral-800">
              {title}
            </h3>
            <button
              onClick={onClose}
              disabled={!canClose}
              className="rounded-lg p-2 text-neutral-500 enabled:hover:bg-neutral-100 disabled:opacity-40"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-auto px-6 py-5">{children}</div>
          {footer && <div className="border-t px-6 py-4">{footer}</div>}
        </div>
      </aside>
    </>
  );
}
