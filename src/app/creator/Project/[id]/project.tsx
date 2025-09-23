// src/app/production/Project/[id]/project.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Video,
  Layer,
  People,
  MoneySend,
  Subtitle,
  Location,
} from "iconsax-react";
import { useSceneAnalysis } from "@/hooks/production/useSceneAnalysis";

import LeftRail from "@/components/layout/LeftRail";
import TopBar from "@/components/creator/header/TopBar";
import SectionOneHeader from "@/components/sections/SectionOneHeader";
import SectionTwoScenes from "@/components/sections/SectionTwoScenes";
import SceneMetaAside from "@/components/scene/SceneMetaAside";
import ShotScroller from "@/components/shot/ShotScroller";
import SectionTwoScenesSkeleton from "@/components/sections/SectionTwoScenesSkeleton";
import SceneEmpty from "@/components/scene/SceneEmpty";
import { useScenes } from "@/hooks/production/useScenes";
import type { Character, Shot } from "@/types/film";
import ActorsView from "@/components/actors/ActorsView";
import FinancesView from "@/components/finances/FinancesView";
import SetLocations from "@/components/locations/SetLocations";
import PosterTrailer from "@/components/project-assets/PosterTrailer";
import SummaryView from "@/components/summary/SummaryView";
import SceneMetaAsideSkeleton from "@/components/scene/SceneMetaAsideSkeleton";
import ShotScrollerSkeleton from "@/components/shot/ShotScrollerSkeleton";
import ShotCard from "@/components/cards/ShotCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/production/useSession"; // ⬅️ NEW

