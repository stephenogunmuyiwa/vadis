// src/api/projects.ts
import { ENV } from "@/config/env";
import type { DeleteProjectResponse } from "@/types/project";

export async function deleteProject(
  userEmail: string,
  projectId: string
): Promise<DeleteProjectResponse> {
  const res = await fetch(`${ENV.API_BASE}/project/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail, projectId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Delete failed");
  }

  return (await res.json()) as DeleteProjectResponse;
}
