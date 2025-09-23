// types/project.ts
export type Audience = "Everyone" | "Adults";
export type Genre = "Action" | "Fantasy";
export type ContentType = "Film" | "Series";

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string[];
  image: string;
  stats: {
    docs: number;      // document count
    collaborators: number;
    rating: number;    // 0..5
  };
  tags: {
    content: ContentType;
    genre: Genre;
    audience: Audience;
  };
  productionCost: number; // in USD
  posters?: string[];
};
