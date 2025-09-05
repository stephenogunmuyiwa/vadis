"use client";

import SectionOneHeader from "@/components/sections/SectionOneHeader";
import {
  Film,
  Clapperboard,
  Users2,
  DollarSign,
  TrendingUp,
  Tag,
  Clock,
  CalendarDays,
  User as UserIcon,
} from "lucide-react";

type Currency = "USD" | "EUR" | "GBP";

export type ProductPlacementRow = {
  brand: string;
  scenes: number[];
  productType: string;
  estValue?: number;
};

// light-weight character & casting shapes for summary
export type SummaryCharacter = {
  name: string;
  role: string; // "Lead" | "Supporting" | etc.
  scenes: number[];
  personality?: string[];
};

export type SelectedCast = {
  character: string;
  actor: string;
  availability?: string;
  fee?: string;
};

export default function SummaryView({
  projectCreatedISO,
  projectCreatedLabel,
  scenesCount,
  shotsCount,
  charactersCount,
  synopsis,
  budgetEstimate,
  revenueEstimate,
  currency = "USD",
  productPlacements = [],
  // NEW:
  characters = [],
  selectedCast = [],
  runtimeMinutesEstimate,
  productionEstimate, // { prepWeeks, shootDays, postWeeks, totalCalendarWeeks? }
}: {
  projectCreatedISO: string;
  projectCreatedLabel: string;
  scenesCount: number;
  shotsCount: number;
  charactersCount: number;
  synopsis: string;
  budgetEstimate: number;
  revenueEstimate: number;
  currency?: Currency;
  productPlacements?: ProductPlacementRow[];
  // NEW:
  characters?: SummaryCharacter[];
  selectedCast?: SelectedCast[];
  runtimeMinutesEstimate?: number;
  productionEstimate?: {
    prepWeeks: number;
    shootDays: number;
    postWeeks: number;
    totalCalendarWeeks?: number;
  };
}) {
  // sensible fallbacks if caller doesn’t pass estimates
  const runtimeMin =
    typeof runtimeMinutesEstimate === "number"
      ? runtimeMinutesEstimate
      : Math.max(85, Math.round(scenesCount * 2)); // ~2 min/scene, floor at 85m

  const derivedShootDays = Math.max(15, Math.ceil(runtimeMin / 4)); // ~4 pages/day ≈ 4 min/day
  const schedule = productionEstimate ?? {
    prepWeeks: 6,
    shootDays: derivedShootDays,
    postWeeks: 14,
  };
  const totalWeeks =
    schedule.totalCalendarWeeks ??
    Math.ceil(schedule.prepWeeks + schedule.shootDays / 5 + schedule.postWeeks);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <SectionOneHeader
        title="Summary"
        createdISO={projectCreatedISO}
        createdLabel={projectCreatedLabel}
        note="Top-level dashboard of scenes, shots, characters, finances, casting and brand placement."
      />

      <section className="flex-1 min-h-0 px-4 sm:px-6 py-4 overflow-y-auto">
        {/* Metrics */}
        <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Film className="h-4 w-4" />}
            label="Scenes analyzed"
            value={scenesCount}
          />
          <MetricCard
            icon={<Clapperboard className="h-4 w-4" />}
            label="Shots analyzed"
            value={shotsCount}
          />
          <MetricCard
            icon={<Users2 className="h-4 w-4" />}
            label="Characters identified"
            value={charactersCount}
          />
          <MetricCard
            icon={<Tag className="h-4 w-4" />}
            label="Brands detected"
            value={productPlacements.length}
          />
        </div>

        {/* Synopsis + Finances + Runtime/Timeline */}
        <div className="mt-4 lg:mt-6 grid gap-4 lg:gap-6 grid-cols-1 xl:grid-cols-3">
          {/* Synopsis */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-gray-200 p-4">
            <h4 className="text-[13px] font-semibold text-gray-900">
              Story Summary
            </h4>
            <p className="mt-2 text-[12px] leading-relaxed text-gray-700">
              {synopsis}
            </p>
          </div>

          {/* Finances snapshot */}
          <div className="rounded-2xl bg-white border border-gray-200 p-4">
            <h4 className="text-[13px] font-semibold text-gray-900">
              Finances (snapshot)
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <KPI
                icon={<DollarSign className="h-4 w-4" />}
                label="Budget estimate"
                value={fmt(budgetEstimate, currency)}
              />
              <KPI
                icon={<TrendingUp className="h-4 w-4" />}
                label="Revenue estimate"
                value={fmt(revenueEstimate, currency)}
              />
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-[12px]">
                <span className="text-gray-600">Delta</span>
                <div
                  className={[
                    "mt-1 text-[15px] font-semibold",
                    revenueEstimate - budgetEstimate >= 0
                      ? "text-emerald-700"
                      : "text-red-700",
                  ].join(" ")}
                >
                  {fmt(revenueEstimate - budgetEstimate, currency)}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-600">
              Adjust inputs in the <span className="font-medium">Finances</span>{" "}
              tab.
            </p>
          </div>

          {/* Runtime & Timeline */}
          <div className="xl:col-span-3 rounded-2xl bg-white border border-gray-200 p-4">
            <h4 className="text-[13px] font-semibold text-gray-900">
              Runtime & Production Timeline
            </h4>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <KPI
                icon={<Clock className="h-4 w-4" />}
                label="Estimated runtime"
                value={`${runtimeMin} min`}
              />
              <KPI
                icon={<CalendarDays className="h-4 w-4" />}
                label="Prep"
                value={`${schedule.prepWeeks} weeks`}
              />
              <KPI
                icon={<CalendarDays className="h-4 w-4" />}
                label="Shoot"
                value={`${schedule.shootDays} days`}
              />
              <KPI
                icon={<CalendarDays className="h-4 w-4" />}
                label="Post"
                value={`${schedule.postWeeks} weeks`}
              />
            </div>
            <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-3 text-[12px]">
              <span className="text-gray-600">Total calendar</span>
              <div className="mt-1 text-[15px] font-semibold">
                {totalWeeks} weeks
              </div>
            </div>
          </div>
        </div>

        {/* Characters & Casting */}
        <div className="mt-4 lg:mt-6 rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-semibold text-gray-900">
              Characters & Casting
            </h4>
            <div className="text-[11px] text-gray-600">
              {characters.length || charactersCount} character(s)
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[760px] w-full text-[12px]">
              <thead className="text-left text-gray-600">
                <tr>
                  <th className="py-2 pr-3">Character</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Scenes</th>
                  <th className="py-2 pr-3">Personality</th>
                  <th className="py-2">Selected Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(characters.length ? characters : []).map((c) => {
                  const cast = selectedCast.find((s) => s.character === c.name);
                  return (
                    <tr key={c.name}>
                      <td className="py-2 pr-3 font-medium text-gray-900">
                        {c.name}
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={[
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            c.role.toLowerCase().includes("lead")
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-200 text-gray-900",
                          ].join(" ")}
                        >
                          {c.role}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-gray-800">
                        {c.scenes.length
                          ? c.scenes.map((s) => `Scene ${s}`).join(", ")
                          : "—"}
                      </td>
                      <td className="py-2 pr-3 text-gray-800">
                        {c.personality?.length ? c.personality.join(", ") : "—"}
                      </td>
                      <td className="py-2 text-gray-900 font-medium">
                        {cast ? (
                          <span className="inline-flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span>{cast.actor}</span>
                            {cast.availability && (
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]">
                                {cast.availability}
                              </span>
                            )}
                            {cast.fee && (
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]">
                                {cast.fee}
                              </span>
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!characters.length && (
            <p className="mt-3 text-[11px] text-gray-600">
              Character rows appear here once provided; selection data is pulled
              from casting decisions.
            </p>
          )}
        </div>

        {/* Product Placement */}
        <div className="mt-4 lg:mt-6 rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-semibold text-gray-900">
              Product Placement
            </h4>
            <div className="text-[11px] text-gray-600">
              {productPlacements.length} brand
              {productPlacements.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[640px] w-full text-[12px]">
              <thead className="text-left text-gray-600">
                <tr>
                  <th className="py-2 pr-3">Brand</th>
                  <th className="py-2 pr-3">Scenes</th>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2">Est. Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productPlacements.map((row, i) => (
                  <tr key={`${row.brand}-${i}`}>
                    <td className="py-2 pr-3 font-medium text-gray-900">
                      {row.brand}
                    </td>
                    <td className="py-2 pr-3 text-gray-800">
                      {row.scenes.length
                        ? row.scenes.map((s) => `Scene ${s}`).join(", ")
                        : "—"}
                    </td>
                    <td className="py-2 pr-3 text-gray-800">
                      {row.productType || "—"}
                    </td>
                    <td className="py-2 font-semibold">
                      {typeof row.estValue === "number"
                        ? fmt(row.estValue, currency)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[11px] text-gray-600">
            Tie brands to exact scenes and featured products to forecast
            deliverables and revenue.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------- UI bits ---------- */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-gray-600">{label}</div>
        {icon}
      </div>
      <div className="mt-1 text-[20px] font-semibold">{value}</div>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-gray-600">{label}</div>
        {icon}
      </div>
      <div className="mt-1 text-[16px] font-semibold">{value}</div>
    </div>
  );
}

function fmt(n: number, c: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);
}
