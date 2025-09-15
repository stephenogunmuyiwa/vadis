// types/vfxAnalysis.ts
export interface VfxAnalysisResponse {
  ok: boolean;
  cached?: boolean;
  user_email: string;
  project_id: string;
  scene_id: string;
  shot_id: string;
  vfx_analysis: string;
  error?: string;
}

export type GetVfxAnalysisParams = {
  userEmail: string;
  projectId: string;
  sceneId: string;
  shotId: string;
};
