// src/hooks/useRequiredSessionEmail.ts
"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

type SessionResp =
  | { ok: true; email: string; role: string }
  | { ok: false };

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(r => r.json());

/**
 * Reads email from /api/session and forces a client-side redirect to "/"
 * when no valid session is present.
 */
export function useRequiredSessionEmail() {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<SessionResp>("/api/session", fetcher, {
    revalidateOnFocus: false,
  });

  const email = data && "ok" in data && data.ok ? data.email : undefined;

  useEffect(() => {
    if (!isLoading && !email) {
      // No session → go to login
      router.replace("/");
    }
  }, [isLoading, email, router]);

  return { email, loading: isLoading, error };
}
