// api/getProductPlacement.ts
// NOTE: Make this import IDENTICAL to the one in getScenes.ts
// (If getScenes.ts imports from a different path/name, mirror it here.)
import { ENV } from "@/config/env";
import type {
  ProductPlacementResponse,
  ProductPlacementItem,
} from "@/types/productPlacement"; // mirror how types are imported in your codebase

export type GetProductPlacementParams = {
  userEmail: string;   // required
  projectId: string;   // required
  sceneId: string;     // required
  shotId: string;      // required
};

/**
 * Build the fully-qualified URL (handy for debugging/testing)
 */
export function buildProductPlacementURL(
  base: string,
  { userEmail, projectId, sceneId, shotId }: GetProductPlacementParams
) {
  const qs = new URLSearchParams({
    userEmail,
    projectId,
    sceneId,
    shotId,
  });
  return `${base.replace(/\/$/, "")}/shot/productPlacement?${qs.toString()}`;
}

/**
 * getProductPlacement
 * Calls: GET /shot/productPlacement?userEmail=&projectId=&sceneId=&shotId=
 * Mirrors error handling and env usage style of getScenes.ts.
 */
export async function getProductPlacement(
  params: GetProductPlacementParams,
  opts?: { signal?: AbortSignal }
): Promise<ProductPlacementResponse> {
  const { userEmail, projectId, sceneId, shotId } = params;

  if (!userEmail || !projectId || !sceneId || !shotId) {
    throw new Error("Missing userEmail, projectId, sceneId, or shotId");
  }

  const url = buildProductPlacementURL(ENV.API_BASE, params);

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
    // If getScenes.ts sets credentials, mirror it here:
    // credentials: "include",
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    // If server didn't return JSON, throw a generic error below
  }

  if (!res.ok) {
    const message =
      (data as ProductPlacementResponse | undefined)?.error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as ProductPlacementResponse;
}
