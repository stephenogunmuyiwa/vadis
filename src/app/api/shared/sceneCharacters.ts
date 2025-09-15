import { SceneCharactersAPI } from "@/types/character";

export type SceneCharactersParams = {
  userEmail: string;
  projectId: string;
  sceneId: string | number;
  force?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""; // "" means same-origin

export async function fetchSceneCharacters(
  { userEmail, projectId, sceneId, force = false }: SceneCharactersParams,
  opts?: { signal?: AbortSignal }
): Promise<Response & { json: () => Promise<SceneCharactersAPI> }> {
  const params = new URLSearchParams({
    userEmail,
    projectId,
    sceneId: String(sceneId),
    force: String(force),
  });

  const res = await fetch(`${API_BASE}/scene/characters?${params.toString()}`, {
    signal: opts?.signal,
  });

  return res as any;
}
