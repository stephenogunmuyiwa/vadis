// components/locations/LocationCard.tsx
"use client";

import { FC } from "react";

export interface SetLocationCardProps {
  location: string; // e.g. "Mauritius"
  region?: string; // e.g. "Africa"
  incentive?: string; // e.g. "30% rebate"
  minimumSpend?: string; // e.g. "$100,000"
  eligibleExpenses?: string; // e.g. "Local spend; crew; post"
  applicationDeadline?: string; // e.g. "Rolling"
  notableConditions?: string; // e.g. "Cultural test; local hires"
  ctaLabel?: string; // optional action button
}

const RegionPill: FC<{ region?: string }> = ({ region }) => {
  if (!region) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white">
      {region}
    </span>
  );
};

const Label: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] uppercase tracking-wide text-gray-500">
    {children}
  </div>
);

const BigValue: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[15px] font-semibold text-gray-900">{children}</div>
);

const Subtle: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[12px] text-gray-500">{children}</div>
);

const LocationCard: FC<SetLocationCardProps> = ({
  location,
  region,
  incentive,
  minimumSpend,
  eligibleExpenses,
  applicationDeadline,
  notableConditions,
  ctaLabel = "Details",
}) => {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-[15px] font-semibold text-gray-900">
            {location}
          </div>
          <RegionPill region={region} />
        </div>
      </div>

      <div className="h-px w-full bg-gray-100" />

      {/* Body */}
      <div
        className="grid grid-cols-1 gap-y-4 px-4 sm:px-6 py-4
                   md:grid-cols-5 md:gap-6"
      >
        {/* Incentive */}
        <div>
          <Label>Incentive</Label>
          <BigValue>{incentive ?? "—"}</BigValue>
        </div>

        {/* Minimum spend */}
        <div>
          <Label>Minimum spend</Label>
          <BigValue>{minimumSpend ?? "—"}</BigValue>
        </div>

        {/* Eligible expenses */}
        <div className="md:col-span-2">
          <Label>Eligible expenses</Label>
          <Subtle>{eligibleExpenses ?? "—"}</Subtle>
        </div>

        {/* Deadline */}
        <div>
          <Label>Application deadline</Label>
          <BigValue>{applicationDeadline ?? "—"}</BigValue>
        </div>

        {/* Notes / Conditions */}
        <div className="md:col-span-5">
          <Label>Notable conditions</Label>
          <Subtle>{notableConditions ?? "—"}</Subtle>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
export type { SetLocationCardProps as LocationCardProps }; // keep existing import name compatible
