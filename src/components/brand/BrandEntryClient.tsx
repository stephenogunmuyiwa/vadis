// components/brand/BrandEntryClient.tsx  (CLIENT COMPONENT)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateProfileCard } from "@/components/brand/ui/CreateProfileCard";
import { useSession } from "@/hooks/production/useSession";
import type { BrandProfile } from "@/types/brand/brand";
import { ENV } from "@/config/env";

const API_BASE = ENV.API_BASE;

export default function BrandEntryClient({
  forceCreate = false,
}: {
  forceCreate?: boolean;
}) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  const [checking, setChecking] = useState(false);
  const [showCreate, setShowCreate] = useState(forceCreate);

  useEffect(() => {
    if (forceCreate) return; // skip lookup entirely when ?create=1

    let cancelled = false;
    async function run() {
      if (!email) {
        setShowCreate(true);
        return;
      }
      setChecking(true);
      try {
        const res = await fetch(
          `${API_BASE}/brands/profiles?brandEmail=${encodeURIComponent(email)}`,
          { cache: "no-store" }
        );
        const json = (await res.json()) as {
          ok: boolean;
          data?: BrandProfile[];
        };

        if (cancelled) return;

        if (json?.ok && json.data && json.data.length > 0) {
          router.replace(`/brand/${json.data[0].id}/catalogue`);
        } else {
          setShowCreate(true);
        }
      } catch {
        if (!cancelled) setShowCreate(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    if (!isLoading) run();
    return () => {
      cancelled = true;
    };
  }, [email, isLoading, router, forceCreate]);

  // If explicitly creating, show the form immediately (no loader)
  if (forceCreate) {
    return <CreateProfileCard defaultEmail={email} />;
  }

  // While session/lookup runs, show loader
  if ((isLoading || checking) && !showCreate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  // Fallback: no profiles or lookup failed → show create card
  return <CreateProfileCard defaultEmail={email} />;
}
