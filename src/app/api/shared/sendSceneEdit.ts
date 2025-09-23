import type { SceneEditResponse } from "@/types/sceneEdit";
import { ENV } from "@/config/env";


export async function sendSceneEdit(params: {
  userEmail: string;
  projectId: string;
  sceneId: string;
  shotId: string;
  prompt: string;
}): Promise<SceneEditResponse> {
  const res = await fetch(
    `${ENV.API_BASE}/shot/image/edit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: params.userEmail,
        projectId: params.projectId,
        sceneId: params.sceneId,
        shotId: params.shotId,
        prompt: params.prompt,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Scene edit failed: ${res.statusText}`);
  }

  return (await res.json()) as SceneEditResponse;
}
