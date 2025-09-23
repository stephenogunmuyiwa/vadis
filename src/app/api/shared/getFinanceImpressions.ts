// app/api/shared/financeImpressions.ts

import {
  FinanceImpressionsRequest,
  FinanceImpressionsResponseRaw,
  FinanceBundle,
  BrandDealRow,
  InvestmentRow,
} from "@/types/finance";
import { ENV } from "@/config/env";


const BASE = ENV.API_BASE;

/** Call Flask: POST /project/finance-impressions */
export async function fetchFinanceImpressions(
  payload: FinanceImpressionsRequest
): Promise<FinanceImpressionsResponseRaw> {
  const res = await fetch(`${BASE}/project/finance-impressions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Always try to read JSON for consistent error messages
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: `Invalid JSON (${res.status} ${res.statusText})` };
  }

  // Network status error OR backend ok=false
  if (!res.ok) {
    if (json && typeof json === "object") return json as FinanceImpressionsResponseRaw;
    return { ok: false, error: `${res.status} ${res.statusText}` };
  }

  return json as FinanceImpressionsResponseRaw;
}

/** Normalize Flask payload into FinancesView-friendly shapes */
export function normalizeFinanceImpressions(
  raw: FinanceImpressionsResponseRaw
): { ok: true; data: FinanceBundle } | { ok: false; error: string } {
  if (!raw.ok) return { ok: false, error: raw.error };

  const d = raw.data;

  // impressions (map twitter -> x)
  const impressions = {
    instagram: d.impressions.instagram ?? 0,
    tiktok: d.impressions.tiktok ?? 0,
    youtube: d.impressions.youtube ?? 0,
    x: d.impressions.twitter ?? 0,
  };

  // flatten brand deals: 1 row per product
  const brandDeals: BrandDealRow[] = [];
  for (const bd of d.brand_deals ?? []) {
    const ai = bd.is_ai_suggested ? "Yes" : "No";
    for (const p of bd.products ?? []) {
      brandDeals.push({
        id: p.id,
        brandName: bd.brand_name || p.brand_name,
        itemName: p.item_name,
        imageUrl: p.image_url || undefined,
        value: p.value ?? 0,
        category:p.category ?? "Uncategorized",
        aiSuggested: ai,
        sceneImageUrl: p.product_scene_url || undefined,
      });
    }
  }

  // investments
  const investments: InvestmentRow[] = (d.investments ?? []).map((i) => ({
    id: i.id,
    investorId: i.investor_id,
    name: i.name,
    value: i.value,
    meetingDate: i.meeting_date,
    meetingLink: i.meeting_link,
    requestPitch: i.request_pitch,
    comments: i.comments,
  }));

  return {
    ok: true,
    data: {
      title: d.title,
      estimatedBudget: d.estimated_budget,
      estimatedROI: d.estimated_ROI,
      impressions,
      brandDeals,
      investments,
    },
  };
}

/** Convenience: fetch + normalize in one call */
export async function getFinanceBundle(
  payload: FinanceImpressionsRequest
): Promise<{ ok: true; data: FinanceBundle } | { ok: false; error: string }> {
  const raw = await fetchFinanceImpressions(payload);
  return normalizeFinanceImpressions(raw);
}
