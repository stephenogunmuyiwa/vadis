// components/finace/RecentTransactions.tsx
"use client";

import { FC, useState } from "react";
import { Image as ImageIcon, ExternalLink, Eye } from "lucide-react";

export interface BrandDeal {
  id: string;
  brandName: string;
  itemName: string;
  imageUrl?: string; // product image
  value: number; // deal value
  category: string; // e.g. "Footwear"
  aiSuggested: string; // short suggestion/explanation
  sceneImageUrl?: string; // optional: open in modal
}

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n
  );

const RecentTransactions: FC<{ items: BrandDeal[] }> = ({ items }) => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="px-4 sm:px-6 py-3 font-medium">Brand</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Item</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Image</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Value</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Category</th>
              <th className="px-4 sm:px-6 py-3 font-medium">AI Suggested</th>
              <th className="px-4 sm:px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">
                  {row.brandName}
                </td>
                <td className="px-4 sm:px-6 py-3 text-gray-700">
                  {row.itemName}
                </td>
                <td className="px-4 sm:px-6 py-3">
                  {row.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-200"
                    />
                  ) : (
                    <div className="h-10 w-10 grid place-items-center rounded-md bg-gray-100 text-gray-400 ring-1 ring-gray-200">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 font-semibold text-gray-900">
                  {currency(row.value)}
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-medium">
                    {row.category}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <span className="inline-flex rounded-md bg-amber-50 text-amber-900 px-2 py-1 text-xs">
                    {row.aiSuggested}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {row.sceneImageUrl && (
                      <button
                        type="button"
                        onClick={() => setPreview(row.sceneImageUrl!)}
                        className="rounded-md border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50"
                        title="Open scene image"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {row.imageUrl && (
                      <a
                        href={row.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50"
                        title="Open product image"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scene image modal */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Scene"
              className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RecentTransactions;
