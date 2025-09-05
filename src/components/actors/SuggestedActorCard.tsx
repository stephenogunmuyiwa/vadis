"use client";

import {
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  CheckCircle2,
  CircleSlash2,
  DollarSign,
  User,
  Clapperboard,
  Info,
} from "lucide-react";
import { useState } from "react";

type Suggested = {
  name: string;
  avatarUrl?: string | null;
  note?: string;

  // NEW (optional): shown next to the name when present
  rating?: number;

  // Expanded details (unchanged from your data model)
  risk: "Low" | "Medium" | "High";
  reason: string;
  available: boolean | "Available" | "On hold" | "Busy";
  fee: string;
  age: number;
  recentWorks: string[];
};

export default function SuggestedActorCard({
  actor,
  onAccept,
  onResuggest,
  className,
}: {
  actor: Suggested;
  onAccept?: () => void;
  onResuggest?: () => void;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const avail =
    typeof actor.available === "boolean"
      ? actor.available
        ? "Available"
        : "Unavailable"
      : actor.available;

  const riskBg =
    actor.risk === "Low"
      ? "bg-emerald-500"
      : actor.risk === "Medium"
      ? "bg-amber-500"
      : "bg-red-600";

  return (
    <aside
      className={["w-[300px] flex-none", className].filter(Boolean).join(" ")}
    >
      <div className="relative rounded-3xl overflow-hidden h-[300px]">
        {/* Photo */}
        {actor.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={actor.avatarUrl}
            alt={actor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}

        {/* Overlay (above image) */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10">
          {/* Gradient behind overlay content */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/55 to-transparent" />

          {/* Header row: name + (optional) rating + expand/collapse */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="text-white min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] sm:text-[18px] font-semibold truncate">
                  {actor.name}
                </h3>
                {typeof actor.rating === "number" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-gray-900 h-6 px-2 text-[11px] font-semibold">
                    <Star className="h-3.5 w-3.5" />
                    {actor.rating.toFixed(1)}
                  </span>
                )}
              </div>
              {actor.note && (
                <p className="mt-1 text-[12px] leading-relaxed text-white/85 line-clamp-2">
                  {actor.note}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((x) => !x)}
              aria-expanded={expanded}
              className="shrink-0 h-9 w-9 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              title={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="relative z-10 mt-2 space-y-2 text-white">
              {/* Risk / Availability / Fee / Age pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center h-6 px-2 rounded-full text-[10px] font-semibold text-white ${riskBg}`}
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                  Risk: {actor.risk}
                </span>

                <span className="inline-flex items-center h-6 px-2 rounded-full text-[10px] font-semibold bg-white/90 text-gray-900">
                  {avail === "Available" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <CircleSlash2 className="h-3.5 w-3.5 mr-1" />
                  )}
                  {avail}
                </span>

                <span className="inline-flex items-center h-6 px-2 rounded-full text-[10px] font-semibold bg-white/90 text-gray-900">
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  {actor.fee}
                </span>

                <span className="inline-flex items-center h-6 px-2 rounded-full text-[10px] font-semibold bg-white/90 text-gray-900">
                  <User className="h-3.5 w-3.5 mr-1" />
                  Age {actor.age}
                </span>
              </div>

              {/* Reason */}
              <div className="text-white/90 text-[11px] leading-snug flex items-start">
                <Info className="h-3.5 w-3.5 mr-2 mt-[1px] flex-none" />
                <span className="line-clamp-2">{actor.reason}</span>
              </div>

              {/* Recent works */}
              <div className="flex items-start text-[11px]">
                <Clapperboard className="h-3.5 w-3.5 mr-2 flex-none opacity-90" />
                <div className="flex gap-1.5 flex-wrap">
                  {actor.recentWorks.map((w, i) => (
                    <span
                      key={`${w}-${i}`}
                      className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur text-white/90"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="relative z-10 mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onAccept}
              className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 h-9 px-4 text-[12px] font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button
              type="button"
              onClick={onResuggest}
              className="h-9 w-9 rounded-full bg-white/15 backdrop-blur text-white flex items-center justify-center hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              title="Re-suggest"
              aria-label="Re-suggest actor"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
