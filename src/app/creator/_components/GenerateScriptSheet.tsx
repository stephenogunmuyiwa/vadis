"use client";

import RightSheet from "@/components/creator/ui/RightSheet";
import Input from "@/components/creator/ui/Input";
import Select from "@/components/creator/ui/Select";
import Textarea from "@/components/creator/ui/Textarea";
import Button from "@/components/creator/ui/Button";
import { Audience, ContentType, Genre } from "@/types/creator/creator";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ENV } from "@/config/env";

/** Trending topics type from Flask endpoint */
type TrendingTopic = {
  topic: string;
  subgenres?: string[];
  story_hook?: string;
  why_trending?: string;
  sensitivity_flags?: string[];
};

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
    /** optional: trending topic chosen from dropdown */
    trendingTopic?: string;
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

  // --- NEW: trending topics state ---
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsErr, setTopicsErr] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const topicOptions = useMemo(
    () => [
      { label: "Select a trending topic", value: "" },
      ...topics.map((t) => ({ label: t.topic, value: t.topic })),
    ],
    [topics]
  );

  useEffect(() => {
    async function fetchTopics() {
      setTopicsLoading(true);
      setTopicsErr(null);
      try {
        const base = ENV.API_BASE; // e.g. http://localhost:5001
        const url = `${base}/trending/script-topics?country=US&n=12`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `Failed with ${res.status}`);
        }
        const payload = await res.json();
        if (!payload?.ok) throw new Error(payload?.error || "Unknown error");
        setTopics(payload?.data ?? []);
      } catch (e: any) {
        setTopicsErr(e?.message || "Failed to load topics");
      } finally {
        setTopicsLoading(false);
      }
    }

    if (open) {
      // fetch when the sheet opens
      fetchTopics();
    }
  }, [open]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setErr(null);
    try {
      await onSubmit({
        name,
        genre,
        audience,
        content,
        description: desc,
        trendingTopic: selectedTopic || undefined,
      });
      onClose(); // close only after success
    } catch (e: any) {
      setErr(e?.message || "Failed to generate script");
    } finally {
      setSubmitting(false);
    }
  }

  // --- small inline skeleton for the topics block ---
  function TopicSkeleton() {
    return (
      <div className="space-y-2">
        <div className="h-9 w-full animate-pulse rounded-md bg-neutral-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  }

  const activeTopic = useMemo(
    () => topics.find((t) => t.topic === selectedTopic),
    [topics, selectedTopic]
  );

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
          disabled={submitting || topicsLoading}
        >
          {(submitting || topicsLoading) && (
            <Loader2 size={16} className="animate-spin" />
          )}
          {submitting
            ? "Generating script…"
            : topicsLoading
            ? "Loading topics…"
            : "Generate script"}
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

        {/* Trending topics block */}
        <div className="rounded-xl border border-neutral-200 p-3">
          <div className="mb-2 text-xs font-medium text-neutral-600">
            Trending topics
          </div>

          {topicsLoading ? (
            <TopicSkeleton />
          ) : topicsErr ? (
            <div className="space-y-2">
              <div className="text-xs text-red-700">{topicsErr}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // simple retry
                  setTopicsErr(null);
                  setTopicsLoading(true);
                  fetch(
                    `${ENV.API_BASE}/trending/script-topics?country=US&n=12`,
                    {
                      cache: "no-store",
                    }
                  )
                    .then(async (r) => {
                      if (!r.ok) throw new Error(await r.text());
                      const j = await r.json();
                      if (!j?.ok) throw new Error(j?.error || "Unknown error");
                      setTopics(j?.data ?? []);
                    })
                    .catch((e) =>
                      setTopicsErr(e?.message || "Failed to load topics")
                    )
                    .finally(() => setTopicsLoading(false));
                }}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <Select
                value={selectedTopic}
                onChange={(v) => {
                  const val = v as string;
                  setSelectedTopic(val);

                  const picked = topics.find((t) => t.topic === val);
                  if (picked) {
                    // title ← topic
                    setName(picked.topic);

                    // description ← story_hook (fallback: keep current)
                    if (picked.story_hook && picked.story_hook.trim()) {
                      setDesc(picked.story_hook.trim());
                    }
                  }
                }}
                options={topicOptions}
              />

              {/* Helpful context preview for the chosen topic */}
              {activeTopic && (
                <div className="mt-3 space-y-2 rounded-lg bg-neutral-50 p-3">
                  {activeTopic.story_hook && (
                    <p className="text-xs text-neutral-700">
                      <span className="font-medium">Hook:</span>{" "}
                      {activeTopic.story_hook}
                    </p>
                  )}
                  {activeTopic.subgenres?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {activeTopic.subgenres.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

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
