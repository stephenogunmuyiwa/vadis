"use client";

import RightSheet from "@/components/creator/ui/RightSheet";
import Select from "@/components/creator/ui/Select";
import Textarea from "@/components/creator/ui/Textarea";
import Button from "@/components/creator/ui/Button";
import { ScriptItem } from "@/types/creator/creator";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function GenerateDeckSheet({
  open,
  onClose,
  scripts,
  onSubmit, // must return a Promise and throw on error
}: {
  open: boolean;
  onClose: () => void;
  scripts: ScriptItem[];
  onSubmit: (v: {
    fromScriptId: string;
    colorTheme: string;
    prompt: string;
  }) => Promise<void>;
}) {
  const [from, setFrom] = useState("");
  const [color, setColor] = useState("Fantasy");
  const [prompt, setPrompt] = useState(
    "Generate a professional pitch deck for my film project..."
  );
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scriptOptions = useMemo(
    () => scripts.map((s) => ({ label: s.name, value: s.id })),
    [scripts]
  );

  useEffect(() => {
    if (open) {
      setFrom(scripts[0]?.id ?? "");
      setErr(null);
      setSubmitting(false);
    }
  }, [open, scripts]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      await onSubmit({ fromScriptId: from, colorTheme: color, prompt });
      onClose(); // only close after the API succeeds
    } catch (e: any) {
      setErr(e?.message || "Failed to generate pitch deck");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RightSheet
      title="Generate Pitch deck"
      open={open}
      onClose={onClose}
      canClose={!submitting}
      footer={
        <Button
          onClick={handleSubmit}
          className="w-full inline-flex items-center gap-2"
          disabled={submitting || !from}
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Generating pitch deck…" : "Generate Pitch deck"}
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
            Attach script
          </label>
          <Select value={from} onChange={setFrom} options={scriptOptions} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Color</label>
          <Select
            value={color}
            onChange={setColor}
            options={[
              "Fantasy",
              "Action",
              "Drama",
              "Comedy",
              "Sci-Fi",
              "Thriller",
              "Neutral",
            ].map((g) => ({ label: g, value: g }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">
            Pitch prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </div>
    </RightSheet>
  );
}
