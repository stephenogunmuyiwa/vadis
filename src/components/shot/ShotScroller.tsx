// components/shot/ShotScroller.tsx
"use client";

import { RefObject } from "react";
import type { Shot } from "@/types/film";
import ShotPage from "./ShotPage";

type RefLike<T> = { current: T | null };

interface ShotScrollerProps {
  shots: Shot[];
  currentShotIdx: number;
  setCurrentShotIdx: (n: number) => void; // kept for parity, though observer lives in parent
  shotsScrollRef: RefLike<HTMLDivElement>;
}

export default function ShotScroller({
  shots,
  currentShotIdx,
  setCurrentShotIdx, // not used inside (observer is in parent) but kept to avoid changing parent logic
  shotsScrollRef,
}: ShotScrollerProps) {
  return (
    <section className="flex-1 ml-[50px] mr-[50px] min-w-0 min-h-0 overflow-hidden flex flex-col">
      {/* Header with dynamic index */}
      <div className="shrink-0 flex items-center justify-between mb-2">
        <div className="text-[12px] text-gray-500">
          Shots{" "}
          <span className="text-gray-900 font-medium">
            {currentShotIdx + 1}
          </span>{" "}
          / {shots.length}
        </div>
      </div>

      {/* Snap container */}
      <div
        ref={shotsScrollRef}
        className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory space-y-8 pr-1"
      >
        {shots.map((shot, idx) => (
          <article
            key={shot.id}
            data-shot-index={idx}
            className="snap-start snap-always"
          >
            <ShotPage shot={shot} />
          </article>
        ))}
      </div>
    </section>
  );
}
