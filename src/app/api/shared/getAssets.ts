import { ENV } from "@/config/env";
export type MovieDetails = {
  title: string;
  preview_text?: string;
  overview: string;
  tags: string[];
  poster_urls?: string[];     
  trailer_url?: string;    
};

export type MovieDetailsResponse =
  | { ok: true; data: MovieDetails }
  | { ok: false; error: string };

export type GeneratePosterResponse =
  | { ok: true; poster_urls?: string[] }
  | { ok: false; error: string };

export type GenerateTrailerResponse =
  | { ok: true; trailer_url: string }
  | { ok: false; error: string };

// Base
const BASE = ENV.API_BASE;

// Fetch movie details
export async function getMovieDetails(params: {
  userEmail: string;
  projectId: string;
  movieId: string;
}): Promise<MovieDetailsResponse> {
  const res = await fetch(`${BASE}/project/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) return { ok: false, error: `${res.status} ${res.statusText}` };
  return (await res.json()) as MovieDetailsResponse;
}

// Generate poster(s)
export async function generatePoster(params: {
  userEmail: string;
  projectId: string;
  movieId: string;
}): Promise<GeneratePosterResponse> {
  const res = await fetch(`${BASE}/posters/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) return { ok: false, error: `${res.status} ${res.statusText}` };
  return (await res.json()) as GeneratePosterResponse;
}

// Generate trailer
export async function generateTrailer(params: {
  userEmail: string;
  projectId: string;
  movieId: string;
}): Promise<GenerateTrailerResponse> {
  const res = await fetch(`${BASE}/movie/trailer/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) return { ok: false, error: `${res.status} ${res.statusText}` };
  return (await res.json()) as GenerateTrailerResponse;
}
