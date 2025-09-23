// types/vfxAnalysis.ts
export interface VfxAnalysisResponse {
  ok: boolean;
  cached?: boolean;
  user_email: string;
  project_id: string;
  scene_id: string;
  shot_id: string;
  vfx_analysis: string;
  vfx_note: string;
  error?: string;
}

export type GetVfxAnalysisParams = {
  userEmail: string;
  projectId: string;
  sceneId: string;
  shotId: string;
};

export type VfxNoteData = {
  userEmail: string;
  projectId: string;
  sceneId: string;
  shotId: string;
  vfx_note: string;
  vfx_note_updated: number;
};

export type SaveVfxNoteResponse =
  | { ok: true; data: VfxNoteData }
  | { ok: false; error: string };

