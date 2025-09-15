// src/hooks/useCreateProject.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { createProject } from "@/app/api/shared/createProject"; // keep your existing import path
import type { CreateProjectPayload, CreateProjectResponse } from "@/types/project";
import { useSession } from "@/hooks/production/useSession";

type SubmitArgs = { title: string; file: File };
type SubmitResult =
  | { ok: true; projectId: string; response: CreateProjectResponse }
  | { ok: false; error: string };

export function useCreateProject() {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !email) router.replace("/");
  }, [isLoading, email, router]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async ({ title, file }: SubmitArgs): Promise<SubmitResult> => {
      setError(null);

      if (isLoading) return { ok: false, error: "Checking session..." };
      if (!email) {
        router.replace("/");
        return { ok: false, error: "Not authenticated" };
      }

      setSubmitting(true);
      try {
        const projectId = uuidv4();
        const payload: CreateProjectPayload = {
          projectId,
          projectTitle: title,
          userEmail: email,
        };

        // NOTE: your API signature is createProject(file, payload)
        const response = await createProject(file, payload);
        if (!response.ok) throw new Error(response.message || "Server error");

        toast.success("Project created");
        return { ok: true, projectId, response };
      } catch (e: any) {
        const msg = e?.message ?? "Failed to create project.";
        setError(msg);
        toast.error(msg);
        return { ok: false, error: msg };
      } finally {
        setSubmitting(false);
      }
    },
    [email, isLoading, router]
  );

  return { submit, submitting, error, setError };
}

export default useCreateProject;
