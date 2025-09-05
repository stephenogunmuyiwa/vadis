// src/hooks/useCreateProject.ts
"use client";

import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { ENV } from "@/config/env";
import { createProject } from "@/api/createProject";
import type { CreateProjectPayload, CreateProjectResponse } from "@/types/project";

type SubmitArgs = { title: string; file: File };
type SubmitResult =
  | { ok: true; projectId: string; response: CreateProjectResponse }
  | { ok: false; error: string };

export function useCreateProject() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async ({ title, file }: SubmitArgs): Promise<SubmitResult> => {
      setError(null);

      const projectTitle = title.trim();
      if (!projectTitle) {
        const msg = "Project title is required.";
        setError(msg);
        toast.error(msg);
        return { ok: false, error: msg };
      }
      if (!file) {
        const msg = "Please choose a script file.";
        setError(msg);
        toast.error(msg);
        return { ok: false, error: msg };
      }

      setSubmitting(true);
      const projectId = uuidv4();
      const payload: CreateProjectPayload = {
        projectTitle,
        userEmail: ENV.DEFAULT_EMAIL || "user@example.com",
        projectId,
      };

      try {
        const res = await createProject(file, payload); // flat FormData
        if (!res?.ok) {
          const msg = res?.message || "Server returned an error.";
          throw new Error(msg);
        }

        toast.success("Project created and processed.");
        // No routing here — caller will handle next step (e.g., refresh projects)
        setSubmitting(false);
        return { ok: true, projectId, response: res };
      } catch (e: any) {
        const msg = e?.message ?? "Failed to create project.";
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        return { ok: false, error: msg };
      }
    },
    []
  );

  return { submit, submitting, error, setError };
}

export default useCreateProject;
