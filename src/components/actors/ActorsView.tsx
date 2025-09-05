"use client";

import { useMemo, useState } from "react";
import SectionOneHeader from "@/components/sections/SectionOneHeader";
import CharacterDetail, {
  CharacterProfile,
} from "@/components/actors/CharacterDetail";
import SuggestedActorCard from "@/components/actors/SuggestedActorCard";

type Suggested = {
  name: string;
  avatarUrl?: string | null;
  note?: string;
  risk: "Low" | "Medium" | "High";
  reason: string;
  available: boolean | "Available" | "On hold" | "Busy";
  fee: string;
  age: number;
  recentWorks: string[];
};

export default function ActorsView({
  projectCreatedISO,
  projectCreatedLabel,
}: {
  projectCreatedISO: string;
  projectCreatedLabel: string;
}) {
  // --- Characters (replace with your extraction) ---
  const [characters] = useState<CharacterProfile[]>([
    {
      id: "c1",
      name: "Ava Cole",
      role: "Lead",
      scenes: [1, 2, 5, 9, 12, 18],
      age: 29,
      race: "Black",
      gender: "Female",
      personality: ["resilient", "driven", "empathetic"],
      description:
        "Ava is a data journalist who uncovers a corporate cover-up. Calm under pressure with a dry wit.",
    },
    {
      id: "c2",
      name: "Ben Ortega",
      role: "Supporting",
      scenes: [1, 3, 6, 10, 14],
      age: 34,
      race: "Latino",
      gender: "Male",
      personality: ["loyal", "protective", "wary"],
      description:
        "A paramedic and Ava’s confidant. Pragmatic, protective, skeptical but dutiful.",
    },
    {
      id: "c3",
      name: "Captain Ruiz",
      role: "Supporting",
      scenes: [4, 8, 11],
      age: 52,
      race: "White",
      gender: "Male",
      personality: ["authoritative", "stoic"],
      description:
        "Veteran precinct captain who prioritizes order; reveals personal stakes when pushed.",
    },
  ]);

  // --- Suggestion pools per character (cycle on refresh) ---
  const suggestionPool: Record<string, Suggested[]> = {
    c1: [
      {
        name: "Tessa Thompson",
        avatarUrl: null,
        note: "Strong presence; range fits investigative drama.",
        risk: "Low",
        reason: "Proven lead in grounded sci-fi and drama; strong press draw.",
        available: "Available",
        fee: "$15k / day",
        age: 41,
        recentWorks: [
          "Passing (2021)",
          "Creed III (2023)",
          "Men in Black: International (2019)",
        ],
      },
      {
        name: "Kiki Layne",
        avatarUrl: null,
        note: "Intense yet empathetic; great for grounded thrillers.",
        risk: "Medium",
        reason:
          "Rising profile; excellent dramatic chops; scheduling may be tight.",
        available: "On hold",
        fee: "$10k / day",
        age: 33,
        recentWorks: [
          "If Beale Street Could Talk (2018)",
          "The Old Guard (2020)",
          "Don't Worry Darling (2022)",
        ],
      },
    ],
    c2: [
      {
        name: "Diego Luna",
        avatarUrl: null,
        note: "Grounded, empathetic performances; protective energy.",
        risk: "Low",
        reason: "Bankable; aligns with character tonality; audience goodwill.",
        available: true,
        fee: "$20k / day",
        age: 45,
        recentWorks: [
          "Andor (2022–)",
          "Rogue One (2016)",
          "Narcos: Mexico (2018–2021)",
        ],
      },
      {
        name: "Gabriel Luna",
        avatarUrl: null,
        note: "Quiet intensity; reads pragmatic on screen.",
        risk: "Medium",
        reason: "Good match; slightly lower recognition; strong TV presence.",
        available: "Available",
        fee: "$8k / day",
        age: 40,
        recentWorks: [
          "The Last of Us (2023)",
          "Agents of S.H.I.E.L.D. (2013–2020)",
        ],
      },
    ],
    c3: [
      {
        name: "Bryan Cranston",
        avatarUrl: null,
        note: "Authoritative with nuance; moral conflict reads well.",
        risk: "Low",
        reason: "Seasoned, versatile; elevates procedural stakes.",
        available: "Busy",
        fee: "$35k / day",
        age: 69,
        recentWorks: [
          "Your Honor (2020–2023)",
          "Trumbo (2015)",
          "Breaking Bad (2008–2013)",
        ],
      },
      {
        name: "J.K. Simmons",
        avatarUrl: null,
        note: "Commanding presence; stoic yet layered.",
        risk: "Low",
        reason: "Highly dependable; instantly authoritative on screen.",
        available: "Available",
        fee: "$25k / day",
        age: 70,
        recentWorks: [
          "Whiplash (2014)",
          "Being the Ricardos (2021)",
          "Invincible (2021–)",
        ],
      },
    ],
  } as const;
  type RoleFilter = "All" | "Lead" | "Supporting";

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");

  const roleCounts = useMemo(
    () => ({
      All: characters.length,
      Lead: characters.filter((c) => c.role === "Lead").length,
      Supporting: characters.filter((c) => c.role === "Supporting").length,
    }),
    [characters]
  );

  const displayed = useMemo(
    () =>
      roleFilter === "All"
        ? characters
        : characters.filter((c) => c.role === roleFilter),
    [characters, roleFilter]
  );

  // track current suggestion index per character
  const [suggIndex, setSuggIndex] = useState<Record<string, number>>({});
  const currentSuggestionFor = (id: string): Suggested => {
    const pool = suggestionPool[id];
    if (!pool || pool.length === 0) {
      // fully-typed fallback object
      return {
        name: "—",
        avatarUrl: null,
        note: "No suggestion available.",
        risk: "Low",
        reason: "—",
        available: "On hold",
        fee: "—",
        age: 0,
        recentWorks: [],
      };
    }
    const idx = suggIndex[id] ?? 0;
    return pool[idx % pool.length];
  };
  const handleResuggest = (id: string) =>
    setSuggIndex((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
  const handleAccept = (id: string) =>
    console.log("Accepted suggestion for", id, currentSuggestionFor(id));

  // --- UI ---
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Section 1: project header */}
      <SectionOneHeader
        title="Actors"
        createdISO={projectCreatedISO}
        createdLabel={projectCreatedLabel}
        note="For better output of the AI result, the script should follow the Hollywood standard."
      />
      {/* Filter row: selectable pills (no bg/border/shadow on the section) */}
      <section className="px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", "Lead", "Supporting"] as const).map((role) => {
            const active = roleFilter === role;
            const count =
              role === "All"
                ? roleCounts.All
                : roleCounts[role as Exclude<RoleFilter, "All">] ?? 0;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={[
                  "h-8 px-3 rounded-full text-[12px] font-medium inline-flex items-center gap-2",
                  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                  active
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300",
                ].join(" ")}
                aria-pressed={active}
                title={`${role}`}
              >
                {/* leading count inside the pill */}
                <span
                  className={[
                    "inline-flex items-center justify-center rounded-full text-[11px] font-semibold px-1",
                    "h-5 min-w-[20px]",
                    active
                      ? "bg-white text-gray-900"
                      : "bg-white/70 text-gray-900",
                  ].join(" ")}
                >
                  {count}
                </span>
                {role}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: centered, scrollable vertical list */}
      <section className="flex-1 min-h-0 px-4 sm:px-6 py-4 overflow-y-auto">
        <div className="flex flex-col gap-8 items-stretch">
          {displayed.map((ch) => {
            const suggestion = currentSuggestionFor(ch.id);
            return (
              <div
                key={ch.id}
                className="w-full max-w-[1100px] mx-auto flex gap-6 items-stretch"
              >
                {/* Left: character details in white rounded container */}
                <div className="flex-1 min-w-0">
                  <CharacterDetail character={ch} />
                </div>

                {/* Right: suggested actor card (fixed 300x300-ish) */}
                <SuggestedActorCard
                  actor={suggestion}
                  onAccept={() => handleAccept(ch.id)}
                  onResuggest={() => handleResuggest(ch.id)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