export default function Project({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  useEffect(() => {
    if (!isLoading && !email) router.replace("/");
  }, [isLoading, email, router]);
  const [selected, setSelected] = useState("SCENE");
  const [activeScene, setActiveScene] = useState<number>(0);
  const [currentShotIdx, setCurrentShotIdx] = useState(0);
  const shotsScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null); // ⬅️ track by id
  const { scenes, loading: loadingScenes, markAnalyzed } = useScenes(projectId);
  const {
    loading: analyzing,
    meta,
    shots,
  } = useSceneAnalysis(projectId, activeSceneId);

  const search = useSearchParams();
  const title = search.get("title") ?? `Project ${projectId}`;
  const createdISO = search.get("createdISO");

  const createdLabel = useMemo(() => {
    if (!createdISO) return "—";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(createdISO));
    } catch {
      return "—";
    }
  }, [createdISO]);

  const items = [
    { key: "SCENE", label: "Scene Analysis", icon: Layer },
    { key: "ACTORS", label: "Actors", icon: People },
    { key: "FINANCES", label: "Finances & ROI", icon: MoneySend },
    { key: "LOCATION", label: "Set Location", icon: Location },
    { key: "ASSETS", label: "Trailer & Poster", icon: Video },
  ];

  // useEffect(() => {
  //   const root = shotsScrollRef.current;
  //   if (!root) return;
  //   const pages = Array.from(
  //     root.querySelectorAll<HTMLElement>("[data-shot-index]")
  //   );
  //   const io = new IntersectionObserver(
  //     (entries) => {
  //       const visible = entries
  //         .filter((e) => e.isIntersecting)
  //         .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  //       if (!visible) return;
  //       const idx = Number(
  //         (visible.target as HTMLElement).dataset.shotIndex ?? 0
  //       );
  //       setCurrentShotIdx(idx);
  //     },
  //     { root, threshold: [0.5, 0.75] }
  //   );
  //   pages.forEach((el) => io.observe(el));
  //   return () => io.disconnect();
  // }, [shots.length]);

  const shotsCount = shots.length;
  const charactersCount = 0;

  useEffect(() => {
    const root = shotsScrollRef.current;
    if (!root) return;

    const pages = Array.from(
      root.querySelectorAll<HTMLElement>("[data-shot-index]")
    );
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(
          (visible.target as HTMLElement).dataset.shotIndex ?? 0
        );
        setCurrentShotIdx(idx);
      },
      { root, threshold: [0.5, 0.75] }
    );
    pages.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [shots.length]);

  useEffect(() => {
    if (!activeSceneId) return;

    // Heuristic for “success”: analyze not loading AND we received data-derived UI
    const success = !analyzing && (meta !== null || shots.length > 0);
    if (success) {
      markAnalyzed(activeSceneId, true);
    }
  }, [analyzing, meta, shots.length, activeSceneId, markAnalyzed]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFFFFFF] text-gray-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(255,255,255,0.9),rgba(247,249,252,0.7),rgba(235,239,246,0.6),transparent_80%)]" />
      <div className="pointer-events-none absolute -left-40 -top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(137,196,244,0.45),rgba(137,196,244,0.12)_60%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-48 -bottom-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(129,236,197,0.45),rgba(129,236,197,0.12)_60%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,206,160,0.45),rgba(255,206,160,0.12)_60%,transparent_70%)] blur-2xl" />
      <TopBar
        brand={{
          logoSrc: "/file.svg",
          label: "VadisAI Creator Hub",
          href: "/creator",
        }}
        crumbs={[
          { label: "Script", href: "/creator" },
          { label: `${projectId}` },
        ]}
      />

      <main className="relative z-10 w-full flex h-[calc(100vh-40px)]">
        {/* Left rail */}
        <LeftRail items={items} selected={selected} setSelected={setSelected} />
        {/* Right flexible column */}+{" "}
        <div className="ml-[200px] flex-1 min-h-0 flex flex-col">
          {/* SCENES view */}
          {selected === "SCENE" && (
            <>
              {/* keep your existing scenes header/section 1 */}
              <SectionOneHeader
                title={title}
                createdISO={createdISO ?? ""}
                createdLabel={createdLabel}
                note="For better output of the AI result, the script should follow the Hollywood standard."
              />

              {/* Section 2: scenes row (skeleton while loading) */}
              {loadingScenes ? (
                <SectionTwoScenesSkeleton />
              ) : (
                <SectionTwoScenes
                  scenes={scenes}
                  activeSceneId={activeSceneId}
                  setActiveSceneId={setActiveSceneId}
                  analyzing={analyzing}
                />
              )}
              {/* Section 3: meta + shots OR empty state */}
              {!activeSceneId ? (
                <SceneEmpty />
              ) : analyzing ? (
                <section className="flex-1 mt-[5px] min-h-0 px-4 sm:px-6 py-4 overflow-auto bg-[#0000000C]">
                  <div className="w-full h-full flex gap-4">
                    <SceneMetaAsideSkeleton />
                    <ShotScrollerSkeleton />
                  </div>
                </section>
              ) : (
                <section className="flex-1 mt-[5px] min-h-0 px-4 sm:px-6 py-4 overflow-auto bg-[#0000000C]">
                  <div className="w-full h-full flex gap-4">
                    {/* meta from server */}
                    {meta && (
                      <SceneMetaAside
                        meta={{
                          title: meta.title,
                          description: meta.description,
                          estimated: meta.screentime ?? "", // ← map screentime → estimated
                          cost: meta.estimateBudget ?? "", // ← map estimateBudget → cost
                          location: meta.location,
                          characters: meta.characters,
                        }}
                      />
                    )}
                    {/* shots from server */}
                    <ShotScroller
                      shots={shots}
                      currentShotIdx={currentShotIdx}
                      setCurrentShotIdx={setCurrentShotIdx}
                      shotsScrollRef={shotsScrollRef}
                      projectId={projectId}
                      sceneId={activeSceneId}
                      userEmail={email || ""}
                    />
                  </div>
                </section>
              )}
            </>
          )}

          {/* ACTORS view */}
          {selected === "ACTORS" && (
            <ActorsView
              projectCreatedISO=""
              projectCreatedLabel=""
              projectId={projectId}
              userEmail={email || ""}
            />
          )}
          {selected === "FINANCES" && (
            <FinancesView projectId={projectId} userEmail={email || ""} />
          )}
          {selected === "LOCATION" && (
            <SetLocations projectId={projectId} userEmail={email || ""} />
          )}
          {selected === "ASSETS" && (
            <PosterTrailer
              projectId={projectId}
              userEmail={email || ""}
              movieId="matrix-remastered"
            />
          )}
          {/* {selected === "SUMMARY" && (
            <SummaryView
              projectCreatedISO="2025-03-08"
              projectCreatedLabel="08 Mar, 2025"
              scenesCount={scenes.length}
              shotsCount={shotsCount}
              charactersCount={charactersCount}
              synopsis={synopsis}
              budgetEstimate={budgetEstimate}
              revenueEstimate={revenueEstimate}
              productPlacements={productPlacements}
              // NEW
              characters={summaryCharacters}
              selectedCast={selectedCast}
              runtimeMinutesEstimate={runtimeMinutesEstimate}
              productionEstimate={productionEstimate}
            />
          )} */}
        </div>
      </main>
    </div>
  );
}
