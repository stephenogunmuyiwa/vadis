// src/hooks/useSceneAnalysis.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { analyzeScene } from "@/app/api/shared/analyzeScene";
import type { AnalyzeSceneResponse, SceneAnalysisDTO } from "@/types/project";
import type { Shot } from "@/types/film";
import { useSession } from "@/hooks/production/useSession";

function secondsToLabel(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
}
function money(n: number) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Tolerant envelope so we don't fight the current AnalyzeSceneResponse type */
type AnalyzeSceneEnvelope = AnalyzeSceneResponse & {
  scene?: SceneAnalysisDTO;
  shots?: any[];
  data?: { scene?: SceneAnalysisDTO; shots?: any[] };
  // allow any extra fields without upsetting TS
  [k: string]: any;
};

export function useSceneAnalysis(projectId: string, sceneId: string | null) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  useEffect(() => {
    if (!isLoading && !email) router.replace("/");
  }, [isLoading, email, router]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeSceneEnvelope | null>(null);

  const canQuery = !!projectId && !!sceneId;

  const refetch = useCallback(async () => {
    if (!canQuery || isLoading || !email) return;

    setLoading(true);
    setError(null);
    try {
      // Your API signature: analyzeScene(userEmail, projectId, sceneId)
      const resp = await analyzeScene(email, projectId, sceneId!);
      if (!(resp as any)?.ok) throw new Error((resp as any)?.error || "Server error");
      setData(resp as AnalyzeSceneEnvelope);
    } catch (e: any) {
      const msg = e?.message ?? "Unable to analyze scene.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [email, projectId, sceneId, canQuery, isLoading]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const meta = useMemo(() => {
    const s = (data?.scene ?? data?.data?.scene ?? data?.data) as SceneAnalysisDTO | undefined;
    if (!s) return null;
    return {
      id: s.id,
      title: s.title,
      location: s.location,
      screentime: secondsToLabel(s.screentime),
      estimateBudget: money(s.estimate_budget),
      description: s.description || "",
      characters: s.characters ?? [],
    };
  }, [data]);

  const shots = useMemo<Shot[]>(() => {
    const arr = (data?.shots ?? data?.data?.shots ?? []) as any[];
    return arr.map((s: any) => ({
      id: s.id,
      bannerUrl: s.image_url || null,
      characters: [], // not provided by API currently
      vfxAnalysis: "",
      productPlacement: "",
      short: {
        title: s.title || `Shot ${s.id}`,
        description: s.content || "",
      },
    }));
  }, [data]);

  return { loading: isLoading || loading, error, meta, shots, refetch };
}
