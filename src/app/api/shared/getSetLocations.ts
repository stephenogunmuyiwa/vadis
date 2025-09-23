import { ENV } from "@/config/env";

export type SetLocationApiItem = {
  Region: string;
  Location: string;
  Incentive?: string;
  Minimum_Spend?: string;
  Eligible_Expenses?: string;
  Application_Deadline?: string;
  Notable_Conditions?: string;
};

export type RankSetsResponse =
  | {
      ok: true;
      project_id: string;
      count: number;
      recommendations: SetLocationApiItem[];
    }
  | { ok: false; error: string };

export async function rankSets(params: {
  userEmail: string;
  projectId: string;
  topK?: number;
}): Promise<RankSetsResponse> {
  const res = await fetch(
    `${ENV.API_BASE}/sets/rank`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: params.userEmail,
        projectId: params.projectId,
        ...(params.topK ? { topK: params.topK } : {}),
      }),
    }
  );

  if (!res.ok) {
    // map network-level failures to a consistent shape so the UI can show a message
    return { ok: false, error: `Request failed: ${res.status} ${res.statusText}` };
  }

  return (await res.json()) as RankSetsResponse;
}
