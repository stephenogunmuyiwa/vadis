// types/finance.ts

/** Request payload */
export type FinanceImpressionsRequest = {
  userEmail: string;
  projectId: string;
};

/** Raw shapes coming back from Flask (matches your sample) */
export type FinanceBrandDealProductRaw = {
  brand_id: string;
  brand_name: string;
  category?: string;
  date_added?: number;
  id: string;
  image_url?: string;
  item_name: string;
  product_scene_url?: string;
  value?: number;
};

export type FinanceBrandDealRaw = {
  brand_id: string;
  brand_name: string;
  is_ai_suggested?: boolean;
  is_approved?: boolean;
  products: FinanceBrandDealProductRaw[];
};

export type FinanceInvestmentRaw = {
  comments?: string;
  id: string;
  investor_email: string;
  meeting_date?: number;
  meeting_url?: string;
  name: string;
  request_pitch?: boolean;
  value: number;
};

export type FinanceDataRaw = {
  title: string;
  estimated_ROI: number;
  estimated_budget: number;
  impressions: {
    instagram?: number;
    tiktok?: number;
    twitter?: number; // Flask returns twitter
    youtube?: number;
  };
  brand_deals: FinanceBrandDealRaw[];
  investments: FinanceInvestmentRaw[];
};

export type FinanceImpressionsResponseRaw =
  | {
      ok: true;
      user_email: string;
      project_id: string;
      data: FinanceDataRaw;
    }
  | { ok: false; error: string };

/** ---------- Normalized shapes for the UI ---------- */

export type SocialImpressions = {
  instagram: number;
  tiktok: number;
  youtube: number;
  x: number; // mapped from twitter
};

export type BrandDealRow = {
  brand_id: string;
  id: string;
  brandName: string;
  itemName: string;
  imageUrl?: string;
  value: number;
  category: string; // <-- required to match RecentTransactions.BrandDeal
  aiSuggested: string;
  approved: string;
  sceneImageUrl?: string;
};

export type InvestmentRow = {
  id: string;
  investorId: string;
  name: string;
  value: number;
  meetingDate?: number;
  meetingLink?: string;
  requestPitch?: boolean;
  comments?: string;
};

export type FinanceBundle = {
  title: string;
  estimatedBudget: number;
  estimatedROI: number;
  impressions: SocialImpressions;
  brandDeals: BrandDealRow[];
  investments: InvestmentRow[];
};
