"use client";
import { Input } from "@/components/brand/ui/Input";
import { Select } from "@/components/brand/ui/Select";
import { PlacementCard } from "@/components/brand/placements/PlacementCard";
import { Search } from "lucide-react";

export default function DealsPage() {
  return (
    <div>
      <h1 className="text-[20px] mt-[50px] font-semibold">Placements</h1>
      <p className="text-xs text-zinc-500">Apple Inc.</p>

      <div className="mt-5 flex gap-6 border-b border-[#E8E8E8FF]">
        <a
          href="../placements"
          className="px-2 py-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          Market place
        </a>
        <button className="border-b-2 border-indigo-500 px-2 py-2 text-sm font-medium text-indigo-600">
          My deals{" "}
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-[420px]">
            <Input placeholder="Search" />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value="all"
              onChange={() => {}}
              options={[{ label: "All contents", value: "all" }]}
            />
            <Select
              value="all"
              onChange={() => {}}
              options={[{ label: "All genre", value: "all" }]}
            />
            <Select
              value="all"
              onChange={() => {}}
              options={[{ label: "All audience", value: "all" }]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PlacementCard
            href="../placements/percy"
            studio="Disney Studios"
            title="Percy Jackson"
            synopsis="The epic journey of a modern-day demigod who discovers his true identity and battles mythical forces to save the world."
            poster="/moviePoster.jpg"
            scenes={224}
            audience={12}
            rating={3.5}
            price={54000}
            tags={["Fantasy", "Series", "Everyone"]}
          />
          <PlacementCard
            href="../placements/spider"
            studio="Marvel Studios"
            title="Spiderman: A new home"
            synopsis='A thrilling chapter in the Spider-Man saga where Peter faces new challenges while redefining what "home" truly means.'
            poster="/moviePoster.jpg"
            scenes={224}
            audience={12}
            rating={3.5}
            price={54000}
            tags={["Action", "Film", "Everyone"]}
          />
        </div>
      </div>
    </div>
  );
}
