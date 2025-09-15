// src/hooks/admin/useAdminOverview.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { getOverview } from "@/app/api/shared/admin/getOverview";
import type { AdminOverview } from "@/types/admin";

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const resp = await getOverview();
    if (resp.ok) setData(resp.data);
    else setError(resp.error);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}
