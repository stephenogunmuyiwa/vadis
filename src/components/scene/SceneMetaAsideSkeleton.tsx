// src/components/scene/SceneMetaAsideSkeleton.tsx
"use client";

export default function SceneMetaAsideSkeleton() {
  return (
    <aside className="flex-none w-[300px]">
      <div className="flex flex-col relative overflow-hidden">
        {/* shimmer */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] pointer-events-none" />

        {/* Title */}
        <div className="h-6 w-48 rounded bg-gray-200" />
        {/* Description */}
        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-11/12 rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>

        {/* Pills */}
        <div className="flex items-center mt-10 gap-2">
          <div className="h-6 w-40 rounded-md bg-gray-200" />
        </div>
        <div className="flex items-center mt-1 gap-2">
          <div className="h-6 w-36 rounded-md bg-gray-200" />
        </div>

        {/* Cost row */}
        <div className="mt-2 rounded-md px-2 py-2 flex items-center justify-between bg-white">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-5 w-16 rounded bg-gray-200" />
        </div>
      </div>
    </aside>
  );
}

/* globals.css (once):
@keyframes shimmer { 100% { transform: translateX(100%); } }
*/
