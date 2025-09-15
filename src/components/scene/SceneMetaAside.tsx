// components/scene/SceneMetaAside.tsx
"use client";

import { useState, useEffect } from "react";
import { initials } from "@/utils/initials";

export interface SceneCharacter {
  name: string;
  level: "main" | "supporting" | "background" | string; // keep open-ended
  description: string;
  estimated_age: number | null;
  gender: "male" | "female" | "" | string; // allow other values if they appear
  personality: string[];
  race: string;
}

export interface SceneMeta {
  title: string;
  description: string;
  estimated: string;
  cost: string;
  location: string;
  characters?: SceneCharacter[];
}

export default function SceneMetaAside({ meta }: { meta: SceneMeta }) {
  const [descOpen, setDescOpen] = useState(false);
  const chars = meta.characters ?? [];

  return (
    <aside className="flex-none w-[300px]">
      <div className="flex flex-col">
        {/* Title */}
        <h2
          className="text-[15px] sm:text-[20px] font-semibold text-gray-900"
          onClick={() => console.log(meta)}
        >
          {meta.title}
        </h2>

        {/* Collapsible Description */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setDescOpen((v) => !v)}
            aria-expanded={descOpen}
            aria-controls="scene-meta-description"
            className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 h-8 text-[12px] text-gray-800 hover:bg-gray-50"
            title={descOpen ? "Collapse description" : "Expand description"}
          >
            <span>{descOpen ? "Hide" : "Show"} description</span>
            <svg
              className={`transition-transform ${descOpen ? "rotate-180" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            id="scene-meta-description"
            className={`overflow-hidden transition-[max-height,opacity] duration-200 ${
              descOpen ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="mt-2 text-[12px] leading-relaxed text-gray-700">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center mt-5 gap-2">
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-[#0A9B00FF] text-white">
            Est. screen time: {meta.estimated}
          </span>
        </div>
        <div className="flex items-center mt-1 gap-2">
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-[#0077eb] text-white">
            Scene location: {meta.location}
          </span>
        </div>

        {/* Cost */}
        <div className="mt-2 rounded-md px-2 py-2 flex items-center justify-between bg-white">
          <div className="text-[12px] text-gray-500">Est. cost</div>
          <div className="text-[15px] font-semibold text-gray-900">
            {meta.cost}
          </div>
        </div>

        {/* NEW: Characters table */}
        <div className="mt-5">
          <div className="mb-2 text-[12px] font-semibold text-gray-900">
            Characters
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 text-[11px] font-medium text-gray-600 bg-gray-50">
              <div>Name</div>
              <div className="justify-self-end">Level</div>
            </div>

            {chars.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12px] text-gray-600">
                No characters detected for this scene.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {chars.map((c, idx) => (
                  <li
                    key={`${c.name}-${idx}`}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2"
                  >
                    {/* Name + avatar */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-7 w-7 shrink-0 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-[10px] font-semibold">
                        {initials(c.name)}
                      </span>
                      <span className="truncate text-[12px] text-gray-900">
                        {c.name}
                      </span>
                    </div>
                    {/* Level */}
                    <div className="justify-self-end">
                      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-800">
                        {String(c.level)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
