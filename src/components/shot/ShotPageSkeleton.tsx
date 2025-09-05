// src/components/shot/ShotPageSkeleton.tsx
"use client";

export default function ShotPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 relative overflow-hidden">
      {/* shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] pointer-events-none" />

      {/* Banner (matches ShotPage banner area) */}
      <div className="w-full overflow-hidden rounded-2xl">
        <div className="aspect-[21/7] w-full rounded-2xl bg-gray-200" />
      </div>

      {/* Two-column analysis section (tabs + text) */}
      <section className="w-full">
        <div className="w-full flex items-start justify-between gap-6 flex-wrap md:flex-nowrap">
          {/* left column: pills row + content block */}
          <div className="flex-none w-[400px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-24 rounded-full bg-gray-200" />
              <div className="h-8 w-28 rounded-full bg-gray-200" />
              <div className="h-8 w-36 rounded-full bg-gray-200" />
            </div>
            <div className="min-h-[120px] space-y-2">
              <div className="h-6 w-40 rounded-full bg-gray-200" />
              <div className="h-6 w-48 rounded-full bg-gray-200" />
              <div className="h-6 w-36 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* right column: short title + description blocks */}
          <div className="w-[400px] min-w-0">
            <div className="h-5 w-56 rounded bg-gray-200" />
            <div className="mt-2 space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-11/12 rounded bg-gray-200" />
              <div className="h-3 w-5/6 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
