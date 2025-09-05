// src/components/shot/ShotScrollerSkeleton.tsx
"use client";

import ShotPageSkeleton from "./ShotPageSkeleton";

export default function ShotScrollerSkeleton() {
  return (
    <section className="flex-1 ml-[50px] mr-[50px] min-w-0 min-h-0 overflow-hidden flex flex-col">
      {/* Header matches ShotScroller’s header */}
      <div className="shrink-0 flex items-center justify-between mb-2">
        <div className="h-4 w-28 rounded bg-gray-200" />
      </div>

      {/* One skeleton “page” (you can duplicate if you prefer multiple) */}
      <div className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory space-y-8 pr-1">
        <article className="snap-start snap-always">
          <ShotPageSkeleton />
        </article>
      </div>
    </section>
  );
}
