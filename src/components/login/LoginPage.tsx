"use client";
import LoginForm from "@/components/login/LoginForm";
import RequestDemoForm from "@/components/login/RequestDemoForm";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialView = useMemo(() => {
    const v = (searchParams?.get("view") || "").toLowerCase();
    return v === "request-demo" ? "request-demo" : "login";
  }, [searchParams]);

  const [view, setView] = useState<"login" | "request-demo">(initialView);

  // Keep URL in sync (no extra history entries)
  useEffect(() => {
    const next = new URL(window.location.href);
    next.searchParams.set("view", view);
    router.replace(next.toString());
  }, [view, router]);
  return (
    <main className="mx-auto grid min-h-screen w-full grid-cols-1 items-stretch gap-10 p-4 md:grid-cols-2 md:p-8 bg-[#EBEBEBFF] text-neutral-900">
      <section className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-b from-[#934ccf] via-[#582398] to-[#050505] p-10 md:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_60%)]" />

        <div className="z-10 mt-auto max-w-md mx-auto text-neutral-900">
          <div className="mb-6 flex items-center justify-center">
            <img
              src="/vadis_logo.png"
              alt="OnlyPipe"
              className="h-[100px] w-auto"
            />
          </div>

          <h1 className="mb-3 text-4xl font-semibold text-white">
            Get Started with VadisAI
          </h1>
          <p className="text-neutral-300">
            {view === "login"
              ? "Don't have an account? Request a demo."
              : "Already using VadisAI? Sign in to continue."}
          </p>

          <ol className="mt-10 space-y-3">
            <li className="flex items-center gap-3 rounded-xl bg-[#FFFFFF1E] p-3 shadow">
              <span className="grid h-8 w-8 place-content-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800">
                1
              </span>
              <div>
                <p className="text-sm text-white font-medium">
                  Production Company
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#FFFFFF1E] p-3 shadow-sm">
              <span className="grid h-8 w-8 place-content-center rounded-full bg-fuchsia-100 text-sm font-semibold text-fuchsia-800">
                2
              </span>
              <div>
                <p className="text-sm text-white font-medium">
                  Branding Agency
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#FFFFFF1E] p-3 shadow-sm">
              <span className="grid h-8 w-8 place-content-center rounded-full bg-pink-100 text-sm font-semibold text-pink-800">
                3
              </span>
              <div>
                <p className="text-sm text-white font-medium">
                  Individual Creator
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#FFFFFF1E] p-3 shadow-sm">
              <span className="grid h-8 w-8 place-content-center rounded-full bg-pink-100 text-sm font-semibold text-pink-800">
                4
              </span>
              <div>
                <p className="text-sm text-white font-medium">Film Investor</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="flex items-center justify-center">
        {view === "login" ? (
          <LoginForm onShowRequestDemo={() => setView("request-demo")} />
        ) : (
          <RequestDemoForm onShowSignIn={() => setView("login")} />
        )}
      </section>
    </main>
  );
}
