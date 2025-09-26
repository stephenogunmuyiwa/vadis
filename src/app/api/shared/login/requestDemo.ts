import type { RequestDemoPayload, ApiResp } from "@/types/login/requestDemo";
import { ENV } from "@/config/env";

const BASE = ENV.API_BASE; 
// e.g. "https://your-flask-host" (leave "" if same origin/proxy)

export async function requestDemo(payload: RequestDemoPayload): Promise<ApiResp> {
  const res = await fetch(`${BASE}/requests/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // credentials: "include", // <- uncomment if you need cookies
  });

  // Flask returns 201 on success, 400/500 otherwise.
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json?.error || "Failed to submit request" };
  return json as ApiResp;
}
