"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ENV } from "@/config/env";
import { analyzeScene } from "@/api/analyzeScene";
import type { AnalyzeSceneResponse, SceneAnalysisDTO } from "@/types/project";
import type { Shot } from "@/types/film";

function secondsToLabel(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
}
function money(n: number) {
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

export function useSceneAnalysis(projectId: string, sceneId: string | null) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SceneAnalysisDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userEmail = ENV.DEFAULT_EMAIL || "user@example.com";

  const refetch = useCallback(async () => {
    if (!projectId || !sceneId) return;
    setLoading(true);
    setError(null);
    try {
      const resp: AnalyzeSceneResponse = await analyzeScene(
        userEmail,
        projectId,
        sceneId
      );
      if (!resp.ok || !resp.data) {
        throw new Error(resp.error || "Server error");
      }
      setData(resp.data);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to analyze scene.";
      setError(msg);
      toast.error(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [userEmail, projectId, sceneId]);

  useEffect(() => {
    // fire when user selects a scene
    refetch();
  }, [refetch]);

  // Map server data into your UI types for meta + shots
  const meta = useMemo(() => {
    if (!data) return null;
    return {
      title: data.title,
      description: data.description,
      estimated: secondsToLabel(data.screentime),
      cost: money(data.estimate_budget),
      location: data.location,
    };
  }, [data]);

  const shots: Shot[] = useMemo(() => {
    if (!data) return [];
    return data.shots.map((s) => ({
      id: s.id,
      bannerUrl: s.image_url || null,
      characters: [],                 // server doesn't provide; keep empty for now
      vfxAnalysis: "",                // placeholder
      productPlacement: "",           // placeholder
      short: {
        title: s.title || `Shot ${s.id}`,
        description: s.content || "",
      },
    }));
  }, [data]);

  return { loading, error, meta, shots, refetch };
}
