// src/app/api/shared/admin/createUser.ts
import { ENV } from "@/config/env";
import type { BasicOK, Role } from "@/types/admin";

export async function createUser(payload: { email: string; password: string; name?: string; role: Role }): Promise<BasicOK> {
  const res = await fetch(`${ENV.API_BASE}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  return res.ok ? { ok: true, message: json?.message } : { ok: false, error: json?.error || "Failed to create user" };
}
