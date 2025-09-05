// src/types/project.ts
export type CreateProjectPayload = {
  projectTitle: string;
  userEmail: string;
  projectId: string;
};

export type CreateProjectResponse = {
  ok: boolean;
  message: string;
  extracted_scenes_blob?: string;
  raw_file_blob?: string;
};

export type UserProject = {
  id: string;
  title: string;
  preview_text: string;
  created_date: number;     // epoch seconds (float)
  last_open: number;        // epoch seconds (float)
  is_published: boolean;
  scene_count: number;
  character_count: number;
  estimated_budget: number;
  creator: string;
  visibility?: boolean;
};

export type ListProjectsResponse = {
  ok: boolean;
  count: number;
  data: UserProject[];
};

export type SceneRow = {
  id: string;            // "1", "2", ...
  title: string;         // "INT. ..."
  content: string;       // raw text
  screentime: number;    // seconds
  location: string;
  estimate_budget: number;
};

export type ListScenesResponse = {
  ok: boolean;
  count: number;
  data: SceneRow[];
  error?: string;
};
