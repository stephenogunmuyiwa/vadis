// src/hooks/useScenes.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getScenes } from "@/app/api/shared/getScenes"; // keep your existing import path
import type { SceneRow } from "@/types/project";
import { useSession } from "@/hooks/production/useSession";

export function useScenes(projectId: string) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  useEffect(() => {
    if (!isLoading && !email) router.replace("/");
  }, [isLoading, email, router]);

  const [scenes, setScenes] = useState<SceneRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!projectId || isLoading || !email) return;

    setLoading(true);
    setError(null);
    try {
      const resp = await getScenes(email, projectId);
      if (!resp.ok) throw new Error(resp?.error || "Server error");

      // keep your existing numeric sort by id
      const sorted = [...(resp.data ?? [])].sort(
        (a, b) => Number(a.id) - Number(b.id)
      );
      setScenes(sorted);
    } catch (e: any) {
      const msg = e?.message ?? "Unable to load scenes.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [projectId, email, isLoading]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // local helper to mark a scene analyzed
  const markAnalyzed = useCallback((sceneId: string, value = true) => {
    setScenes(prev =>
      prev.map(s => (s.id === sceneId ? { ...s, is_analyzed: value } : s))
    );
  }, []);

  return { scenes, loading: isLoading || loading, error, refetch, markAnalyzed };
}
