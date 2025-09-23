export type Audience = 'Adults' | 'Teens' | 'Kids';
export type ContentType = 'Movie' | 'Series' | 'Short';
export type Genre =
  | 'Action' | 'Fantasy' | 'Sci-Fi' | 'Drama' | 'Comedy' | 'Thriller' | 'Horror';

export interface ScriptItem {
  id: string;
  name: string;
  genre: Genre;
  audience: Audience;
  content: ContentType;
  description: string;
  pages: number;
  collaborators: number;
  tags: string[];
}

export interface PitchDeckItem {
  id: string;
  name: string;
  fromScriptId: string;
  colorTheme: Genre | 'Neutral';
  createdAt: string;
}
// ---- API: Projects ----
export interface Project {
  id: string;
  title: string;
  overview?: string;
  preview_text?: string;
  scene_count?: number;
  tags?: string[];
  created_date?: number;
  last_open?: number;
  visibility?: boolean;
  // optional extras the API may send
  character_count?: number;
  estimated_budget?: number;
  is_published?: boolean;
  poster_urls?: string[];
}

export type ListProjectsResponse = {
  ok: boolean;
  count: number;
  data: Project[];
  error?: string;
};

export type GenerateProjectFromBriefBody = {
  userEmail: string;
  title: string;
  logLine: string;
  genre: string;
  audienceRating: string;
  location: string;
  description: string;
};

export type GenerateProjectFromBriefResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  projectId?: string;
  raw_file_blob?: string;
  extracted_scenes_blob?: string;
};

// ---- API: Pitch Decks ----
export interface PitchDeck {
  id: string;                 // project id (server uses project id as deck id)
  project_title: string;
  url: string;
  created_date?: number;
  creator_name?: string;
}

export type ListPitchDecksResponse = {
  ok: boolean;
  count: number;
  data: PitchDeck[];
  error?: string;
};

export type GeneratePitchDeckBody = {
  userEmail: string;
  projectId: string;
};

export type GeneratePitchDeckResponse = {
  ok: boolean;
  project_id?: string;
  blob?: string;
  url?: string;
  error?: string;
};
