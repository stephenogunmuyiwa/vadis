"use client";

export default function LocationCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="skeleton h-4 w-36 rounded-md" />
          <div className="skeleton h-5 w-16 rounded-md" />
        </div>
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>

      <div className="h-px w-full bg-gray-100" />

      {/* Body */}
      <div className="grid grid-cols-1 gap-y-4 px-4 sm:px-6 py-4 md:grid-cols-5 md:gap-6">
        <div>
          <div className="skeleton h-3 w-20 mb-2 rounded" />
          <div className="skeleton h-5 w-28 rounded" />
        </div>

        <div>
          <div className="skeleton h-3 w-28 mb-2 rounded" />
          <div className="skeleton h-5 w-24 rounded" />
        </div>

        <div className="md:col-span-2">
          <div className="skeleton h-3 w-32 mb-2 rounded" />
          <div className="skeleton h-4 w-full rounded" />
        </div>

        <div>
          <div className="skeleton h-3 w-28 mb-2 rounded" />
          <div className="skeleton h-5 w-24 rounded" />
        </div>

        <div className="md:col-span-5">
          <div className="skeleton h-3 w-32 mb-2 rounded" />
          <div className="skeleton h-4 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
