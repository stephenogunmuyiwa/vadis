import type { SaveVfxNoteResponse } from "@/types/vfxAnalysis";
import { ENV } from "@/config/env";


export async function saveVfxNote(params: {
  userEmail: string;
  projectId: string;
  sceneId: string;
  shotId: string;
  note: string;
}): Promise<SaveVfxNoteResponse> {
  const query = new URLSearchParams({
    userEmail: params.userEmail,
    projectId: params.projectId,
    sceneId: params.sceneId,
    shotId: params.shotId,
    note: params.note,
  });

  const res = await fetch(
    `${ENV.API_BASE}/vfx/note?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to save VFX note: ${res.statusText}`);
  }

  return (await res.json()) as SaveVfxNoteResponse;
}
