// src/api/createProject.ts
import { ENV } from "@/config/env";
import { postMultipart } from "@/lib/http";
import type { CreateProjectPayload, CreateProjectResponse } from "@/types/project";

// Make sure your backend route is spelled correctly: /createProject
const ENDPOINT = `${ENV.API_BASE}/createProject`;

export async function createProject(
  file: File,
  { projectTitle, userEmail, projectId }: CreateProjectPayload
): Promise<CreateProjectResponse> {
  const form = new FormData();

  // ⬇️ Flat fields to match your Flask handler:
  form.append("file", file);                // request.files["file"]
  form.append("projectTitle", projectTitle); // request.form["projectTitle"]
  form.append("userEmail", userEmail);       // request.form["userEmail"]
  form.append("projectId", projectId);       // request.form["projectId"]

  // IMPORTANT: do NOT set Content-Type manually; let the browser add the boundary
  return await postMultipart<CreateProjectResponse>(ENDPOINT, form);
}