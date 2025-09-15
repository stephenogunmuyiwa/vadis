// src/app/api/shared/admin/getOverview.ts
import { ENV } from "@/config/env";
import type { AdminOverview } from "@/types/admin";

type SActiveUser = {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  last_active?: number;     // float seconds
  created_date?: number;
  active?: boolean;
};

type SBrand = {
  brand_name: string;
  items: number;
  last_added: number;       // float seconds
};

type SProject = {
  id: string;
  title: string;
  creator?: string;         // email or name
  created_date?: number;
  last_open?: number;       // float seconds
  updated_at?: number;      // alternative
};

type SResp = {
  ok: boolean;
  totals: {
    users?: number;
    projects?: number;
    brands?: number;
    users_by_role?: Partial<Record<"production"|"creator"|"investor"|"brand"|"admin", number>>;
  };
  recent?: {
    active_users?: SActiveUser[];
    brands?: SBrand[];
    projects?: SProject[];
  };
  error?: string;
};

export async function getOverview(): Promise<
  | { ok: true; data: AdminOverview }
  | { ok: false; error: string }
> {
  const res = await fetch(`${ENV.API_BASE}/admin/overview`, { method: "GET" });
  const json = (await res.json().catch(() => ({}))) as SResp;

  if (!res.ok || json.ok === false) {
    return { ok: false, error: json?.error || "Failed to load overview" };
  }

  const byRole = json.totals?.users_by_role || {};
  const totalsUsers = {
    production: byRole.production ?? 0,
    creator: byRole.creator ?? 0,
    investor: byRole.investor ?? 0,
    brand: byRole.brand ?? 0,
    all: json.totals?.users ?? (
      (byRole.production ?? 0) +
      (byRole.creator ?? 0) +
      (byRole.investor ?? 0) +
      (byRole.brand ?? 0) +
      (byRole.admin ?? 0)
    ),
  };

  const recentActiveUsers = (json.recent?.active_users ?? []).map((u) => ({
    id: u.id,
    name: [u.first_name?.trim(), u.last_name?.trim()].filter(Boolean).join(" ") || u.username || u.email,
    email: u.email,
    role: u.role as AdminOverview["recentActiveUsers"][number]["role"],
    lastActive: Math.floor(Number(u.last_active ?? u.created_date ?? 0)),
  }));

  const recentBrands = (json.recent?.brands ?? []).map((b) => ({
    id: `${b.brand_name}-${Math.floor(Number(b.last_added))}`, // synth id (server has no id)
    name: b.brand_name,
    items: b.items,
    createdAt: Math.floor(Number(b.last_added)),
  }));

  const recentProjects = (json.recent?.projects ?? []).map((p) => {
    const updatedSec =
      (typeof p.updated_at === "number" && p.updated_at) ||
      (typeof p.last_open === "number" && p.last_open) ||
      (typeof p.created_date === "number" && p.created_date) || 0;

    return {
      id: p.id,
      title: p.title,
      creatorName: p.creator || "—",
      updatedAt: Math.floor(Number(updatedSec)),
    };
  });

  const data: AdminOverview = {
    totals: {
      users: totalsUsers,
      projects: json.totals?.projects ?? 0,
      brands: json.totals?.brands ?? 0,
    },
    recentActiveUsers,
    recentBrands,
    recentProjects,
  };

  return { ok: true, data };
}
