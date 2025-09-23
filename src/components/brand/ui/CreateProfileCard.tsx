"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, LogOut } from "lucide-react";
import { Input } from "@/components/brand/ui/Input";
import { Select } from "@/components/brand/ui/Select";
import { Button } from "@/components/brand/ui/Button";
import { ENV } from "@/config/env";
import { logout } from "@/lib/api";

const API_BASE = ENV.API_BASE;

const CATEGORY_OPTS = [
  "Electronics",
  "Food",
  "Automobile",
  "Clothing",
  "Drinks",
  "Beauty",
].map((v) => ({ label: v, value: v }));

function makeProfileId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug || "brand"}-${suffix}`;
}

type CreateResponse = {
  ok: boolean;
  data?: { id: string };
  error?: string;
};

export function CreateProfileCard({ defaultEmail }: { defaultEmail?: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [name, setName] = useState("Apple Inc.");
  const [category, setCategory] = useState("Electronics");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = () => fileRef.current?.click();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(f);
  }

  async function onSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      if (!defaultEmail) {
        setError("Missing brand email from session.");
        return;
      }

      const id = makeProfileId(name);
      const createdDate = Date.now();

      let res: Response;

      if (file) {
        const fd = new FormData();
        fd.append("brandEmail", defaultEmail);
        fd.append("id", id);
        fd.append("name", name);
        fd.append("category", category);
        fd.append("created_date", String(createdDate));
        fd.append("file", file);

        // NOTE: do NOT set Content-Type for FormData; browser will handle it.
        res = await fetch(`${API_BASE}/brands/profiles`, {
          method: "POST",
          body: fd,
        });
      } else {
        res = await fetch(`${API_BASE}/brands/profiles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandEmail: defaultEmail,
            id,
            name,
            category,
            created_date: createdDate,
            image_url: null,
          }),
        });
      }

      const json: CreateResponse = await res.json();

      if (!json.ok) {
        throw new Error(json.error || "Failed to create profile.");
      }

      // Success: send the user to the catalogue for the new profile
      const profileId = json.data?.id || id;
      router.replace(`/brand/${profileId}/catalogue`);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header (matches mock) */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-zinc-900" />
          <span className="text-sm font-medium">Vadis AI Media</span>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.replace("/");
          }}
          className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:underline"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </header>

      <div className="mx-auto my-10 flex max-w-[920px] justify-center px-4">
        <div className="w-[520px] rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Create a Profile</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Create a brand profile to showcase your identity, share your story,
            and connect with creators.
          </p>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300">
              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-center text-xs text-zinc-500">
                  <Upload className="mb-2 h-5 w-5" />
                  <span>Upload Png, Jpeg</span>
                  <span>or SVG files.</span>
                </div>
              )}
            </div>

            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFile}
                className="hidden"
              />
              <Button variant="outline" onClick={openPicker}>
                Upload image
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-zinc-700">Profile name</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-zinc-700">Category</span>
              <Select
                value={category}
                onChange={setCategory}
                options={CATEGORY_OPTS}
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            className="mt-6 h-11 w-full bg-[#3E3EFF] hover:bg-[#2F2FEF]"
            disabled={!name || !category || submitting}
            onClick={onSubmit}
          >
            {submitting ? "Creating…" : "Create a brand"}
          </Button>
        </div>
      </div>
    </div>
  );
}
