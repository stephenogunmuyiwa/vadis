"use client";

import { useMemo, useState } from "react";
import {
  ScriptItem,
  Genre,
  Audience,
  ContentType,
} from "@/types/creator/creator";
import { duplicateToGrid } from "@/lib/creator/mock/creator";

export function useScripts() {
  const [scripts, setScripts] = useState<ScriptItem[]>(duplicateToGrid(9));
  const [filter, setFilter] = useState<"All scripts" | Genre>("All scripts");

  const filtered = useMemo(() => {
    if (filter === "All scripts") return scripts;
    return scripts.filter((s) => s.genre === filter);
  }, [scripts, filter]);

  function addScript(input: {
    name: string;
    genre: Genre;
    audience: Audience;
    content: ContentType;
    description: string;
  }) {
    const item: ScriptItem = {
      id: crypto.randomUUID(),
      name: input.name.trim() || "Untitled Script",
      genre: input.genre,
      audience: input.audience,
      content: input.content,
      description: input.description,
      pages: 0,
      collaborators: 0,
      tags: [
        input.genre,
        input.content === "Movie" ? "Film" : input.content,
        input.audience,
      ],
    };
    setScripts((prev) => [item, ...prev]);
    return item;
  }

  return {
    scripts: filtered,
    rawScripts: scripts,
    addScript,
    filter,
    setFilter,
  };
}
