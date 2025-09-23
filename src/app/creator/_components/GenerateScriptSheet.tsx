"use client";

import RightSheet from "@/components/creator/ui/RightSheet";
import Input from "@/components/creator/ui/Input";
import Select from "@/components/creator/ui/Select";
import Textarea from "@/components/creator/ui/Textarea";
import Button from "@/components/creator/ui/Button";
import { Audience, ContentType, Genre } from "@/types/creator/creator";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function GenerateScriptSheet({
  open,
  onClose,
  onSubmit, // must return a Promise (throws on error)
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: {
    name: string;
    genre: Genre;
    audience: Audience;
    content: ContentType;
    description: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("Morpheus The Dream Realm");
  const [genre, setGenre] = useState<Genre>("Fantasy");
  const [audience, setAudience] = useState<Audience>("Adults");
  const [content, setContent] = useState<ContentType>("Movie");
  const [desc, setDesc] = useState(
    "The story should explore a mystical world where dreams and nightmares shape reality..."
  );
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      await onSubmit({ name, genre, audience, content, description: desc });
      onClose(); // close only after success
    } catch (e: any) {
      setErr(e?.message || "Failed to generate script");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RightSheet
      title="Generate Scripts"
      open={open}
      onClose={onClose}
      canClose={!submitting}
      footer={
        <Button
          onClick={handleSubmit}
          className="w-full inline-flex items-center gap-2"
          disabled={submitting}
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Generating script…" : "Generate script"}
        </Button>
      }
      widthClass="w-[420px]"
    >
      <div className="space-y-4">
        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Script name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Genre</label>
          <Select
            value={genre}
            onChange={(v) => setGenre(v as Genre)}
            options={[
              "Action",
              "Fantasy",
              "Sci-Fi",
              "Drama",
              "Comedy",
              "Thriller",
              "Horror",
            ].map((g) => ({ label: g, value: g }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Audience
          </label>
          <Select
            value={audience}
            onChange={(v) => setAudience(v as Audience)}
            options={["Adults", "Teens", "Kids"].map((a) => ({
              label: a,
              value: a,
            }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Content</label>
          <Select
            value={content}
            onChange={(v) => setContent(v as ContentType)}
            options={["Movie", "Series", "Short"].map((a) => ({
              label: a,
              value: a,
            }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Description prompt
          </label>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>
    </RightSheet>
  );
}
