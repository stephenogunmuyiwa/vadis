// components/finace/FundingProgressTable.tsx
"use client";

import { FC } from "react";
import {
  Info,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import type { InvestmentRow } from "@/types/finance";

type Props = {
  items: InvestmentRow[];
  loading?: boolean;
  title?: string;
};

const cols =
  "grid grid-cols-[minmax(220px,1.2fr)_minmax(130px,0.6fr)_minmax(180px,0.8fr)_minmax(200px,0.9fr)_minmax(110px,0.6fr)_minmax(280px,1fr)_minmax(120px,0.6fr)]";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n
  );

function fmtDate(ts?: number) {
  if (!ts) return "—";
  // support seconds or ms
  const ms = ts < 1e12 ? ts * 1000 : ts;
  try {
    return new Date(ms).toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

const Badge = ({
  tone,
  children,
}: {
  tone: "yes" | "no";
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
      tone === "yes"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
        : "bg-gray-100 text-gray-600 ring-gray-200"
    }`}
  >
    {children}
  </span>
);

const RowSkeleton = () => (
  <li className={`${cols} items-center gap-3 rounded-xl px-3 py-2`}>
    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
    <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
    <div className="ml-auto h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
  </li>
);

const FundingProgressTable: FC<Props> = ({
  items,
  loading = false,
  title = "Investments",
}) => {
  const displayCount = String(items.length).padStart(2, "0");

  return (
    <section className="mt-4 rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gray-400" />
          <span className="font-medium">{title}</span>
          <span className="ml-1 inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 font-medium">
            {displayCount}
          </span>
        </div>
        <button
          onClick={() => {
            console.log(items);
          }}
          className="rounded-md p-1.5 hover:bg-gray-50"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Column headings */}
      <div className="px-4 sm:px-6 pt-2 pb-1">
        <div
          className={`${cols} text-[11px] uppercase tracking-wide text-gray-500`}
        >
          <div className="flex items-center gap-1">
            Investor <Info className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1">
            Value <Info className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1">
            Meeting date <Info className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1">
            Meeting link <Info className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1">
            Pitch? <Info className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1">
            Comments <Info className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1 justify-end pr-2">
            Actions
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="px-2 sm:px-4 pb-3">
        <ul className="space-y-1.5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
            : items.map((it, i) => (
                <li
                  key={`${
                    it.id ?? it.investorId ?? it.meetingLink ?? "row"
                  }-${i}`}
                  className={`${cols} items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50`}
                >
                  {/* Investor */}
                  <div className="min-w-0">
                    <div className="truncate text-sm text-gray-900">
                      {it.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {it.investorId}
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-sm font-semibold text-gray-900">
                    {currency(it.value)}
                  </div>

                  {/* Meeting date */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 ring-1 ring-gray-200">
                      <Calendar className="h-3.5 w-3.5 text-gray-600" />
                    </span>
                    <span>{fmtDate(it.meetingDate)}</span>
                  </div>

                  {/* Meeting link */}
                  <div className="text-sm">
                    {it.meetingLink ? (
                      <a
                        href={it.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Open link
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>

                  {/* Pitch? */}
                  <div>
                    <Badge tone={"yes"}>{"Requested"}</Badge>
                  </div>

                  {/* Comments */}
                  <div className="text-sm text-gray-700 truncate">
                    {it.comments || <span className="text-gray-400">—</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    {it.meetingLink && (
                      <a
                        href={it.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        title="Open meeting link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
};

export default FundingProgressTable;
