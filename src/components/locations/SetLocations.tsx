// components/locations/Locations.tsx
"use client";

import { FC, useEffect, useMemo, useState } from "react";
import LocationCard from "./LocationCard";
import LocationCardSkeleton from "./LocationCardSkeleton";
import type { SetLocationCardProps } from "./LocationCard";
import {
  rankSets,
  type RankSetsResponse,
} from "@/app/api/shared/getSetLocations";

type Props = {
  userEmail: string;
  projectId: string;
  topK?: number;
  title?: string;
  description?: string;
};

const SetLocations: FC<Props> = ({
  userEmail,
  projectId,
  topK,
  title = "Suggested movie set locations",
  description = "A curated, scrollable list of location recommendations with incentives, eligibility and key conditions.",
}) => {
  const [items, setItems] = useState<SetLocationCardProps[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canFetch = useMemo(
    () => Boolean(userEmail && projectId),
    [userEmail, projectId]
  );

  useEffect(() => {
    if (!canFetch) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res: RankSetsResponse = await rankSets({
          userEmail,
          projectId,
          topK,
        });

        if (!res.ok) {
          if (!cancelled) setError(res.error || "Failed to load suggestions.");
          return;
        }

        const mapped: SetLocationCardProps[] =
          res.recommendations?.map((r, idx) => ({
            location: r.Location,
            region: r.Region,
            incentive: r.Incentive,
            minimumSpend: r.Minimum_Spend,
            eligibleExpenses: r.Eligible_Expenses,
            applicationDeadline: r.Application_Deadline,
            notableConditions: r.Notable_Conditions,
            // ctaLabel: "View details" // optional
          })) ?? [];

        if (!cancelled) setItems(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unexpected error.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canFetch, userEmail, projectId, topK]);

  return (
    // scroll container
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#ECEFF3]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Header */}
        <header className="mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </header>

        {/* States */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: Math.min(topK ?? 6, 10) }).map((_, i) => (
              <LocationCardSkeleton key={i} />
            ))}
          </div>
        )}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {!loading && !error && (!items || items.length === 0) && (
          <div className="text-sm text-gray-600">No recommendations yet.</div>
        )}

        {/* Cards */}
        {items?.map((item, i) => (
          <LocationCard
            key={`${item.location}-${item.region}-${i}`}
            {...item}
          />
        ))}
      </div>
    </div>
  );
};

export default SetLocations;
