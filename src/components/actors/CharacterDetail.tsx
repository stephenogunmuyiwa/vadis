"use client";

import {
  Clapperboard,
  Calendar,
  Globe,
  User,
  Sparkles,
  FileText,
} from "lucide-react";

import { CharacterProfile } from "@/types/character";

const InitialsBox = ({ name }: { name: string }) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((s) => s[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-[12px] font-semibold text-gray-700">
      {initials}
    </div>
  );
};

export default function CharacterDetail({
  character,
}: {
  character: CharacterProfile;
}) {
  const roleClass =
    character.role === "Lead"
      ? "bg-green-600 text-white"
      : "bg-gray-300 text-gray-900";
  const labelCls = "w-[120px] shrink-0 text-[12px] text-gray-500 pt-0.5";

  return (
    <div className="w-full h-[300px] rounded-2xl bg-white p-4 flex flex-col border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InitialsBox name={character.name} />
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-gray-900">
            {character.name}
          </h1>
        </div>
        <span
          className={`inline-flex items-center px-3 h-8 rounded-full text-[12px] font-medium ${roleClass}`}
        >
          {character.role}
        </span>
      </div>

      <div className="my-4 h-px w-full bg-gray-200" />

      {/* Rows: icon | label | value */}
      <ul className="space-y-2 overflow-y-auto pr-1">
        {/* Appearance — now horizontal scroll */}
        <li className="flex items-start gap-3">
          <Clapperboard className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex items-start gap-3 w-full">
            <div className={labelCls}>Appearance</div>

            {/* scroller */}
            <div
              className="flex-1 overflow-x-auto"
              role="region"
              aria-label="Scene appearances"
            >
              <div className="inline-flex gap-2 pr-2 whitespace-nowrap">
                {character.scenes.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-800"
                  >
                    Scene {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex items-start gap-3 w-full">
            <div className={labelCls}>Age</div>
            <div className="text-[13px] text-gray-900">{character.age}</div>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <Globe className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex items-start gap-3 w-full">
            <div className={labelCls}>Race</div>
            <div className="text-[13px] text-gray-900">{character.race}</div>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <User className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex items-start gap-3 w-full">
            <div className={labelCls}>Gender</div>
            <div className="text-[13px] text-gray-900">{character.gender}</div>
          </div>
        </li>

        {/* Personality — now horizontal scroll */}
        <li className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex items-start gap-3 w-full">
            <div className={labelCls}>Personality</div>

            {/* scroller */}
            <div
              className="flex-1 overflow-x-auto"
              role="region"
              aria-label="Personality traits"
            >
              <div className="inline-flex gap-2 pr-2 whitespace-nowrap">
                {character.personality.map((p, i) => (
                  <span
                    key={`${p}-${i}`}
                    className="px-2 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-800"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex items-start gap-3 w-full">
            <div className={labelCls}>Description</div>
            <p className="flex-1 text-[12px] leading-relaxed text-gray-700">
              {character.description}
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
