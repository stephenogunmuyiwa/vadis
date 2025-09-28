"use client";

import React from "react";
import { Search, ChevronDown, ExternalLink } from "lucide-react";
import ProjectCard, {
  type ProjectCardItem,
} from "@/components/investor/ProjectCard";
import {
  getInvestmentsOverview,
  mapProjectsToCardModels,
  toProjectCardItems,
} from "@/app/api/shared/investor/investor";
import { setSelectedProject } from "@/lib/investor/selection";
import type { ProjectApi, InvestorDeal } from "@/types/investor/project";
import { useRouter } from "next/navigation";

const cls = (...x: (string | false | undefined)[]) =>
  x.filter(Boolean).join(" ");

const Metric: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex-1 flex flex-col items-center justify-center py-10">
    <div className="text-[13px] text-neutral-500 mb-3">{label}</div>
    <div className="text-6xl font-semibold tracking-tight">{value}</div>
  </div>
);

const MetricSkeleton: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-10">
    <div className="text-[13px] text-neutral-500 mb-3">{label}</div>
    <div className="h-10 w-24 rounded bg-neutral-200 animate-pulse" aria-busy />
  </div>
);

const Divider: React.FC = () => <div className="h-full w-px bg-neutral-200" />;

const GenreSelect: React.FC<{
  value: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="relative inline-block">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pr-8 inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50 focus:outline-none"
    >
      <option value="__ALL__">All genre</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
  </div>
);

const SearchInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Search" }) => (
  <div className="relative w-full max-w-xl">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
    />
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
  </div>
);

const TABS = ["Explore projects", "Investments"] as const;
type Tab = (typeof TABS)[number];

