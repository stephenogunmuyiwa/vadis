// components/shot/ShotPage.tsx
"use client";

import { useEffect, useState } from "react";
import type { Shot } from "@/types/film";

// Product placement
import { useProductPlacement } from "@/hooks/production/useProductPlacement";
import ProductPlacementTable, {
  ProductPlacementSkeleton,
} from "@/components/shot/ProductPlacementTable";

// VFX analysis
import { useVfxAnalysis } from "@/hooks/production/useVfxAnalysis";
import VfxAnalysisSkeleton from "@/components/shot/VfxAnalysisSkeleton";
import { saveVfxNote } from "@/app/api/shared/saveVfxNote";
import { sendSceneEdit } from "@/app/api/shared/sendSceneEdit";

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
  const [tab, setTab] = useState<
    "VFX analysis" | "Product placement" | "Scene editor" | null
  >(null);

  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(shot.bannerUrl ?? "");

  useEffect(() => {
    setBannerUrl(shot.bannerUrl ?? "");
  }, [shot.bannerUrl]);

  function withCacheBuster(url: string) {
    if (!url) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}ts=${Date.now()}`;
  }

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

  // VFX
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

  // Product placement
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

  // States
  const [vfxNote, setVfxNote] = useState("");
  const [savingVfxNote, setSavingVfxNote] = useState(false);

  const [isPlacementOpen, setIsPlacementOpen] = useState(false);

  const [sceneEdit, setSceneEdit] = useState("");
  const [sendingSceneEdit, setSendingSceneEdit] = useState(false);

  async function handleSaveVfxNote() {
    if (
      !projectId ||
      !sceneId ||
      !userEmail ||
      typeof shot?.id === "undefined"
    ) {
      alert("Missing identifiers");
      return;
    }

    try {
      setSavingVfxNote(true);

      const res = await saveVfxNote({
        userEmail,
        projectId,
        sceneId,
        shotId: String(shot.id),
        note: vfxNote.trim(),
      });

      if (res.ok) {
        console.log("Saved note:", res.data);
      } else {
      }
    } catch (err) {
      console.error(err);
      alert("Error saving VFX note.");
    } finally {
      setSavingVfxNote(false);
    }
  }
  useEffect(() => {
    if (vfxData?.vfx_note) {
      setVfxNote(vfxData.vfx_note);
    }
  }, [vfxData?.vfx_note]);

  async function handleSendSceneEdit() {
    if (
      !projectId ||
      !sceneId ||
      !userEmail ||
      typeof shot?.id === "undefined"
    ) {
      alert("Missing identifiers");
      return;
    }

    try {
      setSendingSceneEdit(true);

      const res = await sendSceneEdit({
        userEmail,
        projectId,
        sceneId,
        shotId: String(shot.id),
        prompt: sceneEdit.trim(),
      });

      if (res.ok) {
        console.log("Edited image:", res.image_url);
        setBannerUrl(withCacheBuster(res.image_url));

        // optionally, show the new image somewhere in UI
      } else {
      }
    } catch (err) {
      console.error(err);
      alert("Error sending scene edit.");
    } finally {
      setSendingSceneEdit(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Banner */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[16/9] max-h-[40vh]">
        {bannerUrl ? (
          <button
            type="button"
            onClick={() => setIsBannerOpen(true)}
            className="group absolute inset-0"
          >
            <img
              src={bannerUrl}
              alt="Shot banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-200"
            role="status"
            aria-live="polite"
          >
            <div className="mx-6 text-center text-gray-700">
              <p className="text-sm font-semibold">
                Image couldn’t be generated
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Blocked for safety reasons — the scene may contain gory violence
                or offensive content.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Banner modal */}
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
              ✕
            </button>
            <img
              src={bannerUrl}
              alt="Shot banner enlarged"
              className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Analysis section */}
      <section className="w-full">
        <div className="w-full flex flex-col md:flex-row items-start gap-10">
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div
              role="tablist"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1"
            >
              {(
                ["VFX analysis", "Product placement", "Scene editor"] as const
              ).map((key) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`px-4 h-9 rounded-full text-[12px] font-medium border transition-colors ${
                      active
                        ? "bg-white border-2 border-orange-500 text-orange-700"
                        : "border-transparent text-gray-700 hover:bg-white/70"
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 min-h-[260px]">
              {tab === null && (
                <div className="flex items-center justify-center min-h-[200px] text-gray-600 text-center">
                  <p className="text-[15px]">
                    Select a tab to see insights about this scene.
                  </p>
                </div>
              )}

              {/* VFX analysis */}
              {tab === "VFX analysis" && (
                <div className="flex flex-col gap-4">
                  {vfxLoading && <VfxAnalysisSkeleton />}
                  {!vfxLoading && vfxError && (
                    <p className="text-red-600">Failed to load VFX analysis.</p>
                  )}
                  {!vfxLoading && vfxData && (
                    <div className="text-[15px] text-gray-800 whitespace-pre-wrap">
                      {vfxData.vfx_analysis}
                    </div>
                  )}

                  {/* Notes */}
                  <div className="rounded-xl border border-blue-300 bg-blue-50/40 p-3">
                    <label
                      htmlFor="vfx-note"
                      className="block text-[12px] font-medium text-blue-800 mb-2"
                    >
                      Add a note
                    </label>
                    <textarea
                      id="vfx-note"
                      value={vfxNote}
                      onChange={(e) => setVfxNote(e.target.value)}
                      className="w-full rounded-lg border border-blue-300 px-3 py-2"
                    />
                    <div className="mt-2">
                      <button
                        onClick={handleSaveVfxNote}
                        disabled={!vfxNote.trim()}
                        className="rounded-full bg-blue-600 px-4 h-9 text-white text-[13px] hover:bg-blue-700"
                      >
                        {savingVfxNote ? "Saving…" : "Update note"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Product placement */}
              {tab === "Product placement" && (
                <div className="flex flex-col gap-4">
                  {ppLoading && <ProductPlacementSkeleton />}
                  {!ppLoading && ppError && (
                    <p className="text-red-600">
                      Failed to load product placements.
                    </p>
                  )}
                  {!ppLoading && ppData && (
                    <>
                      {ppData.product_scene_url && (
                        <button
                          onClick={() => setIsPlacementOpen(true)}
                          className="self-start rounded-full bg-gray-900 px-4 h-9 text-white text-[13px] hover:bg-black"
                        >
                          View product placement
                        </button>
                      )}
                      <ProductPlacementTable products={ppData.products ?? []} />
                    </>
                  )}
                </div>
              )}

              {/* Scene editor */}
              {tab === "Scene editor" && (
                <div className="mt-1 flex flex-col gap-3">
                  <label
                    htmlFor="scene-editor"
                    className="text-[12px] font-medium text-gray-800"
                  >
                    Describe what you want changed in this scene
                  </label>
                  <textarea
                    id="scene-editor"
                    value={sceneEdit}
                    onChange={(e) => setSceneEdit(e.target.value)}
                    rows={6}
                    placeholder="E.g., Make the lighting warmer, add light fog, move the product closer to frame center…"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2 text-[14px] leading-6 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSendSceneEdit}
                      disabled={sendingSceneEdit || !sceneEdit.trim()}
                      className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 h-9 text-white text-[13px] font-medium shadow hover:bg-black disabled:opacity-50"
                    >
                      {sendingSceneEdit ? "Sending…" : "Send"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product placement modal */}
      {isPlacementOpen && ppData?.product_scene_url && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsPlacementOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsPlacementOpen(false)}
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
            >
              ✕
            </button>
            <img
              src={ppData?.product_scene_url}
              alt="Product placement"
              className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
