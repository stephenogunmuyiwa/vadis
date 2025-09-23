"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { BrandTopbar } from "@/components/brand/layout/BrandTopbar";
import { useDisclosure } from "@/hooks/brand/useDisclosure";
import { AddProductSheet } from "@/components/brand/products/AddProductSheet";
import { ProductDetailsSheet } from "@/components/brand/products/ProductDetailsSheet";
import { ProductTable } from "@/components/brand/data/ProductTable";
import { ProductTableSkeleton } from "@/components/brand/data/ProductTableSkeleton";
import type { Product } from "@/types/brand/brand";
import { useSession } from "@/hooks/production/useSession";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE;

type ApiProduct = {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  created_date?: number;
  value?: number;
  created_by?: string;
};

export default function CataloguePage() {
  const params = useParams<{ brand: string }>(); // brand == profileId
  const profileId = params.brand;
  const { session, isLoading: sessionLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  const add = useDisclosure(false);
  const details = useDisclosure(false);
  const [selected, setSelected] = React.useState<Product | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<Product[]>([]);

  const prettyBrand = React.useMemo(() => {
    return (
      (profileId || "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase())
        .trim() || "Brand"
    );
  }, [profileId]);

  const fetchProducts = React.useCallback(async () => {
    if (!email || !profileId) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/brands/products?brandEmail=${encodeURIComponent(
        email
      )}&profileId=${encodeURIComponent(profileId)}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = (await res.json()) as {
        ok: boolean;
        data?: ApiProduct[];
        error?: string;
      };

      if (!json.ok) {
        setError(json.error || "Failed to fetch products.");
        setItems([]);
      } else {
        const mapped: Product[] = (json.data || []).map((p) => ({
          id: p.id,
          brandId: profileId,
          brandName: prettyBrand,
          name: p.name,
          category: p.category,
          price: Number(p.value ?? 0),
          projectsCount: 0,
          image: p.image_url ?? undefined,
          description: undefined,
        }));
        setItems(mapped);
      }
    } catch (e: any) {
      setError(e?.message || "Network error.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [email, profileId, prettyBrand]);

  React.useEffect(() => {
    if (!sessionLoading && email) fetchProducts();
  }, [sessionLoading, email, fetchProducts]);

  return (
    <>
      <BrandTopbar
        currentProfile={{ id: profileId, name: prettyBrand }}
        onAdd={add.open}
      />
      <div className="mt-6">
        {loading ? (
          <ProductTableSkeleton />
        ) : error ? (
          <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
            {error}
          </div>
        ) : (
          <ProductTable
            products={items}
            onRowClick={(p) => {
              setSelected(p);
              details.open();
            }}
          />
        )}
      </div>

      <AddProductSheet
        open={add.isOpen}
        onClose={add.close}
        onCreated={() => {
          // re-fetch the products so the new one appears immediately
          fetchProducts();
        }}
      />

      <ProductDetailsSheet
        open={details.isOpen}
        onClose={details.close}
        product={selected}
      />
    </>
  );
}
