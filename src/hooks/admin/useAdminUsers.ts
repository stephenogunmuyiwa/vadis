// src/hooks/admin/useAdminUsers.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listUsers, type UserSortDir, type UserSortField } from "@/app/api/shared/admin/listUsers";
import { createUser } from "@/app/api/shared/admin/createUser";
import { toggleUserActive } from "@/app/api/shared/admin/toggleUserActive";
import type { AdminUser, Role } from "@/types/admin";
import { ENV } from "@/config/env";

export type UsersViewMode = "table" | "grid";

export function useAdminUsers() {
  // data
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // controls
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const [activeFilter, setActiveFilter] = useState<"all" | "true" | "false">("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);     // YYYY-MM-DD
  const [sortField, setSortField] = useState<UserSortField>("last_active");
  const [sortDir, setSortDir] = useState<UserSortDir>("desc");
  const [view, setView] = useState<UsersViewMode>("table");
  const [showStats, setShowStats] = useState<boolean>(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    const resp = await listUsers({
      q, role, active: activeFilter, sortField, sortDir, dateFrom, dateTo,
    });
    if (resp.ok) {
      setUsers(resp.data || []);
      setTotal(resp.meta.total);
    } else {
      console.error(resp.error);
      setUsers([]);
      setTotal(0);
    }
    setLoading(false);
  }, [q, role, activeFilter, sortField, sortDir, dateFrom, dateTo]);

  useEffect(() => { refetch(); }, [refetch]);

  const stats = useMemo(() => {
    const countsByRole = users.reduce<Record<string, number>>((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {});
    const activeCount = users.filter(u => u.active).length;
    return {
      countsByRole,
      activePct: users.length ? Math.round((activeCount / users.length) * 100) : 0,
    };
  }, [users]);

  const addUser = useCallback(async (payload: { email: string; password: string; name?: string; role: Role }) => {
    const r = await createUser(payload);
    if ((r as any).ok) await refetch();
    return r;
  }, [refetch]);

  const setActive = useCallback(async (id: string, active: boolean) => {
    const r = await toggleUserActive(id, active);
    if ((r as any).ok) await refetch();
    return r;
  }, [refetch]);

  const exportUsers = useCallback(async (format: "csv" | "json" = "csv") => {
    // Build URL with current filters/sort
    const url = new URL(`${ENV.API_BASE}/admin/system/export/users`);
    if (q) url.searchParams.set("q", q);
    if (role !== "all") url.searchParams.set("role", role);
    if (activeFilter !== "all") url.searchParams.set("active", activeFilter);
    if (dateFrom) url.searchParams.set("date_from", dateFrom);
    if (dateTo) url.searchParams.set("date_to", dateTo);
    url.searchParams.set("format", format);

    const res = await fetch(url.toString());
    const isCsv = format === "csv" && res.headers.get("content-type")?.includes("text/csv");
    const blob = await (isCsv ? res.text().then(t => new Blob([t], { type: "text/csv;charset=utf-8" })) : res.blob());
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = format === "csv" ? "users-export.csv" : "users-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }, [q, role, activeFilter, dateFrom, dateTo]);

  return {
    // data
    users, loading, total,
    // search & filters
    q, setQ, role, setRole,
    activeFilter, setActiveFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    // sort
    sortField, setSortField,
    sortDir, setSortDir,
    // view & stats
    view, setView, showStats, setShowStats, stats,
    // actions
    addUser, setActive, exportUsers,
  };
}
