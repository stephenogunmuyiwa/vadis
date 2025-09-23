import { ENV } from '@/config/env';
import {
  GenerateProjectFromBriefBody,
  GenerateProjectFromBriefResponse,
  ListProjectsResponse,
  Project,
  ListPitchDecksResponse,
  PitchDeck,
  GeneratePitchDeckBody,
  GeneratePitchDeckResponse,
} from '@/types/creator/creator';

function toUrl(p: string) {
  return `${ENV.API_BASE.replace(/\/$/, '')}${p}`;
}

export async function listProjects(userEmail: string): Promise<Project[]> {
  const res = await fetch(
    toUrl(`/projects?userEmail=${encodeURIComponent(userEmail)}`),
    { cache: 'no-store' }
  );
  const json: ListProjectsResponse = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to fetch projects');
  return json.data || [];
}

export async function generateProjectFromBrief(
  body: GenerateProjectFromBriefBody
): Promise<GenerateProjectFromBriefResponse> {
  const res = await fetch(toUrl('/generateProjectFromBrief'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json: GenerateProjectFromBriefResponse = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to generate project');
  return json;
}

export async function listPitchDecks(userEmail: string): Promise<PitchDeck[]> {
  const res = await fetch(toUrl(`/pitch-decks?userEmail=${encodeURIComponent(userEmail)}`), {
    cache: 'no-store',
  });
  const json: ListPitchDecksResponse = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to fetch pitch decks');
  return json.data || [];
}

export async function generatePitchDeck(
  body: GeneratePitchDeckBody
): Promise<GeneratePitchDeckResponse> {
  const res = await fetch(toUrl('/project/pitch-deck/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json: GeneratePitchDeckResponse = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to generate pitch deck');
  return json;
}
