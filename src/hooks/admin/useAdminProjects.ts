// src/hooks/admin/useAdminProjects.ts
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { listProjects, type ProjectSortField, type SortDir } from "@/app/api/shared/admin/listProjects";
import { removeProject } from "@/app/api/shared/admin/removeProject";
import type { AdminProject } from "@/types/admin";
import { ENV } from "@/config/env";

export type ProjectsViewMode = "table" | "grid";

export function useAdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // search & filters
  const [q, setQ] = useState("");
  const [creator, setCreator] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "unpublished" | "hidden" | "visible">("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);

  // sort & view
  const [sortField, setSortField] = useState<ProjectSortField>("updated_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [view, setView] = useState<ProjectsViewMode>("table");

  const refetch = useCallback(async () => {
    setLoading(true);
    const resp = await listProjects({ q, creator, status, dateFrom, dateTo, sortField, sortDir });
    if (resp.ok) {
      setProjects(Array.isArray(resp.data) ? resp.data : []);
      setTotal(resp.meta.total);
    } else {
      console.error(resp.error);
      setProjects([]);
      setTotal(0);
    }
    setLoading(false);
  }, [q, creator, status, dateFrom, dateTo, sortField, sortDir]);

  useEffect(() => { refetch(); }, [refetch]);

  const safeProjects = Array.isArray(projects) ? projects : [];

  const stats = useMemo(() => {
    const updatedToday = safeProjects.filter((p) => {
      const d = new Date(p.updatedAt * 1000);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;

    return { total: total || safeProjects.length, updatedToday };
  }, [safeProjects, total]);

  const remove = useCallback(async (projectId: string) => {
    const r = await removeProject(projectId);
    if (r.ok) await refetch();
    return r;
  }, [refetch]);

  const exportProjects = useCallback(async (format: "csv" | "json" = "csv") => {
    const url = new URL(`${ENV.API_BASE}/admin/system/export/projects`);
    if (q) url.searchParams.set("q", q);
    if (creator) url.searchParams.set("creator", creator);
    if (status !== "all") url.searchParams.set("status", status);
    if (dateFrom) url.searchParams.set("date_from", dateFrom);
    if (dateTo) url.searchParams.set("date_to", dateTo);
    url.searchParams.set("format", format);

    const res = await fetch(url.toString());
    const isCsv = format === "csv" && res.headers.get("content-type")?.includes("text/csv");
    const blob = await (isCsv ? res.text().then(t => new Blob([t], { type: "text/csv;charset=utf-8" })) : res.blob());
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = format === "csv" ? "projects-export.csv" : "projects-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }, [q, creator, status, dateFrom, dateTo]);

  return {
    projects: safeProjects,
    loading,
    // search & filters
    q, setQ, creator, setCreator, status, setStatus, dateFrom, setDateFrom, dateTo, setDateTo,
    // sort & view
    sortField, setSortField, sortDir, setSortDir, view, setView,
    // stats & actions
    stats, remove, exportProjects, refetch,
  };
}
