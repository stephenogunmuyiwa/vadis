// src/app/api/shared/admin/listUsers.ts
import { ENV } from "@/config/env";
import type { AdminUser } from "@/types/admin";

export type UserSortField = "last_active" | "name" | "role";
export type UserSortDir = "asc" | "desc";

type ServerUser = {
  id: string;
  email: string;
  role: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  last_active?: number;     // may be float seconds
  active?: boolean;
  created_date?: number;
};

type ServerListResp = {
  ok?: boolean;
  users?: ServerUser[];
  data?: ServerUser[];
  page?: number;
  per_page?: number;
  total?: number;
  count?: number;
  error?: string;
};

export async function listUsers(params?: {
  q?: string;
  role?: string | "all";
  active?: "all" | "true" | "false";
  sortField?: UserSortField;
  sortDir?: UserSortDir;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  page?: number;
  perPage?: number;
}) {
  const url = new URL(`${ENV.API_BASE}/admin/users`);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.role && params.role !== "all") url.searchParams.set("role", params.role);
  if (params?.active && params.active !== "all") url.searchParams.set("active", params.active);
  if (params?.sortField) url.searchParams.set("sort", `${params.sortField}:${params.sortDir ?? "desc"}`);
  if (params?.dateFrom) url.searchParams.set("date_from", params.dateFrom);
  if (params?.dateTo) url.searchParams.set("date_to", params.dateTo);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.perPage) url.searchParams.set("per_page", String(params.perPage));

  const res = await fetch(url.toString(), { method: "GET" });
  const json = (await res.json().catch(() => ({}))) as ServerListResp;

  if (!res.ok || json.ok === false) {
    return { ok: false as const, error: json?.error || "Failed to load users" };
  }

  const raw = Array.isArray(json.data) ? json.data : Array.isArray(json.users) ? json.users : [];

  const data: AdminUser[] = raw.map((u) => ({
    id: u.id,
    name: [u.first_name?.trim(), u.last_name?.trim()].filter(Boolean).join(" ") || u.username || u.email,
    email: u.email,
    role: u.role as AdminUser["role"],
    active: u.active ?? true,
    lastActive: Math.floor(Number(u.last_active ?? u.created_date ?? 0)),
  }));

  return {
    ok: true as const,
    data,
    meta: {
      page: json.page ?? 1,
      per_page: json.per_page ?? data.length,
      total: json.total ?? json.count ?? data.length,
    },
  };
}
