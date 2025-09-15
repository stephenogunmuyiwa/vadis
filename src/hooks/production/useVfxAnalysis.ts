// hooks/useVfxAnalysis.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import getVfxAnalysis from "@/app/api/shared/getVfxAnalysis";
import type { GetVfxAnalysisParams, VfxAnalysisResponse } from "@/types/vfxAnalysis";

export function useVfxAnalysis(
  enabled: boolean,
  params: GetVfxAnalysisParams | null
) {
  const [data, setData] = useState<VfxAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [bump, setBump] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const key = useMemo(
    () => (params ? JSON.stringify(params) : "__noop__"),
    [params]
  );

  useEffect(() => {
    if (!enabled || !params) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);

    getVfxAnalysis(params, { signal: ac.signal })
      .then((resp) => setData(resp))
      .catch((err) => {
        if ((err as any)?.name !== "AbortError") setError(err as Error);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [enabled, key, bump]);

  return {
    data,
    loading,
    error,
    refetch: () => setBump((n) => n + 1),
  } as const;
}
