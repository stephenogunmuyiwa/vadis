"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSelectedProject } from "@/lib/investor/selection";
import { mapProjectsToCardModels } from "@/app/api/shared/investor/investor";
import type { ProjectApi } from "@/types/investor/project";
import {
  Play,
  Mail,
  Calendar,
  Link as LinkIcon,
  DollarSign,
  MessageSquare,
  X,
  Loader2,
} from "lucide-react";
import { createInvestmentDeal } from "@/app/api/shared/investor/requestPitch";
import { useSession } from "@/hooks/production/useSession";
import { toast } from "sonner";

const TabBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={[
      "pb-2 text-sm",
      active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700",
    ].join(" ")}
  >
    {children}
  </button>
);

export default function ProjectDetailsPage() {
  const { session, isLoading } = useSession();
  const [submitting, setSubmitting] = React.useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = React.useState<ProjectApi | null>(null);
  const [tab, setTab] = React.useState<"overview" | "posters">("overview");
  const [loading, setLoading] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const investorEmail = session?.ok ? session.email : undefined;
  // Form state
  const [meetingUrl, setMeetingUrl] = React.useState("");
  const [meetingDate, setMeetingDate] = React.useState("");
  const [amount, setAmount] = React.useState<number | "">("");
  const [comments, setComments] = React.useState("");

  const fmtDate = (ts?: number) => {
    if (!ts) return "Unknown date";
    // Handle either seconds or milliseconds epoch
    const ms = ts > 1e12 ? ts : ts * 1000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const onRequestPitch = async () => {
    if (!project?.id) return;

    // Basic required field guard (matches button disabled state)
    if (!meetingUrl || !meetingDate || amount === "" || !investorEmail) {
      toast.error("Please complete all required fields.");
      return;
    }

    const iso = meetingDate ? new Date(meetingDate).toISOString() : "";

    const payload = {
      creatorEmail: project?.creator || project?.creator_name || "",
      projectId: String(project.id),
      investorEmail: `${investorEmail}`,
      meetingUrl: meetingUrl.trim(),
      meetingDate: iso,
      comments: comments.trim() || undefined,
      value: Number(amount),
    };

    try {
      setSubmitting(true);
      const id = toast.loading("Sending pitch request…");

      const res = await createInvestmentDeal(payload);

      if (!res.ok) {
        toast.error(res.error || "Failed to create investment deal", { id });
        return;
      }

      toast.success("Request sent. The creator will get your pitch request.", {
        id,
      });
      // success reset
      setSheetOpen(false);
      setMeetingUrl("");
      setMeetingDate("");
      setAmount("");
      setComments("");
    } catch (e: any) {
      toast.error(e?.message || "Network error creating investment deal");
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    let cancelled = false;
    const cached = getSelectedProject();
    if (cached && String(cached.id) === String(projectId)) {
      setProject(cached);
      return;
    }

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const title = project?.title || project?.project_title || "Untitled project";
  const desc = project?.overview || "No overview available yet.";
  const preview = project?.preview_text || "No preview available yet.";
  const posters = Array.isArray(project?.poster_urls)
    ? project!.poster_urls
    : [];
  const hero = posters[0] || "";

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-neutral-50 px-6 py-6">
      <div className="mx-auto w-full rounded-2xl border border-neutral-200 bg-white p-6">
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            <Link href="/investor" className="hover:underline">
              Investor hub
            </Link>{" "}
            / <span className="text-neutral-800">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSheetOpen(true)}
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Request pitch
            </button>
          </div>
        </div>

        {/* Hero row */}
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-[280px,1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
            {hero ? (
              // Use next/image when remote host is allowed in next.config
              <img
                src={hero}
                alt={title}
                className="h-[220px] w-full object-cover"
              />
            ) : (
              <div className="h-[220px] w-full" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow">
                <Play className="h-6 w-6 text-neutral-800" />
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
            <p className="mt-1 text-sm text-neutral-600">{preview}</p>

            {/* Dummy metrics + tags (match list view styling) */}
            {/* Creator + created date */}
            <div className="mt-3 flex items-center gap-6 text-[13px] text-neutral-500">
              <span
                className="inline-flex items-center gap-2 max-w-[320px] truncate"
                title={
                  project?.creator || project?.creator_name || "Unknown creator"
                }
              >
                <Mail className="h-4 w-4" />
                {project?.creator || project?.creator_name || "Unknown creator"}
              </span>

              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {fmtDate(project?.created_date)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(project?.tags || []).slice(0, 3).map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex items-center gap-6 border-b border-neutral-200">
            <TabBtn
              active={tab === "overview"}
              onClick={() => setTab("overview")}
            >
              Overview
            </TabBtn>
            <TabBtn
              active={tab === "posters"}
              onClick={() => setTab("posters")}
            >
              Posters
            </TabBtn>
          </div>

          {/* Tab content */}
          <div className="pt-5">
            {tab === "overview" && (
              <div className="space-y-5 text-sm leading-6 text-neutral-600">
                <p>{desc}</p>
              </div>
            )}

            {tab === "posters" && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {posters.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="overflow-hidden rounded-xl border border-neutral-200"
                  >
                    <img
                      src={src}
                      alt={`Poster ${i + 1}`}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ))}
                {!posters.length && (
                  <div className="text-sm text-neutral-500">
                    No posters available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row (production cost + ROI button) */}
        <div className="mt-[10vh] flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="text-sm text-neutral-600">
            Estimated budget:{" "}
            <span className="font-semibold text-neutral-900">
              {project?.estimated_budget
                ? project.estimated_budget.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })
                : "$765,000"}
            </span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            <div className="text-sm text-neutral-600">
              Estimated ROI:{" "}
              <span className="font-semibold text-neutral-900">
                {project?.estimated_ROI
                  ? project.estimated_ROI.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })
                  : "$765,000"}
              </span>
            </div>
          </button>
        </div>
      </div>
      {/* Right Sheet – Invest in project */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => !submitting && setSheetOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-white shadow-xl border-l border-neutral-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <h3 className="text-[15px] font-semibold text-neutral-900">
                Invest in “{title}”
              </h3>
              <button
                className={`rounded-md p-1 ${
                  submitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-neutral-100"
                }`}
                onClick={() => !submitting && setSheetOpen(false)}
                aria-label="Close"
                disabled={submitting}
              >
                <X className="h-5 w-5 text-neutral-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Meeting URL */}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-600">
                  Meeting URL
                </span>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://…"
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
                  />
                  <LinkIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                </div>
              </label>

              {/* Meeting Date */}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-600">
                  Meeting date
                </span>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                </div>
              </label>

              {/* Amount */}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-600">
                  Amount to invest (USD)
                </span>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="number"
                    min={0}
                    step="1000"
                    value={amount}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAmount(v === "" ? "" : Number(v));
                    }}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
                    placeholder="e.g. 50000"
                  />
                  <DollarSign className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                </div>
              </label>

              {/* (Optional) Creator email for clarity (read-only) */}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-600">
                  Creator email
                </span>
                <input
                  type="email"
                  value={project?.creator || project?.creator_name || ""}
                  readOnly
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800"
                />
              </label>

              {/* Comments */}
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-600">
                  Comments
                </span>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/5"
                    placeholder="Add any notes or context for the meeting…"
                  />
                  <MessageSquare className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-neutral-300" />
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-neutral-200 bg-white p-4">
              <button
                onClick={onRequestPitch}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                disabled={
                  submitting ||
                  !meetingUrl ||
                  !meetingDate ||
                  amount === "" ||
                  !investorEmail
                }
                aria-busy={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Sending…" : "Request pitch"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
