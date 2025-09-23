"use client";

import { useEffect, useState, ReactNode } from "react";
import {
  getMovieDetails,
  generatePoster,
  generateTrailer,
  type MovieDetails,
} from "@/app/api/shared/getAssets";

type Props = {
  userEmail: string;
  projectId: string;
  movieId: string;
  topOffsetPx?: number; // if you have a fixed header height
};

export default function PosterTrailer({
  userEmail,
  projectId,
  movieId,
  topOffsetPx = 0,
}: Props) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [playerOpen, setPlayerOpen] = useState(false);
  const [genPosterLoading, setGenPosterLoading] = useState(false);
  const [genTrailerLoading, setGenTrailerLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getMovieDetails({ userEmail, projectId, movieId });
        if (!cancelled) {
          if (res.ok) setDetails(res.data);
          else setErr(res.error || "Failed to load movie details");
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Unexpected error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userEmail, projectId, movieId]);

  useEffect(() => {
    if (!playerOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setPlayerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playerOpen]);

  const withBuster = (url: string) =>
    !url ? url : `${url}${url.includes("?") ? "&" : "?"}ts=${Date.now()}`;

  const containerStyle =
    topOffsetPx > 0
      ? { height: `calc(100vh - ${topOffsetPx}px)` }
      : { height: "100vh" };

  async function onGeneratePoster() {
    try {
      setGenPosterLoading(true);
      const res = await generatePoster({ userEmail, projectId, movieId });
      if (res.ok) {
        const posters = (res.poster_urls ?? []).map(withBuster);
        setDetails((prev) =>
          prev
            ? { ...prev, poster_urls: posters }
            : ({
                title: "",
                preview_text: "",
                overview: "",
                tags: [],
                poster_urls: posters,
                trailer_url: undefined,
              } as MovieDetails)
        );
      } else {
      }
    } finally {
      setGenPosterLoading(false);
    }
  }

  async function onGenerateTrailer() {
    try {
      setGenTrailerLoading(true);
      // const res = await generateTrailer({ userEmail, projectId, movieId });
      // if (res.ok) {
      //   setDetails((prev) =>
      //     prev ? { ...prev, trailer_url: withBuster(res.trailer_url) } : prev
      //   );
      //   setPlayerOpen(true);
      // } else {
      // }
    } finally {
      setGenTrailerLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="w-full overflow-y-auto" style={containerStyle}>
        <div className="px-[50px] py-[50px]">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-[300px_1fr]">
            <div className="aspect-[4/5] w-full max-w-[300px] rounded-2xl bg-gray-200 animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (err || !details) {
    return (
      <section className="w-full overflow-y-auto" style={containerStyle}>
        <div className="px-[50px] py-[50px] text-sm text-red-600">
          {err || "Failed to load."}
        </div>
      </section>
    );
  }

  const {
    title,
    preview_text,
    overview,
    tags,
    poster_urls = [],
    trailer_url,
  } = details;
  const hasPoster = poster_urls.length > 0;
  const posterSrc = hasPoster ? poster_urls[0] : "";

  return (
    <section
      className="w-full overflow-y-auto [scrollbar-gutter:stable]"
      style={containerStyle}
    >
      <div className="px-[50px] py-[50px]">
        {/* Top row: poster block + details */}
        <div className="grid gap-8 sm:gap-10 md:grid-cols-[300px_1fr]">
          {/* Poster block (no generate here anymore) */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 bg-gray-50">
              {hasPoster ? (
                <img
                  src={posterSrc}
                  alt={`${title} poster`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  No poster yet
                </div>
              )}

              {/* Trailer control on top of poster frame */}
              {trailer_url ? (
                <button
                  type="button"
                  aria-label="Play trailer"
                  onClick={() => setPlayerOpen(true)}
                  className="group absolute inset-0 grid place-items-center"
                >
                  <span className="grid place-items-center h-20 w-20 rounded-full bg-black/40 backdrop-blur-[1px] ring-1 ring-white/40 transition group-hover:bg-black/50">
                    <PlayIcon className="h-8 w-8 text-white/95" />
                  </span>
                </button>
              ) : (
                <div className="absolute inset-x-0 bottom-0 pb-4 flex justify-center">
                  <button
                    type="button"
                    onClick={onGenerateTrailer}
                    disabled={genTrailerLoading}
                    className="rounded-full bg-violet-600 px-4 h-9 text-white text-[13px] hover:bg-violet-700 disabled:opacity-50 shadow"
                  >
                    {genTrailerLoading
                      ? "Generating trailer…"
                      : "Generate trailer"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0">
            <h1 className="text-[28px] font-semibold text-gray-900">{title}</h1>
            {!!preview_text && (
              <p className="mt-1 text-[15px] text-gray-500 leading-6">
                {preview_text}
              </p>
            )}

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    i % 3 === 0
                      ? "bg-fuchsia-100 text-fuchsia-900"
                      : i % 3 === 1
                      ? "bg-rose-100 text-rose-900"
                      : "bg-amber-100 text-amber-900",
                  ].join(" ")}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* OVERVIEW under tags */}
            <div className="mt-6 space-y-6 text-[15px] leading-7 text-gray-700">
              <p>{overview}</p>
            </div>
          </div>
        </div>

        {/* Posters gallery (Generate here) */}
        <div className="mt-10">
          <h3 className="mb-3 text-[15px] font-medium text-gray-800">
            Posters
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {/* Existing posters */}
            {poster_urls.map((url, i) => (
              <div
                key={i}
                className="relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-black/5 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Poster ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
            ))}

            {/* Generate poster tile (always present in the grid) */}
            <button
              type="button"
              onClick={onGeneratePoster}
              disabled={genPosterLoading}
              className="relative aspect-[2/3] rounded-xl ring-1 ring-dashed ring-gray-300 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
              aria-label="Generate poster"
            >
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <PlusIcon className="h-6 w-6" />
                <span className="text-sm font-medium">
                  {genPosterLoading ? "Generating…" : "Generate poster"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      {playerOpen && details.trailer_url && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlayerOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setPlayerOpen(false)}
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 z-10"
            >
              ✕
            </button>

            {isEmbeddable(details.trailer_url) ? (
              <iframe
                src={toEmbedUrl(details.trailer_url)}
                title="Trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <video
                src={details.trailer_url}
                controls
                autoPlay
                className="absolute inset-0 h-full w-full"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- helpers & icons ---------- */

function isEmbeddable(url: string) {
  return /youtu\.be|youtube\.com|vimeo\.com/i.test(url);
}
function toEmbedUrl(url: string) {
  const ytWatch = /youtube\.com\/watch\?v=([^&]+)/i.exec(url);
  if (ytWatch?.[1])
    return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;
  const ytShort = /youtu\.be\/([^?]+)/i.exec(url);
  if (ytShort?.[1])
    return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;
  const vimeo = /vimeo\.com\/(\d+)/i.exec(url);
  if (vimeo?.[1])
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}
function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
