"use client";

import { useMemo, useState } from "react";
import { PitchDeckItem } from "@/types/creator/creator";
import { seedDecks } from "@/lib/creator/mock/creator";

export function usePitchDecks() {
  const [decks, setDecks] = useState<PitchDeckItem[]>(seedDecks);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return decks;
    return decks.filter((d) => d.name.toLowerCase().includes(q));
  }, [decks, query]);

  function addDeck(input: {
    name: string;
    fromScriptId: string;
    colorTheme: PitchDeckItem["colorTheme"];
  }) {
    const item: PitchDeckItem = {
      id: crypto.randomUUID(),
      name: input.name,
      fromScriptId: input.fromScriptId,
      colorTheme: input.colorTheme,
      createdAt: new Date().toISOString(),
    };
    setDecks((prev) => [item, ...prev]);
    return item;
  }

  return { decks: filtered, rawDecks: decks, addDeck, query, setQuery };
}
