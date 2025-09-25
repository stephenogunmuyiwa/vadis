"use client";

import { Button } from "@/components/brand/ui/Button";
import { Badge } from "@/components/brand/ui/Badge";
import { FramesStrip } from "@/components/brand/placements/FramesStrip";
import {
  FileText,
  Wallet,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/brand/ui/Input";
import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ENV } from "@/config/env";
import { useSession } from "@/hooks/production/useSession";
import PlaceProductSheet from "@/components/brand/products/PlaceProductSheet";

const API_BASE = ENV.API_BASE;

type BrandDealProduct = {
  id?: string;
  item_name?: string;
  category?: string;
  value?: number;
  image_url?: string;
  brand_id?: string;
  brand_name?: string;
  name?: string;
};

type BrandDeal = {
  id?: string;
  brand_id?: string;
  brand_name?: string;
  is_ai_suggested?: boolean;
  is_approved?: boolean;
  products?: BrandDealProduct[];
};

type AssetsResponse = {
  ok: boolean;
  error?: string;
  ownerEmail?: string;
  projectId?: string;
  images?: string[];
  imagesCount?: number;
  brandId?: string;
  brandDealFound?: boolean;
  brandDeal?: BrandDeal;
  project?: {
    id?: string;
    title?: string;
    preview_text?: string;
    overview?: string;
    poster_urls?: string[];
    tags?: string[];
    scene_count?: number;
    estimated_budget?: number;
    estimated_ROI?: number;
    created_date?: number;
    last_open?: number;
    creator?: string;
  };
};

type ProductsListResponse = {
  ok: boolean;
  error?: string;
  count?: number;
  data?: BrandDealProduct[];
};

