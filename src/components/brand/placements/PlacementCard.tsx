"use client";
import Link from "next/link";
import { Badge } from "@/components/brand/ui/Badge";
import { FileText, Users, Star } from "lucide-react";
import { useMemo, useState } from "react";

function softColorFrom(text: string) {
  // deterministic soft HSL based on the text
  let hash = 0;
  for (let i = 0; i < text.length; i++)
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `hsl(${hue} 70% 92%)`; // pastel
}

export function PlacementCard({
  href,
  studio,
  title,
  synopsis,
  poster,
  tags = [],
  scenes,
  audience,
  rating,
  price,
}: {
  href: string;
  studio?: string;
  title: string;
  synopsis?: string;
  poster?: string;
  tags?: string[];
  scenes?: number;
  audience?: number;
  rating?: number;
  price?: number;
}) {
  const [showImg, setShowImg] = useState<boolean>(!!poster);
  const bg = useMemo(
    () => softColorFrom(title || studio || "vadis"),
    [title, studio]
  );

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[#DCDCDCFF] bg-white transition hover:border-[#0000C7FF]"
    >
      <div className="flex flex-col gap-3 p-4">
        {showImg ? (
          <img
            src={poster}
            alt=""
            className="h-36 w-full rounded-lg object-cover md:h-40"
            onError={() => setShowImg(false)}
          />
        ) : (
          <div
            className="h-36 w-full rounded-lg md:h-40"
            style={{ backgroundColor: bg }}
            aria-hidden
          />
        )}

        <div className="flex-1">
          {studio && <div className="text-xs text-zinc-500">{studio}</div>}
          <div className="text-sm font-semibold">{title}</div>
          {synopsis && (
            <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
              {synopsis}
            </p>
          )}

          {(scenes !== undefined ||
            audience !== undefined ||
            rating !== undefined ||
            price !== undefined) && (
            <div className="mt-3 flex items-center gap-4 text-[12px] text-zinc-600">
              {scenes !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {scenes}
                </span>
              )}
              {audience !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {audience}
                </span>
              )}
              {rating !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {rating}/5
                </span>
              )}
              {price !== undefined && (
                <span className="ml-auto text-zinc-900">
                  ${price.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <Badge
                  key={i}
                  tone={
                    t === "Action"
                      ? "pink"
                      : t === "Film"
                      ? "purple"
                      : t === "Adults"
                      ? "orange"
                      : t === "Fantasy"
                      ? "green"
                      : "blue"
                  }
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
