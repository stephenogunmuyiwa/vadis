import { ENV } from "@/config/env";
import type { ListScenesResponse } from "@/types/project";

export async function getScenes(userEmail: string, projectId: string): Promise<ListScenesResponse> {
  const url = new URL(`${ENV.API_BASE}/scenes`);
  url.searchParams.set("userEmail", userEmail);
  url.searchParams.set("projectId", projectId);

  const res = await fetch(url.toString(), { method: "GET" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || `Failed to fetch scenes (${res.status})`);
  }
  return json as ListScenesResponse;
}
