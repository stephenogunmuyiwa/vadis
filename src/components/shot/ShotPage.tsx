// components/shot/ShotPage.tsx
"use client";

import { useEffect, useState } from "react";
import type { Shot } from "@/types/film";
import { initials } from "@/utils/initials";

// Product placement
import { useProductPlacement } from "@/hooks/production/useProductPlacement";
import ProductPlacementTable, {
  ProductPlacementSkeleton,
} from "@/components/shot/ProductPlacementTable";

// VFX analysis
import { useVfxAnalysis } from "@/hooks/production/useVfxAnalysis";
import VfxAnalysisSkeleton from "@/components/shot/VfxAnalysisSkeleton";

type ShotPageProps = {
  shot: Shot;
  projectId?: string;
  sceneId?: string;
  userEmail?: string;
};

export default function ShotPage({
  shot,
  projectId,
  sceneId,
  userEmail,
}: ShotPageProps) {
  // Default selection left as null
  const [tab, setTab] = useState<"VFX analysis" | "Product placement" | null>(
    null
  );

  // Banner modal state
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  // Collapsible description (collapsed by default)
  const [descOpen, setDescOpen] = useState(false);

  // Close banner with ESC
  useEffect(() => {
    if (!isBannerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsBannerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isBannerOpen]);

  const haveIds =
    !!projectId && !!sceneId && !!userEmail && typeof shot?.id !== "undefined";

  // ------------------------
  // VFX analysis fetching
  // ------------------------
  const vfxEnabled = tab === "VFX analysis" && haveIds;
  const {
    data: vfxData,
    loading: vfxLoading,
    error: vfxError,
  } = useVfxAnalysis(
    vfxEnabled,
    vfxEnabled
      ? {
          userEmail: userEmail!,
          projectId: projectId!,
          sceneId: sceneId!,
          shotId: String(shot.id),
        }
      : null
  );

  // ------------------------
  // Product placement fetching
  // ------------------------
  const ppEnabled = tab === "Product placement" && haveIds;
  const {
    data: ppData,
    loading: ppLoading,
    error: ppError,
  } = useProductPlacement(
    ppEnabled,
    ppEnabled
      ? {
          userEmail: userEmail!,
          projectId: projectId!,
          sceneId: sceneId!,
          shotId: String(shot.id),
        }
      : null
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Banner: 16:9, capped to ~40vh, click to open modal */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[16/9] max-h-[40vh]">
        {shot.bannerUrl ? (
          <button
            type="button"
            onClick={() => setIsBannerOpen(true)}
            className="group absolute inset-0"
            title="Open banner"
          >
            <img
              src={shot.bannerUrl}
              alt="Shot banner"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <span className="sr-only">Open banner</span>
          </button>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200" />
        )}
      </div>

      {/* Fullscreen banner modal */}
      {isBannerOpen && shot.bannerUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsBannerOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsBannerOpen(false)}
              aria-label="Close"
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <img
              src={shot.bannerUrl}
              alt="Shot banner enlarged"
              className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Analysis section */}
      <section className="w-full">
        {/* Equal-width columns (leave your existing gap setting) */}
        <div className="w-full flex flex-col md:flex-row items-start gap-10">
          {/* Segment 1: tabs + content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              {(["VFX analysis", "Product placement"] as const).map((label) => {
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
              {tab === "VFX analysis" ? (
                <div className="mt-2">
                  {haveIds ? (
                    <>
                      {vfxLoading && <VfxAnalysisSkeleton />}
                      {!vfxLoading && vfxError && (
                        <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          Failed to load VFX analysis
                          {vfxError.message ? `: ${vfxError.message}` : "."}
                        </div>
                      )}
                      {!vfxLoading && !vfxError && vfxData && (
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <p className="text-[12px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                            {vfxData.vfx_analysis}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-[12px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {shot.vfxAnalysis}
                    </p>
                  )}
                </div>
              ) : tab === "Product placement" ? (
                <div className="mt-2">
                  {haveIds ? (
                    <>
                      {ppLoading && <ProductPlacementSkeleton />}
                      {!ppLoading && ppError && (
                        <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          Failed to load product placements
                          {ppError.message ? `: ${ppError.message}` : "."}
                        </div>
                      )}
                      {!ppLoading && !ppError && ppData && (
                        <ProductPlacementTable
                          products={ppData.products ?? []}
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-[12px] leading-relaxed text-gray-700">
                      {shot.productPlacement}
                    </p>
                  )}
                </div>
              ) : (
                // No tab selected (null) – show a subtle prompt or keep empty.
                <div className="text-[12px] text-gray-500">
                  Select a tab to view content.
                </div>
              )}
            </div>
          </div>

          {/* Segment 2: title + collapsible description (collapsed by default) */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">
                {shot.short.title}
              </h3>
              <button
                type="button"
                onClick={() => setDescOpen((v) => !v)}
                aria-expanded={descOpen}
                aria-controls="shot-desc"
                className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 h-8 text-[12px] text-gray-800 hover:bg-gray-50"
                title={descOpen ? "Collapse description" : "Expand description"}
              >
                <span>{descOpen ? "Hide" : "Show"}</span>
                <svg
                  className={`transition-transform ${
                    descOpen ? "rotate-180" : ""
                  }`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div
              id="shot-desc"
              className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
                descOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="mt-2 text-[12px] leading-relaxed text-gray-700">
                {shot.short.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
