// components/finace/SalesPerformanceChart.tsx
"use client";

import { FC, useMemo } from "react";

type Range = "24H" | "7D" | "1M" | "3M";
interface Props {
  range: Range;
}

const socials = [
  {
    key: "instagram",
    name: "Instagram",
    bg: "from-pink-400 via-fuchsia-500 to-purple-500",
  },
  {
    key: "tiktok",
    name: "TikTok",
    bg: "from-gray-800 via-gray-700 to-gray-600",
  },
  {
    key: "youtube",
    name: "YouTube",
    bg: "from-rose-500 via-red-500 to-orange-500",
  },
  {
    key: "x",
    name: "X (Twitter)",
    bg: "from-slate-700 via-slate-600 to-slate-500",
  },
] as const;

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}m`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}k`
    : `${n}`;

const SalesPerformanceChart: FC<Props> = ({ range }) => {
  // make the numbers vary a bit by range so it feels alive
  const data = useMemo(() => {
    const mult =
      range === "24H" ? 0.08 : range === "7D" ? 0.4 : range === "1M" ? 1 : 3;
    return {
      instagram: Math.round(18_500 * mult),
      tiktok: Math.round(22_900 * mult),
      youtube: Math.round(12_300 * mult),
      x: Math.round(9_800 * mult),
    };
  }, [range]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {socials.map((s) => (
        <div
          key={s.key}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg bg-gradient-to-br ${s.bg} ring-1 ring-black/10`}
            />
            <div>
              <div className="text-sm font-medium text-gray-900">{s.name}</div>
              <div className="text-xs text-gray-500">
                last {range.toLowerCase()}
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {fmt((data as any)[s.key])}{" "}
            <span className="font-normal text-gray-500">impressions</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesPerformanceChart;