export default function PlacementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();

  const projectId =
    (params as any).project ?? (params as any).id ?? (params as any).slug ?? "";
  const brandId = (params as any).brand ?? ""; // this is the profileId for the brand
  const creatorEmail = search.get("creatorEmail") ?? "";

  const { session, isLoading: sessionLoading } = useSession();
  const brandEmail = session?.ok ? session.email : undefined;

  const [data, setData] = React.useState<AssetsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const hasDeal = !!data?.brandDeal;
  const approved = !!data?.brandDeal?.is_approved;
  const statusLabel = approved ? "Approved." : "Pending.";
  const statusTone = approved
    ? "bg-green-100 text-green-800"
    : "bg-amber-100 text-amber-800";
  React.useEffect(() => {
    let cancel = false;

    async function run() {
      if (!projectId || !creatorEmail) {
        setLoading(false);
        setError("Missing project or creator email.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams({ creatorEmail, projectId });
        if (brandId) qs.set("brandId", String(brandId));

        const res = await fetch(`${API_BASE}/brands/project/assets?${qs}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as AssetsResponse;

        if (cancel) return;

        if (!res.ok || json?.ok === false) {
          setError(json?.error || `Request failed (${res.status})`);
          setData(null);
        } else {
          // console.log(json);
          setData(json);
        }
      } catch (e: any) {
        if (!cancel) setError(e?.message || "Network error");
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => {
      cancel = true;
    };
  }, [projectId, creatorEmail, brandId]);

  const [deleting, setDeleting] = React.useState(false);
  const [deleteErr, setDeleteErr] = React.useState<string | null>(null);

  async function onDeleteDeal() {
    if (!creatorEmail || !projectId || !brandId) {
      setDeleteErr("Missing creatorEmail, projectId, or brandId.");
      return;
    }
    const ok = window.confirm("Delete this placement? This cannot be undone.");
    if (!ok) return;

    try {
      setDeleting(true);
      setDeleteErr(null);
      const res = await fetch(`${API_BASE}/brands/deals`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorEmail: String(creatorEmail),
          projectId: String(projectId),
          brandId: String(brandId),
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        setDeleteErr(json?.error || `Request failed (${res.status})`);
        return;
      }
      // success: remove deal locally and refresh page
      setData((prev) =>
        prev ? { ...prev, brandDeal: undefined, brandDealFound: false } : prev
      );
      router.refresh();
    } catch (e: any) {
      setDeleteErr(e?.message || "Network error");
    } finally {
      setDeleting(false);
    }
  }

  // ----- derived UI fields -----
  const frames = data?.images ?? [];

  // viewer
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);
  const hasViewer =
    viewerIndex !== null && viewerIndex >= 0 && viewerIndex < frames.length;
  const currentSrc = hasViewer ? frames[viewerIndex as number] : null;

  const openViewer = (_src: string, i: number) => setViewerIndex(i);
  const closeViewer = () => setViewerIndex(null);
  const prev = () => setViewerIndex((i) => (i && i > 0 ? i - 1 : 0));
  const next = () =>
    setViewerIndex((i) => (i !== null && i < frames.length - 1 ? i + 1 : i));

  React.useEffect(() => {
    if (!hasViewer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasViewer, frames.length]);

  const proj = data?.project ?? {};
  const poster = proj.poster_urls?.[0];
  const title = proj.title ?? "Project";
  const synopsis = proj.preview_text || proj.overview || "";
  const tags = proj.tags ?? [];
  const scenesCount = proj.scene_count ?? frames.length ?? 0;
  const availableShots = data?.imagesCount ?? 0;

  const bids = (data?.brandDeal?.products ?? []).map((p, i) => ({
    image_url: p.image_url,
    id: p.id ?? `bid-${i}`,
    brandName: p.brand_name ?? data?.brandDeal?.brand_name ?? "—",
    productName: p.item_name ?? p.name ?? "—",
    category: p.category ?? "—",
    price: typeof p.value === "number" ? p.value : 0,
  }));

  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <div>
      {/* Back button */}
      <div className="mt-[34px]">
        <button
          onClick={() =>
            brandId
              ? router.push(`/brand/${brandId}/placements`)
              : router.back()
          }
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to placements
        </button>
      </div>

      {/* Header: poster + meta + CTA */}
      {loading ? (
        <div className="mb-6 mt-4 flex items-start justify-between">
          <div className="flex gap-5">
            {/* poster skeleton */}
            <div className="h-48 w-48 rounded-xl bg-zinc-200 animate-pulse" />

            {/* text skeletons */}
            <div className="max-w-[560px] mt-1 space-y-3">
              <div className="h-6 w-56 rounded bg-zinc-200 animate-pulse" />
              <div className="h-4 w-[90%] rounded bg-zinc-200 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-zinc-200 animate-pulse" />

              {/* metrics row */}
              <div className="mt-2 flex items-center gap-5">
                <div className="h-4 w-16 rounded bg-zinc-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-zinc-200 animate-pulse" />
              </div>

              {/* tags row */}
              <div className="mt-3 flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-16 rounded-full bg-zinc-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="h-9 w-40 rounded bg-zinc-200 animate-pulse" />
        </div>
      ) : (
        <div className="mb-6 mt-4 flex items-start justify-between">
          <div className="flex gap-5">
            <img
              src={poster}
              alt=""
              className="h-48 w-48 rounded-xl object-cover"
            />
            <div className="max-w-[560px]">
              <h2 className="text-lg font-semibold">{title}</h2>
              {synopsis && (
                <p className="mt-2 text-sm text-zinc-600">{synopsis}</p>
              )}
              <div className="mt-3 flex items-center gap-5 text-sm text-zinc-700">
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {scenesCount}
                </span>
                {!!proj.estimated_budget && (
                  <span className="inline-flex items-center gap-1">
                    <Wallet className="h-4 w-4" />$
                    {(proj.estimated_budget || 0).toLocaleString()}
                  </span>
                )}
              </div>
              {!!tags.length && (
                <div className="mt-3 flex gap-2">
                  {tags.slice(0, 5).map((t, i) => (
                    <Badge
                      key={`${t}-${i}`}
                      tone={
                        ["pink", "purple", "orange", "blue", "green"][
                          i % 5
                        ] as any
                      }
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {hasDeal ? (
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm text-zinc-700">
                <span className="text-zinc-600">Status:</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusTone}`}
                >
                  {statusLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={onDeleteDeal}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-4 h-9 text-white text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete placement"}
              </button>
            </div>
          ) : (
            <Button onClick={() => setSheetOpen(true)}>Place a product</Button>
          )}{" "}
        </div>
      )}

      {/* Summary above frames */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-700">
            Scenes: <span className="font-semibold">{scenesCount}</span>
          </div>
          <div className="text-sm text-zinc-700">
            Generated shots from creator:{" "}
            <span className="font-semibold">{availableShots}</span>
          </div>
        </div>
      </div>

      <div id="frames">
        {loading ? (
          // frames skeleton bar
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-36 rounded-lg bg-zinc-200 animate-pulse"
              />
            ))}
          </div>
        ) : frames.length > 0 ? (
          <FramesStrip frames={frames} onOpen={openViewer} />
        ) : (
          <div className="rounded-xl border border-[#E8E8E8FF] bg-white p-6 text-sm text-zinc-700">
            The project creator has not generated scene visuals for this project
            yet.
          </div>
        )}
      </div>

      {/* Bids */}
      <div className="mt-8 rounded-xl border border-[#E8E8E8FF] bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-medium">All Placements</div>
          <div className="relative w-72">
            <Input placeholder="Search" />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <div className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] items-center gap-2 border-t px-4 py-2 text-[12px] text-zinc-500">
          <div>Brand</div>
          <div>Product name</div>
          <div>Category</div>
          <div>Price</div>
        </div>

        {loading ? (
          <ul className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] items-center gap-2 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded bg-zinc-200 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-zinc-200 animate-pulse" />
                </div>
                <div className="h-4 w-28 rounded bg-zinc-200 animate-pulse" />
                <div className="h-4 w-20 rounded bg-zinc-200 animate-pulse" />
                <div className="h-4 w-16 rounded bg-zinc-200 animate-pulse" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="divide-y">
            {(bids.length ? bids : []).map((b) => (
              <li
                key={b.id}
                className="grid grid-cols-[1.2fr_1.6fr_1.2fr_1fr] border-[#E8E8E8FF] items-center gap-2 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded bg-zinc-200">
                    <img
                      src={b.image_url}
                      alt=""
                      className="h-7 w-7 rounded-xl object-cover"
                    />
                  </div>
                  <span className="text-sm">{b.brandName}</span>
                </div>
                <span className="text-sm text-indigo-700">{b.productName}</span>
                <div className="text-sm">{b.category}</div>
                <div className="text-sm">
                  {b.price ? `$${b.price.toLocaleString()}` : "—"}
                </div>
              </li>
            ))}
            {bids.length === 0 && !loading && (
              <li className="px-4 py-6 text-sm text-zinc-600">
                No placement yet
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Image viewer */}
      {hasViewer && currentSrc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeViewer}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close"
              className="absolute -top-3 -right-3 z-10 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              ✕
            </button>

            {viewerIndex! > 0 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous frame"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {viewerIndex! < frames.length - 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next frame"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            <img
              src={currentSrc}
              alt={`Frame ${viewerIndex! + 1}`}
              className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl bg-white"
            />
          </div>
        </div>
      )}

      {/* ---------------- Right Sheet: Place Product ---------------- */}
      <PlaceProductSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        brandId={String(brandId)}
        brandEmail={brandEmail}
        brandLabel={data?.brandDeal?.brand_name || "Your brand"}
        projectId={String(projectId)} // ✅ NEW
        creatorEmail={String(creatorEmail)} // ✅ NEW
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}

/* ================= Right Sheet Component ================= */
