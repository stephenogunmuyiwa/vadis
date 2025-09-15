// src/app/production/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Sparkles, FileText } from "lucide-react";
import ScriptProjectCard from "@/components/scripts/ScriptProjectCard";
import { ScriptProjectCardSkeleton } from "@/components/scripts/ScriptProjectCardSkeleton";
import { useRouter } from "next/navigation";
import TopBar from "@/components/header/TopBar";
import { useCreateProject } from "@/hooks/production/useCreateProject";
import { useProjects } from "@/hooks/production/useProjects";
import { useSession } from "@/hooks/production/useSession";

const SUPPORTED_EXTS = [".pdf", ".txt", ".docx"];
const ACCEPT_ATTR = SUPPORTED_EXTS.join(",");

type Phase = "idle" | "ready" | "submitting";

export default function Dashboard() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const router = useRouter();
  // const { data: session } = useSession();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;
  useEffect(() => {
    if (!isLoading && !email) router.replace("/");
  }, [isLoading, email, router]);
  const {
    submit,
    submitting,
    error: submitError,
    setError: setSubmitError,
  } = useCreateProject();

  const {
    projects,
    loading: loadingProjects,
    error: projectsError,
    refetch,
  } = useProjects();

  const looksSupported = (f: File) =>
    SUPPORTED_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext));

  const resetAll = useCallback(() => {
    setPhase("idle");
    setIsDragging(false);
    setError(null);
    setSubmitError(null);
    setFile(null);
    setTitle("");
  }, [setSubmitError]);

  const handleFiles = useCallback((files: FileList | null) => {
    setError(null);
    setSubmitError(null);
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!looksSupported(f)) {
      setError("Unsupported file type. Please use PDF, TXT, or DOCX.");
      return;
    }
    // Do NOT upload yet; just store file and let user fill title.
    setFile(f);
    setPhase("ready");
  }, []);

  // DnD
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer?.files ?? null);
    },
    [handleFiles]
  );

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging]
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const cancelOrDelete = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const canContinue = phase === "ready" && !!file && title.trim().length > 0;

  const continueNext = useCallback(async () => {
    if (!canContinue || !file) return;
    setPhase("submitting");

    const result = await submit({ title, file });
    setPhase("idle");
    setFile(null);
    setTitle("");

    if (result.ok) {
      await refetch();
    }
  }, [canContinue, file, title, submit, refetch]);
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#F4F4F4FF] text-gray-900"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(255,255,255,0.9),rgba(247,249,252,0.7),rgba(235,239,246,0.6),transparent_80%)]" />
      <div className="pointer-events-none absolute -left-40 -top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(137,196,244,0.45),rgba(137,196,244,0.12)_60%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-48 -bottom-24 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(129,236,197,0.45),rgba(129,236,197,0.12)_60%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,206,160,0.45),rgba(255,206,160,0.12)_60%,transparent_70%)] blur-2xl" />
      <TopBar
        brand={{
          logoSrc: "/file.svg",
          label: "VadisAI production",
          href: "/",
        }}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: `${""}` }]}
      />
      {/* Drag overlay */}
      {isDragging && phase === "idle" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center border-4 border-dashed border-gray-900/40 bg-white/30 backdrop-blur-sm">
          <p className="text-lg font-medium text-gray-700">
            Drop your script here
          </p>
        </div>
      )}

      <main className="relative z-10 mt-[10vh] h-[40vh] mx-auto w-full max-w-6xl p-6">
        <div className="">
          {/* LEFT: existing upload flow (unchanged content) */}
          <div className="flex h-[40vh] items-center justify-center">
            {phase === "idle" && (
              <section className="w-full text-center">
                <div className="mb-6 flex items-center justify-center">
                  <StackIcon />
                </div>
                <p className="mx-auto max-w-[40ch] text-sm text-gray-600">
                  Drag & drop your script anywhere on this page, or click
                  upload.
                </p>{" "}
                <div className="mt-5 flex flex-col items-center">
                  <PrimaryButton
                    variant="light"
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload script
                  </PrimaryButton>
                  <p className="mt-3 text-xs text-gray-400">
                    Supported:{" "}
                    <span className="font-medium text-gray-500">.pdf</span>,{" "}
                    <span className="font-medium text-gray-500">.txt</span>,{" "}
                    <span className="font-medium text-gray-500">.docx</span>
                  </p>
                  {(error || submitError) && (
                    <p className="mt-2 text-xs text-red-600" role="alert">
                      {error ?? submitError}
                    </p>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT_ATTR}
                  className="sr-only"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </section>
            )}

            {(phase === "ready" || phase === "submitting") && (
              <section className="w-full text-center">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project title"
                  className="mb-1 w-full bg-transparent text-center text-[30px] font-semibold tracking-tight placeholder:text-gray-400 focus:outline-none"
                  aria-label="Project title"
                  disabled={submitting}
                />
                <p className="mb-4 text-center text-[11px] text-gray-500">
                  This is required.
                </p>

                <div className="mx-auto flex w-[300px] items-center gap-3 rounded-[999px] border border-black/5 bg-[#1E1E1E] px-4 py-3 text-white shadow-[0_8px_28px_rgba(0,0,0,0.16)]">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-sm font-semibold leading-none">
                      {file?.name ?? "No file selected"}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/70">
                      {submitting ? "Creating project..." : "Ready to continue"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label="Remove file"
                    title="Remove file"
                    disabled={submitting}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mx-auto mt-4 flex w-[340px] justify-center">
                  <PrimaryButton
                    variant="light"
                    onClick={continueNext}
                    disabled={!canContinue || submitting}
                    className={
                      !canContinue ? "cursor-not-allowed opacity-60" : ""
                    }
                    size="sm"
                  >
                    {phase === "submitting" ? "Submitting..." : "Continue"}
                  </PrimaryButton>
                </div>

                {(error || submitError) && (
                  <p className="mt-3 text-xs text-red-600" role="alert">
                    {error ?? submitError}
                  </p>
                )}
              </section>
            )}
          </div>

          {/* RIGHT: Generate with AI panel */}
          {/* <AIComposePanel /> */}
        </div>
      </main>

      {/* Projects grid */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-3">
          Scripts
        </h2>

        {projectsError && (
          <p className="text-xs text-red-600 mb-3" role="alert">
            {projectsError}
          </p>
        )}

        {loadingProjects ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <ScriptProjectCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-500">
            No projects yet — upload a script to get started.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const createdDate = new Date(p.created_date * 1000); // ms since epoch
              const createdISO = createdDate.toISOString();
              const createdLabel = new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(createdDate);

              const q = new URLSearchParams({
                title: p.title,
                createdISO,
                createdLabel,
              }).toString();

              return (
                <ScriptProjectCard
                  key={p.id}
                  data={p}
                  userEmail={email || ""}
                  onOpen={() => router.push(`production/Project/${p.id}?${q}`)}
                  onDeleted={() => refetch()}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= SVGs ================= */

function StackIcon() {
  return (
    <svg
      width="96"
      height="80"
      viewBox="0 0 112 93"
      fill="#4E4E4E"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g>
        <path d="M24.7088 13.4546C25.5579 5.22118 32.9399 -0.766939 41.1968 0.0798003L98.507 5.9569C106.764 6.80364 112.769 14.1646 111.92 22.3981L106.026 79.5454C105.177 87.7788 97.795 93.7669 89.5381 92.9202L32.2279 87.0431C23.971 86.1964 17.9658 78.8354 18.8149 70.6019L24.7088 13.4546Z"></path>
        <path d="M7.00776 16.8027C5.56798 19.5601 4.75415 22.6943 4.75415 26.0181V72.4979L0.0953325 31.1529C-0.569169 25.2557 2.29385 19.774 7.00776 16.8027Z"></path>
        <path d="M20.3105 13.6614C20.5891 10.9599 21.3953 8.43957 22.6165 6.1918C15.3476 7.24338 9.76394 13.4827 9.76394 21.0224V73.4755C9.76394 81.401 15.9335 87.8896 23.7449 88.4263C17.5424 84.4944 13.7479 77.2933 14.5509 69.507L20.3105 13.6614Z"></path>
      </g>
    </svg>
  );
}

/** Compact circular progress ring */
function CircularProgress({ value }: { value: number }) {
  const size = 40;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      <defs>
        {/* Brighter neon-green gradient */}
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />{" "}
          {/* Tailwind green-500 */}
          <stop offset="70%" stopColor="#16a34a" stopOpacity="0.9" />{" "}
          {/* green-600 */}
          <stop offset="100%" stopColor="#15803d" stopOpacity="0.6" />{" "}
          {/* green-700 */}
        </radialGradient>
      </defs>

      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={stroke}
        fill="none"
      />
      {/* progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#g)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        fill="none"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
function AIComposePanel() {
  const [generating, setGenerating] = useState(false);

  const onGenerate = () => {
    if (generating) return;
    setGenerating(true);
    // TODO: hook to your generation endpoint; this is a quick visual demo
    setTimeout(() => setGenerating(false), 1500);
  };

  return (
    <div className="flex h-[40vh] items-center justify-center">
      <section className="w-full text-center">
        <div className="mb-6 flex items-center justify-center">
          <MagicSparklesIcon />
        </div>
        <p className="mx-auto max-w-[40ch] text-sm text-gray-600">
          Click Generate script to create a new movie script with AI.
        </p>

        <div className="mt-5 mb-5 flex flex-col items-center">
          <PrimaryButton
            variant="ai"
            size="lg"
            leadingIcon={<Sparkles className="h-5 w-5" />}
          >
            Generate Script
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}

function MagicSparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="96"
      height="80"
      viewBox="0 0 112 93"
      fill="#4E4E4E"
    >
      <path d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z" />
    </svg>
  );
}
