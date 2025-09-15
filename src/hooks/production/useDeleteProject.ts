// src/hooks/useDeleteProject.ts
import { useCallback, useState } from "react";
import { deleteProject } from "@/app/api/shared/projects";
import type { DeleteProjectPayload, DeleteProjectResponse } from "@/types/project";

export function useDeleteProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const submit = useCallback(async (payload: DeleteProjectPayload): Promise<DeleteProjectResponse> => {
    setLoading(true);
    setError(null);
    try {
      const out = await deleteProject(payload.userEmail, payload.projectId);
      if (!out.ok) setError(out.error ?? out.message ?? "Delete failed");
      return out;
    } catch (e: any) {
      const msg = e?.message ?? "Network error";
      setError(msg);
      return { ok: false, message: msg, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, setError };
}
