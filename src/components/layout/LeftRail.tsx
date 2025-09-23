// components/layout/LeftRail.tsx
"use client";

import { FC } from "react";

type Item = { key: string; icon: any; label: string };

interface LeftRailProps {
  items: Item[];
  selected: string;
  setSelected: (v: string) => void;
}

const LeftRail: FC<LeftRailProps> = ({ items, selected, setSelected }) => {
  return (
    <div
      className="absolute left-0 top-0 w-[180px] h-[calc(100vh-40px)]
                 box-content border-r border-gray-300/80 bg-white/30 backdrop-blur-md
                 flex flex-col items-start justify-start gap-3 p-4"
    >
      {items.map(({ key, icon: Icon, label }) => {
        const isActive = selected === key;
        return (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors focus:outline-none ${
              isActive
                ? "bg-gray-900 text-white shadow"
                : "bg-transparent text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon
              size="22"
              color={isActive ? "#F0F0F0FF" : "#5E5E5EFF"}
              variant="Bold"
            />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LeftRail;
