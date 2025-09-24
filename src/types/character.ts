export type Role = "Lead" | "Supporting";

export type RiskLevel = "Low" | "Medium" | "High";
export type Availability =
  | boolean
  | "Available"
  | "On hold"
  | "Busy"
  | "Unavailable";

export type suggested_actor = {
  name: string;
  avatar_url?: string | null;
  risk?: "Low" | "Medium" | "High";
  fee?: string;
  age?: number;
  recentWorks?: string[];
};

export type CharacterProfile = {
  id: string;
  name: string;
  role: Role;
  scenes: number[];
  age: number;
  race: string;
  gender: string;
  personality: string[];
  description: string;

  // NEW
  suggested_actor?: suggested_actor;
};

/** Raw payload from /scene/characters */
export type SceneCharactersAPI = {
  ok: boolean;
  cached?: boolean;
  user_email: string;
  project_id: string;
  scene_id: string;
  count: number;
  characters: Array<{
    name: string;
    level?: "main" | "support" | string;
    estimated_age?: number;
    race?: string;
    gender?: string;
    personality?: string[];
    description?: string;

    // NEW — as provided by your backend
    suggested_actor?: suggested_actor;
  }>;
  error?: string;
};
