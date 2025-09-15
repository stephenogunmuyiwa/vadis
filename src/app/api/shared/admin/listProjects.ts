// src/app/api/shared/admin/listProjects.ts
import { ENV } from "@/config/env";
import type { AdminProject } from "@/types/admin";

export type ProjectSortField = "updated_at" | "title";
export type SortDir = "asc" | "desc";

type ServerProject = {
  id: string;
  title: string;
  creator?: string;          // email or name
  creator_name?: string;
  last_open?: number;        // float seconds
  updated_at?: number;       // alt field name
  created_date?: number;     // fallback
  is_published?: boolean;    // status
  visibility?: boolean;      // status
};

type ServerListResp = {
  ok?: boolean;
  projects?: ServerProject[];
  data?: ServerProject[];
  page?: number;
  per_page?: number;
  total?: number;
  count?: number;
  error?: string;
};

export async function listProjects(params?: {
  q?: string;
  creator?: string;
  status?: "all" | "published" | "unpublished" | "hidden" | "visible";
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  sortField?: ProjectSortField;
  sortDir?: SortDir;
  page?: number;
  perPage?: number;
}) {
  const url = new URL(`${ENV.API_BASE}/admin/projects`);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.creator) url.searchParams.set("creator", params.creator);
  if (params?.status && params.status !== "all") url.searchParams.set("status", params.status);
  if (params?.dateFrom) url.searchParams.set("date_from", params.dateFrom);
  if (params?.dateTo) url.searchParams.set("date_to", params.dateTo);
  if (params?.sortField) url.searchParams.set("sort", `${params.sortField}:${params.sortDir ?? "desc"}`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.perPage) url.searchParams.set("per_page", String(params.perPage));

  const res = await fetch(url.toString(), { method: "GET" });
  const json = (await res.json().catch(() => ({}))) as ServerListResp;

  if (!res.ok || json.ok === false) {
    return { ok: false as const, error: json?.error || "Failed to load projects" };
  }

  const raw = Array.isArray(json.data) ? json.data : Array.isArray(json.projects) ? json.projects : [];

  const data: AdminProject[] = raw.map((p) => {
    const updatedSec =
      (typeof p.updated_at === "number" && p.updated_at) ||
      (typeof p.last_open === "number" && p.last_open) ||
      (typeof p.created_date === "number" && p.created_date) ||
      0;

    return {
      id: p.id,
      title: p.title,
      creatorName: p.creator_name || p.creator || "—",
      updatedAt: Math.floor(Number(updatedSec)),
    };
  });

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
