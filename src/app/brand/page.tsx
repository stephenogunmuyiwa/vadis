// app/brand/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateProfileCard } from "@/components/brand/ui/CreateProfileCard";
import type { BrandProfile } from "@/types/brand/brand";
import { ENV } from "@/config/env";
import { useSession } from "@/hooks/production/useSession";

const API_BASE = ENV.API_BASE;

export default function BrandEntry() {
  const router = useRouter();
  const search = useSearchParams();
  const forceCreate = search.get("create") === "1";
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  const [checking, setChecking] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  if (forceCreate) {
    return <CreateProfileCard defaultEmail={email} />;
  }
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!email) {
        // No email (not logged in) => show create screen per flow
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

        if (!cancelled) {
          if (json?.ok && json.data && json.data.length > 0) {
            // use first profile id and go to catalogue
            router.replace(`/brand/${json.data[0].id}/catalogue`);
          } else {
            setShowCreate(true);
          }
        }
      } catch {
        // On network/API error, fall back to create screen
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
  if ((isLoading || checking) && !showCreate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  // No profiles (or no email) => show Create Profile UI
  return <CreateProfileCard defaultEmail={email} />;
}
