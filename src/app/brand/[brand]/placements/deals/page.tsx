"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/brand/ui/Input";
import { Select } from "@/components/brand/ui/Select";
import { PlacementCard } from "@/components/brand/placements/PlacementCard";
import { Search, AlertCircle } from "lucide-react";
import { ENV } from "@/config/env";

/** ---------- Types matching Flask response ---------- */
type BrandProject = {
  id: string;
  title: string;
  preview_text?: string;
  poster_urls?: string[];
  scene_count?: number;
  tags?: string[];
  estimated_budget?: number;
  creator?: string; // maps to "studio" label in card
};

type DealsByProfileResponse = {
  ok: boolean;
  brandProfileId: string;
  count: number;
  data: BrandProject[];
  error?: string;
};

/** ---------- Small skeletons while loading ---------- */
function CardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="h-40 w-full animate-pulse rounded-lg bg-zinc-200" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-zinc-200" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-zinc-200" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-zinc-200" />
      </div>
    </div>
  );
}

/** ---------- Page ---------- */
export default function DealsPage() {
  const params = useParams<{ brand?: string }>();
  // Your route looks like: /brand/[brand]/placements/deals
  const brandProfileId = params?.brand ?? ""; // e.g. "pizzza-9gnp"

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [projects, setProjects] = useState<BrandProject[]>([]);

  // simple client-side search/filter plumbing (non-blocking)
  const [q, setQ] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  useEffect(() => {
    let ignore = false;

    async function loadDeals() {
      try {
        setLoading(true);
        setErr(null);

        const base = ENV.API_BASE;
        const url = `${base}/brands/deals/projects-by-profile?brandProfileId=${encodeURIComponent(
          brandProfileId
        )}`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `Request failed with ${res.status}`);
        }

        const payload = (await res.json()) as DealsByProfileResponse;
        if (!payload.ok) throw new Error(payload.error || "Unknown error");

        if (!ignore) {
          setProjects(payload.data || []);
        }
      } catch (e: any) {
        if (!ignore) setErr(e.message || "Failed to load deals");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (brandProfileId) {
      loadDeals();
    } else {
      setLoading(false);
      setErr("Missing brand profile id in URL.");
    }

    return () => {
      ignore = true;
    };
  }, [brandProfileId]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const p of projects) {
      (p.tags || []).forEach((t) => {
        if (t && t.trim()) tags.add(t.trim());
      });
    }
    return Array.from(tags).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }, [projects]);

  const genreOptions = useMemo(
    () => [
      { label: "All tags", value: "all" },
      ...allTags.map((t) => ({ label: t, value: t })),
    ],
    [allTags]
  );

  /** Apply search + genre filter */
  const filtered = useMemo(() => {
    let list = projects;

    // search (case-insensitive) on title, preview_text, and any tag
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(needle);
        const inPreview = (p.preview_text || "").toLowerCase().includes(needle);
        const inTags = (p.tags || []).some((t) =>
          t.toLowerCase().includes(needle)
        );
        return inTitle || inPreview || inTags;
      });
    }

    // genre filter by exact tag match (case-insensitive)
    if (genreFilter !== "all") {
      const gf = genreFilter.toLowerCase();
      list = list.filter((p) =>
        (p.tags || []).some((t) => t.toLowerCase() === gf)
      );
    }

    return list;
  }, [projects, q, genreFilter]);

  return (
    <div>
      <h1 className="mt-[50px] text-[20px] font-semibold">Placements</h1>
      <p className="text-xs text-zinc-500">{brandProfileId || "—"}</p>

      <div className="mt-5 flex gap-6 border-b border-[#E8E8E8FF]">
        <a
          href="../placements"
          className="px-2 py-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          Market place
        </a>
        <button className="border-b-2 border-indigo-500 px-2 py-2 text-sm font-medium text-indigo-600">
          My deals
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-[420px]">
            <Input
              placeholder="Search"
              value={q}
              onChange={(e: any) => setQ(e.target.value)}
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={genreFilter}
              onChange={(v: any) => setGenreFilter(v)}
              options={[{ label: "All genre", value: "all" }]}
            />
          </div>
        </div>

        {/* Error state */}
        {err && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <div>
              <div className="font-medium">Couldn’t load deals</div>
              <div className="opacity-80">{err}</div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Data grid */}
        {!loading && !err && (
          <>
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-600">
                No deals found for{" "}
                <span className="font-medium">{brandProfileId}</span>.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {filtered.map((p, i) => {
                  const poster =
                    (p.poster_urls && p.poster_urls[0]) || undefined;

                  // Build link to a specific placement/project page under the same brand
                  // const href = `../placements/${p.id}`;

                  return (
                    <PlacementCard
                      key={p.id}
                      href={`./${p.id ?? `proj-${i}`}${
                        p.creator
                          ? `?creatorEmail=${encodeURIComponent(p.creator)}`
                          : ""
                      }`}
                      studio={p.creator || "—"}
                      title={p.title}
                      synopsis={p.preview_text || "No preview available yet."}
                      poster={poster || "/placeholder-poster.png"}
                      scenes={p.scene_count || 0}
                      audience={0}
                      rating={0}
                      price={p.estimated_budget || 0}
                      tags={p.tags || []}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
