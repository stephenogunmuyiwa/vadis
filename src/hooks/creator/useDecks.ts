'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PitchDeck } from '@/types/creator/creator';
import { listPitchDecks, generatePitchDeck } from '@/app/api/shared/creator/creator';

export function useDecks(userEmail?: string) {
  const ready = !!userEmail;

  const [loading, setLoading] = useState(false);
  const [decks, setDecks] = useState<PitchDeck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const refresh = useCallback(async () => {
    if (!ready) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listPitchDecks(userEmail!);
      setDecks(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load pitch decks');
    } finally {
      setLoading(false);
    }
  }, [ready, userEmail]);

  useEffect(() => {
    if (!ready) return;
    refresh();
  }, [ready, refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return decks;
    return decks.filter((d) => d.project_title?.toLowerCase().includes(q));
  }, [decks, query]);

  const createDeck = useCallback(
    async (projectId: string) => {
      if (!ready) throw new Error('User email not available yet.');
      await generatePitchDeck({ userEmail: userEmail!, projectId });
      await refresh();
    },
    [ready, userEmail, refresh]
  );

  return { ready, loading, error, decks: filtered, rawDecks: decks, query, setQuery, refresh, createDeck };
}
