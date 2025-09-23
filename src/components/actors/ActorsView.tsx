"use client";

import { useMemo, useState } from "react";
import SectionOneHeader from "@/components/sections/SectionOneHeader";
import CharacterDetail from "@/components/actors/CharacterDetail";
import SuggestedActorCard from "@/components/actors/SuggestedActorCard";
import { useScenes } from "@/hooks/production/useScenes";
import { useSceneCharactersStream } from "@/hooks/production/useSceneCharactersStream";
import { CharacterProfile, suggested_actor } from "@/types/character";

type RoleFilter = "All" | "Lead" | "Supporting";

export default function ActorsView({
  projectCreatedISO,
  projectCreatedLabel,
  projectId,
  userEmail,
}: {
  projectCreatedISO: string;
  projectCreatedLabel: string;
  projectId: string;
  userEmail: string;
}) {
  const { scenes, loading: loadingScenes } = useScenes(projectId);

  const stream = useSceneCharactersStream({
    scenes,
    userEmail,
    projectId,
    enabled: !loadingScenes,
    concurrency: 1,
    force: false,
  });

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");

  const roleCounts = useMemo(
    () => ({
      All: stream.characters.length,
      Lead: stream.characters.filter((c) => c.role === "Lead").length,
      Supporting: stream.characters.filter((c) => c.role === "Supporting")
        .length,
    }),
    [stream.characters]
  );

  const displayed = useMemo(
    () =>
      roleFilter === "All"
        ? stream.characters
        : stream.characters.filter((c) => c.role === roleFilter),
    [stream.characters, roleFilter]
  );

  const fallbackSuggestion: suggested_actor = {
    name: "—",
    avatarUrl: null,
    risk: "Low",
    fee: "—",
    age: 0,
    recentWorks: [],
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <SectionOneHeader
        title="Actors"
        createdISO={projectCreatedISO}
        createdLabel={projectCreatedLabel}
        note="Characters load progressively as scenes are analyzed."
      />

      {/* Progress & filters */}
      <section className="px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="h-2 w-[160px] bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-[width] duration-500"
                style={{ width: `${stream.progressPct}%` }}
                aria-valuenow={stream.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>
            <div className="text-[12px] text-gray-700">
              {loadingScenes
                ? "Loading scenes…"
                : stream.isLoading
                ? `Processing scenes: ${stream.processed}/${stream.total}`
                : `Completed: ${stream.total}/${stream.total}`}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(["All", "Lead", "Supporting"] as const).map((role) => {
              const active = roleFilter === role;
              const count =
                role === "All"
                  ? roleCounts.All
                  : (roleCounts as any)[role] ?? 0;
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
        </div>
      </section>

      {/* List */}
      <section className="flex-1 min-h-0 px-4 sm:px-6 py-4 overflow-y-auto">
        {loadingScenes && (
          <div className="text-[13px] text-gray-600">Loading scenes…</div>
        )}
        {!loadingScenes &&
          stream.characters.length === 0 &&
          stream.isLoading && (
            <div className="text-[13px] text-gray-600">
              Fetching characters from first scene…
            </div>
          )}

        <div className="flex flex-col gap-8 items-stretch">
          {displayed.map((ch) => {
            const suggestion: suggested_actor =
              ch.suggested_actor ?? fallbackSuggestion;
            console.log("boom", suggestion);
            return (
              <div
                key={ch.id}
                className="w-full max-w-[1100px] mx-auto flex gap-6 items-stretch"
              >
                <div className="flex-1 min-w-0">
                  <CharacterDetail character={ch} />
                </div>
                <SuggestedActorCard
                  actor={suggestion}
                  // onAccept={() =>
                  //   console.log(
                  //     "Accepted suggestion for",
                  //     ch.name,
                  //     suggestion.name
                  //   )
                  // }
                  onResuggest={() => console.log("Re-suggest for", ch.name)}
                />
              </div>
            );
          })}
        </div>

        {!stream.isLoading &&
          !loadingScenes &&
          stream.characters.length > 0 && (
            <div className="mt-6 text-[12px] text-gray-500 text-center">
              Loaded {stream.characters.length} character
              {stream.characters.length === 1 ? "" : "s"} across {stream.total}{" "}
              scene{stream.total === 1 ? "" : "s"}.
            </div>
          )}
      </section>
    </div>
  );
}
