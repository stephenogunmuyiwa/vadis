// src/hooks/useProjects.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getProjects } from "@/app/api/shared/getProjects"; // keep your existing import path
import type { UserProject } from "@/types/project";
import { useSession } from "@/hooks/production/useSession";

export function useProjects() {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  useEffect(() => {
    if (!isLoading && !email) router.replace("/");
  }, [isLoading, email, router]);

  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (isLoading || !email) return;

    setLoading(true);
    setError(null);
    try {
      const resp = await getProjects(email);
      if (!resp.ok) throw new Error( "Server error");
      setProjects(resp.data ?? []);
    } catch (e: any) {
      const msg = e?.message ?? "Unable to load projects.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [email, isLoading]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { projects, loading: isLoading || loading, error, refetch };
}
