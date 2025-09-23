"use client";

import { useState } from "react";
import ScriptsPanel from "./ScriptsPanel";
import DecksPanel from "./DecksPanel";

export default function CreatorTabs() {
  const [tab, setTab] = useState<"scripts" | "decks">("scripts");

  return (
    <div className="mx-auto max-w-8xl px-6 pb-10 md:ml-60 md:px-10">
      <h2 className="text-[20px] font-medium text-neutral-800">Creator hub</h2>

      {/* Tabs */}
      <div className="relative mb-6 mt-10 border-b">
        <div className="flex gap-8">
          <button
            onClick={() => setTab("scripts")}
            className={`-mb-px border-b-2 px-1 py-3 text-sm ${
              tab === "scripts"
                ? "border-[#383fff] text-[#383fff]"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Script Generator
          </button>
          <button
            onClick={() => setTab("decks")}
            className={`-mb-px border-b-2 px-1 py-3 text-sm ${
              tab === "decks"
                ? "border-[#383fff] text-[#383fff]"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Pitch Deck Generator
          </button>
        </div>
      </div>

      {tab === "scripts" ? <ScriptsPanel /> : <DecksPanel />}
    </div>
  );
}
