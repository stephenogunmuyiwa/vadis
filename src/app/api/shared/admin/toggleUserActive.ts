// src/app/api/shared/admin/toggleUserActive.ts
import { ENV } from "@/config/env";
import type { BasicOK } from "@/types/admin";

export async function toggleUserActive(userId: string, active: boolean): Promise<BasicOK> {
  const res = await fetch(`${ENV.API_BASE}/admin/users/${userId}/active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  const json = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, message: json?.message } : { ok: false, error: json?.error || "Failed to update status" };
}
