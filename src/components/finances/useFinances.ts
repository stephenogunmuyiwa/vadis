import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Currency = "USD" | "EUR" | "GBP";

export type FinanceInputs = {
  aboveTheLine: number;
  belowTheLine: number;
  post: number;
  contingencyPct: number;
  bondPct: number;
  paPct: number;
  incentives: {
    apply: boolean;
    scheme: string;
    basePct: number;
    upliftPct: number;
    qualifiedBase: "productionSubtotal" | string;
  };
  revenues: {
    domesticBO: number;
    intlBO: number;
    domSplit: number;
    intlSplit: number;
    streamingLicense: number;
    productPlacement: number;
    otherLicensing: number;
  };
  scenes: { count: number; weights: number[] | null };
};

export type Derived = {
  productionSubtotal: number;
  contingency: number;
  bond: number;
  pa: number;
  grossBudget: number;
  incentives: { base: number; uplift: number; total: number };
  negativeCost: number;
};

export type Revenues = {
  rentalsDomestic: number;
  rentalsIntl: number;
  producerSideRevenue: number;
  breakEvenDelta: number; // you used integer % in examples; treat as number
  profitable: boolean;
};

export type DeptLine = { group: "ATL" | "BTL" | "POST"; label: string; amount: number };
export type SceneLine = { scene: number; estCost: number };

export type FinanceModel = {
  ok: boolean;
  projectId: string;
  currency: Currency;
  inputs: FinanceInputs;
  weights: Record<string, Record<string, number>>;
  createdISO?: string;
  createdLabel?: string;
  scenesCount?: number;
  derived?: Derived;
  revenues?: Revenues;
  departments?: DeptLine[];
  scenes?: SceneLine[];
};

function pickIncludes(include?: string[]) {
  const csv = (include ?? ["derived","departments","scenes","revenues"]).join(",");
  return csv;
}

export function useFinances(projectId: string) {
  const [model, setModel] = useState<FinanceModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // a local, editable copy of inputs
  const [draft, setDraft] = useState<FinanceInputs | null>(null);
  const debounce = useRef<number | null>(null);

  const fetchAll = useCallback(async (include?: string[]) => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/finances?include=${pickIncludes(include)}`);
    const data: FinanceModel = await res.json();
    if (!res.ok || data.ok === false) {
      setError((data as any)?.error || "Failed to load finances");
      setLoading(false);
      return;
    }
    setModel(data);
    setDraft(structuredClone(data.inputs));
    setLoading(false);
  }, [projectId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // what-if compute (no persist)
  const compute = useCallback(async (nextInputs: FinanceInputs, include?: string[]) => {
    const res = await fetch(`/api/projects/${projectId}/finances/compute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: nextInputs, include: include ?? ["derived","departments","scenes","revenues"] }),
    });
    const data = await res.json();
    if (res.ok && data.ok !== false) {
      setModel((prev) => prev ? { ...prev, ...data } : prev);
    }
  }, [projectId]);

  // persist (partial)
  const persist = useCallback(async (partial: Partial<{ currency: Currency; inputs: Partial<FinanceInputs> }>) => {
    setSaving(true);
    const res = await fetch(`/api/projects/${projectId}/finances`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || data.ok === false) {
      setError(data?.error || "Failed to save");
    }
  }, [projectId]);

  // field update helper: updates draft, computes immediately, persists on blur
  function updateField<K extends keyof FinanceInputs>(key: K, value: FinanceInputs[K]) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      // live compute with debouncing for fast typing
      if (debounce.current) window.clearTimeout(debounce.current);
      debounce.current = window.setTimeout(() => compute(next), 150);
      return next;
    });
  }

  async function updateAndPersist<K extends keyof FinanceInputs>(key: K, value: FinanceInputs[K]) {
    updateField(key, value);
    await persist({ inputs: { [key]: value } as Partial<FinanceInputs> });
    // Optional: refresh from server as source of truth
    await fetchAll();
  }

  async function toggleGA(apply: boolean) {
    if (!draft) return;
    const incentives = { apply, scheme: "GA_20_10", basePct: 20, upliftPct: 10, qualifiedBase: "productionSubtotal" as const };
    updateField("incentives", incentives);
    await persist({ inputs: { incentives } });
    await fetchAll();
  }

  async function extractFromScript() {
    setSaving(true);
    const res = await fetch(`/api/projects/${projectId}/finances/extract-from-script?include=derived,departments,scenes,revenues`, { method: "POST" });
    const data: FinanceModel = await res.json();
    setSaving(false);
    if (!res.ok || data.ok === false) {
      setError((data as any)?.error || "Extraction failed");
      return;
    }
    setModel(data);
    setDraft(structuredClone(data.inputs));
  }

  return {
    model, draft, setDraft,
    loading, saving, error,
    fetchAll, compute, persist,
    updateField, updateAndPersist, toggleGA, extractFromScript,
  };
}
