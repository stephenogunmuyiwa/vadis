// components/projectAssets/ProjectAssets.tsx
"use client";

import { FC } from "react";
import { Play, Star } from "lucide-react";

export type RelatedItem = { id: string; title: string; image: string };

export interface ProjectAssetProps {
  poster: string;
  title: string;
  rating: number; // 0-10
  year: string; // "2018"
  runtime: string; // "2h 23min"
  ageRating: string; // "16+"
  overview: string;
  starring: string[];
  createdBy: string[];
  genres: string[];
  related: RelatedItem[];
  activeTab?: "OVERVIEW" | "TRAILERS & MORE" | "MORE LIKE THIS" | "DETAILS";
}

const Dot: FC = () => <span className="mx-3 text-gray-300">•</span>;

const Row: FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex gap-8 text-base">
    <div className="w-40 shrink-0 text-gray-500">{label}</div>
    <div className="text-gray-800">{children}</div>
  </div>
);

const Tabs: FC<{ active: ProjectAssetProps["activeTab"] }> = ({ active }) => {
  const tabs: ProjectAssetProps["activeTab"][] = [
    "OVERVIEW",
    "TRAILERS & MORE",
    "MORE LIKE THIS",
    "DETAILS",
  ];
  return (
    <div className="mt-7 border-b border-gray-200">
      <nav className="-mb-px flex gap-10">
        {tabs.map((t) => {
          const is = t === active;
          return (
            <button
              key={t}
              className={[
                "pb-4 text-sm md:text-base font-semibold tracking-wide uppercase",
                is ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
                "relative",
              ].join(" ")}
            >
              {t}
              {is && (
                <span className="absolute left-0 -bottom-[2px] h-1 w-full rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const RelatedStrip: FC<{ items: RelatedItem[] }> = ({ items }) => (
  <div className="mt-8">
    <h4 className="mb-4 text-base font-medium text-gray-900">Related Movies</h4>
    <div className="flex gap-5 overflow-x-auto pb-3 snap-x">
      {items.map((m) => (
        <div key={m.id} className="w-[280px] shrink-0 snap-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.image}
            alt={m.title}
            className="h-[160px] w-full rounded-xl object-cover ring-1 ring-gray-200"
          />
          <div className="mt-2 text-sm text-gray-800">{m.title}</div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectAssets: FC<ProjectAssetProps> = ({
  poster,
  title,
  rating,
  year,
  runtime,
  ageRating,
  overview,
  starring,
  createdBy,
  genres,
  related,
  activeTab = "OVERVIEW",
}) => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[minmax(360px,0.95fr)_1.5fr]">
        {/* Poster */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={title}
            className="w-full aspect-[2/3] rounded-3xl object-cover shadow-lg ring-1 ring-gray-200"
          />

          {/* Play button overlay (bigger) */}
          <div className="absolute left-5 bottom-5 flex items-end gap-4">
            <button
              type="button"
              aria-label="Play"
              className="grid h-20 w-20 place-items-center rounded-2xl bg-rose-500 shadow-xl transition hover:bg-rose-600"
            >
              <Play className="h-10 w-10 text-white translate-x-[1px]" />
            </button>
            {/* decorative ghost control */}
            <div className="h-14 w-14 rounded-full bg-gray-300/30 ring-1 ring-gray-400/20" />
          </div>
        </div>

        {/* Right column */}
        <div className="pb-4">
          {/* Title + rating */}
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              {title}
            </h1>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-base font-semibold text-amber-600 ring-1 ring-amber-100">
              {rating.toFixed(1)}
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center text-base text-gray-600">
            <span>{year}</span>
            <Dot />
            <span>{runtime}</span>
            <Dot />
            <span>{ageRating}</span>
          </div>

          {/* Tabs */}
          <Tabs active={activeTab} />

          {/* Overview content */}
          <div className="mt-7 space-y-5">
            <p className="text-base md:text-lg leading-7 text-gray-800">
              {overview}
            </p>
            <div className="space-y-4">
              <Row label="Starring">{starring.join(", ")}</Row>
              <Row label="Created by">{createdBy.join(", ")}</Row>
              <Row label="Genre">{genres.join(", ")}</Row>
            </div>

            <RelatedStrip items={related} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectAssets;
