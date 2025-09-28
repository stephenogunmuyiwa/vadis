// components/script/ScriptEditor.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Save, RefreshCw, Undo2, Redo2, Loader2, FileDown } from "lucide-react";

import { ENV } from "@/config/env";

type Scene = { id: string; title: string; content: string };
type ScenesResponse = {
  ok: boolean;
  count?: number;
  data?: Scene[];
  error?: string;
};

type SceneState = {
  id: string;
  title: string;
  content: string;
  savedTitle: string;
  savedContent: string;
  past: Array<{ title: string; content: string }>;
  future: Array<{ title: string; content: string }>;
  saving: boolean;
  refreshing: boolean;
  error?: string | null;
};

export default function ScriptEditor({
  userEmail,
  projectId,
}: {
  userEmail: string;
  projectId: string;
}) {
  // Config
  const API_BASE = ENV.API_BASE;
  const PATH_GET_SCENES = "/scenes";
  const PATH_SAVE_SCENE = "/scene/save"; // adjust later if needed
  const MAX_HISTORY = 500;

  // State
  const [scenes, setScenes] = useState<SceneState[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /** -------- API: fetch all scenes -------- */
  const fetchScenes = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const qs = new URLSearchParams({ userEmail, projectId }).toString();
      const res = await fetch(`${API_BASE}${PATH_GET_SCENES}?${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const json: ScenesResponse = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to load scenes");

      const next =
        (json.data || []).map<SceneState>((s) => ({
          id: s.id,
          title: s.title || "",
          content: s.content || "",
          savedTitle: s.title || "",
          savedContent: s.content || "",
          past: [],
          future: [],
          saving: false,
          refreshing: false,
          error: null,
        })) ?? [];

      setScenes(next);
    } catch (e: any) {
      setLoadError(e?.message || "Failed to fetch scenes.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE, userEmail, projectId]);

  /** -------- API: save one scene -------- */
  const saveScene = useCallback(
    async (scene: SceneState) => {
      const title = scene.title.trim();
      const content = scene.content.trim();
      if (!title || !content) {
        throw new Error("Title and content are required.");
      }

      const res = await fetch(`${API_BASE}${PATH_SAVE_SCENE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          projectId,
          sceneId: scene.id,
          title,
          content,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        const msg = json?.error || `Save failed (${res.status})`;
        throw new Error(msg);
      }
    },
    [API_BASE, userEmail, projectId]
  );

  useEffect(() => {
    fetchScenes();
  }, [fetchScenes]);

  /** -------- Local state helpers -------- */
  const updateSceneState = useCallback(
    (
      id: string,
      patch: Partial<SceneState> | ((s: SceneState) => Partial<SceneState>)
    ) => {
      setScenes((list) =>
        list.map((s) =>
          s.id === id
            ? { ...s, ...(typeof patch === "function" ? patch(s) : patch) }
            : s
        )
      );
    },
    []
  );

  const applyChange = useCallback(
    (id: string, next: { title?: string; content?: string }) => {
      setScenes((list) =>
        list.map((s) => {
          if (s.id !== id) return s;
          const snap = { title: s.title, content: s.content };
          return {
            ...s,
            title: next.title ?? s.title,
            content: next.content ?? s.content,
            past: [...s.past, snap].slice(-MAX_HISTORY),
            future: [],
            error: null,
          };
        })
      );
    },
    []
  );

  const undo = useCallback(
    (id: string) => {
      updateSceneState(id, (s) => {
        if (!s.past.length) return {};
        const prev = s.past[s.past.length - 1];
        return {
          title: prev.title,
          content: prev.content,
          past: s.past.slice(0, -1),
          future: [{ title: s.title, content: s.content }, ...s.future],
        };
      });
    },
    [updateSceneState]
  );

  const redo = useCallback(
    (id: string) => {
      updateSceneState(id, (s) => {
        if (!s.future.length) return {};
        const nxt = s.future[0];
        return {
          title: nxt.title,
          content: nxt.content,
          future: s.future.slice(1),
          past: [...s.past, { title: s.title, content: s.content }].slice(
            -MAX_HISTORY
          ),
        };
      });
    },
    [updateSceneState]
  );

  const onSave = useCallback(
    async (id: string) => {
      const s = scenes.find((x) => x.id === id);
      if (!s) return;
      updateSceneState(id, { saving: true, error: null });
      try {
        await saveScene(s);
        updateSceneState(id, (prev) => ({
          saving: false,
          savedTitle: prev.title,
          savedContent: prev.content,
        }));
      } catch (e: any) {
        updateSceneState(id, {
          saving: false,
          error: e?.message || "Save failed",
        });
      }
    },
    [scenes, saveScene, updateSceneState]
  );

  const onRefresh = useCallback(
    async (id: string) => {
      updateSceneState(id, { refreshing: true, error: null });
      try {
        // pull latest for *this* scene
        const qs = new URLSearchParams({ userEmail, projectId }).toString();
        const res = await fetch(`${API_BASE}${PATH_GET_SCENES}?${qs}`, {
          cache: "no-store",
        });
        const json: ScenesResponse = await res.json();
        const fresh = (json?.data || []).find((s) => s.id === id);
        if (fresh) {
          updateSceneState(id, {
            title: fresh.title || "",
            content: fresh.content || "",
            savedTitle: fresh.title || "",
            savedContent: fresh.content || "",
            past: [],
            future: [],
          });
        }
      } finally {
        updateSceneState(id, { refreshing: false });
      }
    },
    [API_BASE, userEmail, projectId, updateSceneState]
  );
  const exportAll = useCallback(() => {
    // Join in current on-screen order
    const text = scenes
      .map((s) => `${s.title || ""}\n\n${s.content || ""}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [scenes, projectId]);

  function SceneSkeletonCard() {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-9 w-9 rounded-md border border-gray-300 bg-gray-200 animate-pulse" />
          <div className="h-9 w-9 rounded-md border border-gray-300 bg-gray-200 animate-pulse" />
          <div className="mx-2 h-5 w-px bg-gray-200" />
          <div className="h-9 w-9 rounded-md border border-gray-300 bg-gray-200 animate-pulse" />
          <div className="h-9 w-9 rounded-md border border-gray-300 bg-gray-200 animate-pulse" />
          <div className="ml-auto h-3 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-10 w-1/2 rounded-md bg-gray-200 animate-pulse mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-[92%] rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-[85%] rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-[70%] rounded bg-gray-200 animate-pulse" />
          <div className="h-24 w-full rounded bg-gray-200 animate-pulse" />
        </div>
      </section>
    );
  }
  // KB shortcuts on focused scene (Save/Undo/Redo)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const el = document.activeElement as HTMLElement | null;
      const root = el?.closest?.("[data-scene-id]") as HTMLElement | null;
      const id = root?.dataset?.sceneId;
      if (!id) return;
      const k = e.key.toLowerCase();
      if (k === "s") {
        e.preventDefault();
        onSave(id);
      } else if (k === "z") {
        e.preventDefault();
        e.shiftKey ? redo(id) : undo(id);
      } else if (k === "y") {
        e.preventDefault();
        redo(id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave, undo, redo]);

  /** -------- Render -------- */
  if (loading)
    return Array.from({ length: 10 }).map((_, i) => (
      <SceneSkeletonCard key={i} />
    ));
  if (loadError)
    return (
      <div className="w-full h-full grid place-items-center text-rose-700">
        Error: {loadError}
      </div>
    );
  if (!scenes.length)
    return (
      <div className="w-full h-full grid place-items-center">
        No scenes found.
      </div>
    );

  return (
    <div className="relative w-full h-full flex flex-col">
      <button
        type="button"
        onClick={exportAll}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 shadow-lg hover:bg-black"
        title="Export all scenes to a single .txt"
        aria-label="Export script"
      >
        <FileDown className="h-4 w-4" />
        <span className="text-sm">Export script</span>
      </button>
      {/* Scrollable list of scene cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {scenes.map((s) => {
          const dirty =
            s.title !== s.savedTitle || s.content !== s.savedContent;
          const canUndo = s.past.length > 0;
          const canRedo = s.future.length > 0;

          return (
            <section
              key={s.id}
              data-scene-id={s.id}
              className="rounded-2xl mx-[5vw] border border-gray-200 bg-white p-4"
            >
              {/* Toolbar */}
              <div className="mb-3 flex flex-wrap items-center gap-1">
                <button
                  onClick={() => onSave(s.id)}
                  disabled={s.saving}
                  className="inline-flex items-center justify-center rounded-md  bg-gray-900 text-white h-9 w-9 disabled:opacity-60"
                  title="Save (Ctrl/Cmd+S)"
                  aria-label="Save"
                >
                  {s.saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </button>

                <div className="mx-2 h-5 w-px bg-gray-200" />

                <button
                  onClick={() => undo(s.id)}
                  disabled={!canUndo}
                  className="inline-flex items-center justify-center rounded-md  bg-white h-9 w-9 hover:bg-gray-50 disabled:opacity-60"
                  title="Undo (Ctrl/Cmd+Z)"
                  aria-label="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => redo(s.id)}
                  disabled={!canRedo}
                  className="inline-flex items-center justify-center rounded-md  bg-white h-9 w-9 hover:bg-gray-50 disabled:opacity-60"
                  title="Redo (Ctrl+Y or Shift+Ctrl/Cmd+Z)"
                  aria-label="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </button>

                <span className="ml-auto text-xs text-gray-500">
                  {dirty ? "Unsaved changes" : "Saved"}
                </span>
              </div>

              {/* Title */}
              <input
                type="text"
                value={s.title}
                onChange={(e) => applyChange(s.id, { title: e.target.value })}
                placeholder="Scene title"
                className="w-full rounded-md border font-bold border-gray-300 px-3 py-2 text-base mb-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Content */}
              <textarea
                value={s.content}
                onChange={(e) => applyChange(s.id, { content: e.target.value })}
                placeholder="Scene content…"
                className="w-full min-h-40 rounded-md border border-gray-300 px-3 text-[12px] py-2 leading-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                spellCheck={false}
              />

              {/* Meta & error */}
              <div className="mt-2 text-xs text-gray-500">
                {s.content.split(/\s+/).filter(Boolean).length} words ·{" "}
                {s.content.length} characters
              </div>
              {s.error && (
                <div className="mt-2 text-xs text-rose-700">{s.error}</div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
