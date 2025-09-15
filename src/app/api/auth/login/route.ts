// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/types/session";
import { ENV } from "@/config/env";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password required" },
        { status: 400 }
      );
    }
    if (!ENV.API_BASE) {
      return NextResponse.json(
        { ok: false, error: "NEXT_PUBLIC_API_BASE is not set" },
        { status: 500 }
      );
    }

    // Call your Flask endpoint
    const r = await fetch(`${ENV.API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok || !data?.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Invalid credentials" },
        { status: r.status || 401 }
      );
    }

    const user = data.user as {
      first_name: string;
      last_name: string;
      id: string;
      email: string;
      role: Role;     // NOTE: roles in your repo = "production" | "creator" | "investor" | "brand" | "admin"
      created_date: number;
      last_active: number;
    };

    // Minimal cookie session (30 days).
    // If Flask later returns a real token, put it here instead of "1".
    const res = NextResponse.json({ ok: true, user });
    const maxAge = 60 * 60 * 24 * 30;

    res.cookies.set("auth_token", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });
    res.cookies.set("role", user.role, { path: "/", maxAge });
    res.cookies.set("email", user.email, { path: "/", maxAge });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
