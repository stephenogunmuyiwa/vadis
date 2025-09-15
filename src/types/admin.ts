// src/types/admin.ts
export type Role = "production" | "creator" | "investor" | "brand" | "admin";

export type AdminOverview = {
  totals: {
    users: { production: number; creator: number; investor: number; brand: number; all: number };
    projects: number;
    brands: number;
  };
  recentActiveUsers: Array<{ id: string; name: string; email: string; role: Role; lastActive: number }>;
  recentBrands: Array<{ id: string; name: string; items: number; createdAt: number }>;
  recentProjects: Array<{ id: string; title: string; creatorName: string; updatedAt: number }>;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastActive: number; // epoch seconds
};

export type AdminProject = {
  id: string;
  title: string;
  creatorName: string;
  updatedAt: number; // epoch seconds
};

export type ListResponse<T> = { ok: true; data: T } | { ok: false; error: string };
export type BasicOK = { ok: boolean; message?: string; error?: string };
