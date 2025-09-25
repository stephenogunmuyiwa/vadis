import { Credentials, Session } from "@/types/session";

export async function login(
  credentials: Credentials
): Promise<
  | {
      ok: true;
      user: {
        first_name: string;
        last_name: string;
        id: string;
        email: string;
        role: string;
        created_date: number;
        last_active: number;
      };
    }
  | { ok: false; error: string }
> {
  const r = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  try {
    const data = await r.json();
    if (!r.ok || !data?.ok) throw new Error(data?.error || "Login failed");
    return { ok: true, user: data.user };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export async function getSession(): Promise<Session> {
  const r = await fetch("/api/session", { cache: "no-store" });
  return r.json();
}

export async function logout() {
    // console.log("Logging out - client side");
  await fetch("/api/session", { method: "DELETE" });
}