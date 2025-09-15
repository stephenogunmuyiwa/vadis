// api/getVfxAnalysis.ts
import { ENV } from "@/config/env";

import type {
  VfxAnalysisResponse,
  GetVfxAnalysisParams,
} from "@/types/vfxAnalysis";

export function buildVfxAnalysisURL(base: string, p: GetVfxAnalysisParams) {
  const qs = new URLSearchParams({
    userEmail: p.userEmail,
    projectId: p.projectId,
    sceneId: p.sceneId,
    shotId: p.shotId,
  });
  return `${base.replace(/\/$/, "")}/shot/vfxAnalysis?${qs.toString()}`;
}

export default async function getVfxAnalysis(
  params: GetVfxAnalysisParams,
  opts?: { signal?: AbortSignal }
): Promise<VfxAnalysisResponse> {
  const { userEmail, projectId, sceneId, shotId } = params;
  if (!userEmail || !projectId || !sceneId || !shotId) {
    throw new Error("Missing userEmail, projectId, sceneId, or shotId");
    }

  const url = buildVfxAnalysisURL(ENV.API_BASE, params);
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
    // If getScenes.ts uses credentials, mirror it:
    // credentials: "include",
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    /* ignore parse errors; fall back to generic message below */
  }

  if (!res.ok) {
    const message =
      (data as VfxAnalysisResponse | undefined)?.error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as VfxAnalysisResponse;
}
