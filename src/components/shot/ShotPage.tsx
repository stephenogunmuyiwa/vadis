// components/shot/ShotPage.tsx
"use client";

import { useState } from "react";
import type { Shot } from "@/types/film";
import { initials } from "@/utils/initials";

export default function ShotPage({ shot }: { shot: Shot }) {
  const [tab, setTab] = useState<
    "Characters" | "VFX analysis" | "Product placement"
  >("Characters");

  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="w-full overflow-hidden rounded-2xl">
        {shot.bannerUrl ? (
          <img
            src={shot.bannerUrl}
            alt="Shot banner"
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="aspect-[21/7] w-full bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200" />
        )}
      </div>

      {/* Analysis section (no bg/border/shadow). Two segments in a row. */}
      <section className="w-full">
        <div className="w-full flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
          {/* Segment 1: pills + tab content (column) */}
          <div className="flex-none w-[400px]">
            <div className="flex items-center gap-2 mb-3">
              {(
                ["Characters", "VFX analysis", "Product placement"] as const
              ).map((label) => {
                const active = tab === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setTab(label)}
                    className={[
                      "px-4 h-8 rounded-full text-[12px] font-medium transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                      active
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300",
                    ].join(" ")}
                    aria-pressed={active}
                    title={label}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="min-h-[120px]">
              {tab === "Characters" ? (
                <div className="flex flex-wrap gap-2">
                  {shot.characters.map((ch) => (
                    <span
                      key={ch.id}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-[11px]"
                    >
                      <span className="h-5 w-5 rounded-full bg-gray-300 text-gray-800 flex items-center justify-center text-[10px] font-semibold">
                        {initials(ch.name)}
                      </span>
                      {ch.name}
                    </span>
                  ))}
                </div>
              ) : tab === "Product placement" ? (
                <p className="text-[12px] leading-relaxed text-gray-700">
                  {shot.productPlacement}
                </p>
              ) : (
                <p className="text-[12px] leading-relaxed text-gray-700">
                  {shot.vfxAnalysis}
                </p>
              )}
            </div>
          </div>

          {/* Segment 2: short title + description (independent of tabs) */}
          <div className="w-[400px] min-w-0">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
              {shot.short.title}
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-700">
              {shot.short.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
