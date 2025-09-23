// types/film.ts
export type Character = { id: string; name: string };

export type Shot = {
  id: string;
  bannerUrl?: string | null;
  characters: Character[];
  vfxAnalysis: string;
  productPlacement?: string;
  product_scene_url?: string | null;
  short: { title: string; description: string };
};
