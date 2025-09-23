"use client";
import { MoreVertical, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/brand/ui/Input";
import { usePagination } from "@/hooks/brand/usePagination";
import { useSearch } from "@/hooks/brand/useSearch";
import { cn } from "@/lib/brand/cn";
import type { Product } from "@/types/brand/brand";
import * as React from "react";

export function ProductTable({
  products,
  onRowClick,
  onDelete, // <-- wire delete from parent
}: {
  products: Product[];
  onRowClick: (p: Product) => void;
  onDelete?: (p: Product) => void | Promise<void>;
}) {
  const { q, setQ, result } = useSearch(
    products,
    (p) => `${p.brandName} ${p.name} ${p.category} ${p.id}`
  );
  const { page, setPage, totalPages, data } = usePagination(result, 12);

  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleDelete = async (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    // simple guard — you can swap for a nicer modal later
    const ok = window.confirm(`Delete product "${p.name}"?`);
    if (!ok) return;
    await onDelete?.(p);
  };

  return (
    <div className="rounded-xl border bg-white">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-medium">Recent applications</div>
        <div className="relative w-72">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      {/* columns (checkbox removed; Projects → Product ID) */}
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
        {data.map((p) => (
          <li
            key={p.id}
            className="relative grid cursor-pointer grid-cols-[1.3fr_1.8fr_1.2fr_1fr_1.4fr_44px] items-center gap-2 px-4 py-3 hover:bg-zinc-50"
            onClick={() => onRowClick(p)}
          >
            {/* Brand (larger square and show image if exists) */}
            <div className="flex items-center gap-3">
              {p.image ? (
                <img
                  src={p.image}
                  alt=""
                  className="h-9 w-9 rounded object-cover ring-1 ring-zinc-200"
                />
              ) : (
                <div className="h-9 w-9 rounded bg-zinc-200" />
              )}
              <span className="text-sm">{p.brandName}</span>
            </div>

            {/* Product name */}
            <div className="text-sm text-indigo-700 underline-offset-2 hover:underline">
              {p.name}
            </div>

            {/* Category */}
            <div className="text-sm">{p.category}</div>

            {/* Price */}
            <div className="text-sm">${p.price.toLocaleString()}</div>

            {/* Product ID (replaces Projects) */}
            <div className="text-xs text-zinc-600">{p.id}</div>

            {/* Actions (kebab) */}
            <div className="ml-auto">
              <button
                className="rounded p-1 hover:bg-zinc-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId((id) => (id === p.id ? null : p.id));
                }}
              >
                <MoreVertical className="h-4 w-4 text-zinc-600" />
              </button>

              {/* Tiny dropdown */}
              {openMenuId === p.id && (
                <div
                  className="absolute right-3 top-10 z-10 w-40 overflow-hidden rounded-lg border bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={(e) => handleDelete(p, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete product
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* pagination */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className={cn(
            "rounded-lg border px-3 py-2 text-sm",
            page === 1 && "opacity-40"
          )}
          onClick={() => setPage(Math.max(1, page - 1))}
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            const active = n === page;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "h-8 w-8 rounded-md border text-sm",
                  active
                    ? "bg-zinc-900 text-white"
                    : "bg-white hover:bg-zinc-50"
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        <button
          className={cn(
            "rounded-lg border px-3 py-2 text-sm",
            page === totalPages && "opacity-40"
          )}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
