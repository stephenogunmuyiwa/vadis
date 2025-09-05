import { ENV } from "@/config/env";
import type { AnalyzeSceneResponse } from "@/types/project";

export async function analyzeScene(
  userEmail: string,
  projectId: string,
  sceneId: string
): Promise<AnalyzeSceneResponse> {
  const url = new URL(`${ENV.API_BASE}/scene/analyze`);
  url.searchParams.set("userEmail", userEmail);
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("sceneId", sceneId);

  // No timeout: wait until server responds
  const res = await fetch(url.toString(), { method: "GET" });

  let json: any = {};
  try {
    json = await res.json();
  } catch { /* ignore */ }

  if (!res.ok) {
    throw new Error(json?.error || `Failed to analyze scene (${res.status})`);
  }
  return json as AnalyzeSceneResponse;
}
