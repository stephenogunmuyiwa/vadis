// components/shot/VfxAnalysisSkeleton.tsx
"use client";

export default function VfxAnalysisSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="space-y-3">
        <div className="h-4 w-9/12 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-10/12 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-8/12 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-7/12 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
