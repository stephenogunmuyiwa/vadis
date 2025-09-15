// src/components/modals/ProjectDeleteSheet.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Trash2 } from "lucide-react";
import type { UserProject } from "@/types/project";
import { useDeleteProject } from "@/hooks/production/useDeleteProject";

type Props = {
  open: boolean;
  onClose: () => void;
  project: UserProject | null;
  userEmail?: string;
  onDeleted?: (projectId: string) => void;
};

export default function ProjectDeleteSheet({
  open,
  onClose,
  project,
  userEmail,
  onDeleted,
}: Props) {
  const { submit, loading, error, setError } = useDeleteProject();
  const [confirmText, setConfirmText] = useState("");

  const createdISO = useMemo(
    () => (project ? new Date(project.created_date).toISOString() : ""),
    [project]
  );
  const createdLabel = useMemo(() => {
    if (!project) return "—";
    const d = new Date(project.created_date);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  }, [project]);

  useEffect(() => {
    if (!open) {
      setConfirmText("");
      setError(null);
    }
  }, [open, setError]);

  const canDelete =
    !!project && !!userEmail && confirmText.trim() === project.id && !loading;

  const handleDelete = async () => {
    if (!project || !userEmail) return;
    const res = await submit({ projectId: project.id, userEmail });
    if (res.ok) {
      onClose();
      onDeleted?.(project.id);
    }
  };

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-[100] transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-screen bg-white shadow-xl border-l",
          "w-[20vw] min-w-[320px] max-w-[520px]",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-sm text-gray-500">
            Delete{" "}
            <span className="font-semibold text-gray-900">
              {project?.id ?? "—"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <div className="text-xs text-gray-500">Title</div>
            <div className="text-sm font-medium text-gray-900">
              {project?.title ?? "—"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">Created</div>
              <div className="text-sm text-gray-900">{createdLabel}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Created ISO</div>
              <div className="text-[11px] text-gray-700 break-all">
                {createdISO || "—"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Preview</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {project?.preview_text || "No preview available."}
            </p>
          </div>

          <div className="pt-2">
            <label className="text-xs text-gray-600">
              Type the <span className="font-semibold">Project ID</span> to
              confirm:
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project?.id ?? "PROJECT-ID"}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className={[
              "inline-flex items-center justify-center w-full h-10 rounded-md text-white",
              canDelete
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-400 cursor-not-allowed",
            ].join(" ")}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </button>
          {!userEmail && (
            <p className="mt-2 text-[11px] text-amber-700">
              User email is required to delete. Please sign in or provide an
              email.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
