import type { AllProjectsResponse, ProjectApi, ProjectCardModel,  InvestmentsOverviewResponse, } from "@/types/investor/project";
import type { ProjectCardItem } from "@/components/investor/ProjectCard";
import { ENV } from "@/config/env";


const API_BASE = ENV.API_BASE;


// ---- Projects mapping (unchanged, but ensure nullable img) ----
const pickTitle = (p: ProjectApi) => p.title || p.project_title || "Untitled project";
const pickImage = (p: ProjectApi) =>
  (Array.isArray(p.poster_urls) && p.poster_urls[0]) || null;
const pickDesc = (p: ProjectApi) => p.preview_text || p.overview || "No preview available yet.";
const pickTags = (p: ProjectApi) =>
  Array.isArray(p.tags) ? p.tags.slice(0, 3).map((t) => ({ text: t, variant: "gray" as const })) : [];

export function mapProjectsToCardModels(data: ProjectApi[]): ProjectCardModel[] {
  return data.map((p) => ({
    id: String(p.id),
    title: pickTitle(p),
    img: pickImage(p), // may be null
    desc: pickDesc(p),
    meta: { views: 224, episodes: 12, rating: 3.5 },
    tags: pickTags(p),
  }));
}

export function toProjectCardItems(models: ProjectCardModel[]): ProjectCardItem[] {
  // caller can filter for m.img first; this cast keeps UI decoupled
  return models as unknown as ProjectCardItem[];
}

// ---- NEW: investments overview fetcher ----
export async function getInvestmentsOverview(
  investorEmail: string,
  limit = 5000,
  endpoint = "/investments/overview"
): Promise<InvestmentsOverviewResponse> {
  const url = new URL(`${API_BASE}${endpoint}`);
  url.searchParams.set("investorEmail", investorEmail);
  if (limit) url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  let json: InvestmentsOverviewResponse;
  try {
    json = await res.json();
  } catch {
    return {
      ok: false,
      investorEmail,
      counts: { deals: 0, projects: 0 },
      deals: { ok: false, investorEmail, count: 0, data: [] },
      projects: { ok: false, count: 0, data: [] },
    };
  }
  return json;
}
