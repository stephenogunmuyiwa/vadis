"use client";

import { FC, useEffect, useState } from "react";
import {
  Image as ImageIcon,
  MoreHorizontal,
  Film,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";

/** Brand deal row shape */
export interface BrandDeal {
  brand_id: string;
  id: string;
  brandName: string;
  itemName: string;
  imageUrl?: string; // product image
  value: number; // deal value
  category: string; // e.g. "Footwear"
  aiSuggested: string; // short suggestion/explanation
  sceneImageUrl?: string; // legacy: image URL for placement scene
  sceneUrl?: string; // preferred: any URL for placement scene (image or page)
  approved?: boolean | string;

  // Optional IDs we may get from the backend; used for approval endpoint
  brandId?: string;
  brandProfileId?: string;
  projectId?: string;
  brand?: { id?: string; profileId?: string };
}

type Props = {
  items: BrandDeal[];
  onAccept?: (row: BrandDeal) => void;
  onReject?: (row: BrandDeal) => void;
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n
  );

const isImageUrl = (u: string) =>
  !!u && /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(u);

function toApprovedBool(a: BrandDeal["approved"]) {
  if (typeof a === "boolean") return a;
  if (typeof a === "string")
    return a.toLowerCase() === "yes" || a.toLowerCase() === "true";
  return false;
}

const RecentTransactions: FC<Props> = ({ items, onAccept, onReject }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Track expanded rows as a Set (multiple can be open)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Escape closes any open image modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewUrl(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const cols = 8; // keep in sync with <thead>

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
              <th className="px-4 sm:px-6 py-3 font-medium">Approval</th>
              <th className="px-4 sm:px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.map((row) => {
              const approved = toApprovedBool(row.approved);
              const sceneHref = row.sceneUrl || row.sceneImageUrl || "";

              return (
                <FragmentRow
                  key={row.id}
                  row={row}
                  approved={approved}
                  sceneHref={sceneHref}
                  isExpanded={expandedIds.has(row.id)}
                  onToggleExpanded={() => toggleExpanded(row.id)}
                  onPreview={(url) => setPreviewUrl(url)}
                  onAccept={() => onAccept?.(row)}
                  onReject={() => onReject?.(row)}
                  colSpan={cols}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image modal (product or scene) */}
      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              aria-label="Close"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RecentTransactions;

/* ---------- Helpers ---------- */

function truncateUrl(u?: string, max = 64) {
  if (!u) return "";
  if (u.length <= max) return u;
  return u.slice(0, max - 3) + "...";
}

/* ---------- Row + Details ---------- */

const FragmentRow: FC<{
  row: BrandDeal;
  approved: boolean;
  sceneHref: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onPreview: (url: string) => void;
  onAccept: () => void;
  onReject: () => void;
  colSpan: number;
}> = ({
  row,
  approved,
  sceneHref,
  isExpanded,
  onToggleExpanded,
  onPreview,
  onAccept,
  onReject,
  colSpan,
}) => {
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">
          {row.brandName}
        </td>
        <td className="px-4 sm:px-6 py-3 text-gray-700">{row.itemName}</td>
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
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
              approved
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-gray-50 text-gray-700 ring-gray-200"
            }`}
          >
            {approved ? "Yes" : "No"}
          </span>
        </td>
        <td className="px-4 sm:px-6 py-3">
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-2 text-gray-700 hover:bg-gray-50"
              onClick={onToggleExpanded}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Hide actions" : "Show actions"}
            >
              <MoreHorizontal
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-gray-50/60">
          <td className="px-4 sm:px-6 py-4" colSpan={colSpan}>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Left: previews + raw URLs */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Product image
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md ring-1 ring-gray-200 bg-white grid place-items-center">
                      {row.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">URL</div>
                      {row.imageUrl ? (
                        <a
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline break-all"
                          href={row.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {truncateUrl(row.imageUrl)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </div>
                  </div>
                  {row.imageUrl && (
                    <div className="mt-2">
                      <button
                        className="text-xs rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50"
                        onClick={() => onPreview(row.imageUrl!)}
                      >
                        View product
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Placement scene
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md ring-1 ring-gray-200 bg-white grid place-items-center">
                      {isImageUrl(sceneHref) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sceneHref}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Film className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">URL</div>
                      {sceneHref ? (
                        <a
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline break-all"
                          href={sceneHref}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {truncateUrl(sceneHref)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </div>
                  </div>
                  {sceneHref && (
                    <div className="mt-2">
                      <button
                        className="text-xs rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50"
                        onClick={() => {
                          if (isImageUrl(sceneHref)) {
                            onPreview(sceneHref);
                          } else {
                            window.open(
                              sceneHref,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                      >
                        View placement scene
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600">
                    Quick actions
                  </div>

                  {!approved ? (
                    <button
                      className="w-full inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                      onClick={onAccept}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept placement
                    </button>
                  ) : (
                    <button
                      className="w-full inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
                      onClick={onReject}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject placement
                    </button>
                  )}
                </div>

                <div className="mt-3 text-[11px] text-gray-500">
                  Tip: you can keep this panel open and act on multiple
                  rows—each row toggles independently.
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
