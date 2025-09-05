"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Home, Layer, People, MoneySend, Subtitle } from "iconsax-react";
import { useSceneAnalysis } from "@/hooks/useSceneAnalysis";

import LeftRail from "@/components/layout/LeftRail";
import TopBar from "@/components/header/TopBar";
import SectionOneHeader from "@/components/sections/SectionOneHeader";
import SectionTwoScenes from "@/components/sections/SectionTwoScenes";
import SceneMetaAside from "@/components/scene/SceneMetaAside";
import ShotScroller from "@/components/shot/ShotScroller";
import SectionTwoScenesSkeleton from "@/components/sections/SectionTwoScenesSkeleton";
import SceneEmpty from "@/components/scene/SceneEmpty";
import { useScenes } from "@/hooks/useScenes";
import type { Character, Shot } from "@/types/film";
import ActorsView from "@/components/actors/ActorsView";
import FinancesView from "@/components/finances/FinancesView";
import SummaryView from "@/components/summary/SummaryView";
import SceneMetaAsideSkeleton from "@/components/scene/SceneMetaAsideSkeleton";
import ShotScrollerSkeleton from "@/components/shot/ShotScrollerSkeleton";
// (Unused in this refactor but kept as-is to avoid changing your code shape)
import ShotCard from "@/components/cards/ShotCard";

