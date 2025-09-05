// src/api/getProjects.ts
import { ENV } from "@/config/env";
import type { ListProjectsResponse } from "@/types/project";

export async function getProjects(userEmail: string): Promise<ListProjectsResponse> {
  const url = new URL(`${ENV.API_BASE}/projects`);
  url.searchParams.set("userEmail", userEmail);

  const res = await fetch(url.toString(), {
    method: "GET",
    // credentials: "include", // enable if your API needs cookies (then set CORS accordingly)
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || `Failed to fetch projects (${res.status})`);
  }
  return json as ListProjectsResponse;
}
