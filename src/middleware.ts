// middleware.ts  (project root or src/middleware.ts if your app lives in /src)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "production" | "creator" | "investor" | "brand" | "admin";
const ROLES: Role[] = ["production", "creator", "investor", "brand", "admin"];
const isRole = (r: string | undefined | null): r is Role =>
  !!r && (ROLES as string[]).includes(r);

// Treat these as public (no auth gate)
function isPublic(req: NextRequest) {
  const p = req.nextUrl.pathname;

  // Next internals & API
  if (
    p === "/" ||
    p.startsWith("/api") ||
    p.startsWith("/_next/static") ||
    p.startsWith("/_next/image") ||
    p === "/favicon.ico" ||
    p === "/robots.txt" ||
    p === "/sitemap.xml"
  ) return true;

  // Public asset folders you might use
  if (
    p.startsWith("/assets") ||
    p.startsWith("/images") ||
    p.startsWith("/icons") ||
    p.startsWith("/fonts")
  ) return true;

  // File extensions to always allow
  if (/\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|eot|otf)$/i.test(p)) {
    return true;
  }

  // Also bypass for prefetch & static resource fetches
  const dest = req.headers.get("sec-fetch-dest");
  if (dest && ["image", "style", "script", "font"].includes(dest)) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public & asset traffic so preloads/images/fonts don't get intercepted
  if (isPublic(req)) return NextResponse.next();

  // Your auth cookies (match what you set on login)
  const token = req.cookies.get("auth_token")?.value;
  const role  = req.cookies.get("role")?.value;

  // No session → send to login
  if (!token || !role) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // If first segment is a role, enforce it matches the user's role
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isRole(first) && first !== role) {
    const url = req.nextUrl.clone();
    url.pathname = `/${role}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except the hard-coded Next assets (we still early-return more in code)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
