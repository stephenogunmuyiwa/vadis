"use client";

import type { ProjectApi } from "@/types/investor/project";

let memoryProject: ProjectApi | null = null;
const KEY = "investor:selected-project";

export function setSelectedProject(p: ProjectApi) {
  memoryProject = p;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function getSelectedProject(): ProjectApi | null {
  if (memoryProject) return memoryProject;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectApi;
    memoryProject = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSelectedProject() {
  memoryProject = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
