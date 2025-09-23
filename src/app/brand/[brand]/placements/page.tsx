"use client";
import { Input } from "@/components/brand/ui/Input";
import { Select } from "@/components/brand/ui/Select";
import { PlacementCard } from "@/components/brand/placements/PlacementCard";
import { Search } from "lucide-react";
import type { Placement } from "@/types/brand/brand";
import { ENV } from "@/config/env";
import * as React from "react";
import { useParams } from "next/navigation";
import { useProfiles } from "@/hooks/brand/useProfiles";

const API_BASE = ENV.API_BASE;

type ApiProject = {
  id?: string;
  title?: string;
  project_title?: string;
  preview_text?: string;
  overview?: string;
  poster_urls?: string[];
  tags?: string[];
  scene_count?: number;
  creator_name?: string;
  creator?: string;
  estimated_budget?: number;
  estimated_ROI?: number;
  created_date?: number;
  last_open?: number;
  url?: string;
  pitch_deck_url?: string;
};

// ---------- helpers ----------
function scoreProject(p: ApiProject) {
  let s = 0;
  if (p.title || p.project_title) s += 2;
  if (p.preview_text) s += 2;
  if (p.overview) s += 1;
  if (Array.isArray(p.poster_urls)) s += Math.min(5, p.poster_urls.length) * 2;
  if (typeof p.scene_count === "number") s += 1;
  if (typeof p.estimated_budget === "number") s += 1;
  if (p.tags?.length) s += Math.min(5, p.tags.length);
  if (p.pitch_deck_url) s += 1;
  if (typeof p.last_open === "number") s += 0.5;
  if (typeof p.created_date === "number") s += 0.25;
  return s;
}
function dedupeProjects(rows: ApiProject[]) {
  const byId = new Map<string, ApiProject>();
  for (const p of rows) {
    const id = p.id ?? `${p.project_title ?? "unknown"}::${p.creator ?? ""}`;
    const existing = byId.get(id);
    if (!existing) byId.set(id, { ...p, id });
    else
      byId.set(
        id,
        scoreProject(p) >= scoreProject(existing) ? { ...p, id } : existing
      );
  }
  return Array.from(byId.values());
}
function pickTitle(p: ApiProject) {
  return p.title || p.project_title || "Untitled project";
}
function pickSynopsis(p: ApiProject) {
  return p.preview_text || p.overview || "No preview available yet.";
}
function pickPoster(p: ApiProject) {
  return (p.poster_urls && p.poster_urls[0]) || "";
}

// ---------- page ----------
export default function PlacementsPage() {
  const { brand: profileId } = useParams<{ brand: string }>();
  const { profiles } = useProfiles();

  const profileName =
    profiles.find((p) => p.id === profileId)?.name ||
    (profileId || "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [projects, setProjects] = React.useState<ApiProject[]>([]);

  // filters
  const [q, setQ] = React.useState("");
  const [genre, setGenre] = React.useState("all");

  React.useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/projects/all`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (cancel) return;
        const rows: ApiProject[] = Array.isArray(json?.data) ? json.data : [];
        setProjects(dedupeProjects(rows));
      } catch (e: any) {
        if (!cancel) {
          setError(e?.message || "Network error.");
          setProjects([]);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // build dynamic tag options from fetched projects
  const genreOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) (p.tags ?? []).forEach((t) => set.add(t));
    const opts = Array.from(set)
      .sort()
      .map((t) => ({ label: t, value: t }));
    return [{ label: "All genres", value: "all" }, ...opts];
  }, [projects]);

  // apply filters
  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      const titleMatch = !term || pickTitle(p).toLowerCase().includes(term);
      const tagMatch =
        genre === "all" ||
        (p.tags ?? []).some((t) => t.toLowerCase() === genre.toLowerCase());
      return titleMatch && tagMatch;
    });
  }, [projects, q, genre]);

  return (
    <div>
      <h1 className="text-[15px] font-semibold">Placements</h1>
      <p className="text-xs text-zinc-500">{profileName}</p>

      <div className="mt-5 flex gap-6 border-b">
        <button className="border-b-2 border-indigo-500 px-2 py-2 text-sm font-medium text-indigo-600">
          Market place
        </button>
        <a
          href={`./placements/deals`}
          className="px-2 py-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          My deals{" "}
          <span className="ml-1 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]">
            2
          </span>
        </a>
      </div>

      <div className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          {/* Search by title */}
          <div className="relative w-[420px]">
            <Input
              placeholder="Search title"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>

          {/* Genre select from project tags */}
          <div className="flex items-center gap-3">
            <Select value={genre} onChange={setGenre} options={genreOptions} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-sm text-zinc-600">
            No projects match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {filtered.map((p, i) => (
              <PlacementCard
                key={p.id ?? `proj-${i}`}
                href={`./placements/${p.id ?? `proj-${i}`}`}
                studio={p.creator_name || p.creator}
                title={pickTitle(p)}
                synopsis={pickSynopsis(p)}
                poster={pickPoster(p)}
                tags={p.tags || []}
                scenes={p.scene_count}
                price={
                  typeof p.estimated_budget === "number"
                    ? p.estimated_budget
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
