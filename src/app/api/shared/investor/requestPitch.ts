import { ENV } from "@/config/env";


const API_BASE = ENV.API_BASE;

export type CreateDealPayload = {
  creatorEmail: string;
  projectId: string;
  investorEmail: string;
  meetingUrl: string;
  meetingDate: number | string; // epoch seconds OR ISO
  comments?: string;
  value: number;
};

export type CreateDealResponse = {
  ok: boolean;
  error?: string;
};

export async function createInvestmentDeal(
  payload: CreateDealPayload,
  endpoint = "/investments/deals"
): Promise<CreateDealResponse> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  let json: CreateDealResponse;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: "Invalid JSON from server" };
  }
  return json;
}