export default function Page() {
  const router = useRouter();

  // TODO: replace with real auth/session email
  const INVESTOR_EMAIL = "investor@vadis.com";

  const [tab, setTab] = React.useState<Tab>("Explore projects");

  // Raw map for selection/session handoff
  const rawByIdRef = React.useRef<Map<string, ProjectApi>>(new Map());

  // Explore data
  const [items, setItems] = React.useState<ProjectCardItem[]>([]);
  const [genres, setGenres] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState("");
  const [genre, setGenre] = React.useState<string>("__ALL__");

  // Deals data
  const [deals, setDeals] = React.useState<InvestorDeal[]>([]);

  // UX
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch overview on mount (or when email changes)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const ov = await getInvestmentsOverview(INVESTOR_EMAIL);
        if (!ov.ok) throw new Error("Failed to load overview");

        // ---- projects
        const projects = ov.projects?.data ?? [];
        rawByIdRef.current = new Map(projects.map((p) => [String(p.id), p]));

        const models = mapProjectsToCardModels(projects);
        const withImage = models.filter(
          (m): m is (typeof models)[number] & { img: string } => !!m.img
        );
        const cards = toProjectCardItems(withImage);

        // genres from projects (case-insensitive)
        const tagSet = new Map<string, string>();
        for (const m of models) {
          for (const t of m.tags || []) {
            const k = t.text.trim().toLowerCase();
            if (k && !tagSet.has(k)) tagSet.set(k, t.text.trim());
          }
        }
        const sortedGenres = Array.from(tagSet.values()).sort((a, b) =>
          a.localeCompare(b)
        );

        // de-dupe cards by id
        const uniqueBy = <T, K extends keyof T>(arr: T[], key: K) => {
          const seen = new Set<string>();
          return arr.filter((it) => {
            const k = String((it as any)[key] ?? "");
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
        };

        if (!cancelled) {
          setItems(uniqueBy(cards, "id"));
          setGenres(sortedGenres);
          setGenre("__ALL__");
        }

        // ---- deals
        const dealList = ov.deals?.data ?? [];
        if (!cancelled) setDeals(dealList);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [INVESTOR_EMAIL]);

  // Explore filters
  const filteredExplore = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q);
      const matchesGenre =
        genre === "__ALL__" ||
        p.tags.some((t) => t.text.trim().toLowerCase() === genre.toLowerCase());
      return matchesQuery && matchesGenre;
    });
  }, [items, query, genre]);

  // Helpers
  const fmtDate = (val: number | string | undefined | null) => {
    if (val == null) return "—";
    let ms: number;
    if (typeof val === "string") {
      const t = Date.parse(val);
      if (!isNaN(t)) ms = t;
      else return "—";
    } else {
      ms = val > 1e12 ? val : val * 1000;
    }
    return new Date(ms).toLocaleString();
  };
  const sumDealValues = (deals: Array<{ value?: number | null }>) =>
    deals.reduce(
      (acc, d) => acc + (typeof d.value === "number" ? d.value : 0),
      0
    );

  const fmtUSD = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  const totalDealValue = React.useMemo(() => sumDealValues(deals), [deals]);

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-neutral-50 px-6 py-6">
      <div className="mx-auto max-w-[1100px]">
        {/* Header + Metrics */}
        <h1 className="text-[18px] font-semibold text-neutral-900">
          Investor hub
        </h1>

        <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex">
            {loading ? (
              <>
                <MetricSkeleton label="Total Explorable Projects" />
                <Divider />
                <MetricSkeleton label="Total Intrested Projects" />
                <Divider />
                <MetricSkeleton label="Total Proppsed Investments" />
              </>
            ) : (
              <>
                <Metric
                  label="Total Explorable Projects"
                  value={String(items.length)}
                />
                <Divider />
                <Metric
                  label="Total Intrested Projects"
                  value={String(deals.length)}
                />
                <Divider />
                <Metric
                  label="Total Proppsed Investments"
                  value={fmtUSD(totalDealValue)}
                />
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-neutral-200">
          <div className="flex gap-8">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cls(
                  "relative -mb-px pb-3 text-sm",
                  tab === t
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {t}
                {tab === t && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-neutral-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Explore controls */}
        {tab === "Explore projects" && (
          <>
            <p className="mt-6 text-sm text-neutral-700">
              Discover Perfect Projects to invest.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <SearchInput value={query} onChange={setQuery} />
              <div className="ml-auto flex items-center gap-3">
                <GenreSelect
                  value={genre}
                  onChange={setGenre}
                  options={genres}
                />
              </div>
            </div>
          </>
        )}

        {/* Content */}
        {tab === "Explore projects" && (
          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                >
                  <div className="h-44 w-full bg-neutral-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-2/3 bg-neutral-200 rounded" />
                    <div className="h-3 w-full bg-neutral-200 rounded" />
                    <div className="h-3 w-5/6 bg-neutral-200 rounded" />
                    <div className="h-6 w-1/2 bg-neutral-200 rounded" />
                  </div>
                </div>
              ))}
            {!loading &&
              filteredExplore.map((p, i) => (
                <ProjectCard
                  key={`${p.id}-${i}`}
                  item={p}
                  onClick={(id) => {
                    const raw = rawByIdRef.current.get(String(id));
                    if (raw) setSelectedProject(raw);
                    router.push(`/investor/${id}`);
                  }}
                />
              ))}
          </section>
        )}

        {tab === "Investments" && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Project</th>
                    <th className="px-4 py-3 text-left font-medium">Creator</th>
                    <th className="px-4 py-3 text-left font-medium">Meeting</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Comments
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {deals.map((d, i) => {
                    const proj = rawByIdRef.current.get(String(d.projectId));
                    const title =
                      proj?.title || proj?.project_title || d.projectId;
                    const creator =
                      proj?.creator ||
                      proj?.creator_name ||
                      d.creatorEmail ||
                      "—";
                    return (
                      <tr
                        key={`${d.projectId}-${i}`}
                        className="hover:bg-neutral-50"
                      >
                        <td className="px-4 py-3 text-neutral-900">{title}</td>
                        <td className="px-4 py-3 text-neutral-700">
                          {creator}
                        </td>
                        <td className="px-4 py-3 text-neutral-700">
                          {fmtDate(d.meeting_date)}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {d.comments || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100"
                            onClick={() => {
                              if (d.meeting_url)
                                window.open(
                                  d.meeting_url,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                            }}
                          >
                            Open link <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {!deals.length && !loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-neutral-500"
                      >
                        No deals yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
