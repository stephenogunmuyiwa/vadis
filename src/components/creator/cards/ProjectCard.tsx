import { Project } from "@/types/creator/creator";
import Tag from "../ui/Tag";
import Metric from "../ui/Metric";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Soft pastel palette (Tailwind)
const SOFT_BACKGROUNDS = [
  "bg-rose-100",
  "bg-pink-100",
  "bg-fuchsia-100",
  "bg-violet-100",
  "bg-indigo-100",
  "bg-sky-100",
  "bg-cyan-100",
  "bg-teal-100",
  "bg-emerald-100",
  "bg-lime-100",
  "bg-amber-100",
];

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // convert to 32-bit int
  }
  return Math.abs(h);
}

export default function ProjectCard({ item }: { item: Project }) {
  const poster = item.poster_urls?.[0] || "";
  const title = item.title;
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.toString() || "";

  const preview =
    item.preview_text || item.overview || "No preview available yet.";

  const budgetDisplay =
    typeof item.estimated_budget === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(item.estimated_budget)
      : "—";

  // Deterministic soft color based on id/title
  const softBg = useMemo(() => {
    const key = item.id || item.title || "fallback";
    const idx = hashString(key) % SOFT_BACKGROUNDS.length;
    return SOFT_BACKGROUNDS[idx];
  }, [item.id, item.title]);
  const goToProject = () => {
    const createdDate = new Date(
      item.created_date ? item.created_date * 1000 : 0
    ); // ms since epoch
    const createdISO = createdDate.toISOString();
    const createdLabel = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(createdDate);
    const q = new URLSearchParams({
      title: item.title,
      createdISO,
      createdLabel,
    }).toString();
    router.push(`/creator/Project/${item.id}${q ? `?${q}` : ""}`);
  };
  return (
    <div
      onClick={goToProject}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToProject();
        }
      }}
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-[#0007CCFF]"
    >
      {/* Header image or soft color */}
      {poster ? (
        <img
          src={poster}
          alt={`${title} poster`}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={`h-40 w-full ${softBg}`} />
      )}

      {/* Column content */}
      <div className="p-5">
        {/* Title */}
        <h4 className="mb-1 line-clamp-1 text-[15px] font-medium text-neutral-800">
          {title}
        </h4>

        {/* Preview text (with fallback) */}
        <p className="line-clamp-2 h-10 text-sm text-neutral-500">{preview}</p>

        {/* Metrics */}
        <div className="mt-3 flex items-center gap-4">
          <Metric icon="pages" value={item.scene_count ?? 0} />
          <Metric icon="users" value={0} />
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(item.tags || []).slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {/* Estimated budget */}
        <div className="mt-4 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">
            Estimated budget:
          </span>{" "}
          <span>{budgetDisplay}</span>
        </div>
      </div>
    </div>
  );
}