export default function Project({ projectId }: { projectId: string }) {
  const [selected, setSelected] = useState("SCENE");
  const [activeScene, setActiveScene] = useState<number>(0);
  const [currentShotIdx, setCurrentShotIdx] = useState(0);
  const shotsScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null); // ⬅️ track by id
  const { scenes, loading: loadingScenes } = useScenes(projectId);
  const {
    loading: analyzing,
    meta,
    shots,
  } = useSceneAnalysis(projectId, activeSceneId);
  const sceneCount = scenes.length;
  const activeSceneNumber = activeSceneId ? Number(activeSceneId) : 0;

  const sceneNumbers = useMemo(
    () =>
      scenes
        .map((s) => Number(s.id))
        .filter((n) => Number.isFinite(n) && n > 0)
        .sort((a, b) => a - b),
    [scenes]
  );

  const items = [
    { key: "SCENE", label: "Scene", icon: Layer },
    { key: "ACTORS", label: "Actors", icon: People },
    { key: "FINANCES", label: "Finances", icon: MoneySend },
    { key: "SUMMARY", label: "Summary", icon: Subtitle },
  ];

  const sceneMeta = useMemo(
    () => ({
      title: `Scene ${activeScene} Title`,
      description:
        "The main offices are along each wall, the windows overlooking downtown. RHINEHEART, the ultimate company man, lectures Neo without looking at him, typing at his computer continuously. Neo stares at two window cleaners on a scaffolding outside, dragging their rubber squeegees down the surface of the glass.",
      estimated: "1m 45s",
      cost: "$12,500",
      location: "New York",
    }),
    [activeScene]
  );
  // const shots: Shot[] = []; // empty until you wire real shots

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

  const shotsCount = shots.length;
  const charactersCount = 0;
  // const shots: Shot[] = [
  //   {
  //     id: "s1",
  //     bannerUrl: null,
  //     characters: [
  //       { id: "c1", name: "Ava Cole" },
  //       { id: "c2", name: "Ben Ortega" },
  //       { id: "c3", name: "Captain Ruiz" },
  //     ],
  //     vfxAnalysis:
  //       "Smoke sim near the taxi; CG sparks added to practical plate. Matte extension for skyline; 140 tracked frames.",
  //     short: {
  //       title: "Establishing & Arrival",
  //       description:
  //         "Wide establishing of the street; Ava exits taxi and spots Ben at the corner café.",
  //     },
  //   },
  //   {
  //     id: "s2",
  //     bannerUrl: null,
  //     characters: [
  //       { id: "c1", name: "Ava Cole" },
  //       { id: "c4", name: "Nora (Paramedic)" },
  //       { id: "c5", name: "Crowd Extra 1" },
  //     ],
  //     vfxAnalysis:
  //       "CG ash and debris drift; roto on Ava’s hair for lightwrap frames 80–112.",
  //     productPlacement: "Nike, Prada",
  //     short: {
  //       title: "Street Confrontation",
  //       description:
  //         "Tight coverage during the argument; paramedic crosses behind to add tension.",
  //     },
  //   },
  //   {
  //     id: "s3",
  //     bannerUrl: null,
  //     characters: [
  //       { id: "c2", name: "Ben Ortega" },
  //       { id: "c6", name: "Crowd Extra 2" },
  //       { id: "c7", name: "Reporter" },
  //     ],
  //     vfxAnalysis:
  //       "Handheld camera track; replace storefront sign; add monitor glitch on reporter rig.",
  //     short: {
  //       title: "Reporter Interruption",
  //       description:
  //         "Reporter interrupts; Ben deflects the question. Crowd noise builds.",
  //     },
  //   },
  // ];

  // top-level analysisTab exists in your file; retained to avoid changing code
  const [analysisTab, setAnalysisTab] = useState<"Characters" | "VFX analysis">(
    "Characters"
  );

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

  // counts
  // const shotsCount = shots.length;
  // const charactersCount = Array.from(
  //   new Set(shots.flatMap((s) => s.characters.map((c) => c.name)))
  // ).length;

  // sample characters (reuse your ActorsView data if you have it globally)
  const summaryCharacters = [
    {
      name: "Ava Cole",
      role: "Lead",
      scenes: [1, 2, 5, 9, 12, 18],
      personality: ["resilient", "driven", "empathetic"],
    },
    {
      name: "Ben Ortega",
      role: "Supporting",
      scenes: [1, 3, 6, 10, 14],
      personality: ["loyal", "protective", "wary"],
    },
    {
      name: "Captain Ruiz",
      role: "Supporting",
      scenes: [4, 8, 11],
      personality: ["authoritative", "stoic"],
    },
  ];

  // selected cast mapping (update from your Accept actions later)
  const selectedCast = [
    {
      character: "Ava Cole",
      actor: "Tessa Thompson",
      availability: "Available",
      fee: "$15k / day",
    },
    {
      character: "Ben Ortega",
      actor: "Diego Luna",
      availability: "Available",
      fee: "$20k / day",
    },
    {
      character: "Captain Ruiz",
      actor: "J.K. Simmons",
      availability: "On hold",
      fee: "$25k / day",
    },
  ];

  // product placements (same as before)
  const productPlacements = shots.flatMap((s) =>
    (s.productPlacement ?? "")
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean)
      .map((brand) => ({
        brand,
        scenes: [activeScene],
        productType: brand.toLowerCase().includes("nike")
          ? "Footwear"
          : brand.toLowerCase().includes("prada")
          ? "Luxury apparel"
          : "Apparel",
        estValue: undefined,
      }))
  );

  // synopsis + finance snapshot
  const synopsis =
    "A data journalist uncovers a corporate cover-up that spills into the streets, testing loyalties and forcing a public reckoning.";
  const budgetEstimate = 9_300_000;
  const revenueEstimate = 23_950_000;

  // optional runtime & schedule (or omit to use built-in fallbacks)
  const runtimeMinutesEstimate = 105;
  const productionEstimate = { prepWeeks: 6, shootDays: 28, postWeeks: 14 };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFFFFFF] text-gray-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(255,255,255,0.9),rgba(247,249,252,0.7),rgba(235,239,246,0.6),transparent_80%)]" />
      <div className="pointer-events-none absolute -left-40 -top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(137,196,244,0.45),rgba(137,196,244,0.12)_60%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-48 -bottom-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(129,236,197,0.45),rgba(129,236,197,0.12)_60%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,206,160,0.45),rgba(255,206,160,0.12)_60%,transparent_70%)] blur-2xl" />
      <TopBar
        brand={{
          logoSrc: "/file.svg",
          label: "VadisAI production",
          href: "/",
        }}
        crumbs={[
          { label: "Projects", href: "/projects" },
          { label: `${projectId}` },
        ]}
      />

      <main className="relative z-10 w-full flex h-[calc(100vh-40px)]">
        {/* Left rail */}
        <LeftRail items={items} selected={selected} setSelected={setSelected} />
        {/* Right flexible column */}+{" "}
        <div className="ml-[50px] flex-1 min-h-0 flex flex-col">
          {/* SCENES view */}
          {selected === "SCENE" && (
            <>
              {/* keep your existing scenes header/section 1 */}
              <SectionOneHeader
                title="Project Title"
                createdISO="2025-03-08"
                createdLabel="08 Mar, 2025"
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
                    {meta && <SceneMetaAside meta={meta} />}
                    {/* shots from server */}
                    <ShotScroller
                      shots={shots}
                      currentShotIdx={currentShotIdx}
                      setCurrentShotIdx={setCurrentShotIdx}
                      shotsScrollRef={shotsScrollRef}
                    />
                  </div>
                </section>
              )}
            </>
          )}

          {/* ACTORS view */}
          {selected === "ACTORS" && (
            <ActorsView
              projectCreatedISO="2025-03-08"
              projectCreatedLabel="08 Mar, 2025"
            />
          )}
          {selected === "FINANCES" && (
            <FinancesView
              projectCreatedISO="2025-03-08"
              projectCreatedLabel="08 Mar, 2025"
              // (optional) pass a scenesCount if you want to mirror your real scenes
              scenesCount={100}
            />
          )}
          {selected === "SUMMARY" && (
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
          )}
        </div>
      </main>
    </div>
  );
}
