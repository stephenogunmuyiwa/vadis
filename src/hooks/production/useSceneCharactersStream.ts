import { useEffect, useMemo, useRef, useState } from "react";
import { fetchSceneCharacters } from "@/app/api/shared/sceneCharacters";
import {
  CharacterProfile,
  SceneCharactersAPI,
  SuggestedActor,
} from "@/types/character";
import { SceneLite } from "@/types/scene";

export type StreamState = {
  charactersMap: Map<string, CharacterProfile>;
  characters: CharacterProfile[];
  isLoading: boolean;
  processed: number;
  total: number;
  progressPct: number;
};

const normalizeName = (raw: string) =>
  raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const titleCase = (s?: string | null) =>
  (s || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

const usd = (n?: number | null) =>
  typeof n === "number" && isFinite(n)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
    : "—";

// heuristic: bump risk if the backend mentions controversy/backlash
const computeRisk = (prop?: string): "Low" | "Medium" | "High" => {
  const t = (prop || "").toLowerCase();
  if (!t.trim()) return "Low";
  if (t.includes("backlash") || t.includes("controvers")) return "Medium";
  return "Low";
};

const toSuggested = (sa?: SceneCharactersAPI["characters"][number]["suggested_actor"]): SuggestedActor | undefined => {
  if (!sa || !sa.actor_name) return undefined;

  const traits = sa.matching_traits || [];
  const traitLine =
    traits.length > 0 ? `Matches ${traits.length} trait${traits.length > 1 ? "s" : ""}: ${traits.join(", ")}` : "";

  const propaganda = (sa.recent_propaganda || "").trim();
  const reason = [traitLine, propaganda].filter(Boolean).join(" • ");

  return {
    name: titleCase(sa.actor_name),
    avatarUrl: sa.image_url || null,
    note: (sa.movie_personality && sa.movie_personality.length > 0)
      ? `Persona: ${sa.movie_personality.join(", ")}`
      : undefined,
    risk: computeRisk(sa.recent_propaganda),
    reason: reason || "Suggested based on character traits.",
    available: "Available", // backend has no discrete availability yet
    fee: usd(sa.average_amount_charged_to_film),
    age: 0, // unknown
    recentWorks: (sa.movies_played_in || []).map(titleCase),

    // extras for internal tie-break
    matchCount: sa.matching_traits_count ?? traits.length,
    matchingTraits: traits,
    moviePersonality: sa.movie_personality || [],
    moviesPlayedIn: sa.movies_played_in || [],
  };
};

export function useSceneCharactersStream(args: {
  scenes: SceneLite[] | undefined;
  userEmail: string;
  projectId: string;
  enabled?: boolean;
  concurrency?: number;
  force?: boolean;
}) {
  const {
    scenes,
    userEmail,
    projectId,
    enabled = true,
    concurrency = 1,
    force = false,
  } = args;

  const [charactersMap, setCharactersMap] = useState<
    Map<string, CharacterProfile>
  >(new Map());
  const [processed, setProcessed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const total = scenes?.length ?? 0;
  const progressPct = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;

  const toProfile = (
    item: SceneCharactersAPI["characters"][number],
    sceneOrdinal: number
  ): CharacterProfile => {
    const role: CharacterProfile["role"] =
      (item.level ?? "").toLowerCase() === "main" ? "Lead" : "Supporting";

    const id = normalizeName(item.name);

    return {
      id,
      name: item.name.replace(/\s+/g, " ").trim(),
      role,
      scenes: [sceneOrdinal],
      age: item.estimated_age ?? 0,
      race: item.race || "—",
      gender: item.gender || "—",
      personality: item.personality ?? [],
      description: item.description || "—",
      suggestedActor: toSuggested(item.suggested_actor),
    };
  };

  const betterSuggestion = (a?: SuggestedActor, b?: SuggestedActor) => {
    if (a && b) {
      const am = a.matchCount ?? 0;
      const bm = b.matchCount ?? 0;
      return bm > am ? b : a;
    }
    return a ?? b;
  };

  const mergeProfiles = (a: CharacterProfile, b: CharacterProfile): CharacterProfile => {
    const scenesSet = new Set<number>([...a.scenes, ...b.scenes]);
    const personalitySet = new Set<string>([...a.personality, ...b.personality]);
    const role = a.role === "Lead" || b.role === "Lead" ? "Lead" : "Supporting";
    return {
      ...a,
      role,
      scenes: Array.from(scenesSet).sort((x, y) => x - y),
      age: a.age || b.age,
      race: a.race !== "—" ? a.race : b.race,
      gender: a.gender !== "—" ? a.gender : b.gender,
      description: a.description !== "—" ? a.description : b.description,
      personality: Array.from(personalitySet),
      suggestedActor: betterSuggestion(a.suggestedActor, b.suggestedActor),
    };
  };

  useEffect(() => {
    if (!enabled) return;
    if (!scenes || scenes.length === 0) return;

    setIsLoading(true);
    setProcessed(0);
    setCharactersMap(new Map());

    const controller = new AbortController();
    abortRef.current = controller;

    const getSceneId = (s: SceneLite) =>
      String(s.id ?? s.sceneId ?? s.scene_id ?? "");

    const getOrdinal = (s: SceneLite, i: number) =>
      Number(s.number ?? s.no ?? s.index ?? i + 1) || i + 1;

    const queue = scenes.map((s, i) => ({
      id: getSceneId(s),
      ordinal: getOrdinal(s, i),
    }));

    const worker = async (jobs: typeof queue) => {
      for (const job of jobs) {
        if (!job.id) {
          setProcessed((c) => c + 1);
          continue;
        }
        try {
          const res = await fetchSceneCharacters(
            { userEmail, projectId, sceneId: job.id, force },
            { signal: controller.signal }
          );
          if (res.ok) {
            const data = (await res.json()) as SceneCharactersAPI;
            if (data?.ok && Array.isArray(data.characters)) {
              setCharactersMap((prev) => {
                const next = new Map(prev);
                data.characters.forEach((c) => {
                  const mapKey = normalizeName(c.name);
                  const incoming = toProfile(c, job.ordinal);
                  const existing = next.get(mapKey);
                  next.set(mapKey, existing ? mergeProfiles(existing, incoming) : incoming);
                });
                return next;
              });
            }
          }
        } catch {
          // ignore (abort or network), continue
        } finally {
          setProcessed((c) => c + 1);
        }
      }
    };

    const start = async () => {
      if (concurrency <= 1) {
        await worker(queue);
      } else {
        const lanes = Array.from({ length: concurrency }, (_, lane) =>
          worker(queue.filter((_, idx) => idx % concurrency === lane))
        );
        await Promise.all(lanes);
      }
      setIsLoading(false);
    };

    start();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, scenes?.length, userEmail, projectId, concurrency, force]);

  const characters = useMemo(
    () => Array.from(charactersMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    [charactersMap]
  );

  return { charactersMap, characters, isLoading, processed, total, progressPct } as StreamState;
}
