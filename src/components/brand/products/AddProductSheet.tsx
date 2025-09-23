// components/products/AddProductSheet.tsx
"use client";
import { Sheet } from "@/components/brand/ui/Sheet";
import { Input } from "@/components/brand/ui/Input";
import { Select } from "@/components/brand/ui/Select";
import { Button } from "@/components/brand/ui/Button";
import { Upload, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "@/hooks/production/useSession";
import { useRef, useState } from "react";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE;
const categories = [
  "Electronics",
  "Food",
  "Automobile",
  "Tablet",
  "Symbol",
  "Audio",
  "Drinks",
  "Clothing",
].map((v) => ({ label: v, value: v }));

type ApiProduct = {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  created_date?: number;
  value: number;
  created_by?: string;
};

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 40) || "product"
  );
}
function makeProductId(name: string) {
  const slug = slugify(name);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}
function parsePriceToNumber(input: string) {
  // Accepts “30,000”, “30000”, “30,000.50”, etc.
  const normalized = input.replace(/[^\d.]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function AddProductSheet({
  open,
  onClose,
  onCreated, // notify parent to refresh list
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (p: ApiProduct) => void;
}) {
  const { brand: profileId } = useParams<{ brand: string }>();
  const { session } = useSession();
  const brandEmail = session?.ok ? session.email : undefined;

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [name, setName] = useState("Iphone 16");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("30,000"); // UI string; will convert to numeric value
  const [desc, setDesc] = useState("Desc."); // not sent (no field in API), kept for UI parity

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFile = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (!f) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  async function createProduct() {
    setSubmitting(true);
    setError(null);
    try {
      if (!brandEmail) throw new Error("Missing brand email from session.");
      if (!profileId) throw new Error("Missing profileId from route.");

      const id = makeProductId(name);
      const createdDate = Date.now();
      const value = parsePriceToNumber(price);
      if (!value && value !== 0) throw new Error("Invalid price/value.");

      let res: Response;

      if (file) {
        const fd = new FormData();
        fd.append("brandEmail", brandEmail);
        fd.append("profileId", profileId);
        fd.append("id", id);
        fd.append("name", name);
        fd.append("category", category);
        fd.append("value", String(value));
        fd.append("created_date", String(createdDate));
        fd.append("file", file);

        res = await fetch(`${API_BASE}/brands/products`, {
          method: "POST",
          body: fd,
        });
      } else {
        res = await fetch(`${API_BASE}/brands/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandEmail,
            profileId,
            id,
            name,
            category,
            value,
            created_date: createdDate,
            image_url: null,
          }),
        });
      }

      const json = (await res.json()) as {
        ok: boolean;
        data?: ApiProduct;
        error?: string;
      };
      if (!json.ok) {
        throw new Error(json.error || "Failed to add product.");
      }

      onCreated?.(json.data!);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add Product" width={480}>
      <div className="space-y-5">
        <div>
          <div className="text-right text-xs text-indigo-700">
            Profile: {profileId}
          </div>
          <div className="mt-2 flex items-start gap-4">
            <div className="flex h-40 w-40 flex-col items-center justify-center rounded-xl border-2 border-dashed">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-xs text-zinc-500">
                  <Upload className="mb-2 h-5 w-5" />
                  <span>Upload Png, Jpeg</span>
                  <span>or SVG files.</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <Button variant="outline" className="h-10" onClick={pickFile}>
                Upload image
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-700">Product name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-zinc-700">Category</span>
            <Select
              value={category}
              onChange={setCategory}
              options={categories}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-zinc-700">Price</span>
            <div className="relative">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                $
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Default price (used as <code>value</code>).
            </p>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-zinc-700">
              Product description
            </span>
            <textarea
              className="min-h-[110px] w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Desc."
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="pt-3">
          <Button
            className="h-11 w-full"
            onClick={createProduct}
            disabled={submitting || !name || !category || !price}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </span>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
