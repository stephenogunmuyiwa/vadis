// components/finances/FinancesView.tsx
"use client";

import { useMemo, useState } from "react";
import SectionOneHeader from "@/components/sections/SectionOneHeader";
import {
  Calculator,
  Landmark,
  Film,
  Clapperboard,
  Users,
  Building2,
  PiggyBank,
} from "lucide-react";

/**
 * Assumptions are based on industry norms with sources noted in comments:
 * - ATL/BTL/Post categories are standard; contingency ~10% recommended.
 * - Completion bond ~1.8–3% of direct costs.
 * - P&A often ~production scale for wide releases; set here as % of production.
 * - Box office splits normalized to 50% domestic / 40% international distributor rentals (editable).
 * - Example tax incentive (Georgia): 20% base + 10% uplift when applicable.
 */

type Currency = "USD" | "EUR" | "GBP";
type DeptKey = "actors" | "vfx" | "locations";

export default function FinancesView({
  projectCreatedISO,
  projectCreatedLabel,
  scenesCount = 12,
}: {
  projectCreatedISO: string;
  projectCreatedLabel: string;
  scenesCount?: number;
}) {
  // ---------- Assumptions ----------
  const [currency] = useState<Currency>("USD");

  // Editable high-level inputs (example values)
  const [aboveTheLine, setATL] = useState(1_200_000); // story rights + producers + director + lead/supporting talent
  const [belowTheLine, setBTL] = useState(3_400_000); // crew, equipment, sets/props, wardrobe, art, camera/lighting/grip, transport
  const [post, setPost] = useState(1_100_000); // edit, sound, music, color, VFX baseline
  const [contingencyPct, setContPct] = useState(10); // ~10% typical
  const [bondPct, setBondPct] = useState(2.5); // ~1.8–3%
  const [paPct, setPAPct] = useState(50); // P&A as % of (ATL+BTL+Post)
  const [applyGaIncentive, setApplyGA] = useState(true); // GA 20% + 10% uplift example

  // Revenue assumptions
  const [domesticBO, setDomesticBO] = useState(25_000_000);
  const [intlBO, setIntlBO] = useState(18_000_000);
  const [domSplit, setDomSplit] = useState(50); // distributor rentals (% of gross)
  const [intlSplit, setIntlSplit] = useState(40);
  const [streamingLicense, setStreamLic] = useState(3_000_000); // SVOD/TVOD/PayTV aggregate
  const [productPlacement, setPP] = useState(500_000); // brand integrations
  const [otherLicensing, setOtherLic] = useState(750_000); // AVOD, international TV, airlines, etc.

  // ---------- Derived costs ----------
  const productionSubtotal = aboveTheLine + belowTheLine + post;
  const contingency = Math.round((contingencyPct / 100) * productionSubtotal);
  const bond = Math.round((bondPct / 100) * productionSubtotal); // on direct costs
  const pa = Math.round((paPct / 100) * productionSubtotal);
  const grossBudget = productionSubtotal + contingency + bond + pa;

  // Simple Georgia incentive example: 20% base + 10% uplift (logo) on qualified spend (assume productionSubtotal qualifies)
  const gaBase = applyGaIncentive ? Math.round(0.2 * productionSubtotal) : 0;
  const gaUplift = applyGaIncentive ? Math.round(0.1 * productionSubtotal) : 0;
  const incentives = gaBase + gaUplift;
  const negativeCost = grossBudget - incentives; // “negative cost” net of credits

  // ---------- Dept breakdown (Actors / VFX / Locations) ----------
  // Rough decomposition to surface departmental views. Tweak freely.
  const departments = useMemo(() => {
    const actors = Math.round(0.55 * aboveTheLine + 0.05 * belowTheLine);
    const vfx = Math.round(0.4 * post + 0.1 * belowTheLine);
    const locations = Math.round(0.18 * belowTheLine + 0.02 * post);
    return { actors, vfx, locations };
  }, [aboveTheLine, belowTheLine, post]);

  // ---------- Scene costs (equal weight for demo; replace with your scene weights) ----------
  const perScene = useMemo(() => {
    const scenePool = Math.round(0.6 * (belowTheLine + post)); // spread a share of BTL+Post across scenes
    const each = Math.floor(scenePool / Math.max(1, scenesCount));
    return Array.from({ length: scenesCount }, (_, i) => ({
      scene: i + 1,
      estCost: each,
    }));
  }, [belowTheLine, post, scenesCount]);

  // ---------- Revenues ----------
  const rentalsDomestic = Math.round((domSplit / 100) * domesticBO);
  const rentalsIntl = Math.round((intlSplit / 100) * intlBO);
  const producerSideRevenue =
    rentalsDomestic +
    rentalsIntl +
    streamingLicense +
    productPlacement +
    otherLicensing;

  const breakEvenDelta = producerSideRevenue - negativeCost;
  const profitable = breakEvenDelta >= 0;

  // ---------- Tabs ----------
  const tabs = ["Overview", "Scenes", "Revenues"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  // --- Expanded department weights (sum to 100% within each pool) ---

  // Above-the-Line split
  const ATL_WEIGHTS: Record<string, number> = {
    "Story & Rights": 0.02,
    Producers: 0.08,
    Director: 0.06,
    "Principal Cast": 0.55,
    "Supporting Cast": 0.2,
    Casting: 0.04,
    "ATL Misc.": 0.05,
  };

  // Below-the-Line split
  const BTL_WEIGHTS: Record<string, number> = {
    "Production Mgmt (UPM/PM/ADs)": 0.06,
    Camera: 0.08,
    "Lighting (Grip/Electric)": 0.08,
    "Art Dept. & Construction": 0.14,
    "Props & Set Dec": 0.06,
    "Costume / Wardrobe": 0.06,
    "Hair & Makeup": 0.04,
    "Locations Dept": 0.08,
    Transportation: 0.05,
    "Practical SFX": 0.04,
    Stunts: 0.04,
    "Production Sound": 0.04,
    "Catering & Craft": 0.04,
    "Production Office": 0.09, // bumped so BTL totals = 100%
    "BTL Misc.": 0.1,
  };

  // Post-production split
  const POST_WEIGHTS: Record<string, number> = {
    Editorial: 0.22,
    VFX: 0.38,
    "Post Sound": 0.12,
    Music: 0.08,
    "Color / DI": 0.08,
    "Delivery & QC": 0.06,
    "Post Supervision": 0.06,
  };

  // Build full department list with amounts
  const departmentLines = useMemo(() => {
    const rows: {
      label: string;
      amount: number;
      group: "ATL" | "BTL" | "POST";
    }[] = [];
    const push = (
      group: "ATL" | "BTL" | "POST",
      src: number,
      weights: Record<string, number>
    ) => {
      Object.entries(weights).forEach(([label, pct]) => {
        rows.push({ label, group, amount: Math.round(pct * src) });
      });
    };
    push("ATL", aboveTheLine, ATL_WEIGHTS);
    push("BTL", belowTheLine, BTL_WEIGHTS);
    push("POST", post, POST_WEIGHTS);
    return rows;
  }, [aboveTheLine, belowTheLine, post]);

  type DeptGroup = "ATL" | "BTL" | "POST";

  // start with all groups selected
  const [deptGroups, setDeptGroups] = useState<Set<DeptGroup>>(
    () => new Set<DeptGroup>(["ATL", "BTL", "POST"])
  );

  const toggleGroup = (g: DeptGroup) =>
    setDeptGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      // never allow empty: if empty, re-enable all
      if (next.size === 0) return new Set<DeptGroup>(["ATL", "BTL", "POST"]);
      return next;
    });

  const deptCounts = useMemo(
    () => ({
      ATL: departmentLines.filter((d) => d.group === "ATL").length,
      BTL: departmentLines.filter((d) => d.group === "BTL").length,
      POST: departmentLines.filter((d) => d.group === "POST").length,
    }),
    [departmentLines]
  );

  const visibleDepartments = useMemo(
    () => departmentLines.filter((d) => deptGroups.has(d.group)),
    [departmentLines, deptGroups]
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <SectionOneHeader
        title="Finances"
        createdISO={projectCreatedISO}
        createdLabel={projectCreatedLabel}
        note="Budget, departments, per-scene costs, and revenue projections."
      />

      {/* Filter / Tab Row (no background, no border, no shadow) */}
      <section className="px-4 sm:px-6 pt-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "h-8 px-3 rounded-full text-[12px] font-medium",
                    active
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="text-[12px] text-gray-700 flex items-center gap-3">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                className="accent-black"
                checked={applyGaIncentive}
                onChange={(e) => setApplyGA(e.target.checked)}
              />
              GA 20% + 10% uplift
            </label>
            <span className="inline-flex items-center gap-1">
              <PiggyBank className="h-4 w-4" />
              Contingency: {contingencyPct}%
            </span>
            <span className="inline-flex items-center gap-1">
              <Landmark className="h-4 w-4" />
              Bond: {bondPct}%
            </span>
            <span className="inline-flex items-center gap-1">
              <Calculator className="h-4 w-4" />
              P&amp;A: {paPct}%
            </span>
          </div>
        </div>
      </section>

      {/* Main content section (scrollable) */}
      <section className="flex-1 min-h-0 px-4 sm:px-6 py-4 overflow-y-auto">
        {tab === "Overview" && (
          <div className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Production Budget"
              value={productionSubtotal}
              currency={currency}
              icon={<Film className="h-4 w-4" />}
            />
            <SummaryCard
              label="P&A (Marketing)"
              value={pa}
              currency={currency}
              icon={<Building2 className="h-4 w-4" />}
            />
            <SummaryCard
              label="Incentives (est.)"
              value={incentives}
              currency={currency}
              icon={<PiggyBank className="h-4 w-4" />}
            />
            <SummaryCard
              label="Negative Cost (net)"
              value={negativeCost}
              currency={currency}
              icon={<Calculator className="h-4 w-4" />}
            />

            <div className="md:col-span-2 rounded-2xl bg-white border border-gray-200 p-4">
              <h4 className="text-[13px] font-semibold text-gray-900">
                Inputs
              </h4>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
                <InlineNumber
                  label="Above the Line"
                  value={aboveTheLine}
                  onChange={setATL}
                />
                <InlineNumber
                  label="Below the Line"
                  value={belowTheLine}
                  onChange={setBTL}
                />
                <InlineNumber
                  label="Post-production"
                  value={post}
                  onChange={setPost}
                />
                <InlineNumber
                  label="Contingency %"
                  value={contingencyPct}
                  onChange={setContPct}
                  step={0.5}
                />
                <InlineNumber
                  label="Bond %"
                  value={bondPct}
                  onChange={setBondPct}
                  step={0.1}
                />
                <InlineNumber label="P&A %" value={paPct} onChange={setPAPct} />
              </div>

              <div className="mt-4 text-[11px] text-gray-600 leading-relaxed">
                Notes: ATL/BTL/Post categories and a ~10% contingency are
                industry-standard budgeting practice; many financiers/bond co’s
                expect it. Completion bonds are commonly ~1.8–3% of direct
                costs. P&amp;A for wide releases can approach production-scale.
                Assumptions can be tuned above.
              </div>
            </div>

            <div className="md:col-span-2 rounded-2xl bg-white border border-gray-200 p-4">
              <h4 className="text-[13px] font-semibold text-gray-900">
                Revenue Projection (summary)
              </h4>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
                <InlineNumber
                  label="Domestic BO Gross"
                  value={domesticBO}
                  onChange={setDomesticBO}
                />
                <InlineNumber
                  label="Intl BO Gross"
                  value={intlBO}
                  onChange={setIntlBO}
                />
                <InlineNumber
                  label="Dom Split %"
                  value={domSplit}
                  onChange={setDomSplit}
                />
                <InlineNumber
                  label="Intl Split %"
                  value={intlSplit}
                  onChange={setIntlSplit}
                />
                <InlineNumber
                  label="Streaming/TV Licenses"
                  value={streamingLicense}
                  onChange={setStreamLic}
                />
                <InlineNumber
                  label="Product Placement"
                  value={productPlacement}
                  onChange={setPP}
                />
                <InlineNumber
                  label="Other Licensing"
                  value={otherLicensing}
                  onChange={setOtherLic}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                <KPI
                  label="Distributor Rentals"
                  value={rentalsDomestic + rentalsIntl}
                  currency={currency}
                />
                <KPI
                  label="Producer-side Revenue"
                  value={producerSideRevenue}
                  currency={currency}
                />
              </div>

              <div className="mt-3 rounded-xl bg-gray-50 p-3 text-[12px]">
                <span
                  className={`font-semibold ${
                    profitable ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {profitable
                    ? "Projected break-even achieved"
                    : "Projected shortfall"}
                </span>{" "}
                of {fmt(producerSideRevenue - negativeCost, currency)} vs.
                negative cost.
              </div>

              <div className="mt-3 text-[11px] text-gray-600 leading-relaxed">
                Box-office shares vary by title and week; we normalize here to
                50% domestic / 40% international distributor rentals for
                planning. Adjust above as needed.
              </div>
            </div>

            {/* Department breakdown (now part of Overview) */}
            <div className="md:col-span-2 xl:col-span-4 rounded-2xl bg-white border border-gray-200 p-4">
              <h4 className="text-[13px] font-semibold text-gray-900">
                Department Breakdown
              </h4>

              {/* Group chips (selectable) */}
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                {(["ATL", "BTL", "POST"] as const).map((g) => {
                  const active = deptGroups.has(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGroup(g)}
                      className={[
                        "inline-flex items-center gap-1 px-2 h-7 rounded-full border border-gray-200",
                        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                        active
                          ? "bg-black text-white"
                          : "bg-white text-gray-900 hover:bg-gray-100",
                      ].join(" ")}
                      aria-pressed={active}
                      title={g}
                    >
                      <span className="inline-flex items-center justify-center h-5 min-w-[18px] rounded-full text-[10px] font-semibold bg-white/90 text-gray-900">
                        {deptCounts[g]}
                      </span>
                      {g}
                    </button>
                  );
                })}
              </div>

              {/* Cards grid (filtered) */}
              <div className="mt-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleDepartments.map((d) => (
                  <DeptCard
                    key={`${d.group}-${d.label}`}
                    label={`${d.label}`}
                    value={d.amount}
                    currency={currency}
                    icon={
                      <span className="h-4 w-4 rounded bg-gray-100 inline-flex items-center justify-center text-[10px] text-gray-700">
                        {d.group}
                      </span>
                    }
                  />
                ))}
              </div>

              <p className="mt-3 text-[11px] text-gray-600 leading-relaxed">
                Department estimates are allocated from ATL/BTL/Post using
                configurable weightings. Tune ATL/BTL/Post inputs above to see
                the breakdown update instantly.
              </p>
            </div>
          </div>
        )}

        {tab === "Scenes" && (
          <div className="rounded-2xl bg-white border border-gray-200 p-4">
            <h4 className="text-[13px] font-semibold text-gray-900">
              Per-Scene Cost (est.)
            </h4>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-[480px] w-full text-[12px]">
                <thead className="text-left text-gray-600">
                  <tr>
                    <th className="py-2 pr-3">Scene</th>
                    <th className="py-2">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {perScene.map((row) => (
                    <tr key={row.scene}>
                      <td className="py-2 pr-3 text-gray-800">
                        Scene {row.scene}
                      </td>
                      <td className="py-2 font-medium">
                        {fmt(row.estCost, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-gray-600">
              For a more accurate scene model, weight each scene by page count,
              cast size, stunts/VFX flags, night/ext, and company moves.
            </p>
          </div>
        )}

        {tab === "Revenues" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white border border-gray-200 p-4">
              <h4 className="text-[13px] font-semibold text-gray-900">
                Theatrical + Ancillaries
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                <InlineNumber
                  label="Domestic BO Gross"
                  value={domesticBO}
                  onChange={setDomesticBO}
                />
                <InlineNumber
                  label="Domestic Split %"
                  value={domSplit}
                  onChange={setDomSplit}
                />
                <InlineNumber
                  label="International BO Gross"
                  value={intlBO}
                  onChange={setIntlBO}
                />
                <InlineNumber
                  label="International Split %"
                  value={intlSplit}
                  onChange={setIntlSplit}
                />
                <InlineNumber
                  label="Streaming/TV Licenses"
                  value={streamingLicense}
                  onChange={setStreamLic}
                />
                <InlineNumber
                  label="Product Placement"
                  value={productPlacement}
                  onChange={setPP}
                />
                <InlineNumber
                  label="Other Licensing"
                  value={otherLicensing}
                  onChange={setOtherLic}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <KPI
                  label="Distributor Rentals (BO)"
                  value={rentalsDomestic + rentalsIntl}
                  currency={currency}
                />
                <KPI
                  label="Total Producer-side Revenue"
                  value={producerSideRevenue}
                  currency={currency}
                />
              </div>
              <p className="mt-3 text-[11px] text-gray-600">
                “Distributor rentals” approximate the distributor’s share of
                gross from exhibitors. A full recoupment waterfall (distribution
                fee, expenses, investor recoup, participations) applies in real
                deals.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-4">
              <h4 className="text-[13px] font-semibold text-gray-900">
                Break-Even vs. Negative Cost
              </h4>
              <div className="mt-3 text-[12px]">
                <KPI
                  label="Negative Cost (net of incentives)"
                  value={negativeCost}
                  currency={currency}
                />
                <KPI
                  label="Projected Producer-side Revenue"
                  value={producerSideRevenue}
                  currency={currency}
                />
                <div className="mt-3 rounded-xl bg-gray-50 p-3">
                  <span
                    className={`font-semibold ${
                      profitable ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {profitable
                      ? "Projected break-even achieved"
                      : "Projected shortfall"}
                  </span>{" "}
                  {fmt(breakEvenDelta, currency)}
                </div>
              </div>
              <div className="mt-3 text-[11px] text-gray-600">
                Toggle the GA incentive and adjust splits to see sensitivity.
                Add P&amp;A to reflect release scale; wide releases generally
                require larger P&amp;A.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function SummaryCard({
  label,
  value,
  currency,
  icon,
}: {
  label: string;
  value: number;
  currency: Currency;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-gray-600">{label}</div>
        {icon}
      </div>
      <div className="mt-1 text-[18px] font-semibold">
        {fmt(value, currency)}
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  currency,
}: {
  label: string;
  value: number;
  currency: Currency;
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
      <div className="text-[11px] text-gray-600">{label}</div>
      <div className="text-[15px] font-semibold">{fmt(value, currency)}</div>
    </div>
  );
}

function DeptCard({
  label,
  value,
  currency,
  icon,
}: {
  label: string;
  value: number;
  currency: Currency;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-gray-600">{label}</div>
        {icon}
      </div>
      <div className="mt-2 text-[18px] font-semibold">
        {fmt(value, currency)}
      </div>
    </div>
  );
}

function InlineNumber({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="min-w-[120px] text-gray-600">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full max-w-[180px] rounded-lg border border-gray-200 px-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </label>
  );
}

function fmt(n: number, c: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);
}
