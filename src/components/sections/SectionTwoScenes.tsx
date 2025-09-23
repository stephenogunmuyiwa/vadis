// src/components/sections/SectionTwoScenes.tsx
"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import type { SceneRow } from "@/types/project";

interface Props {
  scenes: SceneRow[]; // ⬅️ real scenes
  activeSceneId: string | null; // ⬅️ id of selected scene (or null)
  setActiveSceneId: Dispatch<SetStateAction<string | null>>;
  analyzing?: boolean;
}

export default function SectionTwoScenes({
  scenes,
  activeSceneId,
  setActiveSceneId,
  analyzing = false,
}: Props) {
  // figure out current index from id
  const idx = useMemo(
    () => scenes.findIndex((s) => s.id === activeSceneId),
    [scenes, activeSceneId]
  );

  const count = scenes.length;
  const analyzedCount = useMemo(
    () => scenes.filter((s) => s.is_analyzed).length,
    [scenes]
  );

  const goPrev = () => {
    if (analyzing) return;
    if (count === 0) return;
    if (idx <= 0) {
      setActiveSceneId(scenes[0].id);
    } else {
      setActiveSceneId(scenes[idx - 1].id);
    }
  };

  const goNext = () => {
    if (analyzing) return;
    if (count === 0) return;
    if (idx < 0) {
      setActiveSceneId(scenes[0].id);
    } else if (idx >= count - 1) {
      setActiveSceneId(scenes[count - 1].id);
    } else {
      setActiveSceneId(scenes[idx + 1].id);
    }
  };

  return (
    // a bit taller to fit the new card height
    <section className="h-[120px] w-[calc(100vw-220px)] flex flex-col justify-start">
      {/* Row 1: title + count + arrows */}
      <div className="h-[30px] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] sm:text-[13px] font-semibold text-gray-900">
            Extracted Scenes
          </span>

          {/* total scenes (red pill — existing) */}
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#de1719] text-white"
            aria-label={`Total scenes: ${count}`}
          >
            {count}
          </span>

          {/* analyzed scenes (green pill — new) */}
          <span className="text-[14px] sm:text-[13px] font-semibold text-gray-900">
            Analyzed Scenes
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-green-500 text-white"
            aria-label={`Analyzed scenes: ${analyzedCount}`}
            title="Analyzed scenes"
          >
            {analyzedCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={analyzing}
            className={[
              "h-6 w-6 inline-flex items-center justify-center rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
              analyzing
                ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                : "",
            ].join(" ")}
            aria-label="Previous scene"
            title={analyzing ? "Analyzing… can't change scenes" : "Previous"}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={analyzing}
            className={[
              "h-6 w-6 inline-flex items-center justify-center rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
              analyzing
                ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                : "",
            ].join(" ")}
            aria-label="Next scene"
            title={analyzing ? "Analyzing… can't change scenes" : "Next"}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: horizontal scene chips/cards */}
      <div className="flex-1 flex items-center">
        <div className="w-full overflow-x-auto px-4 sm:px-6">
          <div className="inline-flex items-stretch gap-3">
            {scenes.map((s) => {
              const selected = s.id === activeSceneId;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={analyzing}
                  onClick={() => {
                    if (!analyzing) setActiveSceneId(s.id); // ⬅️ guard
                  }}
                  className={[
                    "min-w-[200px] h-[80px] rounded-2xl border px-3 py-2 text-left",
                    selected
                      ? "bg-[radial-gradient(120%_160%_at_95%_0%,#0B64FF_0%,#0A47D4_35%,#08328F_60%,#062355_80%,#031228_100%)] border-[3px] border-[#5C88EFFF] text-[#FFFFFFFF]"
                      : "border-gray-200 bg-gray-50 hover:bg-white",
                    analyzing ? "opacity-60 cursor-not-allowed" : "",
                  ].join(" ")}
                  title={
                    analyzing
                      ? "Analyzing… can't change scenes"
                      : `Open Scene ${s.id}`
                  }
                >
                  <div
                    className={[
                      "flex items-center justify-between text-[11px]",
                      selected ? "text-[#FFFFFFFF]" : "text-gray-500",
                    ].join(" ")}
                  >
                    <span>Scene {s.id}</span>
                    {s.is_analyzed && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-medium text-white">
                        Analyzed
                      </span>
                    )}
                  </div>

                  <div className="mt-1 line-clamp-2 text-[12px] font-medium">
                    {s.title || "Untitled scene"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
