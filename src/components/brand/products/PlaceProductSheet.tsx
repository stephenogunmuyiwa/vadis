"use client";

import { Button } from "@/components/brand/ui/Button";
import { Search, X, Check } from "lucide-react";
import { Input } from "@/components/brand/ui/Input";
import * as React from "react";
import { ENV } from "@/config/env";
import { useRouter } from "next/navigation";

const API_BASE = ENV.API_BASE;

type BrandDealProduct = {
  id?: string;
  item_name?: string;
  name?: string; // from /brands/products
  category?: string;
  value?: number;
  image_url?: string;
  product_scene_url?: string; // may not exist on list API
  brand_id?: string;
  brand_name?: string;
  created_by?: string; // ⬅️ add this
};

type ProductsListResponse = {
  ok: boolean;
  error?: string;
  count?: number;
  data?: BrandDealProduct[];
};

function PlaceProductSheet({
  open,
  onClose,
  brandId, // profileId (required)
  brandEmail, // from session (required)
  brandLabel, // brand display name
  projectId,
  creatorEmail,
  onSuccess, // ✅ NEW
}: {
  open: boolean;
  onClose: () => void;
  brandId: string;
  brandEmail?: string;
  brandLabel?: string;
  projectId: string;
  creatorEmail: string;
  onSuccess?: () => void; // ✅ NEW
}) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false); // loading products list
  const [submitting, setSubmitting] = React.useState(false); // placing deal
  const [error, setError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<BrandDealProduct[]>([]);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  // fetch when opened
  React.useEffect(() => {
    let cancel = false;

    async function load() {
      if (!open) return;
      if (!brandEmail || !brandId) {
        setError("Missing brandEmail or profileId.");
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams({ brandEmail, profileId: brandId });
        const res = await fetch(`${API_BASE}/brands/products?${qs}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as ProductsListResponse;

        if (cancel) return;

        if (!res.ok || json.ok === false) {
          setError(json?.error || `Failed to load (${res.status})`);
          setProducts([]);
        } else {
          setProducts(json.data || []);
        }
      } catch (e: any) {
        if (!cancel) setError(e?.message || "Network error");
        setProducts([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    load();
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, brandEmail, brandId]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = (p.name || p.item_name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return name.includes(q) || cat.includes(q);
    });
  }, [products, query]);

  const toggle = (id: string | undefined) => {
    if (!id || submitting) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hardClose = () => {
    if (submitting) return; // don't close while placing
    setSelected(new Set());
    onClose();
  };

  const placeDisabled = selected.size === 0 || loading || submitting;

  async function onPlaceProducts() {
    if (placeDisabled) return;
    setSubmitError(null);

    // normalize selected products to the expected schema
    const selectedProducts = products.filter((p) => p.id && selected.has(p.id));
    const normalized = selectedProducts.map((p) => ({
      id: p.id,
      item_name: p.item_name || p.name || "",
      category: p.category || "",
      image_url: p.image_url || "",
      product_scene_url: p.product_scene_url || "",
      // using ms since epoch; backend treats it as metadata
      date_added: Date.now(),
      value: typeof p.value === "number" ? p.value : undefined,
    }));

    const payload = {
      creatorEmail,
      projectId,
      brandId,
      brandName:
        selectedProducts[0]?.created_by ||
        selectedProducts[0]?.brand_name ||
        brandLabel ||
        "Unknown",
      isAISuggested: false,
      isApproved: false,
      products: normalized,
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/brands/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || json?.ok === false) {
        setSubmitError(json?.error || `Request failed (${res.status})`);
        return;
      }

      // success: refresh the PlacementDetailPage to show the new bid,
      // then close the sheet.
      router.refresh();
      onSuccess?.();

      onClose();
      setSelected(new Set());
    } catch (e: any) {
      setSubmitError(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-full">
      {/* overlay (disabled while submitting) */}
      <div
        className={`fixed inset-0 z-[998] bg-black/20 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        } ${submitting ? "cursor-wait" : ""}`}
        onClick={hardClose}
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[999] h-full w-[92vw] max-w-[520px] transform bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="text-[15px] font-medium">Place Product</div>
            {brandLabel && (
              <div className="mt-0.5 text-xs text-indigo-700">
                Brand: {brandLabel}
              </div>
            )}
          </div>
          <button
            onClick={hardClose}
            aria-label="Close"
            disabled={submitting}
            className="rounded p-2 text-zinc-500 hover:bg-zinc-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* search */}
        <div className="px-5 py-3">
          <label className="mb-2 block text-xs font-medium text-zinc-700">
            Select product
          </label>
          <div className="relative">
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              disabled={submitting}
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <div className="rounded-lg border">
            <div className="border-b px-3 py-2 text-[12px] text-zinc-500">
              Products
            </div>

            {/* loading skeleton */}
            {loading && (
              <ul className="divide-y">
                {Array.from({ length: 7 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3 px-3 py-3">
                    <div className="h-8 w-8 rounded bg-zinc-200 animate-pulse" />
                    <div className="h-4 w-40 rounded bg-zinc-200 animate-pulse" />
                  </li>
                ))}
              </ul>
            )}

            {/* error */}
            {!loading && error && (
              <div className="px-3 py-4 text-sm text-red-600">{error}</div>
            )}

            {/* data */}
            {!loading && !error && (
              <ul className="divide-y">
                {filtered.length === 0 ? (
                  <li className="px-3 py-4 text-sm text-zinc-600">
                    No products found.
                  </li>
                ) : (
                  filtered.map((p) => {
                    const id = p.id || "";
                    const name = p.name || p.item_name || "Unnamed";
                    const cat = p.category || "";
                    const picked = selected.has(id);
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => toggle(id)}
                          disabled={submitting}
                          className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-zinc-50 disabled:opacity-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid place-items-center h-8 w-8 rounded bg-zinc-100 ring-1 ring-zinc-200 overflow-hidden">
                              {p.image_url ? (
                                <img
                                  src={p.image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-6 w-6 rounded bg-zinc-200" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-zinc-800">
                                {name}
                              </div>
                              {cat && (
                                <div className="text-xs text-zinc-500">
                                  {cat}
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded border ${
                              picked
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-zinc-300"
                            }`}
                            aria-hidden="true"
                          >
                            {picked && <Check className="h-4 w-4" />}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="mt-auto border-t px-5 py-4">
          {!!submitError && (
            <div className="mb-2 text-xs text-red-600">{submitError}</div>
          )}
          <div className="mb-2 text-right text-xs text-zinc-600">
            Products Selected: ({selected.size})
          </div>
          <Button
            className="w-full"
            disabled={placeDisabled}
            onClick={onPlaceProducts}
          >
            {submitting ? "Placing…" : "Place Product"}
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default PlaceProductSheet;
