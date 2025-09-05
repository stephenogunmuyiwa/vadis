// src/hooks/useProjects.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ENV } from "@/config/env";
import { getProjects } from "@/api/getProjects";
import type { UserProject } from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userEmail = ENV.DEFAULT_EMAIL || "user@example.com";

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getProjects(userEmail);
      if (!resp.ok) throw new Error("Server error");
      setProjects(resp.data ?? []);
    } catch (e: any) {
      const msg = e?.message ?? "Unable to load projects.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    // Fetch when the dashboard first opens
    refetch();
  }, [refetch]);

  return { projects, loading, error, refetch };
}
