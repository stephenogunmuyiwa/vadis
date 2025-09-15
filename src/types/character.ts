export type Role = "Lead" | "Supporting";

export type RiskLevel = "Low" | "Medium" | "High";
export type Availability =
  | boolean
  | "Available"
  | "On hold"
  | "Busy"
  | "Unavailable";

export type SuggestedActor = {
  name: string;
  avatarUrl?: string | null;
  note?: string;
  rating?: number;
  risk: "Low" | "Medium" | "High";
  reason: string;
  available: Availability;     // <-- unified here
  fee: string;
  age: number;
  recentWorks: string[];

  // optional extras
  matchCount?: number;
  matchingTraits?: string[];
  moviePersonality?: string[];
  moviesPlayedIn?: string[];
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
  suggestedActor?: SuggestedActor;
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
    suggested_actor?: {
      actor_name?: string;
      average_amount_charged_to_film?: number | null;
      image_url?: string | null;
      matching_traits?: string[];
      matching_traits_count?: number;
      movie_personality?: string[];
      movies_played_in?: string[];
      recent_propaganda?: string;
    };
  }>;
  error?: string;
};
