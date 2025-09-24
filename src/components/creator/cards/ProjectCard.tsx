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

  const budgetValue =
    typeof item.estimated_budget === "number" ? item.estimated_budget : 0;
  const showBudget = budgetValue > 0;
  const budgetDisplay = showBudget
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(budgetValue)
    : null;

  const sceneCount = Number(item.scene_count ?? 0);
  const usersCount = Number((item as any)?.users_count ?? 0);

  const metrics = useMemo(
    () =>
      [
        sceneCount > 0 && { icon: "pages" as const, value: sceneCount },
        usersCount > 0 && { icon: "users" as const, value: usersCount },
      ].filter(Boolean) as { icon: "pages" | "users"; value: number }[],
    [sceneCount, usersCount]
  );

  const displayTags = useMemo(() => {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of tags) {
      const t = String(raw ?? "").trim();
      const k = t.toLowerCase();
      if (!t || seen.has(k)) continue; // dedupe case-insensitively
      seen.add(k);
      out.push(t);
    }
    return out.slice(0, 4);
  }, [item.tags]);

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
      {
        poster && (
          <img
            src={poster}
            alt={`${title} poster`}
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        )
        // : (
        //   <div className="h-40 w-full bg-neutral-200 flex items-center justify-center text-center p-4">
        //     <div className="text-neutral-700 text-sm">
        //       <p className="font-medium">You have not generated a poster</p>
        //       <p className="text-xs text-neutral-600 mt-1">
        //         Generate a poster from the{" "}
        //         <span className="font-medium">Poster &amp; Trailer</span> tab.
        //       </p>
        //     </div>
        //   </div>
        // )
      }

      {/* Column content */}
      <div className="p-5">
        {/* Title */}
        <h4 className="mb-1 line-clamp-1 text-[15px] font-medium text-neutral-800">
          {title}
        </h4>

        {/* Preview text (with fallback) */}
        <p className="line-clamp-2 h-10 text-sm text-neutral-500">{preview}</p>

        {/* Metrics */}
        {metrics.length > 0 && (
          <div className="mt-3 flex items-center gap-4">
            {metrics.map((m, i) => (
              <Metric
                key={`${item.id}-m-${m.icon}-${i}`}
                icon={m.icon}
                value={m.value}
              />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {displayTags.map((t, i) => (
            <Tag key={`${item.id ?? title ?? "proj"}-${t}-${i}`}>{t}</Tag>
          ))}
        </div>

        {/* Estimated budget */}
        {showBudget && (
          <div className="mt-4 text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">
              Estimated budget:
            </span>{" "}
            <span>{budgetDisplay}</span>
          </div>
        )}
      </div>
    </div>
  );
}
