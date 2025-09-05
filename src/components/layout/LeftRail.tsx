// components/layout/LeftRail.tsx
"use client";

import { FC } from "react";

type Item = { key: string; icon: any };

interface LeftRailProps {
  items: Item[];
  selected: string;
  setSelected: (v: string) => void;
}

const LeftRail: FC<LeftRailProps> = ({ items, selected, setSelected }) => {
  return (
    <div
      className="absolute left-0 top-0 w-[60px] h-[calc(100vh-40px)]
                 box-content border-r border-gray-300/80 bg-white/30 backdrop-blur-md
                 flex flex-col items-center justify-center gap-6"
    >
      {items.map(({ key, icon: Icon }) => {
        const isActive = selected === key;
        return (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className="flex flex-col items-center gap-0.5 focus:outline-none"
          >
            <div
              className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
                isActive
                  ? "bg-gray-900 text-white shadow"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon
                size="22"
                color={isActive ? "#F0F0F0FF" : "#5E5E5EFF"}
                variant="Bold"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LeftRail;
