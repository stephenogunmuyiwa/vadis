
export type ProjectApi = {
  id: string;
  creator?: string;
  creator_name?: string;
  created_date?: number;

  project_title?: string;
  url?: string;

  title?: string;
  overview?: string;
  preview_text?: string;
  poster_urls?: string[];
  poster_urls_updated?: number;
  tags?: string[];
  scene_count?: number;
  is_published?: boolean;
  visibility?: boolean;
  estimated_budget?: number;
  estimated_ROI?: number;
  finance_last_updated?: number;
  last_open?: number;
  character_count?: number;
};

export type AllProjectsResponse = {
  ok: boolean;
  count?: number;
  data?: ProjectApi[];
  error?: string;
};

// NOTE: img is now nullable (no placeholder fallback)
export type ProjectCardModel = {
  id: string;
  title: string;
  img: string | null; // <- changed
  desc: string;
  meta: { views: number | string; episodes: number | string; rating: number | string };
  tags: { text: string; variant?: "purple" | "gray" | "orange" | "green" | "indigo" | "blue" }[];
};


export type InvestorDeal = {
  comments?: string | null;
  created_at?: number | null;     // epoch seconds or ms
  updated_at?: number | null;
  creatorEmail: string;
  investorEmail: string;
  investor_id?: string | null;
  meeting_date: number | string;  // epoch or ISO
  meeting_url: string;
  projectId: string;
  value?: number | null;
};

export type DealsBundle = {
  ok: boolean;
  investorEmail: string;
  count: number;
  data: InvestorDeal[];
};

export type ProjectsBundle = {
  ok: boolean;
  count: number;
  data: ProjectApi[];
};

export type InvestmentsOverviewResponse = {
  ok: boolean;
  investorEmail: string;
  counts: { deals: number; projects: number };
  deals: DealsBundle;
  projects: ProjectsBundle;
};
