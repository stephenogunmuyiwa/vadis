// hooks/useProfiles.ts
'use client';
import { useEffect, useState } from 'react';
import type { BrandProfile } from '@/types/brand/brand';
import { useSession } from '@/hooks/production/useSession';
import { ENV } from "@/config/env";


const API_BASE = ENV.API_BASE;

export function useProfiles() {
  const { session, isLoading } = useSession();
  const email = session?.ok ? session.email : undefined;

  const [profiles, setProfiles] = useState<BrandProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    async function run() {
      if (!email) {
        setProfiles([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/brands/profiles?brandEmail=${encodeURIComponent(email)}`,
          { cache: 'no-store' }
        );
        const json = await res.json();
        if (cancel) return;
        if (json?.ok) setProfiles(json.data || []);
        else setError(json?.error || 'Failed to load profiles.');
      } catch (e: any) {
        if (!cancel) setError(e?.message || 'Network error.');
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    if (!isLoading) run();
    return () => {
      cancel = true;
    };
  }, [email, isLoading]);

  return { profiles, loading, error, email };
}
