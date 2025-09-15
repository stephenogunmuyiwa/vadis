import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Role } from "@/types/session";

export async function GET() {
  const c = await cookies();                       // Next 15: await
  const token = c.get("auth_token")?.value;        // 👈 looks for auth_token
  const role = c.get("role")?.value as Role | undefined;
  const email = c.get("email")?.value;
  return NextResponse.json({ ok: Boolean(token && role && email), email, role });
}

export async function DELETE(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
  res.cookies.set("role", "", { path: "/", maxAge: 0 });
  res.cookies.set("email", "", { path: "/", maxAge: 0 });
  return res;
}
