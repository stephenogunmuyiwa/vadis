// src/hooks/useScenes.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ENV } from "@/config/env";
import { getScenes } from "@/api/getScenes";
import type { SceneRow } from "@/types/project";

export function useScenes(projectId: string) {
  const [scenes, setScenes] = useState<SceneRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userEmail = ENV.DEFAULT_EMAIL || "user@example.com";

  const refetch = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await getScenes(userEmail, projectId);
      if (!resp.ok) throw new Error(resp?.error || "Server error");

      // ✅ sort ascending numerically by id
      const sorted = [...(resp.data ?? [])].sort((a, b) => {
        return Number(a.id) - Number(b.id);
      });

      setScenes(sorted);
    } catch (e: any) {
      const msg = e?.message ?? "Unable to load scenes.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userEmail, projectId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { scenes, loading, error, refetch };
}
