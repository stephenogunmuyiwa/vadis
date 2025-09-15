// src/app/api/shared/admin/removeProject.ts
import { ENV } from "@/config/env";
import type { BasicOK } from "@/types/admin";

export async function removeProject(projectId: string): Promise<BasicOK> {
  const res = await fetch(`${ENV.API_BASE}/admin/projects/${projectId}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, message: json?.message } : { ok: false, error: json?.error || "Failed to remove project" };
}
