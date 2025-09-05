// src/components/scripts/ScriptProjectCard.tsx
"use client";

import { Clapperboard, Users2, DollarSign } from "lucide-react";
import type { UserProject } from "@/types/project";

export default function ScriptProjectCard({
  data,
  onOpen,
}: {
  data: UserProject;
  onOpen?: (id: string) => void;
}) {
  const date = new Date((data.created_date ?? 0) * 1000);
  const statusLabel = data.is_published ? "Published" : "Draft";

  return (
    <article
      onClick={() => onOpen?.(data.id)}
      className={[
        "relative cursor-pointer rounded-2xl border border-gray-200",
        "bg-gray-50 transition-colors hover:bg-white hover:shadow-lg",
        'before:content-[""] before:absolute before:-top-2 before:left-8 before:h-4 before:w-14 before:rounded-b-xl',
        "before:bg-inherit before:border before:border-gray-200",
        "p-4",
      ].join(" ")}
    >
      {/* Top row: Project ID chip */}
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center h-6 px-2 rounded-md text-[9px] font-medium bg-[#E8DDF9FF] text-[#11005EFF]">
          {data.id}
        </span>
      </div>

      {/* Title (2 lines) */}
      <h3 className="mt-3 text-[16px] font-semibold text-gray-900 line-clamp-2">
        {data.title}
      </h3>

      {/* Preview text (3 lines) */}
      <p className="mt-1 text-[12px] leading-relaxed text-gray-600 line-clamp-3">
        {data.preview_text || "No preview available yet."}
      </p>

      {/* Info chips: created date + status */}
      <div className="mt-3 flex items-center gap-2 text-[11px]">
        <span className="inline-flex items-center h-6 px-2 rounded-md bg-gray-100 text-gray-800">
          {isFinite(date.getTime())
            ? date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "2-digit",
              })
            : "—"}
        </span>
        <span
          className={[
            "inline-flex items-center h-6 px-2 rounded-md font-semibold",
            data.is_published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-800",
          ].join(" ")}
        >
          {statusLabel}
        </span>
      </div>

      {/* Divider */}
      <div className="my-3 h-px w-full bg-gray-200" />

      {/* Footer metrics: scenes | characters | budget */}
      <div className="flex items-center justify-between text-[12px] text-gray-900">
        <div className="inline-flex items-center gap-2">
          <Clapperboard className="h-4 w-4 text-gray-600" />
          <span className="font-medium">{data.scene_count}</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <Users2 className="h-4 w-4 text-gray-600" />
          <span className="font-medium">{data.character_count}</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-600" />
          <span className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(data.estimated_budget || 0)}
          </span>
        </div>
      </div>
    </article>
  );
}
