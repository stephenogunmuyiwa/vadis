// components/finace/FinancesView.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw, MoreHorizontal } from "lucide-react";
import StatCard from "./StatCard";
import RecentTransactions, { BrandDeal } from "./RecentTransactions";
import FundingProgressTable from "./FundingProgressTable";
import { getFinanceBundle } from "@/app/api/shared/getFinanceImpressions";
import type { FinanceBundle } from "@/types/finance";

export default function FinancesView({
  userEmail,
  projectId,
}: {
  userEmail: string;
  projectId: string;
}) {
  const [bundle, setBundle] = useState<FinanceBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getFinanceBundle({ userEmail, projectId });
      if (res.ok) setBundle(res.data);
      else setError(res.error);
    } catch (e: any) {
      setError(e?.message || "Failed to load finance data.");
    } finally {
      setLoading(false);
    }
  }, [userEmail, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- helpers ---------- */
  const currency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

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

  /* ---------- derive UI values from bundle ---------- */
  const impressions = bundle?.impressions;
  const deals: BrandDeal[] = useMemo(() => bundle?.brandDeals ?? [], [bundle]);
  const investmentsTotal = useMemo(
    () => (bundle?.investments ?? []).reduce((a, b) => a + (b.value || 0), 0),
    [bundle]
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-[#ECEFF3]">
      <header className="sticky top-0 z-10 bg-[#ECEFF3]/80 backdrop-blur">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Financies & Engagements
              </h2>
              <p className="text-sm text-gray-500">
                Track your ROI, investments, engagements and trendings.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 h-11 rounded-xl bg-gray-900 px-4 text-sm text-white shadow-sm hover:bg-black disabled:opacity-60"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 pb-10">
        {/* KPI cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Budget"
              value={currency(bundle?.estimatedBudget ?? 0)}
              delta="—"
              deltaTone="neutral"
              caption="project total"
              iconBadge
            />
            <StatCard
              title="Investments"
              value={currency(investmentsTotal)}
              delta="—"
              deltaTone="neutral"
              caption="committed"
              iconBadge
            />
            <StatCard
              title="ROI est."
              value={currency(bundle?.estimatedROI ?? 0)}
              delta="—"
              deltaTone="neutral"
              caption="estimated"
              iconBadge
            />
          </div>
        )}

        {/* Social impressions header/actions */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              Engagement Performance
            </h3>
            <button className="rounded-md p-1.5 hover:bg-gray-50">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Social tiles */}
          <div className="px-4 sm:px-6 py-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SocialTileSkeleton />
                <SocialTileSkeleton />
                <SocialTileSkeleton />
                <SocialTileSkeleton />
              </div>
            ) : (
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
                        <div className="text-sm font-medium text-gray-900">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-500">impressions</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmt((impressions as any)?.[s.key] ?? 0)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Branding deal values table */}
        <section className="rounded-2xl mt-4 border border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">
              Branding deal values
            </h3>
            <button className="rounded-md p-1.5 hover:bg-gray-50">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="px-0">
            {loading ? (
              <DealsTableSkeleton />
            ) : (
              <RecentTransactions items={deals} />
            )}
          </div>
        </section>

        <FundingProgressTable
          items={bundle?.investments ?? []}
          loading={loading}
          title="Investments"
        />
        {error && (
          <div className="mt-4 text-sm text-rose-600">
            Error loading finance data: {error}
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------- Skeletons (Tailwind-only) ---------------- */

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="mt-3 h-7 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="mt-3 flex items-center gap-2">
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

function SocialTileSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
        <div className="space-y-1">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-2.5 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

function DealsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            {[
              "Brand",
              "Item",
              "Image",
              "Value",
              "Category",
              "AI Suggested",
              "Actions",
            ].map((h) => (
              <th key={h} className="px-4 sm:px-6 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 sm:px-6 py-3">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </td>
              <td className="px-4 sm:px-6 py-3">
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
              </td>
              <td className="px-4 sm:px-6 py-3">
                <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
              </td>
              <td className="px-4 sm:px-6 py-3">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </td>
              <td className="px-4 sm:px-6 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
              </td>
              <td className="px-4 sm:px-6 py-3">
                <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
              </td>
              <td className="px-4 sm:px-6 py-3">
                <div className="ml-auto flex justify-end gap-2">
                  <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-8 w-8 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
