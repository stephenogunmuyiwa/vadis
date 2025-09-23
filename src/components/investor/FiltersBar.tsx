// components/investor/FiltersBar.tsx
"use client";

import { Search, ChevronDown } from "lucide-react";

export default function FiltersBar() {
  const Select = ({ label }: { label: string }) => (
    <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
      {label}
      <ChevronDown className="h-4 w-4 text-neutral-500" />
    </button>
  );

  return (
    <div className="flex flex-col items-start justify-between gap-3 py-4 md:flex-row md:items-center">
      <div className="relative w-full md:max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        <input
          placeholder="Search"
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select label="All contents" />
        <Select label="All genre" />
        <Select label="All audience" />
      </div>
    </div>
  );
}
