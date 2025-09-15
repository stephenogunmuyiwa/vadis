"use client";
import type { ProductPlacementItem } from "@/types/productPlacement";

export function ProductPlacementSkeleton() {
  // 6 shimmering rows, 4 cols (image, brand, item, category)
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-[120px_1fr_1fr_160px] gap-3 px-3 py-2 text-[11px] font-medium text-gray-600 bg-gray-50">
        <div>Image</div>
        <div>Brand</div>
        <div>Product</div>
        <div>Category</div>
      </div>
      <ul className="divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[120px_1fr_1fr_160px] items-center gap-3 px-3 py-3"
          >
            <div className="h-14 w-20 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductPlacementTable({
  products,
}: {
  products: ProductPlacementItem[];
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-[120px_1fr_1fr_160px] gap-3 px-3 py-2 text-[11px] font-medium text-gray-600 bg-gray-50">
        <div>Image</div>
        <div>Brand</div>
        <div>Product</div>
        <div>Category</div>
      </div>
      {products.length === 0 ? (
        <div className="px-4 py-10 text-center text-[12px] text-gray-600">
          No products found for this shot.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-[120px_1fr_1fr_160px] items-center gap-3 px-3 py-3"
            >
              <div>
                <img
                  src={p.imageurl}
                  alt={p.item_name}
                  className="h-14 w-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
              <div className="text-[12px] font-medium text-gray-900">
                {p.brand_name}
              </div>
              <div className="text-[12px] text-gray-800">{p.item_name}</div>
              <div className="text-[12px] text-gray-700">{p.category}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
