// src/components/sections/SectionTwoScenesSkeleton.tsx
"use client";

export default function SectionTwoScenesSkeleton() {
  return (
    <section className="h-[120px] flex flex-col justify-start relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />
      <div className="h-[30px] px-4 sm:px-6 flex items-center justify-between">
        <div className="h-4 w-40 rounded bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-200" />
          <div className="h-6 w-6 rounded bg-gray-200" />
        </div>
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-[calc(100vw-100px)] overflow-x-hidden px-4">
          <div className="inline-flex items-stretch gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[80px] w-[180px] rounded-2xl border bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
