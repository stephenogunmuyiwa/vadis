"use client";

export function ProductTableSkeleton() {
  return (
    <div className="rounded-xl border bg-white">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-medium">Recent applications</div>
        <div className="h-10 w-72 animate-pulse rounded-lg bg-zinc-100" />
      </div>

      {/* columns (no checkbox; with Product ID) */}
      <div className="grid grid-cols-[1.3fr_1.8fr_1.2fr_1fr_1.4fr_44px] items-center gap-2 border-t bg-white px-4 py-2 text-[12px] text-zinc-500">
        <div>Brand</div>
        <div>Product name</div>
        <div>Category</div>
        <div>Price</div>
        <div>Product ID</div>
        <div />
      </div>

      {/* rows */}
      <ul className="divide-y">
        {Array.from({ length: 10 }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[1.3fr_1.8fr_1.2fr_1fr_1.4fr_44px] items-center gap-2 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
            <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
            <div className="ml-auto h-4 w-6 animate-pulse rounded bg-zinc-100" />
          </li>
        ))}
      </ul>

      {/* pagination */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-100" />
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 animate-pulse rounded-md border bg-zinc-50"
            />
          ))}
        </div>
        <div className="h-9 w-16 animate-pulse rounded-lg bg-zinc-100" />
      </div>
    </div>
  );
}
