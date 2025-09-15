// src/components/scripts/ScriptProjectCard.tsx
"use client";

import { useMemo, useState } from "react";
import { Clapperboard, Users2, DollarSign, Trash2 } from "lucide-react";
import type { UserProject } from "@/types/project";
import ProjectDeleteSheet from "@/components/modals/ProjectDeleteSheet";

export default function ScriptProjectCard({
  data,
  onOpen,
  userEmail,
  onDeleted,
}: {
  data: UserProject;
  onOpen?: (id: string) => void;
  userEmail?: string;
  onDeleted?: (id: string) => void;
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const createdDate = useMemo(
    () => new Date(data.created_date * 1000),
    [data.created_date]
  );
  const statusLabel = data.is_published ? "Published" : "Draft";

  return (
    <>
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
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center h-6 px-2 rounded-md text-[9px] font-medium bg-[#E8DDF9FF] text-[#11005EFF]">
            {data.id}
          </span>
          <button
            className="p-1 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50"
            aria-label="Delete project"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDelete(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <h3 className="mt-3 text-[16px] font-semibold text-gray-900 line-clamp-2">
          {data.title}
        </h3>

        <p className="mt-1 text-[12px] leading-relaxed text-gray-600 line-clamp-3">
          {data.preview_text || "No preview available yet."}
        </p>

        <div className="mt-3 flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center h-6 px-2 rounded-md bg-gray-100 text-gray-800">
            {isFinite(createdDate.getTime())
              ? createdDate.toLocaleDateString("en-US", {
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

        <div className="my-3 h-px w-full bg-gray-200" />

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

      <ProjectDeleteSheet
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        project={data}
        userEmail={userEmail}
        onDeleted={(id) => {
          setOpenDelete(false);
          onDeleted?.(id);
        }}
      />
    </>
  );
}
